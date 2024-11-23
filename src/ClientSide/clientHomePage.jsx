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
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Tooltip from "@mui/material/Tooltip";
import UpdateServiceProvider from "../serviceRegister/UpdateServiceProvider.jsx";
import Mainlogo from '../assets/img/main_logo.png';
import {
  faTimes,
  faCheckCircle,
  faCircle,
  faCheck,
  faUser,
  faBell,
  faClipboardList,
  faHeadset,
} from "@fortawesome/free-solid-svg-icons";
import ServicesSupport from "./ServicesSuport.jsx";

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
  const [showNotifications, setShowNotifications] = useState(false);
  const [supportTicket, setSuportTicket] = useState(false);
  const [showActivity, setShowActivity] = useState(false);
  const [activities, setActivities] = useState([]);
  const [serviceProviders, setServiceProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingToggle, setLoadingToggle] = useState({});
  const [user, setUser] = useState(null);
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
  const handleToggleSupport = () => {
    setSuportTicket((prev) => !prev);
    logUserActivity("view-Support section");
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

      toast.success(`Hello! Now you are ${newAvailability}.`);
    } catch (error) {
      const errorMsg = error.response?.data?.error || "Failed to be Online.";
      toast.error(errorMsg);
      console.error("Error updating availability:", error);

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

  const openEditModalHandler = (provider) => {
    setSelectedProvider(provider);
    setOpenEditModal(true);
  };

  const closeEditModalHandler = () => {
    setOpenEditModal(false);
    setSelectedProvider(null);
  };

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center ">
        <img src={Mainlogo} alt="Loading..." className="lg:h-24 h-10 w-auto animate-bounce" />
        <p className="mt-4 text-white text-xl font-semibold">Loading your dashboard...</p>
      </div>
    );
  }

  const variants = {
    hidden: { opacity: 0, y: 100 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-purple-100 py-8 relative">
      <div className="bg-white text-gray-800 text-center py-6 shadow-lg rounded-lg mb-4 mx-4">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold ">Welcome to Your Dashboard</h1>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
          <DashboardCard
            icon={faClipboardList}
            title="Recent Activity"
            description="View your recent activity and track progress."
            buttonText="View Activity"
            onClick={handleViewActivity}
            bgColor="bg-blue-500"
            hoverColor="bg-blue-600"
          />

          <DashboardCard
            icon={faHeadset}
            title="Support Ticket"
            description="Create a support ticket for any issues with our service."
            buttonText="Open Ticket"
            onClick={handleToggleSupport}
            bgColor="bg-green-500"
            hoverColor="bg-green-600"
          />

          <DashboardCard
            icon={faBell}
            title="Messages"
            description="Check your latest messages and stay updated."
            buttonText="View Messages"
            onClick={handleToggleMessages}
            bgColor="bg-yellow-500"
            hoverColor="bg-yellow-600"
          />
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          <div className="bg-white text-gray-800 shadow-lg rounded-lg p-6 lg:w-1/3">
            <h2 className="text-2xl font-bold mb-4 text-center">Register as a Service Provider</h2>
            <p className="text-gray-600 mb-4 text-center">Have skills to offer? Register yourself as a Service Provider!</p>
            <div className="flex justify-center">
              <button
                onClick={() => setIsModalOpen(true)}
                className="btn py-2 px-6 rounded-full bg-purple-500 text-white hover:bg-purple-600 transition duration-300 transform hover:scale-105"
              >
                Register Now
              </button>
            </div>
            <ServiceProviderForm
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
            />
          </div>

          <div className="lg:w-2/3">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Your Service Providers</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.isArray(serviceProviders) && serviceProviders.length > 0 ? (
                serviceProviders.map((provider) => (
                  <ServiceProviderCard
                    key={provider._id}
                    provider={provider}
                    loadingToggle={loadingToggle}
                    handleToggleAvailability={handleToggleAvailability}
                    openEditModalHandler={openEditModalHandler}
                  />
                ))
              ) : (
                <p className="col-span-full text-center py-4 bg-red-100 text-red-600 rounded-lg">
                  You are not registered as a service provider or a server error occurred.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {renderModals(supportTicket, setSuportTicket, showNotifications, setShowNotifications, showActivity, activities, handleCloseActivity)}

      {openEditModal && selectedProvider && (
        <EditModal
          selectedProvider={selectedProvider}
          closeEditModalHandler={closeEditModalHandler}
        />
      )}
    </div>
  );
};

const DashboardCard = ({ icon, title, description, buttonText, onClick, bgColor, hoverColor }) => (
  <div className="bg-white shadow-lg rounded-lg p-4 transition-all duration-300 hover:shadow-xl">
    <div className="flex items-center justify-center w-10 h-10 mx-auto mb-1 rounded-full bg-gray-100">
      <FontAwesomeIcon icon={icon} className="text-xl text-gray-600" />
    </div>
    <h3 className="text-xl font-bold  text-center text-gray-800">{title}</h3>
    <p className="text-gray-600  text-center">{description}</p>
    <div className="text-center">
      <button
        onClick={onClick}
        className={`mt-2 ${bgColor} text-white px-6 py-2 rounded-full hover:${hoverColor} transition duration-300 transform hover:scale-105`}
      >
        {buttonText}
      </button>
    </div>
  </div>
);

const ServiceProviderCard = ({ provider, loadingToggle, handleToggleAvailability, openEditModalHandler }) => (
  <div className="bg-white shadow-lg rounded-lg p-6 relative transition-all duration-300 hover:shadow-xl">
    <div className="absolute top-2 right-2">
      <AvailabilityToggle
        provider={provider}
        loadingToggle={loadingToggle}
        handleToggleAvailability={handleToggleAvailability}
      />
    </div>
    <h3 className="text-xl font-bold mb-2 text-gray-800">As - {provider.servicesType}</h3>
    <StatusBadge status={provider.status} />
    <p className="text-gray-600">Account No: <strong>{provider.accountId}</strong></p>
    <p className="text-gray-600">Work Time: <strong className="text-sm">{provider.workingFrom} to {provider.workingTo}</strong></p>
    <p className="text-gray-600 mt-4 flex items-center">
      Availability:
      {loadingToggle[provider._id] ? (
        <span className="ml-2">Loading...</span>
      ) : (
        <AvailabilityStatus availability={provider.availability} />
      )}
    </p>
    {provider.status === "Modification Required" && (
      <button
        onClick={() => openEditModalHandler(provider)}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition duration-300"
      >
        Edit
      </button>
    )}
  </div>
);

const StatusBadge = ({ status }) => (
  <p className="text-gray-600 mb-2">
    Status:{" "}
    <span className={`font-bold ${status === "Approved" ? "text-green-500" : "text-red-500"}`}>
      {status} {status === "Approved" && <FontAwesomeIcon icon={faCheck} />}
    </span>
  </p>
);

const AvailabilityToggle = ({ provider, loadingToggle, handleToggleAvailability }) => (
  <Tooltip
    title={provider.verified ? 
      (provider.availability === "Online" ? "Go Offline" : "Go Online") :
      "Unable to go online. Your account is suspended."
    }
    placement="top"
  >
    <span>
      <Android12Switch
        checked={provider.availability === "Online"}
        onChange={() => handleToggleAvailability(provider._id, provider.availability)}
        disabled={loadingToggle[provider._id] || !provider.verified}
        sx={{
          "&.Mui-checked": {
            "& .MuiSwitch-track": {
              backgroundColor: "#4CAF50",
            },
          },
          "&.Mui-disabled": {
            opacity: 0.5,
          },
        }}
      />
    </span>
  </Tooltip>
);

const AvailabilityStatus = ({ availability }) => (
  <>
    <FontAwesomeIcon
      icon={availability === "Online" ? faCheckCircle : faCircle}
      className={`ml-2 ${availability === "Online" ? "text-green-500" : "text-red-500"}`}
    />
    <span className="ml-1 font-bold">
      {availability === "Online" ? "Available" : "Not Available"}
    </span>
  </>
);

const renderModals = (supportTicket, setSuportTicket, showNotifications, setShowNotifications, showActivity, activities, handleCloseActivity) => (
  <>
    {supportTicket && (
      <ModalWrapper onClose={() => setSuportTicket(false)}>
        <ServicesSupport />
      </ModalWrapper>
    )}

    {showNotifications && (
      <ModalWrapper onClose={() => setShowNotifications(false)}>
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Notifications</h2>
        <NotificationDisplay />
      </ModalWrapper>
    )}

    {showActivity && (
      <ModalWrapper onClose={handleCloseActivity}>
        <h2 className="text-2xl font-bold mb-4 text-gray-800">User Activities</h2>
        <ActivityDisplay activities={activities} />
      </ModalWrapper>
    )}
  </>
);

const ModalWrapper = ({ children, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <motion.div
      className="bg-white rounded-lg shadow-xl lg:p-6 p-2 w-11/12 lg:w-3/4 max-h-[90vh] overflow-y-auto"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
    >
      <button
        className="fixed top-2 right-2 text-gray-500 hover:text-gray-700"
        onClick={onClose}
      >
        <FontAwesomeIcon icon={faTimes} size="lg" />
      </button>
      {children}
    </motion.div>
  </div>
);

const EditModal = ({ selectedProvider, closeEditModalHandler }) => (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div className="bg-white relative p-6 rounded-lg w-11/12 max-w-2xl">
      <UpdateServiceProvider
        providerId={selectedProvider._id}
        currentData={selectedProvider}
        handlePrev={closeEditModalHandler}
      />
      <button
        onClick={closeEditModalHandler}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
      >
        <FontAwesomeIcon icon={faTimes} size="lg" />
      </button>
    </div>
  </div>
);

export default ClientHomePage;
