import User from "../models/userModel.js";
export const verifyOtp = async (req, res) => {
  const { otp } = req.body;
  const user = await User.findOne({
    otp,
    otpExpire: { $gt: Date.now() },
  });
  if (!user) return res.status(400).json({ msg: "Invalid or expired OTP" });

  res.json({ msg: "OTP verified" });
};
