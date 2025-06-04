import "./App.css";
import Home from "./components/Main/Home";
import LogIn from "./components/LogIn Page/LogIn";
import Main from "./components/Main/Main";
import Products from "./components/Main/Products";
import AdminProducts from "./components/Admin Section/AdminProducts";
import Users from "./components/Admin Section/Users";
import Settings from "./components/Admin Section/Settings";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Cart from "./components/Main/Cart";
import Register from "./components/SignUp Page/Register";
import Dashboard from "./components/Admin Section/Dashboard";
import Analytics from "./components/Admin Section/Analytics";
import Checkout from "./components/Main/Checkout";
import Order from "./components/Main/Order";
import UserProfile from "./components/Main/UserProfile";
import ManageOrder from "./components/Admin Section/ManageOrder";
import AdminManagement from "./components/Admin Section/AdminManagement";
import ResetPassword from "./components/ResetPassword";
import ForgotPassword from "./components/ForgotPassword";
import VerifyOtp from "./components/VerifyOtp";
import StaffDashboard from "./components/staff section/StaffDashboard";
import Profile from "./components/staff section/Profile";
import Orders from "./components/staff section/Orders";
import { isTokenExpired } from "./utils/authUtils";
import { useEffect } from "react";
import Fav from "./components/Main/Fav";
import AdminProfile from "./components/Admin Section/AdminProfile";
import AdminManage from "./components/Admin Section/AdminManage";
import DispatchOrder from "./components/staff section/DispatchOrders";
import DeliverOrder from "./components/staff section/DeliverOrders";
import About from "./components/Main/About";
import Contact from "./components/Main/Contact";
function App() {
  useEffect(() => {
    const token = localStorage.getItem("token");

    // Check once on load
    if (token && isTokenExpired()) {
      alert("Session expired!");
      //navigate("/Login"); // ⬅️ Redirect to login
      return; // Don't continue interval if already expired
    }

    // Set interval if token exists and not yet expired
    if (token) {
      const interval = setInterval(() => {
        if (isTokenExpired()) {
          alert("Session expired!");
          //navigate("/Login");
        }
      }, 10000); // every 10sec

      return () => clearInterval(interval);
    }
  }, []);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />}>
          <Route index element={<Home />} />
          <Route path="/product" element={<Products />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/Cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order" element={<Order />} />
          <Route path="/user" element={<UserProfile />} />
          <Route path="/fav" element={<Fav />} />
        </Route>

        <Route path="/admin-Dashboard" element={<Dashboard />}>
          <Route path="" element={<Analytics />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="users" element={<Users />} />
          <Route path="manage-order" element={<ManageOrder />} />
          <Route path="manage-admins" element={<AdminManage />} />
          <Route path="profile" element={<AdminProfile />} />

          <Route path="settings" element={<Settings />} />
        </Route>

        <Route path="/staff-Dashboard" element={<StaffDashboard />}>
          <Route index element={<Orders />} />
          <Route path="profile" element={<Profile />} />
          <Route path="dispatchOrder" element={<DispatchOrder />} />
          <Route path="deliverOrder" element={<DeliverOrder />} />
        </Route>
        <Route path="/Login" element={<LogIn />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
