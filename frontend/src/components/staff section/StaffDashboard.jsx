/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import StaffSidebar from "./StaffSidebar";
import Notfound from "../Notfound";
import { isTokenExpired } from "../../utils/authUtils";

function StaffDashboard() {
  const staffId = localStorage.getItem("staffId");
  const staffToken = localStorage.getItem("staffToken");
  const navigate = useNavigate();

  useEffect(() => {
    const checkTokenExpiry = () => {
      let expired = false;

      if (staffToken && isTokenExpired(staffToken)) {
        localStorage.removeItem("staffToken");
        localStorage.removeItem("staffId");
        localStorage.removeItem("staffName");
        expired = true;
      }

      if (expired) {
        navigate("/product");
      }
    };

    const interval = setInterval(checkTokenExpiry, 5000);
    return () => clearInterval(interval);
  }, [navigate]);

  if (!staffId) return <Notfound />;

  return (
    <div className="flex  ">
      <StaffSidebar className=" max-h-screen overflow-y-auto" />
      <div className="max-h-screen w-[78%]  overflow-y-auto  ">
        <Outlet />
      </div>
    </div>
  );
}

export default StaffDashboard;
