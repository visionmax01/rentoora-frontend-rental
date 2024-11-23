import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import Mainlogo from "../assets/img/Main_logo.png";
import defaultProfilePic from "../assets/img/man.png";
import Api from "../utils/Api.js";
import FeedbackForm from "../utils/FeedbackForm.jsx";
import { User, LayoutDashboard, LogOut } from "lucide-react";

const NavBar = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(defaultProfilePic);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);
  const toggleProfileMenu = () => setIsProfileMenuOpen(!isProfileMenuOpen);
  const toggleFeedback = () => setIsFeedbackOpen(!isFeedbackOpen);

  const handleNavigation = (path) => {
    navigate(path);
    setIsDrawerOpen(false);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setIsProfileMenuOpen(false);
    setUserEmail("");
    navigate("/client-login");
  };

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const checkLoginStatus = async () => {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await Api.get("auth/profile", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setIsLoggedIn(true);
          fetchProfilePhoto(response.data.profilePhotoPath);
          setUserEmail(response.data.email);
        } catch (error) {
          console.error("Error fetching profile:", error);
          setIsLoggedIn(false);
          localStorage.removeItem("token");
        }
      } else {
        setIsLoggedIn(false);
      }
      setIsLoading(false);
    };

    checkLoginStatus();
    window.addEventListener('storage', checkLoginStatus);

    return () => {
      window.removeEventListener('storage', checkLoginStatus);
    };
  }, []);

  const fetchProfilePhoto = (profilePhotoPath) => {
    if (profilePhotoPath) setProfilePhoto(profilePhotoPath);
  };

  const NavItem = ({ onClick, isActive, children }) => (
    <li
      onClick={onClick}
      className={`list-none cursor-pointer px-4 py-2 relative group ${
        isActive
          ? "bg-gradient-to-r from-yellow-600 to-yellow-100 text-transparent bg-clip-text"
          : "text-gray-200 hover:bg-gradient-to-r hover:from-yellow-600 hover:to-yellow-100 hover:text-transparent hover:bg-clip-text"
      }`}
    >
      {children}
      <span className={`absolute bottom-1 hidden sm:block left-1/2 w-12 h-0.5 bg-gradient-to-r from-yellow-600 to-yellow-100 transform -translate-x-1/2 transition-transform duration-300 ${
        isActive ? "scale-x-100" : "scale-x-0"
      } group-hover:scale-x-100`}></span>
    </li>
  );

  return (
    <div className="sticky top-0 z-50">
      <nav className="bg-black border-b border-brand-Yellow/25 shadow-md">
        <div className="w-full  px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex-shrink-0 flex items-center">
              <img
                onClick={() => handleNavigation("/")}
                className="h-8 w-auto sm:h-10 cursor-pointer"
                src={Mainlogo}
                alt="Rentoora Logo"
              />
            </div>
          <div className="hidden md:flex text-white md:items-center md:space-x-4">

              <NavItem onClick={toggleFeedback} isActive={isActive("/feedback")}>Feedback</NavItem>
              <NavItem onClick={() => handleNavigation("/service")} isActive={isActive("/service")}>Services</NavItem>
              <NavItem onClick={() => handleNavigation("/about")} isActive={isActive("/about")}>About</NavItem>
              <NavItem onClick={() => handleNavigation("/developer")} isActive={isActive("/developer")}>Developer</NavItem>
          </div>
            {/* Desktop Navigation */}
            <div className="hidden md:flex text-white md:items-center md:space-x-4">

              {isLoading ? (
                <div className="w-20 h-10 bg-gray-300 rounded animate-pulse"></div>
              ) : isLoggedIn ? (
                <div className="relative">
                  <div className="w-20">
                  <img
                    src={profilePhoto}
                    alt="User"
                    className="h-10 w-10 rounded-full cursor-pointer border-2 border-brand-Yellow"
                    onClick={toggleProfileMenu}
                  />
                  </div>
                  {isProfileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                      <Link to="/client-profile" className=" px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                        <User className="h-4 w-4 mr-2" />
                        Profile
                      </Link>
                      <Link to="/client-dashboard" className=" px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                        <LayoutDashboard className="h-4 w-4 mr-2" />
                        Dashboard
                      </Link>
                      <button onClick={logout} className=" w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/client-login" className="bg-indigo-500 hover:bg-indigo-600-600 w-20 mr-12 text-white font-bold py-2 px-4 rounded transition duration-300">
                  Login
                </Link>
              )}
            </div>

            {/* Mobile menu button and profile image */}
            <div className="flex items-center md:hidden">
              {isLoggedIn && (
                <img
                  src={profilePhoto}
                  alt="User"
                  className="h-8 w-8 rounded-full cursor-pointer border-2 border-brand-Yellow mr-2"
                  onClick={toggleProfileMenu}
                />
              )}
              <button
                onClick={toggleDrawer}
                className="inline-flex items-center justify-center p-1 rounded text-indigo-900  focus:outline-none  bg-brand-Yellow"
              >
                <span className="sr-only">Open main menu</span>
                {isDrawerOpen ? <CloseIcon className="block h-6 w-6" /> : <MenuIcon className="block h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu, show/hide based on menu state */}
        <div className={`md:hidden text-white ${isDrawerOpen ? 'block' : 'hidden'}`}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <NavItem onClick={toggleFeedback} isActive={isActive("/feedback")}>Feedback</NavItem>
            <NavItem onClick={() => handleNavigation("/service")} isActive={isActive("/service")}>Services</NavItem>
            <NavItem onClick={() => handleNavigation("/about")} isActive={isActive("/about")}>About</NavItem>
            <NavItem onClick={() => handleNavigation("/developer")} isActive={isActive("/developer")}>Developer</NavItem>
          </div>
          <div className="pt-4 pb-3 border-t  border-gray-200/25">
            {isLoading ? (
              <div className="flex items-center px-5">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg- animate-pulse"></div>
                </div>
                <div className="ml-3">
                  <div className="h-4 w-24 bg-gray-300 rounded animate-pulse"></div>
                </div>
              </div>
            ) : isLoggedIn ? (
              <div className="flex items-center px-5">
                <div className="flex-shrink-0">
                  <img className="h-10 w-10 rounded-full" src={profilePhoto} alt="User" />
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-white">{userEmail}</div>
                  <div className="text-sm font-medium text-gray-500"></div>
                </div>
              </div>
            ) : (
              <div className="mt-3 px-2">
                <Link
                  to="/client-login"
                  className="block text-center w-full  bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300"
                >
                  Login
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Profile menu for mobile */}
      {isProfileMenuOpen && (
        <div className="md:hidden absolute right-12 top-14 lg:top-16 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
          <Link to="/client-profile" className=" px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
            <User className="h-4 w-4 mr-2" />
            Profile
          </Link>
          <Link to="/client-dashboard" className=" px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
            <LayoutDashboard className="h-4 w-4 mr-2" />
            Dashboard
          </Link>
          <button onClick={logout} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </button>
        </div>
      )}

      {isFeedbackOpen && <FeedbackForm toggleFeedback={toggleFeedback} />}
    </div>
  );
};

export default NavBar;
