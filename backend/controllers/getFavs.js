import Fav from "../models/favouriteModel.js";

export const getFavs = async (req, res) => {
  try {
    const { userId } = req.params;

    const items = await Fav.find({ userId });

    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
