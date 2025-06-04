import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    fullName: { type: String }, // Added fullName field
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 6 },
    img: { type: String }, // Profile image URL
    address: { type: String }, // Added address field
    otp: { type: String },
    otpExpire: { type: Date },
  },
  {
    timestamps: true, // This will add createdAt and updatedAt fields
  }
);

export default mongoose.model("User", userSchema);
