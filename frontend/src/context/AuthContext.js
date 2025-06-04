// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import { isTokenExpired } from "../utils/authUtils";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({
    token: localStorage.getItem("token"),
    userId: localStorage.getItem("userId"),
    userName: localStorage.getItem("userName"),
    adminId: localStorage.getItem("adminId"),
    adminName: localStorage.getItem("adminName"),
  });

  const [isAuthenticated, setIsAuthenticated] = useState(!!user.token);

  // Function to clear auth data
  const clearAuthData = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("adminId");
    localStorage.removeItem("adminName");

    setUser({
      token: null,
      userId: null,
      userName: null,
      adminId: null,
      adminName: null,
    });
    setIsAuthenticated(false);
  };

  // Function to set auth data
  const setAuthData = (authData) => {
    const { token, userId, userName, adminId, adminName } = authData;

    if (token) localStorage.setItem("token", token);
    if (userId) localStorage.setItem("userId", userId);
    if (userName) localStorage.setItem("userName", userName);
    if (adminId) localStorage.setItem("adminId", adminId);
    if (adminName) localStorage.setItem("adminName", adminName);

    setUser({
      token: token || null,
      userId: userId || null,
      userName: userName || null,
      adminId: adminId || null,
      adminName: adminName || null,
    });
    setIsAuthenticated(!!token);
  };

  // Check token expiration
  useEffect(() => {
    const checkTokenExpiration = () => {
      if (user.token && isTokenExpired()) {
        console.log("Token expired - clearing auth data");
        clearAuthData();
        alert("Session expired! Please login again.");
        // You can also redirect here if needed
        // window.location.href = '/Login';
        return true;
      }
      return false;
    };

    // Check once on mount
    if (user.token) {
      checkTokenExpiration();
    }

    // Set up interval to check periodically
    const interval = setInterval(() => {
      if (user.token) {
        checkTokenExpiration();
      }
    }, 30000); // Check every 30 seconds (reduced frequency)

    return () => clearInterval(interval);
  }, [user.token]);

  const contextValue = {
    user,
    isAuthenticated,
    setAuthData,
    clearAuthData,
    isAdmin: !!(user.adminId && user.adminName),
    isUser: !!(user.userId && user.userName),
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
