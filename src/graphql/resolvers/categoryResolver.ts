import Product from "@/src/models/Product";
// import Category from "@/src/models/Category";
import { connectDB } from "@/src/lib/db";
import categoryModel from "@/src/models/Category";

export const categoryResolvers = {
  Category: {
    id: (parent: any) => parent._id?.toString() ?? parent.id,
    name: (parent: any) => parent.name ?? null,
    slug: (parent: any) => parent.slug ?? null,
    productCount: async (parent: any) => {
      const { default: productModel } = await import("@/src/models/Product");
      const categoryId = parent._id ?? parent.id;
      return await productModel.countDocuments({ category: categoryId });
    },
  },
  Query: {
    products: async () => {
      await connectDB();
      return await Product.find().populate("category"); // ✅ IMPORTANT
    },

    categories: async () => {
      await connectDB();
      return await categoryModel.find();
    },
  },

  Mutation: {
    createCategory: async (
      _: any,
      { name, slug }: { name: string; slug: string },
    ) => {
      await connectDB();
      const existing = await categoryModel.findOne({ slug });
      if (existing) return existing;

      const category = await categoryModel.create({ name, slug });
      return category;
    },

    createProduct: async (_: any, args: any) => {
      await connectDB();

      return await Product.create({
        ...args,
      });
    },

    updateCategory: async (_: any, { id, name, description }: any) => {
      await connectDB();
      const slug = name.toLowerCase().replace(/\s+/g, "-");
      return await categoryModel.findByIdAndUpdate(
        id,
        { name, slug, description },
        { new: true },
      );
    },

    deleteCategory: async (_: any, { id }: { id: string }) => {
      await connectDB();
      return await categoryModel.findByIdAndDelete(id);
    },
  },
};
