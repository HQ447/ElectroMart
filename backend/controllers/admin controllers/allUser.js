import User from "../../models/userModel.js";

async function allUser(req, res) {
  try {
    const users = await User.find();
    if (!users) return res.json({ message: "error in finding users" });

    return res.json({ message: "All user data fetch successfully ", users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export default allUser;
