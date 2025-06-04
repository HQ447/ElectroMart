import Admin from "../../models/adminModel.js";
import bcrypt from "bcryptjs";

export const adminSignup = async (req, res) => {
  try {
    const { adminName, email, password } = req.body;

    const checkUser = await Admin.findOne({ email });
    if (checkUser) {
      return res
        .status(400)
        .json({ message: "this admin is already registed , Please login" });
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const admin = new Admin({ adminName, email, password: hashedPassword });
    await admin.save();

    res.status(201).json({ message: "Admin registered successfully", admin });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
