import React, { useEffect, useState } from "react";

const Profile = () => {
  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    address: "",
  });
  const [imgPreview, setImgPreview] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const domain = "http://localhost:8080";

  useEffect(() => {
    const fetchProfile = async () => {
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
          setProfile({
            fullName: user.fullName || user.username || "",
            email: user.email || "",
            address: user.address || "",
          });

          if (user.img) {
            setImgPreview(`${domain}/${user.img}`);
          }
        } else {
          setMessage("Failed to fetch user");
        }
      } catch (error) {
        console.error("Error loading profile", error);
        setMessage("Error loading profile");
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProfileImage(file);
    setImgPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("fullName", profile.fullName);
    formData.append("email", profile.email);
    formData.append("address", profile.address);
    if (profileImage) formData.append("img", profileImage);
    if (currentPassword && newPassword) {
      formData.append("currentPassword", currentPassword);
      formData.append("newPassword", newPassword);
    }

    try {
      const res = await fetch(`${domain}/api/profile`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
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
    <div className="max-w-xl mx-auto p-6 bg-white shadow-lg rounded-xl mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center">Update Profile</h2>
      {message && <p className="text-center mb-4 text-red-500">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col items-center">
          <div className="relative">
            <img
              src={imgPreview || "/profile.png"}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border shadow"
            />
            <label
              htmlFor="fileInput"
              className="absolute bottom-1 right-1 bg-white p-1 rounded-full shadow cursor-pointer"
              title="Upload new profile image"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-blue-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
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
        </div>

        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={profile.fullName}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={profile.email}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <input
          type="text"
          name="address"
          placeholder="Address"
          value={profile.address}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <hr className="my-4" />
        <h3 className="text-lg font-semibold">Change Password</h3>

        <input
          type="password"
          placeholder="Current Password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded"
        >
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default Profile;
