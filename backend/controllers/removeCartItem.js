import Cart from "../models/cartModel.js"; // Import the Cart model

/**
 * Remove a product from the cart
 */
export const removeCartItem = async (req, res) => {
  try {
    const { id } = req.params; // Get productId from request parameters

    // Check if the product exists in the cart
    const cartItem = await Cart.findById(id);

    if (!cartItem) {
      return res.status(404).json({ message: "Product not found in the cart" });
    }

    // Remove the product from the cart
    await Cart.findByIdAndDelete(id);

    res.json({ message: "Product removed from the cart" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
