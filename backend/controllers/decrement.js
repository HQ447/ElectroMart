import Cart from "../models/cartModel.js";
import mongoose from "mongoose";

export const decrement = async (req, res) => {
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

    // decrement the quantity by 1
    if (cartItem.qty > 1) {
      cartItem.qty -= 1;
      await cartItem.save();
      return res.json({ message: "Cart item quantity decremented", cartItem });
    } else {
      return res
        .status(400)
        .json({ message: "Cannot reduce quantity below 1" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
