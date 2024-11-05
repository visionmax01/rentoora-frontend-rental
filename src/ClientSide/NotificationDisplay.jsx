import React, { useEffect, useState, useRef } from 'react';
import Api from '../utils/Api.js';

const NotificationDisplay = () => {
  const [notifications, setNotifications] = useState([]);
  const [noMoreNotifications, setNoMoreNotifications] = useState(false);
  const options = { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true };
  const notificationListRef = useRef(null);

  const fetchNotifications = async () => {
    const response = await Api.get('admin/notifications');
    const now = new Date();
    const filteredNotifications = response.data.map(notification => {
      const createdTime = new Date(notification.timestamp);
      const isOld = (now - createdTime) > 3 * 24 * 60 * 60 * 1000; // Older than 3 days
      return { ...notification, isOld };
    });

    // Sort notifications by timestamp in descending order
    filteredNotifications.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    setNotifications(filteredNotifications);
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleScroll = () => {
    const scrollTop = notificationListRef.current.scrollTop;
    const scrollHeight = notificationListRef.current.scrollHeight;
    const clientHeight = notificationListRef.current.clientHeight;

    // If scrolled to the bottom
    if (scrollTop + clientHeight >= scrollHeight) {
      setNoMoreNotifications(true); // Show no more notifications message
    } else {
      setNoMoreNotifications(false); // Hide no more notifications message
    }
  };

  return (
    <div className="p-4 bg-gray-200 rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-600">Recent Notifications</h2>
      <ul
        ref={notificationListRef}
        onScroll={handleScroll}
        className="space-y-4"
        style={{ 
          maxHeight: '350px', // Adjust this value to fit three notifications
          overflowY: notifications.length > 3 ? 'auto' : 'hidden' 
        }}
      >
        {notifications.length === 0 ? (
          <li className="text-gray-500">No recent notifications.</li>
        ) : (
          notifications.map((notification) => (
            <li
              key={notification._id}
              className={`border-gray-300 p-4 rounded-lg shadow-md relative ${notification.isOld ? 'bg-black/80' : 'bg-black text-gray-400'}`}
            >
              <div className='flex justify-between'>
                <p>Date: <span className="text-sm text-gray-500">{new Date(notification.timestamp).toLocaleDateString('en-US', options)}</span></p>
                <span className={`text-xs font-semibold px-2 py-1 rounded ${notification.isOld ? 'bg-yellow-300 text-yellow-800' : 'bg-green-300 text-green-800'}`}>
                  {notification.isOld ? 'Old' : 'New'}
                </span>
              </div>
              <div className="mt-4 w-full flex gap-6">
                <p><span className="block text-lg">{notification.message}</span></p>
              </div>
            </li>
          ))
        )}
      </ul>
      
      {!noMoreNotifications && notifications.length > 0 && (
        <p className="text-sm text-red-800 mt-2">Scroll to view more</p>
      )}
      
      {noMoreNotifications && notifications.length > 0 && (
        <p className="text-sm text-red-800 mt-2">No more notifications available.</p>
      )}
    </div>
  );
};

export default NotificationDisplay;
