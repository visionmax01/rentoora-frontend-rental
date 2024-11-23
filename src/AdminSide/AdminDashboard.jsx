import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaSpinner } from "react-icons/fa";
import manpng from "../assets/img/man.png";
import { FiUser, FiClipboard, FiUsers, FiEye, FiTool, FiHeadphones, FiBell, FiUserCheck, FiFileText, FiMessageSquare } from "react-icons/fi";
import AdminNav from "./adminNav";
import RecentUsers from "./resentUser.jsx";
import Api from "../utils/Api.js";
import { motion } from "framer-motion";
import SupportTickets from "./SupportTickets.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import Notification from "./Notification.jsx";
import ListofServiceProvider from "./servicesProviderReview/ListofServiceProvider.jsx";

const AnimatedCount = ({ targetValue }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 1000;
    const increment = Math.ceil(targetValue / (duration / 50));

    let interval = setInterval(() => {
      setCount((prevCount) => {
        if (prevCount + increment >= targetValue) {
          clearInterval(interval);
          return targetValue;
        }
        return prevCount + increment;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [targetValue]);

  return <span>{count}</span>;
};

const AdminDashboard = () => {
  const [user, setUser] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [clientCount, setClientCount] = useState(null);
  const [providerCount, setProviderCount] = useState(null);
  const [postCount, setPostCount] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [showSupportTickets, setShowSupportTickets] = useState(false);
  const [showServicesProvider, setServicesProvider] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
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
          fetchProfilePhoto(response.data.profilePhotoPath);
        }
        setTimeout(() => setLoading(false));
      } catch (error) {
        console.error("Error fetching user data:", error);
        setLoading(false);
      }
    };

    const fetchProfilePhoto = (profilePhotoPath) => {
      if (!profilePhotoPath) return;
      setProfilePhoto(profilePhotoPath);
    };

    const fetchClientCount = async () => {
      try {
        const response = await Api.get("count/clients", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setClientCount(response.data.count);
      } catch (error) {
        console.error("Error fetching client count:", error);
      }
    };

    const fetchServicesProvider = async () => {
      try {
        const response = await Api.get("count/total-provider", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setProviderCount(response.data.count);
      } catch (error) {
        console.error("Error fetching client count:", error);
      }
    };

    const fetchPostCount = async () => {
      try {
        const response = await Api.get("admin/total-posts", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setPostCount(response.data.count);
      } catch (error) {
        console.error("Error fetching post count:", error);
      }
    };

    fetchUserData();
    fetchClientCount();
    fetchServicesProvider();
    fetchPostCount();
  }, [navigate]);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

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

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };
  const toggleSupportPopup = () => {
    setShowSupportTickets(!showSupportTickets);
  };
  const toggleshowServicesProvider = () => {
    setServicesProvider(!showServicesProvider);
  };
  const toggleNotification = () => {
    setShowNotification(!showNotification);
  };
  if (loading)
    return (
      <div className="w-full bg-brand-bgColor h-screen mx-auto my-auto text-white flex justify-center items-center">
        <div className="w-fit mx-auto flex justify-center flex-col">
          <FaSpinner className="animate-spin w-10 h-10 mx-auto" />
          <p>Redirecting to Admin Dashboard...</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 md:p-8">
      <AdminNav />
      <div className="p-4 mt-4 md:p-0">
        <div className="bg-white shadow-md rounded-lg  md:flex mb-6 items-center justify-between">
          <div className="flex flex-col md:flex-row items-center w-full justify-between bg-gradient-to-r from-gray-800 to-brand-bgColor rounded-lg p-6 shadow-lg">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="hidden md:block mr-6">
                {profilePhoto ? (
                  <img
                    className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
                    src={profilePhoto}
                    alt="Profile"
                  />
                ) : (
                  <img
                    className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
                    src={manpng}
                    alt="Default profile"
                  />
                )}
              </div>
              <div className="text-white ">
                <h2 className="lg:text-2xl text-md font-bold mb-2">
                  Welcome, {user.name}!
                </h2>
                <p className="text-lg">
                  <span className="font-semibold">Account Type:</span>
                  <span className="ml-2 bg-blue-200 text-blue-800 px-2 py-1 rounded">
                    {user.role === 0 ? "Client" : "Admin"}
                  </span>
                </p>
                <p className="text-sm opacity-80">Email: {user.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-3  gap-4 w-full md:w-auto mt-4 md:mt-0">
              <div className="bg-white rounded-lg lg:p-4 p-2 text-center">
                <FiUser className="text-blue-600 lg:text-4xl text-xl mx-auto mb-2" />
                <strong className="lg:text-4xl text-xl text-gray-800 block mb-1">
                  <AnimatedCount targetValue={clientCount || 0} />
                </strong>
                <p className="lg:text-sm text-[10px]  text-gray-600">Total Clients</p>
              </div>
              <div className="bg-white rounded-lg lg:p-4 p-2   text-center">
                <FiUsers className="text-purple-600 lg:text-4xl text-xl mx-auto mb-2" />
                <strong className="lg:text-4xl text-xl text-gray-800 block mb-1">
                  <AnimatedCount targetValue={providerCount || 0} />
                </strong>
                <p className="lg:text-sm text-[10px]   text-gray-600">Total Providers</p>
              </div>
              <div className="bg-white rounded-lg lg:p-4 p-2   text-center">
                <FiClipboard className="text-green-600 lg:text-4xl text-xl mx-auto mb-2" />
                <strong className="lg:text-4xl text-xl text-gray-800 block mb-1">
                  <AnimatedCount targetValue={postCount || 0} />
                </strong>
                <p className="lg:text-sm text-[10px]   text-gray-600">Total Posts</p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gray-800 shadow-lg rounded-lg px-6 py-4 mb-6">
          <div className="mb-6">
            <h1 className="font-bold text-3xl text-blue-400 mb-4">Basic Controls</h1>
            <div className="grid grid-cols-2 md:flex lg:text-md text-sm md:flex-wrap gap-4">
              <Link
                to="/client-list"
                className="bg-blue-600 hover:bg-blue-700 p-2 text-white font-semibold rounded-lg transition duration-300 ease-in-out lg:text-center text-left flex-1 flex items-center lg:justify-center"
              >
                <FiEye className="mr-2" /> View Clients
              </Link>
              
              <Link 
                className="bg-blue-600 hover:bg-blue-700 p-2 text-white font-semibold rounded-lg transition duration-300 ease-in-out lg:text-center text-left flex-1 flex items-center lg:justify-center"
              >
                <FiTool className="mr-2" /> View Services
              </Link>
              <Link
                onClick={toggleSupportPopup}
                className="bg-yellow-600 hover:bg-yellow-700 p-2 text-white font-semibold rounded-lg transition duration-300 ease-in-out lg:text-center text-left flex-1 flex items-center lg:justify-center"
              >
                <FiHeadphones className="mr-2" /> Support
              </Link>
              <Link
                onClick={toggleNotification}
                className="bg-blue-600 hover:bg-blue-700 p-2 text-white font-semibold rounded-lg transition duration-300 ease-in-out lg:text-center text-left flex-1 flex items-center lg:justify-center"
              >
                <FiBell className="mr-2" /> Notify Users
              </Link>
              <Link
                onClick={toggleshowServicesProvider}
                className="bg-blue-600 w-48 sm:w-full hover:bg-blue-700 p-2 text-white font-semibold rounded-lg transition duration-300 ease-in-out lg:text-center text-left flex-1 flex items-center lg:justify-center"
              >
                <FiUserCheck className="mr-2" /> View Service Providers
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 shadow-lg rounded-lg px-6 py-4 mb-6">
          <div className="mb-6">
            <h1 className="font-bold text-3xl text-blue-400 mb-4">Handle Posts</h1>
            <div className="grid grid-cols-2 text-sm lg:text-md md:flex md:flex-wrap gap-4 lg:w-1/2">
              <Link
                to="/client-posts"
                className="bg-indigo-700 hover:bg-indigo-600 p-2 text-white font-semibold rounded-lg transition duration-300 ease-in-out lg:text-center text-left flex-1 flex items-center lg:justify-center"
              >
                <FiFileText className="mr-2" /> View Posts
              </Link>
              <button
                onClick={togglePopup}
                className="bg-indigo-700 hover:bg-indigo-600 p-2 text-white font-semibold rounded-lg transition duration-300 ease-in-out lg:text-center text-left flex-1 flex items-center lg:justify-center"
              >
                <FiUsers className="mr-2" /> Recent Users
              </button>
              <Link
                to="/Diaplay-feedback"
                className="bg-indigo-700 hover:bg-indigo-600 p-2 text-white font-semibold rounded-lg transition duration-300 ease-in-out lg:text-center text-left flex-1 flex items-center lg:justify-center"
              >
                <FiMessageSquare className="mr-2" /> View Feedback
              </Link>
            </div>
          </div>
        </div>

        {/* Popup for recent users */}
        {isPopupOpen && (
          <div className="fixed inset-0  flex items-center justify-center z-50">
            <div className="bg-gradient-to-br from-purple-100 via-indigo-200 to-indigo-200 relative rounded-lg shadow-lg p-2 lg:p-6 w-full   md:w-1/3">
              <h2 className="text-xl font-bold mb-4">Recent Users</h2>
              <RecentUsers />
              <button
                onClick={togglePopup}
                className=" absolute top-2 right-2 text-red-500 hover:text-red-700   bg-gray-400  font-bold text-sm rounded px-3 py-2"
              >
                X
              </button>
            </div>
          </div>
        )}

        {dropdownOpen && (
          <div className="absolute top-16 right-8 w-48 bg-white border border-gray-300 rounded shadow-lg z-10">
            <Link
              to="/client-profile"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              Profile
            </Link>
            <Link
              to="/change-password"
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

      {/* Popup for Support Tickets */}
      {showSupportTickets && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-50"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <motion.div 
            className="bg-gradient-to-br from-gray-900 to-brand-bgColor absolute top-0 left-0 w-full h-screen overflow-hidden"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <div className="pt-16 lg:px-6 h-full overflow-y-auto">
              <SupportTickets />
            </div>
            <motion.button
              onClick={toggleSupportPopup}
              className="absolute top-4 left-4 bg-red-500 hover:bg-red-600 text-white font-bold rounded p-2 shadow-lg transition-colors duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FontAwesomeIcon icon={faHome} className="text-xl" />
            </motion.button>
          </motion.div>
        </motion.div>
      )}
      {/* Popup for Service Provider */}
      {showServicesProvider && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-50"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <motion.div 
            className=" bg-brand-bgColor absolute top-0 left-0 w-full h-screen overflow-hidden"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <div className="pt-16 lg:px-6 h-full overflow-y-auto">
              <ListofServiceProvider />
            </div>
            <motion.button
              onClick={toggleshowServicesProvider}
              className="absolute top-4 left-4 bg-red-500 hover:bg-red-600 text-white font-bold rounded p-2 shadow-lg transition-colors duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FontAwesomeIcon icon={faHome} className="text-xl" />
            </motion.button>
          </motion.div>
        </motion.div>
      )}

      {showNotification && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="absolute top-0 left-0 w-screen h-screen bg-black/50"></div>
          <div className="bg-gray-800 relative lg:w-3/4 w-full mx-auto lg:rounded-lg shadow-lg shadow-slate-950/25 overflow-hidden">
            <Notification />
            <button
              onClick={toggleNotification}
              className="absolute top-2 right-2 bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded transition-colors duration-300"
            >
              &times;
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AdminDashboard;
