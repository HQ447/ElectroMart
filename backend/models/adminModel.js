// models/Admin.js
import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  adminName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6 },
  phone: { type: String },
  profileImg: { type: String }, // store image path or URL
});

export default mongoose.model("Admin", adminSchema);
