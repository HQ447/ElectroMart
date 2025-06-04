import React, { useEffect, useState } from "react";

const AdminProfile = () => {
  const domain = "http://localhost:8080/api";
  const adminId = localStorage.getItem("adminId");
  const token = localStorage.getItem("adminToken");

  const [profile, setProfile] = useState({
    adminName: "",
    email: "",
    phone: "",
  });
  const [imgPreview, setImgPreview] = useState(null);
  const [profileImg, setProfileImg] = useState(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        const res = await fetch(`${domain}/admin/${adminId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (res.ok) {
          console.log("admin fetch:", data);
          setProfile({
            adminName: data.admin.adminName || "",
            email: data.admin.email || "",
            phone: data.admin.phone || "",
          });

          if (data.admin.profileImg) {
            setImgPreview(`http://localhost:8080/${data.admin.profileImg}`);
          }
        } else {
          setMessage("Failed to load admin profile");
        }
      } catch (error) {
        console.error("Fetch error:", error);
        setMessage("Error fetching profile");
      }
    };

    fetchAdminProfile();
  }, [adminId, token]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProfileImg(file);
    setImgPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("adminName", profile.adminName);
    formData.append("email", profile.email);
    formData.append("phone", profile.phone);
    if (profileImg) formData.append("profileImg", profileImg);
    if (currentPassword && newPassword) {
      formData.append("currentPassword", currentPassword);
      formData.append("newPassword", newPassword);
    }

    try {
      const res = await fetch(`${domain}/updateAdminProfile/${adminId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        setMessage("Profile updated successfully!");
      } else {
        setMessage(data.message || "Update failed");
      }
    } catch (error) {
      console.error("Update error", error);
      setMessage("Something went wrong!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-md mx-auto">
        <div className="bg-white shadow-xl rounded-lg border border-gray-100 overflow-hidden mt-6">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
            <h2 className="text-xl font-semibold text-white text-center">
              Admin Profile Settings
            </h2>
          </div>

          <div className="p-6">
            {/* Success/Error Message */}
            {message && (
              <div
                className={`text-center mb-4 px-4 py-2 rounded-lg text-sm font-medium ${
                  message.includes("successfully")
                    ? "bg-green-100 text-green-700 border border-green-200"
                    : "bg-red-100 text-red-700 border border-red-200"
                }`}
              >
                {message}
              </div>
            )}

            <div className="space-y-4">
              {/* Profile Image Section */}
              <div className="flex flex-col items-center mb-6">
                <div className="relative group">
                  <img
                    src={imgPreview || "/profile.png"}
                    alt="Admin"
                    className="w-20 h-20 rounded-full object-cover border-4 border-blue-100 shadow-lg group-hover:border-blue-300 transition-all duration-300"
                  />
                  <label
                    htmlFor="fileInput"
                    className="absolute bottom-1 right-1 bg-blue-600 hover:bg-blue-700 p-2 rounded-full shadow-lg cursor-pointer transform hover:scale-110 transition-all duration-300 group-hover:bg-purple-600"
                    title="Upload new profile image"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 w-3 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </label>
                </div>
                <input
                  id="fileInput"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Click camera icon to change photo
                </p>
              </div>

              {/* Profile Information */}
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                    Admin Name
                  </label>
                  <input
                    type="text"
                    name="adminName"
                    placeholder="Enter admin name"
                    value={profile.adminName}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border-2 border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-blue-500 focus:bg-white transition-all duration-300 shadow-sm hover:shadow-md"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter email address"
                    value={profile.email}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border-2 border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-blue-500 focus:bg-white transition-all duration-300 shadow-sm hover:shadow-md"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    name="phone"
                    placeholder="Enter phone number"
                    value={profile.phone}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border-2 border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-blue-500 focus:bg-white transition-all duration-300 shadow-sm hover:shadow-md"
                  />
                </div>
              </div>

              {/* Password Change Section */}
              <div className="border-t border-gray-200 pt-4 mt-6">
                <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center">
                  <svg
                    className="w-4 h-4 mr-2 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                  Change Password
                </h3>

                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                      Current Password
                    </label>
                    <input
                      type="password"
                      placeholder="Enter current password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full bg-gray-50 border-2 border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-purple-500 focus:bg-white transition-all duration-300 shadow-sm hover:shadow-md"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                      New Password
                    </label>
                    <input
                      type="password"
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-gray-50 border-2 border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-purple-500 focus:bg-white transition-all duration-300 shadow-sm hover:shadow-md"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  onClick={handleSubmit}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-300 text-sm"
                >
                  Update Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
