import mongoose from "mongoose";
import User from "../models/userModel.js";

export const getUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate id before querying
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid or missing user ID" });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({ message: "User fetched successfully", user });
  } catch (error) {
    console.error("Error in fetching user", error);
    res.status(500).json({ message: "Server error" });
  }
};
