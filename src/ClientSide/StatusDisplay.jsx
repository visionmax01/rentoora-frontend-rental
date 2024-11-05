// StatusDisplay.jsx
import React, { useEffect, useState } from 'react';
import Api from '../utils/Api.js'; 
import { toast } from 'react-toastify';

const StatusDisplay = ({ onClose }) => {
  const [serviceProviders, setServiceProviders] = useState([]);

  useEffect(() => {
    const fetchServiceProviderData = async () => {
      try {
        const response = await Api.get('service-provider/fatch-data', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setServiceProviders(response.data);
      } catch (error) {
        console.error('Error fetching service provider data:', error);
        toast.error(error.response?.data?.error || 'Failed to fetch service provider data.');
      }
    };

    fetchServiceProviderData();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4 text-gray-600">Service Provider Status</h2>
      {serviceProviders.length === 0 ? (
        <p className="text-gray-600">No service provider data found.</p>
      ) : (
        <div>
          {serviceProviders.map((provider) => (
            <div key={provider._id} className="mb-2">
              <p className="text-gray-600">Service Type: {provider.servicesType}</p>
              <p className="text-gray-600">Status: {provider.status}</p>
              <p className="text-gray-600">Working From: {provider.workingFrom} to {provider.workingTo}</p>
            </div>
          ))}
        </div>
      )}
      <button onClick={onClose} className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-300">
        Close
      </button>
    </div>
  );
};

export default StatusDisplay;
