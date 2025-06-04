import Product from "../models/productModel.js"; // Import the Product model

/**
 * Get all products from the database
 */
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find(); // Fetch all products from the database
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
