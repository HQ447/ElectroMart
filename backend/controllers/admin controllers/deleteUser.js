import User from "../../models/userModel.js";

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    await User.findByIdAndDelete(id);

    res.json({ message: "user removed from the List", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
