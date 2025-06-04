import React from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";

function StaffSidebar() {
  // Dummy staff data (replace with real data or props/localStorage)
  const staffMember = {
    name: "John Doe",
    email: "johndoe@gmail.com",
    image: "https://via.placeholder.com/100", // Replace with actual image URL
  };

  const location = useLocation();
  const navigate = useNavigate();

  const linkClass = (path) =>
    `group flex items-center py-3 px-4 rounded-xl transition-all duration-300 ${
      location.pathname === path
        ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg transform scale-[1.02]"
        : "text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 hover:text-blue-600 hover:shadow-md hover:transform hover:scale-[1.01]"
    }`;

  const handleLogout = async () => {
    localStorage.removeItem("staffToken");
    localStorage.removeItem("adminToken");
    localStorage.removeItem("userToken");

    localStorage.removeItem("staffId");
    localStorage.removeItem("adminId");
    localStorage.removeItem("userId");

    localStorage.removeItem("staffName");
    localStorage.removeItem("adminName");
    localStorage.removeItem("userName");

    navigate("/");
  };

  return (
    <div className="w-[26%] h-screen bg-gradient-to-br from-white via-gray-50 to-blue-50 shadow-2xl border-r border-gray-200 flex flex-col">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-br-3xl shadow-lg">
        <div className="flex flex-col items-center">
          <div className="relative">
            <img
              src={"/profile.png"}
              alt="Staff"
              className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-xl"
            />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-2 border-white"></div>
          </div>
          <h2 className="mt-4 font-bold text-xl text-center">
            {staffMember.name}
          </h2>
          <p className="text-blue-100 text-sm font-medium">
            {staffMember.email}
          </p>
          <div className="mt-2 px-3 py-1 bg-blue-500/30 rounded-full">
            <span className="text-xs font-semibold">Staff Member</span>
          </div>
        </div>
      </div>

      {/* Navigation Section */}
      <div className="flex-1 p-6">
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
            Order Management
          </h3>
          <nav className="space-y-3">
            <Link to="" className={linkClass("")}>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-current rounded-full mr-3 opacity-60"></div>
                <span className="font-medium">Confirm Orders</span>
              </div>
            </Link>
            <Link to="dispatchOrder" className={linkClass("dispatchOrder")}>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-current rounded-full mr-3 opacity-60"></div>
                <span className="font-medium">Dispatch Orders</span>
              </div>
            </Link>
            <Link to="deliverOrder" className={linkClass("deliverOrder")}>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-current rounded-full mr-3 opacity-60"></div>
                <span className="font-medium">Deliver Orders</span>
              </div>
            </Link>
          </nav>
        </div>
      </div>

      {/* Footer Section */}
      <div className="p-6 bg-gray-50 border-t border-gray-200">
        <div className="flex gap-3">
          <NavLink
            to="/product"
            className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl px-4 py-3 text-sm font-semibold text-center transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            🌐 Website
          </NavLink>
          <button
            onClick={handleLogout}
            className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            🚪 Logout
          </button>
        </div>

        {/* Additional Footer Info */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            Dashboard v2.0 • Last login: Today
          </p>
        </div>
      </div>
    </div>
  );
}

export default StaffSidebar;
