import Admin from "../../models/adminModel.js";

async function allAdmins(req, res) {
  try {
    const admins = await Admin.find();
    if (!admins) return res.json({ message: "error in finding admins" });

    return res.json({ message: "All user data fetch successfully ", admins });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export default allAdmins;
