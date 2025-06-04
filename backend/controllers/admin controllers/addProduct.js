import Product from "../../models/productModel.js";

export const addProduct = async (req, res) => {
  try {
    const { productName, description, price, qty, category } = req.body;
    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${
      req.file.filename
    }`;
    const existingProduct = await Product.findOne({
      productName,
      description,
      price,
    });

    if (existingProduct) {
      return res
        .status(400)
        .json({ message: "Product is already in the List" });
    }

    const data = await Product.create({
      productName,
      img: imageUrl,
      description,
      price,
      qty,
      category,
    });

    res.status(201).json({ message: "Product Successfully Added", data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
