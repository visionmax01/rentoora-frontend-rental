import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import AdminNav from "../AdminSide/adminNav";

const AdminChangepass = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        "https://rentoora-backend-rental.onrender.com/auth/change-password",
        { oldPassword, newPassword },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast.success(response.data.message);

      // Simulate 2-second delay and log out the user
      setTimeout(() => {
        localStorage.removeItem("token"); // Clear token to log out
        toast.success("Logged out successfully. Please log in with the new password.");
        navigate("/client-login"); // Redirect to login page
      }, 2000); // 2-second delay

    } catch (error) {
      console.error("Error changing password:", error);
      toast.error(
        error.response?.data?.message || "Failed to change password"
      );
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = (setShowPassword, showPassword) => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="lg:p-8   bg-brand-bgColor h-screen">
      <AdminNav/>
    <div className="lg:w-1/2 w-[95%] lg:mt-8 mx-auto mt-8  shadow-md rounded-lg p-6">
      <h2 className="text-2xl text-brand-white font-bold mb-4">Change Password</h2>
      <form onSubmit={handleSubmit} autoComplete="off">
        {/* Hidden field to confuse auto-fill */}
        <input type="text" name="fakeUsername" style={{ display: 'none' }} />

        <div className="mb-4 relative">
          <label className="block text-gray-400 text-sm font-bold mb-2">
            Old Password
          </label>
          <input
            type={showOldPassword ? "text" : "password"}
            name="current-password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
            autoComplete="new-password"
          />
          <FontAwesomeIcon
            icon={showOldPassword ? faEyeSlash : faEye}
            onClick={() => togglePasswordVisibility(setShowOldPassword, showOldPassword)}
            className="absolute right-3 top-12 transform -translate-y-1/2 cursor-pointer text-gray-700"
          />
        </div>
        <div className="mb-4 relative">
          <label className="block text-gray-400 text-sm font-bold mb-2">
            New Password
          </label>
          <input
            type={showNewPassword ? "text" : "password"}
            name="new-password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
            autoComplete="new-password"
          />
          <FontAwesomeIcon
            icon={showNewPassword ? faEyeSlash : faEye}
            onClick={() => togglePasswordVisibility(setShowNewPassword, showNewPassword)}
            className="absolute right-3 top-12 transform -translate-y-1/2 cursor-pointer text-gray-700"
          />
        </div>
        <div className="mb-4 relative">
          <label className="block text-gray-400 text-sm font-bold mb-2">
            Confirm New Password
          </label>
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirm-new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
            autoComplete="new-password"
          />
          <FontAwesomeIcon
            icon={showConfirmPassword ? faEyeSlash : faEye}
            onClick={() => togglePasswordVisibility(setShowConfirmPassword, showConfirmPassword)}
            className="absolute right-3 top-12 transform -translate-y-1/2 cursor-pointer text-gray-700"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          disabled={loading}
        >
          {loading ? (
            <>
              <FontAwesomeIcon icon={faSpinner} className="animate-spin h-5 w-5 mr-2" />
              Changing...
            </>
          ) : (
            "Change Password"
          )}
        </button>
      </form>
    </div>
    </div>

  );
};

export default AdminChangepass;
