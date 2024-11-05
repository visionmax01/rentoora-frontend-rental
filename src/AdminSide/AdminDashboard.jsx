import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaSpinner } from "react-icons/fa";
import manpng from "../assets/img/man.png";
import { User } from "lucide-react";
import AdminNav from "./adminNav";
import RecentUsers from './resentUser.jsx';
import Api from '../utils/Api.js'
import { motion } from 'framer-motion';
import SupportTickets from "./SupportTickets.jsx";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome  } from '@fortawesome/free-solid-svg-icons';
import Notification from './Notification.jsx'
import ListofServiceProvider from "./servicesProviderReview/ListofServiceProvider.jsx";


const AdminDashboard = () => {
  const [user, setUser] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [clientCount, setClientCount] = useState(null);
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
  const toggleNotification =() =>{
      setShowNotification(!showNotification);
  }
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
      <div className="p-4 md:p-0">
        <div className="bg-white shadow-md rounded-lg p-4 md:flex mb-6 items-center justify-between">
          <div className="md:flex">
            <div className="md:block hidden">
              {profilePhoto ? (
                <img
                  className="w-24 h-24 rounded-lg object-cover mr-6"
                  src={profilePhoto}
                  alt="Profile"
                />
              ) : (
                <img
                  className="w-24 h-24 rounded-lg object-cover"
                  src={manpng}
                  alt="pic"
                />
              )}
            </div>
            <div className="ml-2 w-full mb-4">
              <h2 className="text-xl font-semibold md:mb-4">
                Welcome, {user.name}!
              </h2>
              <h2 className="font-bold">
                Account Type &nbsp;&nbsp;:&nbsp;&nbsp;
                <span className="text-blue-300">
                  {user.role === 0 ? "Client" : "Admin"}
                </span>
              </h2>
              <p>Email: {user.email}</p>
            </div>
          </div>

          <div className="bg-red-100 md:text-[1rem] text-[10px] font-bold p-2 flex justify-between gap-6 rounded-lg">
            <div className="md:w-28 w-20 md:h-28 h-20 bg-white rounded-lg flex flex-col items-center justify-center">
              <User className="bg-gray-800 p-1 text-white rounded-full" />
              <strong className="md:text-4xl text-2xl text-gray-400">{clientCount || '0'}</strong>
              <p>Total Client's</p>
            </div>
            <div className="md:w-28 w-20 md:h-28 h-20 bg-white rounded-lg flex flex-col items-center justify-center">
              <User className="bg-gray-800 p-1 text-white rounded-full" />
              <strong className="md:text-4xl text-2xl text-gray-400">100</strong>
              <p>Total user's</p>
            </div>
            <div className="md:w-28 w-20 md:h-28 h-20 bg-white rounded-lg flex flex-col items-center justify-center">
              <User className="bg-gray-800 p-1 text-white rounded-full" />
              <strong className="md:text-4xl text-2xl text-gray-400">{postCount || '0'}</strong>
              <p>Total post's</p>
            </div>
          </div>
        </div>
        <div className="bg-white shadow-md rounded-lg px-4 gap-4 flex mb-4">
          <div className="py-4 ">
            <h1 className="font-bold text-2xl">Basic Control's</h1>
            <div className="flex gap-8 text-sm">
              <div className="py-5 flex flex-wrap md:flex-row flex-col gap-6 capitalize w-fit ">
                <Link to="/client-list" className="bg-red-500 hover:bg-red-700 p-2 text-white font-bold rounded">
                  view clients
                </Link>
                <Link
                onClick={toggleshowServicesProvider} 
                className="bg-red-500 hover:bg-red-700 p-2 text-white font-bold rounded">
                  view Service Provider
                </Link>
              </div>
              <div className="py-5 flex md:flex-row flex-col gap-6 capitalize w-fit h-fit">
                <Link
                className="bg-red-500 hover:bg-red-700 p-2 text-white font-bold rounded">
                  view Services
                </Link>
                <Link
                 onClick={toggleSupportPopup} 
                 className="bg-red-500 hover:bg-red-700 p-2 text-white font-bold rounded">
                  support
                </Link>
                <Link 
                 onClick={toggleNotification} 
                className="bg-red-500 hover:bg-red-700 p-2 text-white font-bold rounded">
                  Notify users
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg px-4 gap-4 flex">
          <div className="py-4 ">
            <h1 className="font-bold text-2xl">Handle Post's</h1>
            <div className="flex gap-8 text-sm">
              <div className="py-5 flex flex-wrap md:flex-row flex-col gap-6 capitalize w-fit ">
                <Link to="/client-posts" className="bg-red-500 hover:bg-red-700 p-2 text-white font-bold rounded">
                  view post
                </Link>
                <button 
                  onClick={togglePopup} 
                  className="bg-red-500 hover:bg-red-700 p-2 text-white font-bold rounded"
                >
                  Recent Users
                </button>
                <Link to="/Diaplay-feedback" className="bg-red-500 hover:bg-red-700 p-2 text-white font-bold rounded">
                  View FeedBack
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Popup for recent users */}
        {isPopupOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white relative rounded-lg shadow-lg p-6 w-11/12 md:w-1/3">
              <h2 className="text-xl font-bold mb-4">Recent Users</h2>
              <RecentUsers />
              <button 
                onClick={togglePopup} 
                className=" absolute top-0 right-0  bg-red-500 hover:bg-red-700 text-white font-bold  border-tr-lg px-2 py-1"
              >
                X
              </button>
            </div>
          </div>
        )}

        {dropdownOpen && (
          <div className="absolute top-16 right-8 w-48 bg-white border border-gray-300 rounded shadow-lg z-10">
            <Link to="/client-profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Profile</Link>
            <Link to="/change-password" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Change Password</Link>
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
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            transition={{ duration: 0.5 }} 
          >
            <div className="bg-gray-400 absolute top-0 left-0 pt-12  px-6 w-full h-screen">
              <SupportTickets />
              <button 
                onClick={toggleSupportPopup} 
                className="absolute top-4 rounded-r left-0 bg-red-500 hover:bg-red-700 text-white font-bold border-tr-lg px-2 py-1"
              >
                <FontAwesomeIcon  icon={faHome} className={``} /> &nbsp; Return to Home
      
              </button>
            </div>
          </motion.div>
        )}
        {/* popup service provider */}
        {showServicesProvider && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50"
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            transition={{ duration: 0.5 }} 
          >
            <div className="bg-gray-400 absolute top-0 left-0 pt-12  px-6 w-full h-screen">
              <ListofServiceProvider />
              <button 
                onClick={toggleshowServicesProvider} 
                className="absolute top-4 rounded-r left-0 bg-red-500 hover:bg-red-700 text-white font-bold border-tr-lg px-2 py-1"
              >
                <FontAwesomeIcon  icon={faHome} className={``} /> &nbsp; Return to Home
      
              </button>
            </div>
          </motion.div>
        )}


      {showNotification && (
          <motion.div
            className="fixed inset-0 flex  items-center   justify-center z-50"
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            transition={{ duration: 0.5 }} 
          >
            <div className="absolute top-0 left-0 w-screen h-screen bg-black/50"></div>
            <div className=" bg-white relative  w-3/4 mx-auto  shadow-md shadow-slate-950/25   ">
              <Notification/>
              <button 
                onClick={toggleNotification} 
                className="absolute top-0  right-0 bg-red-500 hover:bg-red-700 text-white font-bold border-tr-lg px-2 py-1"
              >
                close
              </button>
            </div>
            
          </motion.div>
        )}
    </div>
  );
};

export default AdminDashboard;
