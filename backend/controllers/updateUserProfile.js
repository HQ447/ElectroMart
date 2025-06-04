import bcrypt from "bcryptjs";
import User from "../models/userModel.js";

export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { fullName, email, address, currentPassword, newPassword } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Handle profile image upload
    if (req.file) {
      // Delete old profile image if it exists
      if (user.img) {
        const oldImagePath = path.join(process.cwd(), user.img);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }

      // Set new image path
      user.img = `uploads/profiles/${req.file.filename}`;
    }

    // Update basic info
    if (fullName) user.fullName = fullName;
    if (email && email !== user.email) {
      // Check if email already exists
      const existingUser = await User.findOne({ email, _id: { $ne: userId } });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Email already in use",
        });
      }
      user.email = email;
    }
    if (address) user.address = address;

    // Update password if provided
    if (currentPassword && newPassword) {
      const isCurrentPasswordValid = await bcrypt.compare(
        currentPassword,
        user.password
      );

      if (!isCurrentPasswordValid) {
        return res.status(400).json({
          success: false,
          message: "Current password is incorrect",
        });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({
          success: false,
          message: "New password must be at least 6 characters long",
        });
      }

      const hashedNewPassword = await bcrypt.hash(newPassword, 12);
      user.password = hashedNewPassword;
    }

    await user.save();

    // Return updated user data (without sensitive info)
    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: user._id,
        username: user.username,
        fullName: user.fullName || user.username,
        email: user.email,
        img: user.img,
        address: user.address,
        joinDate: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
