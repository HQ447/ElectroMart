import React, { useEffect, useState } from "react";
import { Edit, Trash2, Plus, User } from "lucide-react";

const AdminManagement = () => {
  const [admins, setAdmins] = useState([]);
  const [formData, setFormData] = useState({
    adminName: "",
    email: "",
    password: "",
    _id: "",
  });
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Get token from memory storage (replace with your actual token management)
  const token = localStorage.getItem("adminToken");

  const API_BASE_URL = "http://localhost:8080/api";

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    setLoading(true);
    setError("");

    try {
      console.log("Fetching admins from:", `${API_BASE_URL}/admins`);

      const response = await fetch(`${API_BASE_URL}/admins`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("Fetch response status:", response.status);
      console.log("Fetch response headers:", response.headers);

      // Check if response is JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const textResponse = await response.text();
        console.error("Non-JSON response:", textResponse);
        throw new Error(
          "Server returned HTML instead of JSON. Check API endpoint and server status."
        );
      }

      const data = await response.json();
      console.log("Admins API response:", data);

      if (!response.ok) {
        throw new Error(
          data.message || data.error || `HTTP ${response.status}`
        );
      }

      // Handle different response structures
      let adminsList = [];
      if (data.success && Array.isArray(data.admins)) {
        adminsList = data.admins;
      } else if (data.data && Array.isArray(data.data)) {
        adminsList = data.data;
      } else if (Array.isArray(data)) {
        adminsList = data;
      } else if (data.admins && Array.isArray(data.admins)) {
        adminsList = data.admins;
      }

      setAdmins(adminsList);
      console.log("Set admins:", adminsList);
    } catch (err) {
      console.error("Error fetching admins:", err);
      setError("Failed to fetch admins: " + err.message);
      setAdmins([]);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ adminName: "", email: "", password: "", _id: "" });
    setProfileImage(null);
    setImagePreview("");
    setIsEditing(false);
    setShowCreateForm(false);
    setError("");
    setSuccess("");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        setError("Image size should be less than 5MB");
        return;
      }

      if (!file.type.startsWith("image/")) {
        setError("Please select a valid image file");
        return;
      }

      setProfileImage(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setError("");
    }
  };

  const handleAdminEdit = async (id) => {
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      console.log("Fetching admin data for ID:", id);

      const response = await fetch(`${API_BASE_URL}/admin/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Edit fetch response status:", response.status);

      // Check if response is JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const textResponse = await response.text();
        console.error("Non-JSON response:", textResponse);
        throw new Error(
          "Server returned HTML instead of JSON. Check API endpoint."
        );
      }

      const data = await response.json();
      console.log("Admin edit data response:", data);

      if (!response.ok) {
        throw new Error(
          data.message || data.error || `HTTP ${response.status}`
        );
      }

      // Handle different response structures
      const adminData = data.user || data.admin || data.data || data;

      setFormData({
        adminName:
          adminData.adminName || adminData.username || adminData.name || "",
        email: adminData.email || "",
        password: "",
        _id: adminData._id || id,
      });

      // Set existing profile image if available
      if (adminData.profileImage) {
        setImagePreview(adminData.profileImage);
      }

      setIsEditing(true);
      setShowCreateForm(true);
    } catch (err) {
      console.error("Error loading admin data:", err);
      setError("Error loading admin data: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Separate function for creating new admin
  const createNewAdmin = async () => {
    try {
      console.log("Creating new admin");

      const formDataToSend = new FormData();
      formDataToSend.append("adminName", formData.adminName);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("password", formData.password);

      if (profileImage) {
        formDataToSend.append("profileImage", profileImage);
      }

      const response = await fetch(`${API_BASE_URL}/adminSignup`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      console.log("Create admin response status:", response.status);

      // Check if response is JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const textResponse = await response.text();
        console.error("Non-JSON response:", textResponse);
        throw new Error(
          "Server returned HTML instead of JSON. Check API endpoint."
        );
      }

      const result = await response.json();
      console.log("Create admin response:", result);

      if (!response.ok) {
        throw new Error(
          result.message || result.error || `HTTP ${response.status}`
        );
      }

      return result;
    } catch (err) {
      console.error("Create admin error:", err);
      throw err;
    }
  };

  // Separate function for updating admin profile
  const updateAdminProfile = async () => {
    try {
      console.log("Updating admin profile");

      const formDataToSend = new FormData();
      formDataToSend.append("adminName", formData.adminName);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("id", formData._id);

      if (formData.password) {
        formDataToSend.append("password", formData.password);
      }

      if (profileImage) {
        formDataToSend.append("profileImage", profileImage);
      }

      const response = await fetch(`${API_BASE_URL}/profile`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      console.log("Update profile response status:", response.status);

      // Check if response is JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const textResponse = await response.text();
        console.error("Non-JSON response:", textResponse);
        throw new Error(
          "Server returned HTML instead of JSON. Check API endpoint."
        );
      }

      const result = await response.json();
      console.log("Update profile response:", result);

      if (!response.ok) {
        throw new Error(
          result.message || result.error || `HTTP ${response.status}`
        );
      }

      return result;
    } catch (err) {
      console.error("Update profile error:", err);
      throw err;
    }
  };

  const handleSubmit = async () => {
    setError("");
    setSuccess("");
    setLoading(true);

    // Validation
    if (!formData.adminName.trim() || !formData.email.trim()) {
      setError("Admin name and email are required");
      setLoading(false);
      return;
    }

    if (!isEditing && !formData.password.trim()) {
      setError("Password is required for new admin");
      setLoading(false);
      return;
    }

    if (!isEditing && formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      setLoading(false);
      return;
    }

    try {
      let result;

      if (isEditing) {
        result = await updateAdminProfile();
        setSuccess("Admin profile updated successfully!");
      } else {
        result = await createNewAdmin();
        setSuccess("New admin created successfully!");
      }

      console.log("Operation successful:", result);
      resetForm();
      fetchAdmins(); // Refresh the list
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this admin? This action cannot be undone."
      )
    ) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      console.log("Deleting admin with ID:", id);

      const response = await fetch(`${API_BASE_URL}/admin/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("Delete response status:", response.status);

      // Check if response is JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const textResponse = await response.text();
        console.error("Non-JSON response:", textResponse);
        throw new Error(
          "Server returned HTML instead of JSON. Check API endpoint and server status."
        );
      }

      const result = await response.json();
      console.log("Delete response:", result);

      if (!response.ok) {
        throw new Error(
          result.message || result.error || `HTTP ${response.status}`
        );
      }

      setSuccess("Admin deleted successfully!");
      fetchAdmins(); // Refresh the list
    } catch (error) {
      console.error("Delete error:", error);
      setError("Delete failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b">
          <h1 className="text-3xl font-bold text-gray-800">Admin Management</h1>
          <p className="text-gray-600 mt-2">
            Manage administrator accounts and permissions
          </p>
        </div>

        <div className="p-6">
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-gray-700">
                Admins List
              </h2>
              <p className="text-gray-500 text-sm">
                Total admins: {admins.length}
              </p>
            </div>
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
              onClick={() => {
                resetForm();
                setShowCreateForm(true);
              }}
              disabled={loading}
            >
              <Plus size={18} /> New Admin
            </button>
          </div>

          {/* Success/Error Messages */}
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 flex justify-between items-center">
              <span>{success}</span>
              <button
                onClick={() => setSuccess("")}
                className="text-green-700 hover:text-green-900"
              >
                ×
              </button>
            </div>
          )}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex justify-between items-center">
              <span>{error}</span>
              <button
                onClick={() => setError("")}
                className="text-red-700 hover:text-red-900"
              >
                ×
              </button>
            </div>
          )}

          {/* Create/Edit Form */}
          {showCreateForm && (
            <div className="mb-6 bg-gray-50 border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">
                {isEditing ? "Edit Admin Profile" : "Create New Admin"}
              </h3>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Admin Name *
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={formData.adminName}
                      onChange={(e) =>
                        setFormData({ ...formData, adminName: e.target.value })
                      }
                      placeholder="Enter admin name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      placeholder="Enter email address"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password{" "}
                    {isEditing ? "(Leave blank to keep current password)" : "*"}
                  </label>
                  <input
                    type="password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    placeholder={
                      isEditing
                        ? "Enter new password (optional)"
                        : "Enter password (min 6 characters)"
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Profile Image
                  </label>
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Max file size: 5MB. Formats: JPG, PNG, GIF
                      </p>
                    </div>
                    {imagePreview && (
                      <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-300 flex-shrink-0">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={loading}
                  >
                    {loading
                      ? "Processing..."
                      : isEditing
                      ? "Update Admin"
                      : "Create Admin"}
                  </button>
                  <button
                    type="button"
                    className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded-md transition-colors disabled:opacity-50"
                    onClick={resetForm}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && !showCreateForm && (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Loading...</p>
            </div>
          )}

          {/* Debug Info */}
          <div className="mb-4 p-3 bg-gray-100 rounded text-sm">
            <strong>Debug Info:</strong>
            <br />
            API Base URL: {API_BASE_URL}
            <br />
            Token: {token ? "Present" : "Missing"}
            <br />
            Admins Count: {admins.length}
          </div>

          {/* Admins Table */}
          {!loading && (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      #
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Profile
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Admin Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {admins.length === 0 ? (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-6 py-8 text-center text-gray-500"
                      >
                        {loading
                          ? "Loading admins..."
                          : "No admins found. Create your first admin account."}
                      </td>
                    </tr>
                  ) : (
                    admins.map((admin, index) => (
                      <tr key={admin._id || index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                            {admin.profileImage ? (
                              <img
                                src={admin.profileImage}
                                alt={
                                  admin.adminName || admin.username || "Admin"
                                }
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <User size={20} className="text-gray-400" />
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {admin.adminName ||
                            admin.username ||
                            admin.name ||
                            "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {admin.email || "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-3">
                            <button
                              onClick={() => handleAdminEdit(admin._id)}
                              className="text-blue-600 hover:text-blue-800 transition-colors disabled:opacity-50"
                              disabled={loading}
                              title="Edit Admin"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => handleDelete(admin._id)}
                              className="text-red-600 hover:text-red-800 transition-colors disabled:opacity-50"
                              disabled={loading}
                              title="Delete Admin"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminManagement;
