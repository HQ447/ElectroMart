/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";

function AdminManage() {
  const [admins, setAdmins] = useState([]);
  const [newAccData, setNewAccData] = useState({
    adminName: "",
    email: "",
    password: "",
    newPassword: "",
  });
  const adminId = localStorage.getItem("adminId");
  const token = localStorage.getItem("adminToken");
  const domain = "http://localhost:8080/api";

  useEffect(() => {
    fetchAdmins();
    fetchActiveAdmin();
  }, []);

  const fetchAdmins = async () => {
    try {
      const response = await fetch(`${domain}/admins`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();
      if (response.ok) {
        console.log("admins data fetched:", result);
        setAdmins(result.admins);
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("error in fetching admin", error);
    }
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
        console.log("active admin:", activeAdmin.admin);
      }
    } catch (error) {
      console.error("error in fetching active admin", error);
    }
  };

  const handleDeleteAcc = async (id) => {
    try {
      const response = await fetch(`${domain}/removeAdmin/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();
      if (response.ok) {
        console.log("admins removed id:", id);
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("error in removing admin", error);
    }
  };

  const createNewAdmin = async () => {
    try {
      const res = await fetch(`${domain}/adminSignup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `bearer ${token}`,
        },
        body: JSON.stringify(newAccData),
      });

      const result = await res.json();

      if (res.ok) {
        alert("Admin account created");
        fetchAdmins();
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("error in creating admin account: ", error);
    }

    console.log("creating new admin account");
    console.log(newAccData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 px-4 py-6 ">
      <div className="max-w-4xl mx-auto space-y-4">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-1">
            Admin Management
          </h1>
          <p className="text-sm text-gray-600">
            Manage administrator accounts and permissions
          </p>
        </div>

        {/* Admin List Section */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-3">
            <h2 className="text-lg font-semibold text-white">
              Current Administrators
            </h2>
          </div>

          <div className="p-4">
            <div className="space-y-3">
              {admins.map((admin) => (
                <div
                  key={admin._id}
                  className="group bg-gradient-to-r from-white to-gray-50 border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-blue-300 transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <img
                          src={
                            admin.profileImg
                              ? `http://localhost:8080/${admin.profileImg}`
                              : "/profile.png"
                          }
                          alt={admin.adminName || "admin profile"}
                          className="w-10 h-10 rounded-full object-cover border-2 border-blue-100 shadow-sm group-hover:border-blue-300 transition-colors duration-300"
                        />
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
                      </div>

                      <div className="space-y-1">
                        <h3 className="text-sm font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
                          {admin.adminName}
                        </h3>
                        <p className="text-xs text-gray-600">{admin.email}</p>
                        <p className="text-xs text-gray-400 font-mono bg-gray-100 px-2 py-0.5 rounded-full inline-block">
                          ID: {admin._id}
                        </p>
                      </div>
                    </div>

                    <button
                      className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-300"
                      onClick={() => handleDeleteAcc(admin._id)}
                    >
                      Delete Account
                    </button>
                  </div>
                </div>
              ))}

              {admins.length === 0 && (
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg
                      className="w-6 h-6 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-500 text-sm">
                    No administrators found
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Create New Admin Section */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-4 py-3">
            <h2 className="text-lg font-semibold text-white">
              Create New Administrator
            </h2>
          </div>

          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Enter full name"
                  className="w-full bg-gray-50 border-2 border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-blue-500 focus:bg-white transition-all duration-300 shadow-sm hover:shadow-md"
                  onChange={(e) =>
                    setNewAccData({ ...newAccData, adminName: e.target.value })
                  }
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="Enter email address"
                  className="w-full bg-gray-50 border-2 border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-blue-500 focus:bg-white transition-all duration-300 shadow-sm hover:shadow-md"
                  onChange={(e) =>
                    setNewAccData({ ...newAccData, email: e.target.value })
                  }
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Enter password"
                  className="w-full bg-gray-50 border-2 border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-blue-500 focus:bg-white transition-all duration-300 shadow-sm hover:shadow-md"
                  onChange={(e) =>
                    setNewAccData({ ...newAccData, password: e.target.value })
                  }
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                  Confirm Password
                </label>
                <input
                  type="password"
                  placeholder="Confirm password"
                  className="w-full bg-gray-50 border-2 border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-blue-500 focus:bg-white transition-all duration-300 shadow-sm hover:shadow-md"
                  onChange={(e) =>
                    setNewAccData({
                      ...newAccData,
                      newPassword: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="mt-4 text-center">
              <button
                onClick={createNewAdmin}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-2.5 px-8 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-300 text-sm"
              >
                Create Administrator Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminManage;
