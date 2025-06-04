import Cart from "../models/cartModel.js";
import mongoose from "mongoose";

export const increment = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if `productId` is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    // Find the cart item by `_id`
    const cartItem = await Cart.findById(id);

    if (!cartItem) {
      return res.status(404).json({ message: "Product not found in the cart" });
    }

    // Increment the quantity by 1
    cartItem.qty += 1;
    await cartItem.save();

    res.json({ message: "Cart item quantity incremented", cartItem });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
