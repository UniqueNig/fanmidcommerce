import { connectDB } from "@/src/lib/db";
import productModel from "@/src/models/Product";


export const productResolvers = {
  Query: {
    products: async () => {
      await connectDB();

      try {
        return await productModel.find().populate("category");
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
        if (!context.user || context.user.role !== "admin") {
          throw new Error("Unauthorized");
        }

      const newProduct = await productModel.create({
        ...args,
        createdBy: context.user?.id,
      });

      return newProduct;
    },

    // ✅ UPDATE PRODUCT
    updateProduct: async (_: unknown, { id, ...rest }: any, context: any) => {
      await connectDB();

      if (!context.user || context.user.role !== "admin") {
        throw new Error("Unauthorized");
      }

      const updatedProduct = await productModel.findByIdAndUpdate(id, rest, {
        new: true,
      });

      if (!updatedProduct) {
        throw new Error("Product not found");
      }

      return updatedProduct;
    },

    // ✅ DELETE PRODUCT
    deleteProduct: async (_: unknown, { id }: { id: string }, context: any) => {
      await connectDB();

      if (!context.user || context.user.role !== "admin") {
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
