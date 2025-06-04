import Cart from "../models/cartModel.js";

export const getAllCartItems = async (req, res) => {
  try {
    const { userId } = req.params;

    const items = await Cart.find({ userId });

    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
