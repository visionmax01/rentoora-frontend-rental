import React, { useEffect, useState } from 'react';
import Api from '../utils/Api.js';

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [newMessage, setNewMessage] = useState('');

  const fetchNotifications = async () => {
    const response = await Api.get('admin/notifications');
    setNotifications(response.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await Api.post('admin/notifications', { message });
    setMessage('');
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
      // Update the notification and include a new timestamp
      await Api.put(`admin/notifications/${updatingId}`, { message: newMessage, updatedAt: new Date() });
      fetchNotifications();
      setLoading(false);
      setModalOpen(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    });
  };

  return (
    <div className="w-full mx-auto">
      <div className="flex">
        <div className="bg-gray-200 shadow-black shadow-2xl p-6">
          <h2 className="text-2xl font-bold mb-4">Notifications</h2>
          <form onSubmit={handleSubmit} className="mb-6">
            <textarea
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter your message"
              required
              className="border h-72 border-gray-300 rounded-lg p-2 w-full mb-2"
            />
            <button
              type="submit"
              disabled={loading}
              className={`bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 transition ${loading && 'opacity-50 cursor-not-allowed'}`}
            >
              {loading ? 'Sending...' : 'Send Notification'}
            </button>
          </form>
        </div>
        <div className='bg-gray-400/80 w-full p-6 h-[500px]'>
          <h2 className="text-2xl font-bold mb-4">Sended Message List</h2>
          <ul className="space-y-4">
            {notifications.map((notification) => (
              <li key={notification._id} className="border border-gray-300 p-4 rounded-lg flex justify-between items-center">
                <div>
                  <span className="font-semibold">{notification.message}</span>
                  <span className="text-gray-900 text-sm"> (at {formatDate(notification.updatedAt || notification.timestamp)})</span>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleUpdateOpen(notification._id, notification.message)}
                    className="text-blue-500 hover:underline"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDelete(notification._id)}
                    disabled={loading}
                    className={`text-red-500 hover:underline ${loading && 'opacity-50 cursor-not-allowed'}`}
                  >
                    {loading ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Modal for updating notification */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-4 w-1/3">
            <h2 className="text-lg font-bold mb-4">Update Notification</h2>
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="border border-gray-300 rounded-lg p-2 w-full mb-4"
              required
            />
            <div className="flex justify-end">
              <button onClick={() => setModalOpen(false)} className="mr-2 bg-gray-300 rounded-lg px-4 py-2">Cancel</button>
              <button onClick={handleUpdateConfirm} className="bg-blue-500 text-white rounded-lg px-4 py-2">
                {loading ? 'Updating...' : 'Update'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notification;
