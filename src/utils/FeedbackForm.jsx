import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Api from "./Api.js";
import { FaCheckCircle, FaSpinner, FaStar } from "react-icons/fa"; // Import star icon
import {toast} from "react-toastify";

const FeedbackForm = ({ toggleFeedback }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    rating: 0, // Add rating to formData
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRating = (rating) => {
    setFormData({ ...formData, rating });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic form validation
    if (!formData.name) {
      toast.error("Name field is required");
      return;
    }
    if (!formData.email) {
      toast.error("Email field is required");
      return;
    }
    if (!formData.message) {
      toast.error("Message field is required");
      return;
    }
    if (formData.rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    setLoading(true);

    try {
      const response = await Api.post(
        "/feadback/sendFeadback",
        formData
      );
      setSuccess(true);
      toast.success(response.data.message);
    } catch (error) {
      toast.error("Your feedback has already been submitted with this email.");
    } finally {
      setLoading(false);
    }
  };

  const closeSuccessModal = () => {
    setSuccess(false);
    toggleFeedback();
  };

  return (
    <AnimatePresence>
      {success ? (
        <motion.div
          className="fixed inset-0 z-50 flex justify-center items-center text-black bg-black bg-opacity-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white p-6 rounded-lg shadow-lg w-80 text-center"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
          >
            <FaCheckCircle className="text-green-500 text-4xl mx-auto mb-4" />
            <h2 className="text-lg font-semibold mb-4">Feedback Submitted!</h2>
            <p className="mb-4">Thank you for your feedback.</p>
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              onClick={closeSuccessModal}
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      ) : (
        <motion.div
          className="fixed inset-0 z-50 flex justify-center items-center text-black bg-black bg-opacity-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-gray-100 p-6 rounded-lg shadow-lg relative lg:w-1/2 w-full mx-2"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
          >
            <h2 className="text-lg font-semibold">Feedback Form</h2>
            <p className="text-sm mb-4 text-red-500 capitalize">
              Your feedback is valuable for us!
            </p>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Name <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-700"
                  onChange={handleChange}
                  value={formData.name}
                  placeholder="Your Name"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email <span className="text-red-600">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-700"
                  onChange={handleChange}
                  value={formData.email}
                  placeholder="your-email@example.com"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Feedback message <span className="text-red-600">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-700"
                  rows="3"
                  onChange={handleChange}
                  value={formData.message}
                  placeholder="Write your feedback here..."
                ></textarea>
              </div>

              {/* Rating Stars */}
              <div className="mb-4 ">
                <label className="block text-sm font-medium text-gray-700  mb-2">
                  Rating <span className="text-red-600">*</span>
                </label>
                <div className="flex space-x-1 bg-gray-900 py-2 px-1 rounded">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                      key={star}
                      className={`cursor-pointer text-xl ${
                        formData.rating >= star
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }`}
                      onClick={() => handleRating(star)}
                    />
                  ))}
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <FaSpinner className="animate-spin mr-2" />
                      Submitting...
                    </>
                  ) : (
                    "Submit"
                  )}
                </button>
                <button
                  type="button"
                  className="absolute top-0 right-0 px-3 py-1 bg-red-500 text-white rounded-tr-lg hover:bg-red-600"
                  onClick={toggleFeedback}
                >
                  X
                </button>
              </div>
              {error && <p className="text-red-500 mt-4">{error}</p>}
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FeedbackForm;
