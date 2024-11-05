import React, { useState, useEffect } from 'react';
import AdminNav from './adminNav';
import { motion, AnimatePresence } from 'framer-motion';
import Api from '../utils/Api.js'

const FeedbackList = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchFeedbacks = async () => {
      const response = await Api.get('feadback/getfeadback');
      // Sort feedbacks by createdAt in descending order to show latest first
      const sortedFeedbacks = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setFeedbacks(sortedFeedbacks);
    };

    fetchFeedbacks();
  }, []);

  const closePopup = () => {
    setSelectedFeedback(null);
  };

  // Calculate total pages
  const totalPages = Math.ceil(feedbacks.length / itemsPerPage);
  
  // Get current feedbacks for the current page
  const currentFeedbacks = feedbacks.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="lg:p-4">
      <AdminNav />
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">Feedback List</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left bg-white border border-gray-200">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">#</th>
                <th className="py-2 px-4 border-b">Name</th>
                <th className="py-2 px-4 border-b">Email</th>
                <th className="py-2 px-4 border-b hidden lg:table-cell">Submitted At</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentFeedbacks.map((feedback, index) => (
                <tr key={feedback._id} className="text-left">
                  <td className="py-2 px-4 border-b">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td className="py-2 px-4 border-b">{feedback.name}</td>
                  <td className="py-2 px-4 border-b">{feedback.email}</td>
                  <td className="py-2 px-4 border-b hidden lg:table-cell">
                    {new Date(feedback.createdAt).toLocaleString()}
                  </td>
                  <td className="py-2 px-4 border-b">
                    <button
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                      onClick={() => setSelectedFeedback(feedback)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* Feedback Popup */}
      <AnimatePresence>
        {selectedFeedback && (
          <motion.div
            className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg"
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
            >
              <h2 className="text-lg font-semibold mb-4">Feedback Details</h2>
              <div className="flex flex-col gap-2">
                <p><strong>Name:</strong> {selectedFeedback.name}</p>
                <p><strong>Email:</strong> {selectedFeedback.email}</p>
                <p><strong>Message:</strong><br /> <span className="bg-gray-300 px-4 py-1 rounded-sm">{selectedFeedback.message}</span></p>
                <p><strong>Submitted at:</strong> {new Date(selectedFeedback.createdAt).toLocaleString()}</p>
              </div>
              <div className="flex justify-end mt-4">
                <button
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                  onClick={closePopup}
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FeedbackList;
