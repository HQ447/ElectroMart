import Staff from "../../models/staffModel.js";
import bcrypt from "bcryptjs";

export const staffSignup = async (req, res) => {
  try {
    const { staffName, email, password } = req.body;

    const checkUser = await Staff.findOne({ email });
    if (checkUser) {
      return res
        .status(400)
        .json({ message: "this staff is already registed , Please login" });
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const staff = new Staff({ staffName, email, password: hashedPassword });
    await staff.save();

    res.status(201).json({ message: "staff registered successfully", staff });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
