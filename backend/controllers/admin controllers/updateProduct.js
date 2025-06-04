import Product from "../../models/productModel.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

export const updateProduct = async (req, res) => {
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const { productName, description, price, category } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (req.file && product.img) {
      const oldImagePath = path.join(__dirname, "..", product.img);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    product.productName = productName || product.productName;
    product.description = description || product.description;
    product.price = price || product.price;
    product.category = category || product.category;

    if (req.file) {
      product.img = `${req.protocol}://${req.get("host")}/uploads/${
        req.file.filename
      }`;
    }

    await product.save();

    res.status(200).json({ message: "Product updated successfully", product });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
