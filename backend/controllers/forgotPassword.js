import User from "../models/userModel.js";
import { sendEmail } from "../utils/sendEmail.js"; // ✅ using your existing utility

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpire = Date.now() + 5 * 60 * 1000; // 5 min
    await user.save();

    const message = `
      <h2>Password Reset Request</h2>
      <p>Please click the link below to reset your password:</p>
      <h1 target="_blank">${otp}</h1>
      <p>This link will expire in 10 min.</p>
    `;

    await sendEmail(email, "Yor OTP", message);
    res.json({ msg: "OTP sent to your email" });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Error sending password reset email",
      error: err.message,
    });
  }
};
