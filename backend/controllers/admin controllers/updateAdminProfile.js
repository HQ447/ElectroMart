// controllers/adminController.js
import Admin from "../../models/adminModel.js";
import bcrypt from "bcryptjs";

export const updateAdminProfile = async (req, res) => {
  try {
    const { adminId } = req.params;
    const { adminName, phone, currentPassword, newPassword } = req.body;

    const admin = await Admin.findById(adminId);
    if (!admin) return res.status(404).json({ error: "Admin not found" });

    // Update fields if present
    if (adminName) admin.adminName = adminName;
    if (phone) admin.phone = phone;
    if (req.file) admin.profileImg = req.file.path;

    // If password change is requested
    if (currentPassword && newPassword) {
      console.log("Checking password match...");
      const isMatch = await bcrypt.compare(currentPassword, admin.password);

      if (!isMatch) {
        return res.status(400).json({ error: "Incorrect current password" });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      admin.password = hashedPassword;
    }
    const updatedAdmin = await admin.save();

    res.status(200).json({
      message: "Admin profile updated successfully",
      admin: updatedAdmin,
    });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Server error while updating admin profile" });
  }
};
