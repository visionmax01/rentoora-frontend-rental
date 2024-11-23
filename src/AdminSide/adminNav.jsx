import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import manpng from "../assets/img/man.png";
import Api from '../utils/Api.js'
import { FaHome, FaUser, FaLock, FaSignOutAlt } from 'react-icons/fa';

const AdminNav = () => {
  const [user, setUser] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await Api.get("auth/profile", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setUser(response.data);
        if (response.data.profilePhotoPath) {
          setProfilePhoto(response.data.profilePhotoPath);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await Api.post(
        "auth/logout",
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
    <nav className="bg-gradient-to-r to-gray-800 from-brand-bgColor shadow-sm shadow-white/25 lg:rounded-lg mb-6">
      <div className="w-full mx-auto">
        <div className="relative flex  px-4 items-center justify-between h-16">
          <div className="">
            <Link to="/admin-dashboard" className="flex-shrink-0 flex items-center">
              <FaHome className="h-8 w-8 text-white hover:text-gray-200 transition-colors duration-300" />
              <span className="ml-3 text-white font-bold text-xl hidden md:block">Admin Home</span>
            </Link>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-4 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <div className="ml-3 relative">
              <div>
                <button onClick={toggleDropdown} className="bg-gray-800 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white" id="user-menu-button" aria-expanded="false" aria-haspopup="true">
                  <span className="sr-only">Open user menu</span>
                  <img className="h-8 w-8 rounded-full object-cover border-2 border-white" src={profilePhoto || manpng} alt="User profile" />
                </button>
              </div>
              {dropdownOpen && (
                <div className="origin-top-right z-50 absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button" tabIndex="-1">
                  <Link to="/admin-profile" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
                    <FaUser className="mr-3" />
                    Profile
                  </Link>
                  <Link to="/admin-change-password" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
                    <FaLock className="mr-3" />
                    Change Password
                  </Link>
                </div>
              )}
            </div>
            <button onClick={handleLogout} className="ml-4 flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
              <FaSignOutAlt className="mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNav;
