import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    productName: { type: String },
    img: { type: String },
    description: { type: String },
    price: { type: Number },
    qty: { type: Number },
    category: { type: String },
    feature: { type: Boolean },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
