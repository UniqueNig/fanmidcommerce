import mongoose from "mongoose";

// Each item inside an order (a product + qty + price at time of purchase)
const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "fanmidcommerce-products",
    required: true,
  },
  name:     { type: String, required: true },  // snapshot of product name
  image:    { type: String },                  // snapshot of product image
  price:    { type: Number, required: true },  // price AT TIME of purchase
  quantity: { type: Number, required: true, default: 1 },
});

const orderSchema = new mongoose.Schema(
  {
    // Who placed the order
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "fanmidcommerce-users",
      required: true,
    },

    // What they ordered
    items: [orderItemSchema],

    // Shipping details
    shippingAddress: {
      firstName: { type: String, required: true },
      lastName:  { type: String, required: true },
      address:   { type: String, required: true },
      city:      { type: String, required: true },
      state:     { type: String, required: true },
      phone:     { type: String, required: true },
      email:     { type: String, required: true },
    },

    // Payment
    paymentMethod:    { type: String, default: "Paystack" },
    paymentReference: { type: String },          // Paystack transaction ref
    isPaid:           { type: Boolean, default: false },
    paidAt:           { type: Date },

    // Pricing
    subtotal:      { type: Number, required: true }, // before shipping
    shippingCost:  { type: Number, default: 0 },
    totalAmount:   { type: Number, required: true }, // subtotal + shipping

    // Order lifecycle status
    status: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Failed", "Cancelled"],
      default: "Pending",
    },

    // Delivery tracking
    deliveredAt: { type: Date },
  },
  { timestamps: true }, // gives createdAt + updatedAt automatically
);

const orderModel =
  mongoose.models["fanmidcommerce-orders"] ||
  mongoose.model("fanmidcommerce-orders", orderSchema);

export default orderModel;