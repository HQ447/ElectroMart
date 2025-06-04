import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { Outlet, useNavigate } from "react-router-dom";
import Notfound from "../Notfound";
import { isTokenExpired } from "../../utils/authUtils";

function Dashboard() {
  const navigate = useNavigate();
  const adminId = localStorage.getItem("adminId");
  const [userData, setUserData] = useState({
    userId: localStorage.getItem("userId"),
    userName: localStorage.getItem("userName"),
    adminId: localStorage.getItem("adminId"),
    adminName: localStorage.getItem("adminName"),
  });
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Handle sidebar toggle
  const handleSidebarToggle = (collapsed) => {
    setIsSidebarCollapsed(collapsed);
  };

  useEffect(() => {
    const checkTokenExpiry = () => {
      const adminToken = localStorage.getItem("adminToken");
      let expired = false;

      if (adminToken && isTokenExpired(adminToken)) {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminId");
        localStorage.removeItem("adminName");
        expired = true;
      }

      if (expired) {
        setUserData({
          userId: localStorage.getItem("userId"),
          userName: localStorage.getItem("userName"),
          adminId: localStorage.getItem("adminId"),
          adminName: localStorage.getItem("adminName"),
        });
        navigate("/product");
      }
    };

    const interval = setInterval(checkTokenExpiry, 5000);
    return () => clearInterval(interval);
  }, [navigate]);

  if (!adminId) return <Notfound />;

  return (
    <div className="flex min-h-screen">
      <Sidebar onToggle={handleSidebarToggle} />
      <main className={``}>
        <Outlet />
      </main>
    </div>
  );
}

export default Dashboard;
