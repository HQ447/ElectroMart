import Admin from "../../models/adminModel.js";

export const removeAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const admin = await Admin.findById(id);

    if (!admin) {
      return res.status(404).json({ message: "admin not found" });
    }

    await Admin.findByIdAndDelete(id);

    res.json({ message: "admin removed from the List", admin });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
