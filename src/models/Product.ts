import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String },
    stock: { type: Number, required: true },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "fanmidcommerce-categories",
      required: true,
    },
    isNew: { type: Boolean, default: false },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "fanmidcommerce-users",
    },
    // ← remove the manual createdAt field, timestamps handles it
  },
  {
    timestamps: true, // ← adds createdAt + updatedAt automatically
    toJSON: {
      virtuals: true,
      transform: (_doc: any, ret: any) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
      },
    },
  },
);

const productModel =
  mongoose.models["fanmidcommerce-products"] ||
  mongoose.model("fanmidcommerce-products", productSchema);

export default productModel;