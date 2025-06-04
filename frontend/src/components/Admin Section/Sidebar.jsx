import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaBox,
  FaUsers,
  FaCog,
  FaTachometerAlt,
  FaBars,
  FaTimes,
  FaSignOutAlt,
  FaShoppingCart,
} from "react-icons/fa";

function Sidebar({ onToggle, isCollapsed }) {
  const [collapsed, setCollapsed] = useState(isCollapsed || false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeAdmin, setActiveAdmin] = useState();
  const token = localStorage.getItem("adminToken");
  const adminId = localStorage.getItem("adminId");
  const domain = "http://localhost:8080/api";

  const navigate = useNavigate();

  const toggleSidebar = () => {
    const newCollapsedState = !collapsed;
    setCollapsed(newCollapsedState);
    if (onToggle) {
      onToggle(newCollapsedState); // Notify parent of the new state
    }
  };

  const toggleMobileSidebar = () => {
    setMobileOpen(!mobileOpen);
  };

  const fetchActiveAdmin = async () => {
    try {
      if (!adminId) return;

      const admin = await fetch(`${domain}/admin/${adminId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const activeAdmin = await admin.json();

      if (admin.ok) {
        setActiveAdmin(activeAdmin.admin);
      }
    } catch (error) {
      console.error("error in fetching active admin", error);
    }
  };

  useEffect(() => {
    fetchActiveAdmin();
  }, []);

  const navItems = [
    {
      to: "",
      icon: <FaTachometerAlt />,
      text: "Dashboard",
      exact: true,
      badge: null,
    },
    {
      to: "products",
      icon: <FaBox />,
      text: "Products",
      badge: null,
    },
    {
      to: "manage-order",
      icon: <FaShoppingCart />,
      text: "Orders",
      badge: null,
    },
    {
      to: "users",
      icon: <FaUsers />,
      text: "Users",
      badge: null,
    },
    {
      to: "manage-admins",
      icon: <FaUsers />,
      text: "Admins",
      badge: null,
    },
    {
      to: "settings",
      icon: <FaCog />,
      text: "Settings",
      badge: null,
    },
  ];

  const NavItem = ({ item }) => (
    <NavLink
      to={item.to}
      end={item.exact}
      className={({ isActive }) =>
        `group flex items-center px-3 py-2.5  rounded-lg transition-all duration-300 ease-in-out transform hover:scale-[1.02] relative overflow-hidden ${
          isActive
            ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md shadow-blue-500/25"
            : "text-slate-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-700 border border-transparent hover:border-blue-100/50 hover:shadow-sm"
        } ${
          collapsed && window.innerWidth >= 768
            ? "justify-center"
            : "justify-between"
        }`
      }
      onClick={() => {
        // Close mobile sidebar when nav item is clicked
        if (window.innerWidth < 768) {
          setMobileOpen(false);
        }
      }}
    >
      {({ isActive }) => (
        <>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <div className="flex items-center relative z-10">
            <span
              className={`${
                collapsed && window.innerWidth >= 768 ? "text-base" : "text-sm"
              } transition-all duration-300 group-hover:scale-110 ${
                isActive ? "drop-shadow-sm" : ""
              }`}
            >
              {item.icon}
            </span>
            {(!collapsed || window.innerWidth < 768) && (
              <span className="ml-3 font-medium text-sm tracking-wide transition-all duration-300">
                {item.text}
              </span>
            )}
          </div>
          {(!collapsed || window.innerWidth < 768) && item.badge && (
            <span className="bg-gradient-to-r from-orange-400 to-pink-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-sm animate-pulse relative z-10 border border-white/20">
              {item.badge}
            </span>
          )}
        </>
      )}
    </NavLink>
  );

  function handleLogout() {
    localStorage.removeItem("adminId");
    localStorage.removeItem("adminName");
    localStorage.removeItem("adminToken");
    navigate("/");
  }

  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-20 lg:hidden transition-all duration-300"
          onClick={toggleMobileSidebar}
        />
      )}

      {/* Mobile Menu Button */}
      <button
        className="fixed top-4 left-4 z-30 p-2.5 rounded-xl bg-white/90 backdrop-blur-md shadow-xl text-slate-700 lg:hidden hover:shadow-2xl transition-all duration-300 hover:scale-110 border border-slate-200/50"
        onClick={toggleMobileSidebar}
      >
        {mobileOpen ? (
          <FaTimes className="w-4 h-4" />
        ) : (
          <FaBars className="w-4 h-4" />
        )}
      </button>

      {/* Sidebar */}
      <div
        className={`
          bg-gradient-to-b from-white via-slate-50/80 to-white shadow-2xl border-r border-slate-200/50 backdrop-blur-xl transition-all duration-500 ease-in-out min-h-screen flex flex-col fixed lg:relative z-25
          
          /* Mobile styles */
          ${
            mobileOpen
              ? "translate-x-0 w-72 sm:w-80"
              : "-translate-x-full w-72 sm:w-80"
          } lg:translate-x-0
          
          /* Desktop styles */
          ${collapsed ? "lg:w-20" : "lg:w-72 xl:w-80"}
        `}
      >
        {/* Admin Profile Section */}
        {activeAdmin && (
          <div className="pt-6 pb-4 px-4 border-b border-slate-200/30">
            <div className="flex flex-col justify-center items-center">
              <div className="relative group mb-3">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-500 animate-pulse"></div>
                <div className="relative border-2 border-white rounded-full shadow-lg">
                  <img
                    src={
                      activeAdmin.profileImg
                        ? `http://localhost:8080/${activeAdmin.profileImg}`
                        : "/profile.png"
                    }
                    alt="Admin Profile"
                    className={`${
                      collapsed && window.innerWidth >= 1024
                        ? "w-10 h-10"
                        : "w-12 h-12 sm:w-14 sm:h-14"
                    } rounded-full object-cover transition-all duration-300 group-hover:scale-105`}
                  />
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 sm:w-4 sm:h-4 bg-green-500 border-2 border-white rounded-full shadow-md">
                  <div className="w-full h-full bg-green-400 rounded-full animate-ping"></div>
                </div>
              </div>

              {(!collapsed || window.innerWidth < 1024) && (
                <>
                  <h1 className="font-semibold text-sm sm:text-base uppercase bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent tracking-wide mb-1 text-center px-2">
                    {activeAdmin.adminName}
                  </h1>
                  <p className="text-slate-500 text-xs sm:text-sm mb-3 font-medium text-center px-2 break-all">
                    {activeAdmin.email}
                  </p>
                  <NavLink
                    to="profile"
                    className="inline-block text-xs sm:text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 cursor-pointer px-3 py-2 rounded-lg text-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 border border-blue-500/20 hover:border-blue-400/30"
                    onClick={() => {
                      if (window.innerWidth < 1024) {
                        setMobileOpen(false);
                      }
                    }}
                  >
                    ✨ Edit Profile
                  </NavLink>
                </>
              )}
            </div>
          </div>
        )}

        {/* Navigation Menu */}
        <div className="py-4 px-4 flex-1 overflow-y-auto">
          {(!collapsed || window.innerWidth < 1024) && (
            <div className="mb-4">
              <div className="relative">
                <p className="px-2 py-1 text-xs font-bold text-slate-400 uppercase tracking-wide">
                  📊 Main Menu
                </p>
                <div className="absolute bottom-0 left-2 right-2 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
              </div>
            </div>
          )}

          <nav className="space-y-2">
            {navItems.map((item, index) => (
              <div
                key={index}
                className="transform transition-all duration-300 hover:translate-x-1"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <NavItem item={item} />
              </div>
            ))}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-slate-200/50 bg-white/80 backdrop-blur-sm">
          {(!collapsed || window.innerWidth < 1024) && (
            <div className="flex flex-col sm:flex-row gap-2 mb-3">
              <NavLink
                to={"/"}
                className="flex-1 py-2.5 px-3 text-xs sm:text-sm font-semibold bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 text-center border border-orange-400/20 hover:border-orange-300/30"
                onClick={() => {
                  if (window.innerWidth < 1024) {
                    setMobileOpen(false);
                  }
                }}
              >
                🌐 Website
              </NavLink>
              <button
                className="flex-1 py-2.5 px-3 text-xs sm:text-sm font-semibold bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 border border-red-400/20 hover:border-red-300/30"
                onClick={handleLogout}
              >
                🚪 Logout
              </button>
            </div>
          )}

          {/* Desktop-only collapse button */}
          <button
            onClick={toggleSidebar}
            className="hidden lg:block w-full py-2.5 px-3 text-xs sm:text-sm font-semibold bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 text-center border border-blue-400/20 hover:border-blue-300/30"
          >
            {collapsed ? "➡️ Expand" : "⬅️ Collapse"}
          </button>

          {/* Mobile-only close button */}
          <button
            onClick={toggleMobileSidebar}
            className="lg:hidden w-full py-2.5 px-3 text-xs sm:text-sm font-semibold bg-gradient-to-r from-gray-500 to-slate-500 hover:from-gray-600 hover:to-slate-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 text-center border border-gray-400/20 hover:border-gray-300/30"
          >
            ✕ Close Menu
          </button>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
