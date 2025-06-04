import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import loadingImg from "../../assets/Loading_icon.gif";

const LogIn = () => {
  const [useremail, setEmail] = useState("");
  const [userpassword, setPassword] = useState("");
  //const [isCheck, setIsCheck] = useState(false);
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);

  const domain = "http://localhost:8080";
  const navigate = useNavigate();

  // function handleCheckBox(e) {
  //   const checked = e.target.checked;
  //   setIsCheck(checked);
  //   console.log("Checkbox value:", checked);
  // }

  async function UserLogin() {
    setLoading(true);
    if (!useremail || !userpassword) {
      alert("Enter email and password");
      return;
    }

    const userData = {
      email: useremail,
      password: userpassword,
    };

    if (role == "admin") {
      console.log("call admin api");

      try {
        const response = await fetch(`${domain}/api/adminLogin`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        });

        const output = await response.json();

        if (response.ok) {
          const { token } = output;
          localStorage.setItem("adminToken", token);
          console.log(
            "admin token generated:",
            localStorage.getItem("adminToken")
          );
          const payload = JSON.parse(atob(token.split(".")[1]));
          const adminId = payload.id;
          const adminName = payload.name;
          localStorage.removeItem("userId");
          localStorage.removeItem("userName");
          localStorage.removeItem("userToken");
          localStorage.removeItem("staffToken");
          localStorage.removeItem("staffId");
          localStorage.removeItem("staffName");
          localStorage.setItem("adminId", adminId);
          localStorage.setItem("adminName", adminName);

          console.log("Admin id is :");
          console.log(localStorage.getItem("adminId"));
          setLoading(false);
          navigate("/product");
        } else {
          setLoading(false);
          alert(output.message || "Something went wrong!");
        }
      } catch (error) {
        console.error("Registration failed:", error.message);
        setLoading(false);
        alert("Something went wrong on the server. Please try again later.");
      }
    } else if (role == "staff") {
      try {
        const response = await fetch(`${domain}/api/staffLogin`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        });

        const output = await response.json();

        if (response.ok) {
          //const userId = output.user._id;
          //const userName = output.user.username;
          const { token } = output;

          // Save token in localStorage
          localStorage.setItem("staffToken", token);
          console.log(
            "staff token fetched: ",
            localStorage.getItem("staffToken")
          );

          // Decode token to get userId or any other data
          const payload = JSON.parse(atob(token.split(".")[1]));
          const staffId = payload.id; // Or payload._id or payload.u
          const staffName = payload.name; // Or payload._id or payload.u

          console.log(
            "staff id from token :",
            staffId,
            "staffName is :",
            staffName
          );
          localStorage.setItem("staffId", staffId);
          localStorage.setItem("staffName", staffName);
          localStorage.removeItem("adminName");
          localStorage.removeItem("adminToken");
          localStorage.removeItem("adminId");
          localStorage.removeItem("userToken");
          localStorage.removeItem("userId");
          localStorage.removeItem("userName");

          setLoading(false);
          navigate("/product");
        } else {
          setLoading(false);
          alert(output.message || "Something went wrong!");
        }
      } catch (error) {
        console.error("Registration failed:", error.message);
        setLoading(false);
        alert("Something went wrong on the server. Please try again later.");
      }
    } else {
      try {
        const response = await fetch(`${domain}/api/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        });

        const output = await response.json();

        if (response.ok) {
          //const userId = output.user._id;
          //const userName = output.user.username;
          console.log("customer Name:", output.user.username);
          const { token } = output;

          // Save token in localStorage
          localStorage.setItem("userToken", token);
          console.log(
            "User token fetched: ",
            localStorage.getItem("userToken")
          );

          // Decode token to get userId or any other data
          const payload = JSON.parse(atob(token.split(".")[1]));
          const userId = payload.id; // Or payload._id or payload.u
          const userName = payload.name; // Or payload._id or payload.u

          console.log(
            "user id from token :",
            userId,
            "userName is :",
            userName
          );
          localStorage.removeItem("adminToken");
          localStorage.removeItem("adminId");
          localStorage.removeItem("adminName");
          localStorage.removeItem("staffToken");
          localStorage.removeItem("staffId");
          localStorage.removeItem("staffName");
          localStorage.setItem("userId", userId);
          localStorage.setItem("userName", userName);

          setLoading(false);
          navigate("/product");
        } else {
          setLoading(false);
          alert(output.message || "Something went wrong!");
        }
      } catch (error) {
        console.error("Registration failed:", error.message);
        setLoading(false);
        alert("Something went wrong on the server. Please try again later.");
      }
    }
  }

  function handleLogin(e) {
    e.preventDefault();
    UserLogin();
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md">
        {/* Header with store-like branding */}
        <div className="bg-orange-600 p-6 rounded-t-lg">
          <h2 className="text-2xl font-bold text-white text-center">
            Welcome Back
          </h2>
          <p className="text-orange-100 text-center mt-1">
            Sign in to your account
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white p-8 rounded-b-lg shadow-lg border-t-0 border border-gray-200">
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                    />
                  </svg>
                </div>
                <input
                  type="email"
                  placeholder="your@email.com"
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <input
                  type="password"
                  placeholder="••••••••"
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <select
                  className=" outline-none font-medium bg-gray-100 px-3 py-1 rounded-md text-sm text-orange-600"
                  name="role"
                  id="role"
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option className=" font-medium bg-orange-600 text text-white">
                    Select Role
                  </option>
                  <option
                    className="font-medium bg-orange-600 text text-white"
                    value="customer"
                  >
                    Customer
                  </option>
                  <option
                    className="font-medium bg-orange-600 text text-white"
                    value="admin"
                  >
                    Admin
                  </option>
                  <option
                    className="font-medium bg-orange-600 text text-white"
                    value="staff"
                  >
                    Staff
                  </option>
                </select>
                {/* <input
                  type="checkbox"
                  id="adminCheck"
                  onChange={handleCheckBox}
                  checked={isCheck}
                  className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="adminCheck"
                  className="ml-2 block text-sm text-gray-700"
                >
                  I am Admin
                </label> */}
              </div>
              <div className="text-sm">
                <a
                  href="/forgot-password"
                  className="font-medium text-orange-600 hover:text-orange-500"
                >
                  Forgot password?
                </a>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-orange-600 text-white py-3 px-4 rounded-lg hover:bg-orange-700 transition-colors font-medium shadow-sm flex items-center justify-center"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                />
              </svg>
              Sign In
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                New to our store?
              </span>
            </div>
          </div>

          <div className="text-center">
            <Link
              to="/Register"
              className="inline-block text-orange-600 font-medium hover:text-orange-800 hover:underline"
            >
              Create an account
            </Link>
          </div>

          {loading && (
            <div className="flex justify-center mt-6">
              <img src={loadingImg} alt="Loading" className="h-10 w-10" />
            </div>
          )}

          {/* Trust badges - common in e-commerce */}
          <div className="mt-8 grid grid-cols-3 gap-2">
            <div className="flex flex-col items-center">
              <svg
                className="h-6 w-6 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              <span className="text-xs text-gray-500 mt-1">Secure</span>
            </div>
            <div className="flex flex-col items-center">
              <svg
                className="h-6 w-6 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              <span className="text-xs text-gray-500 mt-1">Protected</span>
            </div>
            <div className="flex flex-col items-center">
              <svg
                className="h-6 w-6 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-xs text-gray-500 mt-1">24/7 Support</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogIn;
