import React, { useEffect, useState } from "react";
import Api from "../utils/Api.js";
import { motion } from "framer-motion";
import { FiSend, FiEdit2, FiTrash2 } from "react-icons/fi";

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [newMessage, setNewMessage] = useState("");

  const fetchNotifications = async () => {
    const response = await Api.get("admin/notifications");
    setNotifications(response.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await Api.post("admin/notifications", { message });
    setMessage("");
    fetchNotifications();
    setLoading(false);
  };

  const handleDelete = async (id) => {
    setLoading(true);
    await Api.delete(`admin/notifications/${id}`);
    fetchNotifications();
    setLoading(false);
  };

  const handleUpdateOpen = (id, currentMessage) => {
    setUpdatingId(id);
    setNewMessage(currentMessage);
    setModalOpen(true);
  };

  const handleUpdateConfirm = async () => {
    if (newMessage) {
      setLoading(true);
      await Api.put(`admin/notifications/${updatingId}`, {
        message: newMessage,
        updatedAt: new Date(),
      });
      fetchNotifications();
      setLoading(false);
      setModalOpen(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  };

  return (
    <div className="w-full mx-auto bg-gradient-to-br from-purple-100 via-indigo-200 to-indigo-200 p-4 md:p-8 h-screen lg:h-fit overflow-y-auto">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="bg-purple-50 rounded-xl shadow-lg p-4 md:p-6 w-full lg:w-1/2 ">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-indigo-700">Create Notification</h2>
          <form onSubmit={handleSubmit} className="mb-4 md:mb-6">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter your message"
              required
              className="border-2 border-indigo-300 rounded-lg p-3 w-full mb-4 h-32 md:h-48 lg:h-72 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
            />
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`bg-indigo-600 text-white rounded-lg px-4 md:px-6 py-2 md:py-3 font-semibold flex items-center justify-center w-full ${
                loading ? "opacity-50 cursor-not-allowed" : "hover:bg-indigo-700"
              } transition duration-200`}
            >
              {loading ? "Sending..." : (
                <>
                  <FiSend className="mr-2" />
                  Send Notification
                </>
              )}
            </motion.button>
          </form>
        </div>
        <div className="bg-purple-50 rounded-xl shadow-lg p-4 md:p-6 w-full lg:w-1/2 max-h-[500px] md:max-h-[600px]">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-indigo-700">Sent Notifications</h2>
          <ul className="space-y-4 h-[400px] overflow-y-auto">
            {notifications.map((notification) => (
              <motion.li
                key={notification._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="border-2 border-indigo-200 p-3 md:p-4 rounded-lg mr-6 flex flex-col sm:flex-row  justify-between items-start sm:items-center bg-indigo-50"
              >
                <div className="mb-2 sm:mb-0 w-full sm:w-3/4">
                  <p className="font-semibold text-indigo-800 text-sm md:text-base">{notification.message}</p>
                  <p className="text-xs md:text-sm text-indigo-600 mt-1">
                    {formatDate(notification.updatedAt || notification.timestamp)}
                  </p>
                </div>
                <div className="flex space-x-2 mt-2 sm:mt-0">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleUpdateOpen(notification._id, notification.message)}
                    className="text-blue-500 hover:text-blue-700 transition duration-200"
                  >
                    <FiEdit2 size={18} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleDelete(notification._id)}
                    disabled={loading}
                    className={`text-red-500 hover:text-red-700 transition duration-200 ${
                      loading && "opacity-50 cursor-not-allowed"
                    }`}
                  >
                    <FiTrash2 size={18} />
                  </motion.button>
                </div>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg p-4 md:p-6 w-full max-w-md"
          >
            <h2 className="text-xl md:text-2xl font-bold mb-4 text-indigo-700">Update Notification</h2>
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="border-2 border-indigo-300 rounded-lg p-3 w-full mb-4 h-32 md:h-40 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
              required
            />
            <div className="flex justify-end space-x-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setModalOpen(false)}
                className="bg-gray-300 text-gray-800 rounded-lg px-3 md:px-4 py-2 font-semibold text-sm md:text-base hover:bg-gray-400 transition duration-200"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleUpdateConfirm}
                className="bg-indigo-600 text-white rounded-lg px-3 md:px-4 py-2 font-semibold text-sm md:text-base hover:bg-indigo-700 transition duration-200"
              >
                {loading ? "Updating..." : "Update"}
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Notification;
