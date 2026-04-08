import mongoose from "mongoose";
// import User from "./User";

const productSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  description: { type: String, required: true },
  price:       { type: Number, required: true },
  image:       { type: String, },
  stock:       { type: Number, required: true },
  category:    { type: String, required: true },
  isNew:       { type: Boolean, default: false }, // 👈 ADD THIS
  createdBy:   { type: mongoose.Schema.Types.ObjectId, ref: "fanmidcommerce-users" },
  createdAt:   { type: Date, default: Date.now },
});

const productModel =
  mongoose.models["fanmidcommerce-products"] ||
  mongoose.model("fanmidcommerce-products", productSchema);

export default productModel;
