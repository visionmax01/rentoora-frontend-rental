import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaSpinner } from "react-icons/fa";
import manpng from "../assets/img/man.png";
import { Link } from "react-router-dom";
import { User } from "lucide-react";
import AdminNav from "./adminNav";

const AdminDashboard = () => {
  const [user, setUser] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false); // State for dropdown
  const [clientCount, setClientCount] = useState(null);
  const [postCount, setPostCount] = useState(null); // New state for post count
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
        setTimeout(() => setLoading(false));
      } catch (error) {
        console.error("Error fetching user data:", error);
        setLoading(false);
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

    const fetchClientCount = async () => {
      try {
        const response = await axios.get("https://rentoora-backend-rental.onrender.com/count/clients", {
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
        const response = await axios.get("https://rentoora-backend-rental.onrender.com/admin/total-posts", { // Adjusted endpoint for post count
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
    fetchPostCount(); // Fetch post count
  }, [navigate]);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

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
    <div className="min-h-screen  bg-gray-100 md:p-8   ">
     <AdminNav/>
     <div className="p-4 md:p-0">
      <div className="bg-white shadow-md rounded-lg p-4 md:flex mb-6  items-center justify-between">
        <div className="md:flex">
          <div className="md:block hidden">
            {profilePhoto ? (
              <img
                className="w-24 h-24 rounded-full object-cover mr-6"
                src={profilePhoto}
                alt="Profile"
              />
            ) : (
              <img
                className="w-24 h-24 rounded-full object-cover"
                src={manpng}
                alt="pic"
              />
            )}
          </div>
          <div className="ml-2  w-full mb-4">
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
            <strong className="md:text-4xl text-2xl text-gray-400">{postCount || '0'}</strong> {/* Updated to show post count */}
            <p>Total post's</p>
          </div>
        </div>
      </div>
      <div className="bg-white shadow-md rounded-lg px-4 gap-4 flex mb-4">
        <div className="py-4 ">
          <h1 className="font-bold text-2xl">Basic Control's </h1>
          <div className=" flex gap-8  text-sm">
            <div className="py-5 flex  flex-wrap md:flex-row flex-col gap-6  capitalize w-fit ">
              <Link to="/client-list" className="bg-red-500 hover:bg-red-700 p-2 text-white font-bold rounded">
                view clients
              </Link>
              <Link className="bg-red-500 hover:bg-red-700 p-2 text-white font-bold rounded">
                view electrician
              </Link>
              <Link className="bg-red-500 hover:bg-red-700 p-2 text-white font-bold rounded">
                view Plumber
              </Link>
            </div>
           <div className="py-5 flex md:flex-row flex-col gap-6 capitalize w-fit h-fit">
              <Link className="bg-red-500  hover:bg-red-700 p-2 text-white font-bold rounded">
                view Services
              </Link>
              <Link className="bg-red-500  hover:bg-red-700 p-2 text-white font-bold rounded">
                support
              </Link>
              <Link className="bg-red-500  hover:bg-red-700 p-2 text-white font-bold rounded">
                Notify users
              </Link>
           </div>
          </div>
        </div>
      </div>


      <div className="bg-white shadow-md rounded-lg px-4 gap-4 flex">
        <div className="py-4 ">
          <h1 className="font-bold text-2xl">Handle Post's </h1>
          <div className=" flex gap-8  text-sm">
            <div className="py-5 flex  flex-wrap md:flex-row flex-col gap-6  capitalize w-fit ">
              <Link to="/client-posts" className="bg-red-500 hover:bg-red-700 p-2 text-white font-bold rounded">
                view post
              </Link>
           </div>
          </div>
        </div>
      </div>
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
    </div>
  );
};

export default AdminDashboard;
