import { connectDB } from "@/src/lib/db";
import categoryModel from "@/src/models/Category";
import productModel from "@/src/models/Product";

export const productResolvers = {
  Product: {
    id: (parent: any) => parent._id?.toString() ?? parent.id,
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
  },

  Mutation: {
    // ✅ CREATE PRODUCT (ADMIN)
    createProduct: async (_: unknown, args: any, context: any) => {
      console.log("🔥 CREATE PRODUCT HIT"); // ✅ HERE
      console.log("🔥 USER:", context.user); // ✅ ALSO HERE

      //   console.log("DECODED USER:", user);

      await connectDB();

      // 🔒 Protect route
      if (
        !context.user ||
        !["admin", "superadmin"].includes(context.user.role)
      ) {
        throw new Error("Unauthorized");
      }

      const newProduct = await productModel.create({
        ...args,
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

      // const updatedProduct = await productModel
      //   .findByIdAndUpdate(id, rest, { new: true })
      //   .populate("category");

      // if (!updatedProduct) {
      //   throw new Error("Product not found");
      // }

      // ✅ Validate category if provided
      if (rest.category) {
        const exists = await categoryModel.findById(rest.category);
        if (!exists) {
          throw new Error("Invalid category");
        }
      }

      const { name, price, image, category, isNew } = rest;

      const updatedProduct = await productModel
        .findByIdAndUpdate(
          id,
          { name, price, image, category, isNew },
          { new: true, runValidators: true },
        )
        .populate("category");

      if (!updatedProduct) {
        throw new Error("Product not found");
      }

      // return updatedProduct;
      return await updatedProduct.populate("category");
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
  },
};
