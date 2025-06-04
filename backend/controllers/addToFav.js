import Fav from "../models/favouriteModel.js";

export const addToFav = async (req, res) => {
  try {
    const { userId, productId, productName, img, description, price, qty } =
      req.body;

    const existingFavItem = await Fav.findOne({ userId, productId });

    if (existingFavItem) {
      return res
        .status(400)
        .json({ message: "Product is already in your WishList" });
    }

    const data = await Fav.create({
      userId,
      productId,
      productName,
      img,
      description,
      price,
      qty,
    });

    res.status(201).json({ message: "Product added to your Wishlist", data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
