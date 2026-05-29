import { connectDB } from "@/src/lib/db";
import categoryModel from "@/src/models/Category";
import productModel from "@/src/models/Product";
import mongoose from "mongoose";
import { makeUniqueSlug, slugify } from "@/src/lib/slug";

// Escape any regex-special characters so a product name can be used safely
// inside a `new RegExp(...)` (e.g. a name with "(" won't break the query).
const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * Produce a slug that is guaranteed unique across the products collection.
 * - `desired` is the raw text to slugify (the admin's slug input, or the name).
 * - `excludeId` lets an edit ignore the product's own current slug, so
 *   re-saving without changing the slug doesn't trip the uniqueness check.
 */
async function generateUniqueProductSlug(
  desired: string,
  excludeId?: string,
): Promise<string> {
  const base = slugify(desired) || "product";

  // Find every existing slug shaped like "base" or "base-2", "base-3", ...
  const regex = new RegExp(`^${escapeRegex(base)}(-\\d+)?$`, "i");
  const query: Record<string, unknown> = { slug: regex };
  if (excludeId) query._id = { $ne: excludeId };

  const existing = await productModel.find(query).select("slug").lean();
  const taken = existing
    .map((d: any) => d.slug)
    .filter((s: unknown): s is string => typeof s === "string");

  return makeUniqueSlug(base, taken);
}

export const productResolvers = {
  Product: {
    id: (parent: any) => parent._id?.toString() ?? parent.id,
    slug: (parent: any) => parent.slug ?? null,
    category: (parent: any) => {
      const cat = parent.category;
      if (!cat) return null;
      // if it's just an ObjectId (not populated), return null
      if (!cat.name) return null;
      return {
        id: cat._id?.toString() ?? cat.id,
        name: cat.name,
        slug: cat.slug,
        description: cat.description ?? null,
        productCount: cat.productCount ?? 0,
      };
    },
  },

  Query: {
    products: async () => {
      await connectDB();

      try {
        const products = await productModel.find().sort({ _id: -1 }).populate("category");
        // ✅ filter out products with broken category refs
        return products.filter((p) => p.category != null);
      } catch (error) {
        console.error(error);
        throw new Error("Failed to fetch products");
      }
    },

    product: async (_: unknown, { id }: { id: string }) => {
      await connectDB();

      const product = await productModel.findById(id).populate("category");

      if (!product) {
        throw new Error("Product not found");
      }

      return product;
    },

    // ✅ Pre-checkout availability check.
    checkStock: async (
      _: unknown,
      { items }: { items: Array<{ product: string; quantity: number }> },
    ) => {
      await connectDB();

      const ids = items.map((i) => i.product);
      const products = await productModel
        .find({ _id: { $in: ids } })
        .select("name stock")
        .lean();

      const byId = new Map(
        products.map((p: any) => [p._id.toString(), p]),
      );

      return items.map((i) => {
        const p = byId.get(i.product);
        const available = p?.stock ?? 0;
        return {
          product: i.product,
          name: p?.name ?? null,
          available,
          requested: i.quantity,
          ok: available >= i.quantity,
        };
      });
    },

    // ✅ Public product page lookup by slug, with id fallback.
    // New URLs are /product/<slug>; old /product/<mongoId> links still resolve.
    productBySlug: async (_: unknown, { slug }: { slug: string }) => {
      await connectDB();

      let product = await productModel.findOne({ slug }).populate("category");

      // Fallback: the value looks like a Mongo ObjectId (an old-style link)
      if (!product && mongoose.isValidObjectId(slug)) {
        product = await productModel.findById(slug).populate("category");
      }

      if (!product) {
        throw new Error("Product not found");
      }

      return product;
    },
  },

  Mutation: {
    // ✅ CREATE PRODUCT (ADMIN)
    createProduct: async (_: unknown, args: any, context: any) => {
      await connectDB();

      // 🔒 Protect route
      if (
        !context.user ||
        !["admin", "superadmin"].includes(context.user.role)
      ) {
        throw new Error("Unauthorized");
      }

      // Use the admin-provided slug if present, otherwise derive from the name.
      // Either way we run it through the uniqueness guard.
      const slug = await generateUniqueProductSlug(args.slug || args.name);

      const newProduct = await productModel.create({
        ...args,
        slug,
        createdBy: context.user?.id,
      });

      return await newProduct.populate("category");
    },

    // ✅ UPDATE PRODUCT
    updateProduct: async (_: unknown, { id, ...rest }: any, context: any) => {
      await connectDB();

      if (
        !context.user ||
        !["admin", "superadmin"].includes(context.user.role)
      ) {
        throw new Error("Unauthorized");
      }

      // ✅ Validate category if provided
      if (rest.category) {
        const exists = await categoryModel.findById(rest.category);
        if (!exists) {
          throw new Error("Invalid category");
        }
      }

      // Only update the fields that were actually sent.
      const updates: Record<string, unknown> = {};
      for (const key of [
        "name",
        "description",
        "price",
        "image",
        "stock",
        "category",
        "isNew",
        "sizes",
      ]) {
        if (rest[key] !== undefined) updates[key] = rest[key];
      }

      // Slug only changes when the admin explicitly provides one, so existing
      // SEO URLs aren't silently broken on every edit.
      if (rest.slug !== undefined && rest.slug !== "") {
        updates.slug = await generateUniqueProductSlug(rest.slug, id);
      }

      const updatedProduct = await productModel
        .findByIdAndUpdate(id, updates, { new: true, runValidators: true })
        .populate("category");

      if (!updatedProduct) {
        throw new Error("Product not found");
      }

      return updatedProduct;
    },

    // ✅ DELETE PRODUCT
    deleteProduct: async (_: unknown, { id }: { id: string }, context: any) => {
      await connectDB();

      if (
        !context.user ||
        !["admin", "superadmin"].includes(context.user.role)
      ) {
        throw new Error("Unauthorized");
      }

      const deleted = await productModel.findByIdAndDelete(id);

      if (!deleted) {
        throw new Error("Product not found");
      }

      return deleted;
    },

    // ✅ ONE-TIME BACKFILL (ADMIN): give every slug-less product a slug.
    backfillProductSlugs: async (_: unknown, __: unknown, context: any) => {
      await connectDB();

      if (
        !context.user ||
        !["admin", "superadmin"].includes(context.user.role)
      ) {
        throw new Error("Unauthorized");
      }

      // Products missing a slug
      const missing = await productModel.find({
        $or: [{ slug: { $exists: false } }, { slug: null }, { slug: "" }],
      });

      // Slugs already in use (so we don't create duplicates)
      const withSlug = await productModel
        .find({ slug: { $nin: [null, ""] } })
        .select("slug")
        .lean();
      const taken = new Set(
        withSlug
          .map((d: any) => d.slug)
          .filter((s: unknown): s is string => typeof s === "string"),
      );

      let count = 0;
      for (const product of missing) {
        const slug = makeUniqueSlug(product.name, taken);
        product.slug = slug;
        taken.add(slug);
        await product.save();
        count++;
      }

      return count;
    },
  },
};
