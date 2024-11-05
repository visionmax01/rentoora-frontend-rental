import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Api from "../utils/Api.js";
import NotificationDisplay from "./NotificationDisplay";
import ActivityDisplay from "../utils/ActivityDisplay.jsx";
import { motion } from "framer-motion";
import ServiceProviderForm from "../serviceRegister/serviceProviderForm.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { styled } from "@mui/material/styles";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Tooltip from "@mui/material/Tooltip";
import InfoIcon from "@mui/icons-material/Info";
import UpdateServiceProvider from "../serviceRegister/UpdateServiceProvider.jsx"; 
import {
  faTimes,
  faCheckCircle,
  faCircle,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
const Android12Switch = styled(Switch)(({ theme }) => ({
  padding: 8,
  "& .MuiSwitch-track": {
    borderRadius: 22 / 2,
    backgroundColor: "#cc0000",
    "&::before, &::after": {
      content: '""',
      position: "absolute",
      top: "50%",
      transform: "translateY(-50%)",
      width: 16,
      height: 16,
    },
    "&::before": {
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
        theme.palette.getContrastText(theme.palette.primary.main)
      )}" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>')`,
      left: 12,
    },
    "&::after": {
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
        theme.palette.getContrastText(theme.palette.primary.main)
      )}" d="M19,13H5V11H19V13Z" /></svg>')`,
      right: 12,
    },
  },
  "& .MuiSwitch-thumb": {
    boxShadow: "none",
    width: 16,
    height: 16,
    margin: 2,
  },
}));

const ClientHomePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showActivity, setShowActivity] = useState(false);
  const [activities, setActivities] = useState([]);
  const [serviceProviders, setServiceProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingToggle, setLoadingToggle] = useState({});
  const [user, setUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await Api.get("auth/user-data", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setUser(response.data);
        await logUserActivity("LOGIN");
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchServiceProviders = async () => {
      try {
        const response = await Api.get("service-provider/fatch-data", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (Array.isArray(response.data)) {
          setServiceProviders(response.data);
        } else {
          console.error("Expected an array but got:", response.data);
        }
      } catch (error) {
        console.error("Error fetching service provider data:", error);
      }
    };

    fetchUserData();
    fetchServiceProviders();
  }, []);

  const logUserActivity = async (action) => {
    try {
      await Api.post(
        "activity/log-activity",
        { action },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
    } catch (error) {
      console.error("Error logging activity:", error);
    }
  };

  const handleToggleMessages = () => {
    setShowNotifications((prev) => !prev);
    logUserActivity("VIEW_NOTIFICATIONS");
  };

  const handleViewActivity = async () => {
    await logUserActivity("");
    const response = await Api.get("activity/user-activities", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    setActivities(response.data);
    setShowActivity(true);
  };

  const handleCloseActivity = () => {
    setShowActivity(false);
  };

  const handleToggleAvailability = async (providerId, currentAvailability) => {
    setLoadingToggle((prev) => ({ ...prev, [providerId]: true }));

    const newAvailability =
      currentAvailability === "Online" ? "Offline" : "Online";

    // Optimistically update the availability in the UI
    setServiceProviders((prevProviders) =>
      prevProviders.map((provider) =>
        provider._id === providerId
          ? { ...provider, availability: newAvailability }
          : provider
      )
    );

    try {
      await Api.put(
        `service-provider/${providerId}/availability`,
        { availability: newAvailability },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // Display toast message based on the new availability
      toast.success(`Hello! Now you are ${newAvailability}.`);
    } catch (error) {
      const errorMsg = error.response?.data?.error || "Failed to be Online.";
      toast.error(errorMsg);
      console.error("Error updating availability:", error);

      // Revert the optimistic update if there's an error
      setServiceProviders((prevProviders) =>
        prevProviders.map((provider) =>
          provider._id === providerId
            ? { ...provider, availability: currentAvailability }
            : provider
        )
      );
    } finally {
      setLoadingToggle((prev) => ({ ...prev, [providerId]: false }));
    }
  };

  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(null);

  // Function to open the modal for editing
  const openEditModalHandler = (provider) => {
    setSelectedProvider(provider);
    setOpenEditModal(true);
  };

  // Function to close the modal
  const closeEditModalHandler = () => {
    setOpenEditModal(false);
    setSelectedProvider(null);
  };


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-700">Loading...</p>
      </div>
    );
  }

  return (
    <div className="h-auto py-4 relative">
      <div className="text-black text-center py-4 shadow-md">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">Welcome to the Dashboard</h1>
          {user && <p className="text-lg">Hi, {user.name}!</p>}
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Recent Activity Card */}
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4 text-gray-700">
              Recent Activity
            </h3>
            <p className="text-gray-600">
              View your recent activity and track progress.
            </p>
            <button
              onClick={handleViewActivity}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
            >
              View Activity
            </button>
          </div>

          {/* Profile Settings Card */}
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4 text-gray-700">
              Profile Settings
            </h3>
            <p className="text-gray-600">
              Manage your account settings and update personal details.
            </p>
            <button
              onClick={() => navigate("#")}
              className="mt-4 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-300"
            >
              Edit Profile
            </button>
          </div>

          {/* Messages Card */}
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4 text-gray-700">Messages</h3>
            <p className="text-gray-600">
              Check your latest messages and stay updated.
            </p>
            <button
              onClick={handleToggleMessages}
              className="mt-4 bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition duration-300"
            >
              View Messages
            </button>
          </div>
        </div>

        <div className="flex gap-12 mt-8">
          {/* Register Service Provider Section */}
          <div className="bg-white text-black shadow-lg rounded-lg p-6">
            <h1>
              Register yourself as a Service Provider <br /> if you have any skills!
            </h1>
            <div className="p-6 flex flex-col gap-1">
              <button
                onClick={() => setIsModalOpen(true)}
                className="btn py-2 px-4 rounded bg-blue-500 text-white"
              >
                Register as Service Provider
              </button>

              <ServiceProviderForm
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
              />
            </div>
          </div>

          {/* Display Service Providers */}
          <div className="flex text-black bg-transparent rounded-lg gap-8">
          {Array.isArray(serviceProviders) && serviceProviders.length > 0 ? (
        serviceProviders.map((provider) => (
          <div key={provider._id} className="bg-white w-[300px] relative shadow-lg rounded-lg p-6">
            <h3 className="text-xl font-bold mb-2">As - {provider.servicesType}</h3>
            <p className="text-gray-600">
              Status:{" "}
              <strong
                className={provider.status === "Approved" ? "text-green-500" : "text-red-500"}
              >
                {provider.status}{" "}
                {provider.status === "Approved" && <FontAwesomeIcon icon={faCheck} />}
              </strong>
            </p>

            <p className="text-gray-600">
              Account No: <strong>{provider.accountId}</strong>
            </p>
            <p className="text-gray-600">
              Work Time: <strong>{provider.workingFrom} to {provider.workingTo}</strong>
            </p>
            <p className="text-gray-600 flex items-center">
              Availability:
              {loadingToggle[provider._id] ? (
                <span className="ml-2">Loading...</span>
              ) : provider.availability === "Online" ? (
                <>
                  <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 ml-2" />
                  <span className="ml-1">
                    <strong>Available</strong>
                  </span>
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faCircle} className="text-red-500 ml-2" />
                  <span className="ml-1">
                    <strong>Not Available</strong>
                  </span>
                </>
              )}
              <Tooltip
                title={
                  provider.availability === "Online"
                    ? "Available: You are available to book and your ID is shown in booking data."
                    : "Not Available: No one can book your service. You are disabled from the booking system, and your ID is not shown in booking data."
                }
                arrow
                placement="top"
              >
                <InfoIcon className="ml-2 cursor-pointer text-gray-500 hover:text-gray-700" />
              </Tooltip>
            </p>

            {/* Conditional Rendering of Edit Button */}
            {provider.status === "Modification Required" && (
              <button
                onClick={() => openEditModalHandler(provider)}
                className=" bg-blue-500 text-white px-4 py-2 rounded-md"
              >
                Edit
              </button>
            )}

            <div className="absolute top-3 right-0 flex items-center">


<FormControlLabel
  control={
    // Use Tooltip to display message when provider is not verified
    <Tooltip
      title="Unable to go online. Your account is suspended."
      placement="top"
      disableHoverListener={provider.verified === true} // Only show tooltip if the provider is NOT verified
    >
      <span> {/* Wrapping the switch inside a span to apply the tooltip */}
        <Android12Switch
          checked={provider.availability === "Online"}
          onChange={() => handleToggleAvailability(provider._id, provider.availability)}
          disabled={loadingToggle[provider._id] || provider.verified === false} // Disable the switch if not verified
          sx={{
            "&.Mui-checked": {
              "& .MuiSwitch-track": {
                backgroundColor: "#ca8a04", // Green for online
              },
            },
            "&.Mui-disabled": {
              opacity: 0.5,
            },
          }}
        />
      </span>
    </Tooltip>
  }
  label=""
/>


            </div>
          </div>
        ))
      ) : (
        <p className="px-4 py-3 rounded h-fit text-red-600 w-fit bg-red-200 ">
          You are not registered as a service provider. <br /> or server error occurred.
        </p>
      )}
          </div>
        </div>
      </div>
      {/* Popup Modal for Notification Display */}
      {showNotifications && (
        <div className="bg-black bg-opacity-50 h-sereen absolute w-full top-0 right-0">
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-black rounded-lg shadow-lg p-6   relative  w-1/2">
              <button
                className="absolute text-3xl top-1 right-2 text-gray-400 hover:text-gray-800"
                onClick={() => setShowNotifications(false)}
              >
                &times;
              </button>
              <h2 className="text-xl font-bold mb-4 text-gray-600">
                Notifications
              </h2>
              <NotificationDisplay />
            </div>
          </motion.div>
        </div>
      )}

      {/* Popup Modal for Activity Display */}
      {showActivity && (
        <div className="bg-black bg-opacity-50 absolute h-screen w-full top-0 right-0">
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-white h-[500px] overflow-y-auto rounded-lg shadow-lg p-6 relative w-1/2">
              <button
                className="absolute text-3xl top-1 right-2 text-gray-400 hover:text-gray-800"
                onClick={handleCloseActivity}
              >
                &times;
              </button>
              <h2 className="text-xl font-bold mb-4 text-gray-600">
                User Activities
              </h2>
              <ActivityDisplay activities={activities} />
            </div>
          </motion.div>
        </div>
      )}

      {/* Edit Modal (Popup) */}
      {openEditModal && selectedProvider && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white  p-6 rounded-lg w-1/2">
            <UpdateServiceProvider
              providerId={selectedProvider._id}
              currentData={selectedProvider}
              handlePrev={closeEditModalHandler}
            />
            <button
              onClick={closeEditModalHandler}
              className="mt-4 text-gray-600 underline"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientHomePage;
