import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaSpinner } from "react-icons/fa";
import manpng from "../assets/img/man.png";
import { Link } from "react-router-dom";
import { User } from "lucide-react";

const AdminNav = () => {
  const [user, setUser] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false); // State for dropdown
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("https://rentoora-backend-rental.onrender.com/auth/profile", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setUser(response.data);
        if (response.data.profilePhotoPath) {
          fetchProfilePhoto(response.data.profilePhotoPath);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    const fetchProfilePhoto = async (profilePhotoPath) => {
      try {
        const response = await axios.get(
          `https://rentoora-backend-rental.onrender.com/${profilePhotoPath}`,
          {
            responseType: "blob",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const imageUrl = URL.createObjectURL(response.data);
        setProfilePhoto(imageUrl);
      } catch (error) {
        console.error("Error fetching profile photo:", error);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await axios.post(
        "https://rentoora-backend-rental.onrender.com/auth/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      localStorage.removeItem("token");
      localStorage.removeItem("userRole");
      navigate("/client-login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };


  return (
    <div className=" space-y-6  ">
      <div className="flex justify-between items-center lg:mb-6 bg-brand-lightGrow md:rounded-lg p-4 ">
        <h1 className="md:text-2xl  text-white font-bold uppercase">Admin Dashboard</h1>

        <div
          onClick={toggleDropdown}
          className=" items-center cursor-pointer flex gap-4"
        >
          {profilePhoto ? (
            <img
              className="md:w-10 md:h-10 w-8 h-8  border-4 border-brand-bgColor rounded-full object-cover"
              src={profilePhoto}
              alt="Profile"
            />
          ) : (
            <img
              className="md:w-10 md:h-10 w-8 h-8 border-4 border-brand-bgColor rounded-full object-cover"
              src={manpng}
              alt="Default"
            />
          )}
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-700 text-white  font-bold md:h-10 py-1 md:px-4 px-2 rounded"
          >
            <i class="fa-solid fa-right-from-bracket"></i>
          </button>
        </div>
      </div>
      {dropdownOpen && (
        <div className="absolute top-8 right-4 md:top-[70px] md:right-12  mt-2 w-48 bg-white border border-gray-300 rounded shadow-lg z-10">
          <Link
            to="/admin-dashboard"
            className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            Go to Dashboard
          </Link>
          <Link
            to="/admin-profile"
            className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            Profile
          </Link>
          <Link
            to="/admin-change-password"
            className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            Change Password
          </Link>
          <button
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminNav;
