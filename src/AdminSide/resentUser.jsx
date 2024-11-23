import React, { useEffect, useState } from 'react';
import Api from '../utils/Api.js'
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { FaSpinner, FaUserCircle, FaEnvelope, FaCheck } from 'react-icons/fa';

const RecentUsers = () => {
  const [recentUsers, setRecentUsers] = useState([]);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRecentUsers = async () => {
      try {
        const response = await Api.get('count/recent-users', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        const filteredUsers = response.data.filter(user => user.role === 0);
        setRecentUsers(filteredUsers);
      } catch (error) {
        console.error('Error fetching recent users', error);
      }
    };
    fetchRecentUsers();
  }, []);

  const handleCheckboxChange = (userId) => {
    setSelectedUserIds((prev) => 
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  const handleSelectAllChange = (e) => {
    setSelectedUserIds(e.target.checked ? recentUsers.map(user => user._id) : []);
  };

  const sendFeedbackEmails = async () => {
    setLoading(true);
    try {
      await Api.post('count/send-feedback-emails', { userIds: selectedUserIds }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      toast.success('Feedback emails sent successfully!');
      setSelectedUserIds([]);
    } catch (error) {
      toast.error('Error sending emails');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      className="p-4 sm:p-6 bg-gradient-to-br from-brand-bgColor to-brand-bgColor rounded-xl shadow-2xl"
      initial={{ opacity: 0, scale: 0.9 }} 
      animate={{ opacity: 1, scale: 1 }} 
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl sm:text-xl text-gray-300 font-bold mb-6 ">Recent Users <span className="text-yellow-300">(Last 2 Days)</span></h2>
      <div className="overflow-x-auto">
        <table className="w-full bg-white/10 backdrop-blur-md rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-white/20">
              <th className="p-3 text-left">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    onChange={handleSelectAllChange}
                    checked={selectedUserIds.length === recentUsers.length}
                    className="form-checkbox h-5 w-5 text-purple-600 rounded border-white/30"
                  />
                  <span className="ml-2 text-xs font-medium text-white uppercase tracking-wider">Select All</span>
                </label>
              </th>
              <th className="p-3 text-left text-xs font-medium text-white uppercase tracking-wider hidden sm:table-cell">
                <FaUserCircle className="inline mr-2" />Name
              </th>
              <th className="p-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                <FaEnvelope className="inline mr-2" />Email
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {recentUsers.map((user) => (
              <motion.tr 
                key={user._id} 
                className="hover:bg-white/5 transition-colors"
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <td className="p-3 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selectedUserIds.includes(user._id)}
                    onChange={() => handleCheckboxChange(user._id)}
                    className="form-checkbox h-5 w-5 text-purple-600 rounded border-white/30"
                  />
                </td>
                <td className="p-3 whitespace-nowrap hidden sm:table-cell text-white/80">{user.name}</td>
                <td className="p-3 whitespace-nowrap text-white/80">
                  <span className="sm:hidden mr-2 font-bold">{user.name}:</span>
                  {user.email}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
      <motion.button 
        onClick={sendFeedbackEmails} 
        className="mt-6 w-full sm:w-auto px-3 py-1  text-white rounded shadow-lg  bg-indigo-600 hover:bg-indigo-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        disabled={selectedUserIds.length === 0}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {loading ? (
          <span className="flex items-center">
            <FaSpinner className="animate-spin h-5 w-5 mr-2" />
            Sending...
          </span>
        ) : (
          <span className="flex items-center">
            <FaCheck className="mr-2" />
            Send Feedback Emails
          </span>
        )}
      </motion.button>
    </motion.div>
  );
};

export default RecentUsers;
