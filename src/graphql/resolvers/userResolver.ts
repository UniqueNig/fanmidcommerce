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
        // console.error("Error fetching users:", error);
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
        // console.error("Error fetching user:", error);
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
        phone,
        address,
        password,
      }: { name: string; email: string; phone?: string; address?: string; password: string },
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
        phone,
        address,
        password: hashedPassword,
        role: "user", // good practice
      });

      return {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        address: newUser.address,
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
        phone,
        address
      }: {
        id: string;
        name?: string;
        email?: string;
        phone?: string;
        address?: string;
      },
    ) => {
      await connectDB();

      const existingUser = await userModel.findById(id);

      if (!existingUser) {
        throw new Error("User not found");
      }

      if (name !== undefined) existingUser.name = name;

      if (email !== undefined) existingUser.email = email;
      if (phone !== undefined) existingUser.phone = phone;
      if (address !== undefined) existingUser.address = address;

      await existingUser.save();

      return existingUser;
    },

    updateProfile: async (
  _: unknown,
  { name, email, phone }: { name: string; email: string; phone?: string },
  context: any
) => {
  await connectDB();

  if (!context.user) {
    throw new Error("Not authenticated");
  }

  const user = await userModel.findById(context.user.id);

  if (!user) {
    throw new Error("User not found");
  }

  user.name = name;
  user.email = email;
  if (phone !== undefined) user.phone = phone;

  await user.save();

  return user;
},

changePassword: async (
  _: unknown,
  {
    currentPassword,
    newPassword,
  }: { currentPassword: string; newPassword: string },
  context: any
) => {
  await connectDB();

  // 🔐 Ensure user is logged in
  if (!context.user) {
    throw new Error("Not authenticated");
  }

  const user = await userModel.findById(context.user.id);

  if (!user) {
    throw new Error("User not found");
  }

  // 🔑 Verify current password
  const isMatch = await bcrypt.compare(currentPassword, user.password);

  if (!isMatch) {
    throw new Error("Current password is incorrect");
  }

  // 🚨 Prevent same password reuse (optional but good)
  const isSame = await bcrypt.compare(newPassword, user.password);
  if (isSame) {
    throw new Error("New password must be different from current password");
  }

  // 🔐 Hash new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  user.password = hashedPassword;
  await user.save();

  return true;
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

    deleteAccount: async (_: unknown, __: unknown, context: any) => {
  await connectDB();

  if (!context.user) {
    throw new Error("Not authenticated"); // This is fine
  }

  const deletedUser = await userModel.findByIdAndDelete(context.user.id);

  if (!deletedUser) {
    throw new Error("User not found"); // Or return false if you prefer
  }

  return true; // Make sure to **always return a boolean**
},
  },
};
