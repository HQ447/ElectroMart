import Product from "../../models/productModel.js";

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found in the list" });
    }

    await Product.findByIdAndDelete(id);

    res.json({ message: "Product removed from the List", product });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
