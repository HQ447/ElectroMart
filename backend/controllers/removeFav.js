import Fav from "../models/favouriteModel.js"; // Import the Cart model

/**
 * Remove a product from the cart
 */
export const removeFav = async (req, res) => {
  try {
    const { id } = req.params; // Get productId from request parameters

    // Check if the product exists in the cart
    const FavItem = await Fav.findById(id);

    if (!FavItem) {
      return res.status(404).json({ message: "Product not found in the List" });
    }

    // Remove the product from the cart
    await Fav.findByIdAndDelete(id);

    res.json({ message: "Product removed from Your Wishlist" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
