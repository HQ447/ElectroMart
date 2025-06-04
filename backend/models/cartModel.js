import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  productName: { type: String, required: true },
  img: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  qty: { type: Number, required: true },
});

// Ensure a user can only have one of each product
cartSchema.index({ userId: 1, productId: 1 }, { unique: true });

export default mongoose.model("Cart", cartSchema);
