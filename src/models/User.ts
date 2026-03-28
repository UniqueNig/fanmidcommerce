import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    phone: {
      type: String,
    },

    address: {
      type: String,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["user", "admin"], // 🔒 restrict values
      default: "user", // 👈 very important
    },
  },
  { timestamps: true },
);

const userModel =
  mongoose.models["fanmidcommerce-users"] ||
  mongoose.model("fanmidcommerce-users", userSchema);

export default userModel;
