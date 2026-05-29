import mongoose from "mongoose";

const subscriberSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  },
  { timestamps: true },
);

const subscriberModel =
  mongoose.models["fanmidcommerce-subscribers"] ||
  mongoose.model("fanmidcommerce-subscribers", subscriberSchema);

export default subscriberModel;
