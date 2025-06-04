import User from "../models/userModel.js";
import bcrypt from "bcryptjs";

/**
 * Register a new user
 */
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const checkUser = await User.findOne({ email });
    if (checkUser) {
      return res
        .status(400)
        .json({ message: "this user is already registed , Please login" });
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = new User({ username, email, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
