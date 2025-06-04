import React, { useState, useEffect } from "react";
//import avtar from "../../assets/profile.png";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  FaShoppingCart,
  FaUserCircle,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";

import { FaTruckArrowRight } from "react-icons/fa6";
import { isTokenExpired } from "../../utils/authUtils";

function Main() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const [imgPreview, setImgPreview] = useState(null);
  const [userData, setUserData] = useState({
    userId: localStorage.getItem("userId"),
    userName: localStorage.getItem("userName"),
    adminId: localStorage.getItem("adminId"),
    adminName: localStorage.getItem("adminName"),
    staffId: localStorage.getItem("staffId"),
    staffName: localStorage.getItem("staffName"),
  });
  console.log("admin ID ::", userData.adminId);
  console.log("user ID ::", userData.userId);

  const domain = "http://localhost:8080";

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userData.userId) return;
      try {
        const res = await fetch(
          `${domain}/api/user/${localStorage.getItem("userId")}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("userToken")}`,
            },
          }
        );

        const data = await res.json();
        if (res.ok) {
          const user = data.user;
          // console.log(user);
          if (user.img) {
            setImgPreview(`${domain}/${user.img}`);
          }
        } else {
          setImgPreview(null);
          alert("Failed to fetch user");
        }
      } catch (error) {
        //setImgPreview(null);
        //console.error("Error loading profile", error);
        console.log("Error loading profile", error);
      }
    };

    fetchProfile();
  }, []);

  // Update user data when localStorage changes
  useEffect(() => {
    const checkTokenExpiry = () => {
      const userToken = localStorage.getItem("userToken");
      const adminToken = localStorage.getItem("adminToken");
      const staffToken = localStorage.getItem("staffToken");

      let expired = false;

      if (userToken && isTokenExpired(userToken)) {
        // Clear user data only
        localStorage.removeItem("userToken");
        localStorage.removeItem("userId");
        localStorage.removeItem("userName");
        expired = true;
        setImgPreview(null);
      }

      if (adminToken && isTokenExpired(adminToken)) {
        // Clear admin data only
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminId");
        localStorage.removeItem("adminName");
        expired = true;
      }

      if (staffToken && isTokenExpired(staffToken)) {
        // Clear staff data only
        localStorage.removeItem("staffToken");
        localStorage.removeItem("staffId");
        localStorage.removeItem("staffName");
        expired = true;
      }

      if (expired) {
        // Update state accordingly
        setUserData({
          userId: localStorage.getItem("userId"),
          userName: localStorage.getItem("userName"),
          adminId: localStorage.getItem("adminId"),
          adminName: localStorage.getItem("adminName"),
          staffId: localStorage.getItem("staffId"),
          staffName: localStorage.getItem("staffName"),
        });
        // Redirect user to product or login page as you prefer
        navigate("/product");
      }
    };

    const interval = setInterval(checkTokenExpiry, 5000); // check every 5 seconds

    return () => clearInterval(interval);
  }, [navigate]);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("userToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("staffToken");
    localStorage.removeItem("staffId");
    localStorage.removeItem("staffName");
    localStorage.removeItem("adminId");
    localStorage.removeItem("adminName");

    setImgPreview(null);
    setUserData({
      userId: null,
      userName: null,
      adminId: null,
      adminName: null,
      staffId: null,
      staffName: null,
    });
    navigate("/product");
  };

  return (
    <div className="w-full min-h-screen flex flex-col">
      <header
        className={`w-full fixed top-0 left-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-white/95 backdrop-blur-lg shadow-lg border-b border-gray-100"
            : "bg-white/90 backdrop-blur-sm shadow-sm"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14">
            {/* Logo */}
            <div className="flex items-center">
              <NavLink to="/" className="flex items-center group">
                <div className="relative">
                  <span className="text-2xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-red-600 bg-clip-text text-transparent group-hover:from-purple-600 group-hover:via-pink-600 group-hover:to-orange-600 transition-all duration-300">
                    TechMart
                  </span>
                  <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-red-600 group-hover:w-full transition-all duration-300"></div>
                </div>
                <span className="hidden sm:inline-block ml-2 text-xs font-bold text-gray-400 mt-1 tracking-wide">
                  MARKETPLACE
                </span>
              </NavLink>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {[
                { to: "/", label: "Home" },
                { to: "/product", label: "Products" },
                { to: "/about", label: "About" },
                { to: "/contact", label: "Contact" },
              ].map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                      isActive
                        ? "text-blue-600 bg-blue-50"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {link.label}
                      {isActive && (
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full"></div>
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </nav>

            {/* Desktop User Section */}
            <div className="hidden lg:flex items-center space-x-3">
              {/* User Info */}
              <div className="flex items-center">
                {userData.adminId ? (
                  <div className="flex items-center px-3 py-1.5 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-full border border-purple-200">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                    <span className="text-sm font-semibold text-purple-700">
                      {userData.adminName}
                    </span>
                  </div>
                ) : userData.userId ? (
                  <div
                    className="flex items-center px-3 py-1.5 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-full border border-blue-200 cursor-pointer hover:shadow-md transition-all duration-300"
                    onClick={() => navigate("/user")}
                  >
                    <img
                      src={imgPreview || "/profile.png"}
                      alt="profile"
                      className="w-6 h-6 rounded-full border-2 border-white shadow-sm mr-2"
                    />
                    <span className="text-sm font-semibold text-blue-700">
                      {userData.userName}
                    </span>
                  </div>
                ) : userData.staffId ? (
                  <div className="flex items-center px-3 py-1.5 bg-gradient-to-r from-green-50 to-emerald-50 rounded-full border border-green-200">
                    <img
                      src={imgPreview || "/profile.png"}
                      alt="profile"
                      className="w-6 h-6 rounded-full border-2 border-white shadow-sm mr-2"
                    />
                    <span className="text-sm font-semibold text-green-700">
                      {userData.staffName}
                    </span>
                  </div>
                ) : null}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2">
                {userData.adminId ? (
                  <button
                    onClick={() => navigate("/admin-Dashboard")}
                    className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white text-sm font-medium rounded-lg hover:from-purple-600 hover:to-indigo-700 shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                  >
                    Dashboard
                  </button>
                ) : userData.userId ? (
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1 px-3 py-2 bg-gray-50 rounded-lg border">
                      <FaRegHeart
                        className="text-lg text-gray-600 hover:text-red-500 cursor-pointer transition-colors duration-300"
                        onClick={() => navigate("/fav")}
                      />
                      <FaTruckArrowRight
                        title="My Orders"
                        className="text-lg text-gray-600 hover:text-blue-500 cursor-pointer transition-colors duration-300"
                        onClick={() => navigate("/order")}
                      />
                      <div className="relative">
                        <FaShoppingCart
                          title="Cart"
                          className="text-lg text-gray-600 hover:text-green-500 cursor-pointer transition-colors duration-300"
                          onClick={() => navigate("/cart")}
                        />
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
                          0
                        </span>
                      </div>
                    </div>
                  </div>
                ) : userData.staffId ? (
                  <button
                    onClick={() => navigate("/staff-Dashboard")}
                    className="flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-medium rounded-lg hover:from-green-600 hover:to-emerald-700 shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                  >
                    Dashboard
                  </button>
                ) : null}

                {/* Auth Button */}
                {!userData.userId && !userData.adminId && !userData.staffId ? (
                  <NavLink to="/Login">
                    <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-medium rounded-lg hover:from-blue-600 hover:to-blue-700 shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300">
                      Login
                    </button>
                  </NavLink>
                ) : (
                  <button
                    onClick={handleLogout}
                    className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-300"
                  >
                    <FaSignOutAlt className="text-lg" />
                  </button>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-300"
              >
                {isMenuOpen ? (
                  <FaTimes className="h-5 w-5" />
                ) : (
                  <FaBars className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          <div
            className={`lg:hidden transition-all duration-300 ease-in-out ${
              isMenuOpen
                ? "max-h-screen opacity-100 pb-4"
                : "max-h-0 opacity-0 overflow-hidden"
            }`}
          >
            <div className="pt-4 space-y-2">
              {/* User Info Section - Mobile */}
              <div className="pb-4 border-b border-gray-100 mb-4">
                <div className="flex items-center px-4 py-3 bg-gray-50 rounded-lg">
                  {userData.adminId ? (
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center mr-3">
                        <span className="text-white text-sm font-bold">A</span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">
                          {userData.adminName}
                        </p>
                        <p className="text-xs text-purple-600 font-medium">
                          Admin
                        </p>
                      </div>
                    </div>
                  ) : userData.userId ? (
                    <div className="flex items-center">
                      <img
                        src={imgPreview || "/profile.png"}
                        alt="profile"
                        className="w-8 h-8 rounded-full border-2 border-white shadow-sm mr-3"
                      />
                      <div>
                        <p
                          className="text-sm font-semibold text-gray-800 cursor-pointer hover:text-blue-600"
                          onClick={() => {
                            navigate("/user");
                            setIsMenuOpen(false);
                          }}
                        >
                          {userData.userName}
                        </p>
                        <p className="text-xs text-blue-600 font-medium">
                          User
                        </p>
                      </div>
                    </div>
                  ) : userData.staffId ? (
                    <div className="flex items-center">
                      <img
                        src={imgPreview || "/profile.png"}
                        alt="profile"
                        className="w-8 h-8 rounded-full border-2 border-white shadow-sm mr-3"
                      />
                      <div>
                        <p className="text-sm font-semibold text-gray-800">
                          {userData.staffName}
                        </p>
                        <p className="text-xs text-green-600 font-medium">
                          Staff
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center mr-3">
                        <FaUserCircle className="text-white text-lg" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">
                          Guest
                        </p>
                        <p className="text-xs text-gray-500">Not logged in</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Navigation Links - Mobile */}
              <div className="space-y-1">
                {[
                  { to: "/", label: "Home" },
                  { to: "/product", label: "Products" },
                  { to: "/about", label: "About" },
                  { to: "/contact", label: "Contact" },
                ].map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    className={({ isActive }) =>
                      `block px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                        isActive
                          ? "bg-blue-50 text-blue-600 border-l-4 border-blue-600"
                          : "text-gray-700 hover:bg-gray-50"
                      }`
                    }
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </NavLink>
                ))}
              </div>

              {/* Mobile Actions */}
              <div className="pt-4 space-y-2 border-t border-gray-100">
                {userData.adminId && (
                  <button
                    onClick={() => {
                      navigate("/admin-Dashboard");
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left block px-4 py-3 rounded-lg text-sm font-medium text-purple-700 bg-purple-50 hover:bg-purple-100 transition-all duration-300"
                  >
                    Admin Dashboard
                  </button>
                )}

                {userData.staffId && (
                  <button
                    onClick={() => {
                      navigate("/staff-Dashboard");
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left block px-4 py-3 rounded-lg text-sm font-medium text-green-700 bg-green-50 hover:bg-green-100 transition-all duration-300"
                  >
                    Staff Dashboard
                  </button>
                )}

                {userData.userId && (
                  <>
                    {[
                      {
                        action: () => navigate("/fav"),
                        label: "Favorites",
                        icon: "❤️",
                      },
                      {
                        action: () => navigate("/order"),
                        label: "My Orders",
                        icon: "📦",
                      },
                      {
                        action: () => navigate("/cart"),
                        label: "Cart",
                        icon: "🛒",
                      },
                    ].map((item, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          item.action();
                          setIsMenuOpen(false);
                        }}
                        className="w-full text-left flex items-center px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all duration-300"
                      >
                        <span className="text-base mr-3">{item.icon}</span>
                        {item.label}
                      </button>
                    ))}
                  </>
                )}

                {!userData.userId && !userData.adminId && !userData.staffId ? (
                  <NavLink
                    to="/Login"
                    className="block px-4 py-3 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-center transition-all duration-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </NavLink>
                ) : (
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left flex items-center px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-all duration-300"
                  >
                    <span className="text-base mr-3">🚪</span>
                    Logout
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Content Container with padding for fixed header */}
      <main className="flex-grow pt-16">
        <Outlet />
      </main>

      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-4">
                TechMart
              </h3>
              <p className="text-gray-400 mb-6">
                Your destination for the latest trends Tech Devices
              </p>
              <div className="flex space-x-4">
                {["facebook", "twitter", "instagram", "youtube"].map(
                  (social) => (
                    <button
                      key={social}
                      className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors duration-300"
                    >
                      <i className={`fab fa-${social} text-sm`}></i>
                    </button>
                  )
                )}
              </div>
            </div>

            {[
              {
                title: "Shop",
                links: ["Smart Phones", "Watches", "Laptops", "Gagets", "Sale"],
              },
              {
                title: "Support",
                links: ["Contact Us", "Shipping Info", "Returns", "FAQ"],
              },
              {
                title: "Company",
                links: [
                  "About Us",
                  "Careers",
                  "Press",
                  "Sustainability",
                  "Terms of Service",
                ],
              },
            ].map((section, index) => (
              <div key={index}>
                <h4 className="text-lg font-semibold mb-4">{section.title}</h4>
                <ul className="space-y-2">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a
                        href="#"
                        className="text-gray-400 hover:text-white transition-colors duration-300"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2025 TechMart. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Main;
