import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Staff from "../../models/staffModel.js";

export const staffLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const staff = await Staff.findOne({ email });
    if (!staff) {
      return res
        .status(400)
        .json({ message: "staff Not Found check credential" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, staff.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect Password" });
    }

    const token = jwt.sign(
      { id: staff._id, name: staff.staffName },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h", // optional
      }
    );

    res.json({ message: "staff Login successful", staff, token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
