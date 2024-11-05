import React, { useEffect, useState } from 'react';
import Api from '../utils/Api.js'
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { FaSpinner } from 'react-icons/fa';

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
        // Filter users to only include those with role 0
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
    if (e.target.checked) {
      const allUserIds = recentUsers.map(user => user._id);
      setSelectedUserIds(allUserIds);
    } else {
      setSelectedUserIds([]);
    }
  };

  const sendFeedbackEmails = async () => {
    setLoading(true);
    try {
      await Api.post('count/send-feedback-emails', { userIds: selectedUserIds }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      toast.success('Feedback emails sent successfully!');
      setSelectedUserIds([]); // Reset selection after sending emails
    } catch (error) {
      toast.error('Error sending emails');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      className="p-4"
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
    >
      <h2 className="text-2xl font-bold mb-4">Recent Users (Joined in Last 2 Days)</h2>
      <motion.table 
        className="min-w-full border"
        initial={{ y: -20 }} 
        animate={{ y: 0 }} 
        transition={{ duration: 0.3 }}
      >
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-4 py-2">
              <input
                type="checkbox"
                onChange={handleSelectAllChange}
                checked={selectedUserIds.length === recentUsers.length}
                indeterminate={selectedUserIds.length > 0 && selectedUserIds.length < recentUsers.length}
              />
            </th>
            <th className="border px-4 py-2 hidden md:table-cell">Name</th>
            <th className="border px-4 py-2">Email</th>
          </tr>
        </thead>
        <tbody>
          {recentUsers.map((user) => (
            <motion.tr 
              key={user._id} 
              className="hover:bg-gray-100"
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <td className="border px-4 py-2">
                <input
                  type="checkbox"
                  checked={selectedUserIds.includes(user._id)}
                  onChange={() => handleCheckboxChange(user._id)}
                />
              </td>
              <td className="border px-4 py-2 hidden md:table-cell">{user.name}</td>
              <td className="border px-4 py-2">{user.email}</td>
            </motion.tr>
          ))}
        </tbody>
      </motion.table>
      <button 
        onClick={sendFeedbackEmails} 
        className="mt-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        disabled={selectedUserIds.length === 0} 
      >
        {loading ? (
          <span className="flex items-center">
            <FaSpinner className="animate-spin h-5 w-5 mr-2" />
            Email Sending...
          </span>
        ) : (
          "Send Feedback Emails"
        )}
      </button>
    </motion.div>
  );
};

export default RecentUsers;
