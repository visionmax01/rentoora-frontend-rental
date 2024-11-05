import React, { useEffect, useState } from 'react';
import Api from '../utils/Api.js'
import { toast } from 'react-hot-toast';

const ReceivedOrders = () => {
  const [receivedOrders, setReceivedOrders] = useState([]);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('Booked'); // Default filter
  const [visibleOrders, setVisibleOrders] = useState(5); // Number of visible orders
  const [filteredOrders, setFilteredOrders] = useState([]); // Orders to display based on filter

  // Fetch orders from the server
  const fetchReceivedOrders = async () => {
    const token = localStorage.getItem('token'); // Get token from local storage

    if (!token) {
      setError('User not authenticated. Please log in again.');
      return;
    }

    try {
      const response = await Api.get('api/orders/received-orders', {
        headers: {
          Authorization: `Bearer ${token}`, // Include token in headers
        },
      });
      console.log('Received Orders fetched:', response.data);
      setReceivedOrders(response.data);
    } catch (err) {
      console.error('Error fetching received orders:', err);
      setError(err.response?.data?.message || 'Error fetching received orders');
    }
  };

  useEffect(() => {
    fetchReceivedOrders(); // Fetch received orders on component mount
  }, []);

  useEffect(() => {
    // Filter orders based on the selected filter
    const filtered = receivedOrders.filter(order => 
      (filter === 'Booked' && order.orderStatus !== 'Order Canceled') ||
      (filter === 'Canceled' && order.orderStatus === 'Order Canceled')
    );
    setFilteredOrders(filtered);
  }, [filter, receivedOrders]);

  // Handle filtering orders
  const handleFilterChange = (type) => {
    setFilter(type);
    setVisibleOrders(5); // Reset visible orders count
  };

  // Load more orders when "View More" is clicked
  const handleViewMore = () => {
    setVisibleOrders(prevVisible => prevVisible + 5); // Load 5 more orders
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Received Orders</h1>

      {error && <p className="text-red-500">{error}</p>}

      {/* Filter Buttons */}
      <div className="mb-4">
        <button
          className={`px-4 py-2 mr-2 rounded-md ${filter === 'Booked' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}
          onClick={() => handleFilterChange('Booked')}
        >
          Booked Orders
        </button>
        <button
          className={`px-4 py-2 rounded-md ${filter === 'Canceled' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}
          onClick={() => handleFilterChange('Canceled')}
        >
          Canceled Orders
        </button>
      </div>

      {filteredOrders.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="py-3 px-4">SN</th>
                <th className="py-3 px-4">Order By (Name)</th>
                <th className="py-3 px-4">Phone Number</th>
                <th className="py-3 px-4">Account ID</th>
                <th className="py-3 px-4">Order ID</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.slice(0, visibleOrders).map((order, index) => (
                <tr key={order._id} className="border-b">
                  {/* Serial Number */}
                  <td className="py-3 px-4 text-center">{index + 1}</td>

                  {/* Order by Name */}
                  <td className="py-3 px-4">
                    {order.userId ? order.userId.name : 'Unknown User'}
                  </td>

                  {/* Phone Number */}
                  <td className="py-3 px-4">
                    {order.userId ? order.userId.phoneNo : 'No phone number'}
                  </td>

                  {/* Account ID */}
                  <td className="py-3 px-4">{order.userId ? order.userId.accountId : 'No Account ID'}</td>

                  {/* Order ID */}
                  <td className="py-3 px-4">{order.orderId}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* View More Button */}
          {visibleOrders < filteredOrders.length && (
            <button
              className="mt-4 text-blue-500 underline"
              onClick={handleViewMore}
            >
              View More
            </button>
          )}
        </div>
      ) : (
        <p className="text-gray-600">No received orders found.</p>
      )}
    </div>
  );
};

export default ReceivedOrders;
