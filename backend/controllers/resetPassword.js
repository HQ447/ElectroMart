import User from "../models/userModel.js";
import bcrypt from "bcryptjs";

export const resetPassword = async (req, res) => {
  const { otp, password } = req.body;

  console.log("Reset Password Triggered");
  console.log("OTP:", otp);
  console.log("New Password:", password);

  try {
    if (!otp || !password) {
      return res.status(400).json({ msg: "OTP and password are required" });
    }

    const user = await User.findOne({
      otp,
      otpExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ msg: "Invalid or expired OTP" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.otp = undefined;
    user.otpExpire = undefined;
    await user.save();

    res.json({ msg: "Password reset successful" });
  } catch (err) {
    console.error("Error resetting password:", err);
    res
      .status(500)
      .json({ msg: "Error in Password Reset", error: err.message });
  }
};
