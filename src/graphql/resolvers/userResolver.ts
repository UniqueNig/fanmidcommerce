import bcrypt from "bcryptjs";
import { connectDB } from "@/src/lib/db";
import userModel from "@/src/models/User";
import { generateToken } from "@/src/lib/auth";

export const userResolvers = {
  Query: {
    users: async () => {
      await connectDB();

      try {
        const usersDB = await userModel.find().select("-password");
        return usersDB;
      } catch (error) {
        console.error("Error fetching users:", error);
        throw new Error("Failed to fetch users");
      }
    },

    user: async (_: unknown, { id }: { id: string }) => {
      await connectDB();

      try {
        const userDB = await userModel.findById(id).select("-password");

        if (!userDB) {
          throw new Error("User not found");
        }

        return userDB;
      } catch (error) {
        console.error("Error fetching user:", error);
        throw new Error("Failed to fetch user");
      }
    },

    // ✅ NEW (VERY IMPORTANT)
    me: async (_: unknown, __: unknown, context: any) => {
      await connectDB();

      if (!context.user) {
        throw new Error("Not authenticated");
      }

      const user = await userModel
        .findById(context.user.id)
        .select("-password");

      return user;
    },
  },

  Mutation: {
    // ✅ REGISTER
    register: async (
      _: unknown,
      {
        name,
        email,
        password,
      }: { name: string; email: string; password: string },
    ) => {
      await connectDB();

      const existingUser = await userModel.findOne({ email });
      if (existingUser) {
        throw new Error("User already exists");
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await userModel.create({
        name,
        email,
        password: hashedPassword,
        role: "user", // good practice
      });

      return {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      };
    },

    // ✅ LOGIN (UPDATED TO USE auth.ts)
    login: async (
      _: unknown,
      { email, password }: { email: string; password: string },
    ) => {
      await connectDB();

      const user = await userModel.findOne({ email });
      if (!user) {
        throw new Error("Invalid credentials");
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new Error("Invalid credentials");
      }

      // ✅ USE YOUR HELPER
      const token = generateToken(user);

      return {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      };
    },

    // ✅ UPDATE USER
    updateUser: async (
      _: unknown,
      {
        id,
        name,
        email,
      }: {
        id: string;
        name?: string;
        email?: string;
      },
    ) => {
      await connectDB();

      const existingUser = await userModel.findById(id);

      if (!existingUser) {
        throw new Error("User not found");
      }

      if (name !== undefined) existingUser.name = name;

      if (email !== undefined) existingUser.email = email;

      await existingUser.save();

      return existingUser;
    },

    // ✅ DELETE USER
    deleteUser: async (_: unknown, { id }: { id: string }) => {
      await connectDB();

      const deletedUser = await userModel.findByIdAndDelete(id);

      if (!deletedUser) {
        throw new Error("User not found");
      }

      return deletedUser;
    },
  },
};
