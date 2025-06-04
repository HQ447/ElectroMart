import Cart from "../models/cartModel.js";

export const addToCart = async (req, res) => {
  try {
    const { userId, productId, productName, img, description, price, qty } =
      req.body;

    const existingCartItem = await Cart.findOne({ userId, productId });

    if (existingCartItem) {
      return res
        .status(400)
        .json({ message: "Product is already in the cart" });
    }

    const data = await Cart.create({
      userId,
      productId,
      productName,
      img,
      description,
      price,
      qty,
    });

    res.status(201).json({ message: "Product added to cart", data });
  } catch (error) {
    console.error("Error in addToCart controller:", error); // <--- Add this
    res.status(500).json({ error: error.message });
  }
};
