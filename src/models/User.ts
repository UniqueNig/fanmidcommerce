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
      enum: ["user", "admin", "superadmin"],
      default: "user",
    },

    // ✅ ADD THIS — tracks whether admin has disabled the account
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
  },
  { timestamps: true }, // gives us createdAt (used as "joined")
);

const userModel =
  mongoose.models["fanmidcommerce-users"] ||
  mongoose.model("fanmidcommerce-users", userSchema);

// delete mongoose.models["fanmidcommerce-users"];
// const userModel = mongoose.model("fanmidcommerce-users", userSchema);

export default userModel;