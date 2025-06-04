import Admin from "../../models/adminModel.js";

export const getAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const admin = await Admin.findById(id);

    if (!admin) {
      return res.json({ message: "admin Not found" });
    }

    return res.json({ message: "admin Fetched Succesfully: ", admin });
  } catch (error) {
    console.error("Error in fetching admin", error);
  }
};
