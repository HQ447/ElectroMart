import express from "express";
import { authValidator } from "../middlewares/authValidator.js";

// Import controllers
import { getAllProducts } from "../controllers/getProducts.js";
import { register } from "../controllers/register.js";
import { login } from "../controllers/login.js";
import { addToCart } from "../controllers/addToCart.js";
import { increment } from "../controllers/increment.js";
import { decrement } from "../controllers/decrement.js";
import { removeCartItem } from "../controllers/removeCartItem.js";
import { getAllCartItems } from "../controllers/getCartItems.js";
import { adminLogin } from "../controllers/admin controllers/adminLogin.js";
import { adminSignup } from "../controllers/admin controllers/adminSignup.js";
import { addProduct } from "../controllers/admin controllers/addProduct.js";
import allUser from "../controllers/admin controllers/allUser.js";
import { deleteProduct } from "../controllers/admin controllers/deleteProduct.js";
import { deleteUser } from "../controllers/admin controllers/deleteUser.js";
import { placeOrder } from "../controllers/placeOrder.js";
import allOrder from "../controllers/admin controllers/allOrder.js";
import { getUserOrders } from "../controllers/getUserOrders.js";
import { cancelOrder } from "../controllers/cancelOrder.js";
import allAdmins from "../controllers/admin controllers/allAdmins.js";
import { forgotPassword } from "../controllers/forgotPassword.js";
import { resetPassword } from "../controllers/resetPassword.js";
import { verifyOtp } from "../controllers/verifyOtp.js";
import tokenMiddleware from "../middlewares/tokenMiddleware.js";
import { addToFav } from "../controllers/addToFav.js";
import { getFavs } from "../controllers/getFavs.js";
import { removeFav } from "../controllers/removeFav.js";
import upload from "../middlewares/multerMiddleware.js";
import { updateProduct } from "../controllers/admin controllers/UpdateProduct.js";
import uploadProfile from "../middlewares/uploadProfile.js";
import { updateUserProfile } from "../controllers/updateUserProfile.js";
import { getUser } from "../controllers/getUser.js";
import { removeAdmin } from "../controllers/admin controllers/removeAdmin.js";
import { updateAdminProfile } from "../controllers/admin controllers/updateAdminProfile.js";
import adminUpload from "../middlewares/adminUpload.js";
import { getAdmin } from "../controllers/admin controllers/getAdmin.js";
import updateOrderStatus from "../controllers/admin controllers/updateOrderStatus.js";
import { staffLogin } from "../controllers/staff controllers/staffLogin.js";
import { staffSignup } from "../controllers/staff controllers/staffSignup.js";

const router = express.Router();

// Product Routes
router.get("/products", getAllProducts);

// Authentication Routes
router.post("/register", authValidator, register);
router.post("/login", authValidator, login);
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);

//admin dashboard APIs
router.post("/adminLogin", authValidator, adminLogin);
router.post("/adminSignup", authValidator, adminSignup);
router.delete("/removeAdmin/:id", tokenMiddleware, removeAdmin);
router.put(
  "/updateAdminProfile/:adminId",
  adminUpload.single("profileImg"),
  updateAdminProfile
);
router.post("/addProduct", tokenMiddleware, upload.single("img"), addProduct);
router.put(
  "/updateProduct/:id",
  tokenMiddleware,
  upload.single("img"),
  updateProduct
);
router.delete("/deleteProduct/:id", tokenMiddleware, deleteProduct);
router.get("/users", tokenMiddleware, allUser);
router.delete("/deleteUser/:id", tokenMiddleware, deleteUser);
router.get("/orders", tokenMiddleware, allOrder);
router.get("/admins", tokenMiddleware, allAdmins);
router.get("/admin/:id", tokenMiddleware, getAdmin);

router.put("/updateOrderStatus/:orderId", tokenMiddleware, updateOrderStatus);

//staff routes

router.post("/staffSignup", authValidator, staffSignup);
router.post("/staffLogin", authValidator, staffLogin);

// user Routes
router.put(
  "/profile",
  tokenMiddleware,
  uploadProfile.single("img"),
  updateUserProfile
);
router.get("/user/:id", getUser);
router.get("/cartItems/:userId", tokenMiddleware, getAllCartItems);
router.post("/addToCart", tokenMiddleware, addToCart);
router.post("/addToFav", tokenMiddleware, addToFav);
router.get("/FavItems/:userId", tokenMiddleware, getFavs);
router.put("/increment/:id", tokenMiddleware, increment);
router.put("/decrement/:id", tokenMiddleware, decrement);
router.delete("/removeCartItem/:id", tokenMiddleware, removeCartItem);
router.delete("/removeFavItem/:id", tokenMiddleware, removeFav);
router.post("/placeOrder", tokenMiddleware, placeOrder);
router.get("/userOrders/:userId", tokenMiddleware, getUserOrders);
router.delete("/cancelOrder/:id", tokenMiddleware, cancelOrder);

export default router;
