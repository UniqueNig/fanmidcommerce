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
        return usersDB.map(user => ({
          ...user._doc,
          id: user._id,
          createdAt: user.createdAt.toISOString(),
        }));
      } catch (error) {
        throw new Error("Failed to fetch users");
      }
    },

    user: async (_: unknown, { id }: { id: string }) => {
      await connectDB();
      try {
        const userDB = await userModel.findById(id).select("-password");
        if (!userDB) throw new Error("User not found");
        return {
          ...userDB._doc,
          id: userDB._id,
          createdAt: userDB.createdAt.toISOString(),
        };
      } catch (error) {
        throw new Error("Failed to fetch user");
      }
    },

    me: async (_: unknown, __: unknown, context: any) => {
      await connectDB();
      if (!context.user) throw new Error("Not authenticated");
      const user = await userModel.findById(context.user.id).select("-password");
      if (!user) throw new Error("User not found");
      return {
        ...user._doc,
        id: user._id,
        createdAt: user.createdAt.toISOString(),
      };
    },
  },

  Mutation: {
    register: async (
      _: unknown,
      { name, email, phone, address, password }: { name: string; email: string; phone?: string; address?: string; password: string },
    ) => {
      await connectDB();
      const existingUser = await userModel.findOne({ email });
      if (existingUser) throw new Error("User already exists");

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await userModel.create({
        name,
        email,
        phone,
        address,
        password: hashedPassword,
        role: "user",
      });

      return {
        ...newUser._doc,
        id: newUser._id,
        createdAt: newUser.createdAt.toISOString(),
      };
    },

    login: async (_: unknown, { email, password }: { email: string; password: string }) => {
      await connectDB();
      const user = await userModel.findOne({ email });
      if (!user) throw new Error("Invalid credentials");

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) throw new Error("Invalid credentials");

      const token = generateToken(user);
      return {
        token,
        user: {
          ...user._doc,
          id: user._id,
          createdAt: user.createdAt.toISOString(),
        },
      };
    },

    updateUser: async (
      _: unknown,
      { id, name, email, phone, address }: { id: string; name?: string; email?: string; phone?: string; address?: string },
    ) => {
      await connectDB();
      const existingUser = await userModel.findById(id);
      if (!existingUser) throw new Error("User not found");

      if (name !== undefined) existingUser.name = name;
      if (email !== undefined) existingUser.email = email;
      if (phone !== undefined) existingUser.phone = phone;
      if (address !== undefined) existingUser.address = address;

      await existingUser.save();

      return {
        ...existingUser._doc,
        id: existingUser._id,
        createdAt: existingUser.createdAt.toISOString(),
      };
    },

    updateProfile: async (
      _: unknown,
      { name, email, phone, address }: { name: string; email: string; phone?: string; address?: string },
      context: any
    ) => {
      await connectDB();
      if (!context.user) throw new Error("Not authenticated");

      const user = await userModel.findById(context.user.id);
      if (!user) throw new Error("User not found");

      user.name = name;
      user.email = email;
      if (phone !== undefined) user.phone = phone;
      if (address !== undefined) user.address = address;

      await user.save();

      return {
        ...user._doc,
        id: user._id,
        createdAt: user.createdAt.toISOString(),
      };
    },

    changePassword: async (
      _: unknown,
      { currentPassword, newPassword }: { currentPassword: string; newPassword: string },
      context: any
    ) => {
      await connectDB();
      if (!context.user) throw new Error("Not authenticated");

      const user = await userModel.findById(context.user.id);
      if (!user) throw new Error("User not found");

      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) throw new Error("Current password is incorrect");

      const isSame = await bcrypt.compare(newPassword, user.password);
      if (isSame) throw new Error("New password must be different from current password");

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      await user.save();

      return true;
    },

    deleteUser: async (_: unknown, { id }: { id: string }) => {
      await connectDB();
      const deletedUser = await userModel.findByIdAndDelete(id);
      if (!deletedUser) throw new Error("User not found");

      return {
        ...deletedUser._doc,
        id: deletedUser._id,
        createdAt: deletedUser.createdAt.toISOString(),
      };
    },

    deleteAccount: async (_: unknown, __: unknown, context: any) => {
      await connectDB();
      if (!context.user) throw new Error("Not authenticated");

      const deletedUser = await userModel.findByIdAndDelete(context.user.id);
      if (!deletedUser) throw new Error("User not found");

      return true;
    },
  },
};