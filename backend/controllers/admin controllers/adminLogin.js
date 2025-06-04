import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../../models/adminModel.js";

/**
 * Login a user
 */
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res
        .status(400)
        .json({ message: "admin Not Found check credential" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect Password" });
    }

    const token = jwt.sign(
      { id: admin._id, name: admin.adminName },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h", // optional
      }
    );

    res.json({ message: "Admin Login successful", admin, token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
