// ActivityDisplay.js
import React from 'react';

const ActivityDisplay = ({ activities }) => {
  return (
    <ul className="space-y-4">
      {activities.length === 0 ? (
        <li className="text-gray-500">No recent activities.</li>
      ) : (
        activities.map(activity => (
          <li key={activity._id} className="bg-gray-100 text-black  p-4 rounded-lg shadow-md">
            <div className="flex justify-between">
              <p><strong>Action:</strong> {activity.action}</p>
              <p><strong>Date:</strong> {new Date(activity.timestamp).toLocaleString()}</p>
            </div>
          </li>
        ))
      )}
    </ul>
  );
};

export default ActivityDisplay;
