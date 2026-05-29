import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    // SEO-friendly URL identifier, e.g. "minimalist-leather-jacket".
    // unique → no two products can share a slug.
    // sparse → existing products without a slug don't break the unique index
    //          (run the backfill script to fill them in).
    slug: { type: String, unique: true, sparse: true, index: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String },
    stock: { type: Number, required: true },
    // Optional size options (e.g. ["S","M","L"]). Empty = no size selection.
    sizes: { type: [String], default: [] },
    // Which size-guide chart to show: clothing, footwear, or none.
    sizeGuide: {
      type: String,
      enum: ["clothing", "footwear", "none"],
      default: "clothing",
    },
    // Optional product detail copy (shown on the product page; fall back to
    // sensible defaults when empty).
    materials: { type: String, default: "" },
    sizingFit: { type: String, default: "" },
    careInstructions: { type: String, default: "" },
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
    // `isNew` is technically a reserved Mongoose key; it works correctly here
    // (verified), so we just silence the startup warning.
    suppressReservedKeysWarning: true,
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