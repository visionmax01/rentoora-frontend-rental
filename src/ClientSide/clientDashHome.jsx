import React, { useState, useEffect, useRef } from "react";
import {
  Menu,
  User,
  HelpCircle,
  FileText,
  LayoutDashboard,
  ChevronDown,
  LogOut,
  Package,
  Eye,
  Upload,
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import Api from '../utils/Api.js'
import CompanyLogo from "../assets/img/Main_logo.png";
import manpng from "../assets/img/man.png";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ClientHomePage from "./clientHomePage";
import ClientProfile from "./clientProfile";
import AllPost from "./displayClientPost";
import ClientPost from "./ClintPost";
import { FaSpinner } from "react-icons/fa";
import ChangePassword from "./ChangePassword";
import ServicesSupport from './ServicesSuport';
import MyOrders from "../Myorder/MyOrders";
import MyBookedOrders from "./MyBookedOrders";

const ClientDashHome = () => {
  const [user, setUser] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [activeComponent, setActiveComponent] = useState("Dashboard");
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load the last active component from localStorage if it exists
    const savedComponent = localStorage.getItem("activeComponent");
    if (savedComponent) {
      setActiveComponent(savedComponent);
    }

    const fetchUserData = async () => {
      try {
        // Fetch user data from the server, token is automatically included in headers
        const response = await Api.get("auth/user-data", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        // Set the user data and profile photo path
        setUser(response.data);
        fetchProfilePhoto(response.data.profilePhotoPath);

        // Set loading state to false
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        navigate("/client-login");
      }
    };

    fetchUserData();
  }, [navigate]);

  const fetchProfilePhoto = (profilePhotoPath) => {
    if (!profilePhotoPath) return;
  
    // Directly use the Cloudinary URL to set the profile photo
    setProfilePhoto(profilePhotoPath);
  };
  

  const handleLogout = async () => {
    try {
      await Api.post('auth/logout', {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
      navigate('/client-login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleProfileMenu = () => setProfileMenuOpen(!profileMenuOpen);

  const handleClickOutside = (event) => {
    if (
      profileMenuRef.current &&
      !profileMenuRef.current.contains(event.target)
    ) {
      setProfileMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleComponentChange = (component) => {
    setActiveComponent(component);
    localStorage.setItem("activeComponent", component); // Save active component to localStorage
  };
  
  const renderComponent = () => {
    switch (activeComponent) {
      case "Dashboard":
        return <ClientHomePage />;
      case "Profile":
        return <ClientProfile />;
      case "View_posts":
        return <AllPost />;
      case "Order_recieved":
        return <MyBookedOrders />;
      case "Support":
        return <ServicesSupport />;
      case "Create_post":
        return <ClientPost />;
      case "my_order":
        return <MyOrders />;
      case "change-password":
        return <ChangePassword />;
      default:
        return <ClientHomePage />;
    }
  };

  if (loading) {
    return (
      <div className="w-full bg-brand-bgColor h-screen mx-auto my-auto text-white flex justify-center items-center">
        <div className="w-fit mx-auto flex justify-center flex-col">
          <FaSpinner className="animate-spin w-10 h-10 mx-auto mb-6" />
          <p>Redirecting to Your Dashboard . . .</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <div className="w-full h-screen mx-auto my-auto text-white">Error loading user data.</div>;
  }

  return (
    <div className="flex  h-fit">
      <button
        className="fixed top-2 left-2 rounded hover:bg-gray-200 bg-white p-3 text-red-800 z-50"
        onClick={toggleMenu}
      >
        {isOpen ? <Menu /> : <Menu />}
      </button>
      <nav
        className={`bg-brand-bodyColor h-screen py-24 pl-2 fixed top-0 left-0 z-40 transform ${
          isOpen ? "translate-x-0 w-44" : "w-16 -translate-x-0"
        } transition-all duration-500`}
      >
        <ul className="flex gap-4 flex-col">
          {["Dashboard", "Profile", "View_posts", "my_order", "Order_recieved", "Support", "Create_post"].map((item) => (
            <li key={item} className="relative group">
              <a
                href="#"
                className={`flex hover:bg-brand-bgColor hover:text-white items-center gap-2 w-full px-4 rounded-l-full py-2 ${
                  activeComponent === item ? "bg-brand-bgColor text-white" : ""
                }`}
                onClick={() => handleComponentChange(item)}
              >
                {item === "Dashboard" && <LayoutDashboard />}
                {item === "Profile" && <User />}
                {item === "View_posts" && <FileText />}
                {item === "my_order" && <Eye />}
                {item === "Order_recieved" && <Package  />}
                {item === "Support" && <HelpCircle />}
                {item === "Create_post" && <Upload />}
                {isOpen && <span>{item}</span>}
              </a>
              {!isOpen && (
                <div className="absolute hover:hidden flex items-center justify-center left-16 top-5 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 group-hover:left-full transition-all duration-300">
                  <div className="w-6 h-6 bg-white rotate-45"></div>
                  <div className="relative -ml-5 bg-white text-red-800 font-bold p-2 max-w-fit rounded">
                    {item}
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </nav>
      <aside
        className={`ml-auto transition-all duration-500 text-white ${
          isOpen ? "w-[calc(100%)]" : "w-full"
        }`}
        style={{ marginLeft: isOpen ? "11rem" : "4rem" }}
      >
        <div className="w-[100%] h-auto flex justify-end relative">
          <div className="bg-gradient-to-l sticky top-0 from-brand-Colorpurple to-brand-dark w-full h-12 px-4 py-8 flex items-center justify-between">
            <img src={CompanyLogo} className="h-10" alt="Company-logo" />
            <div className="h-8 w-fit flex items-center justify-center px-4 relative">
              <span className="text-white capitalize font-semibold hidden sm:block lg:pr-8 p-3 py-1 bg-gray-400 rounded-l-full bg-opacity-25">
                Welcome, {user.name}!
              </span>
              <button
                className="bg-white px-2 py-1 rounded-md -ml-3 flex items-center"
                onClick={toggleProfileMenu}
              >
                {profilePhoto ? (
                  <img
                    className="profile-img w-8 h-8 rounded object-top object-cover bg-brand-dark"
                    alt="Profile"
                    src={profilePhoto}
                  />
                ) : (
                  <img
                    className="profile-img w-8 h-8 rounded object-top-center object-cover bg-brand-dark"
                    src={manpng}
                    alt="pic"
                  />
                )}
                <ChevronDown className="text-black" />
              </button>
            </div>
          </div>
        </div>
        <main className="overflow-hidden h-screen bg-gray-100 ">{renderComponent()}</main>
      </aside>
      {profileMenuOpen && (
        <div
          ref={profileMenuRef}
          className="absolute z-50 top-14 right-8 bg-white w-[13rem] h-fit rounded-sm shadow-lg text-black"
        >
          <ul className="flex flex-col gap-2">
            <li
              onClick={() => navigate("/")}
              className="hover:bg-gray-300 rounded py-2 pl-4 cursor-pointer"
            >
              Return to Home
            </li>
            <li
              onClick={() => handleComponentChange("Profile")}
              className="hover:bg-gray-300 rounded py-2 pl-4 cursor-pointer"
            >
              Profile
            </li>
            <li
              onClick={() => handleComponentChange("change-password")}
              className="hover:bg-gray-300 rounded py-2 pl-4 cursor-pointer"
            >
              Change Password
            </li>
            <li
              onClick={handleLogout}
              className="hover:bg-gray-300 rounded py-2 pl-4 cursor-pointer"
            >
              Logout &nbsp;
              <LogOut className="inline-block mr-2" />
            </li>
          </ul>
          <ArrowDropUpIcon className="text-white absolute -top-3 right-2" />
        </div>
      )}
    </div>
  );
};

export default ClientDashHome;
