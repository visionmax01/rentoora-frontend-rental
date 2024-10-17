import React, { useEffect, useState } from "react";
import axios from "axios";
import ReceivedOrder from "../Myorder/ReceivedOrder"; // Import the OrderPopup component if needed
import { FiChevronDown, FiChevronUp } from "react-icons/fi"; // Import icons

const MyBookedOrders = () => {
  const [orders, setOrders] = useState([]);
  const [expandedOrderId, setExpandedOrderId] = useState(null); // Track the expanded order
  const [selectedOrder, setSelectedOrder] = useState(null); // For handling the popup
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("Booked"); // Default filter
  const [visibleOrders, setVisibleOrders] = useState(5); // Number of visible orders

  // Fetch orders from the server
  const fetchOrders = async () => {
    const token = localStorage.getItem("token"); // Get token from local storage

    if (!token) {
      setError("User not authenticated. Please log in again.");
      return;
    }

    try {
      const response = await axios.get(
        "https://rentoora-backend-rental.onrender.com/order/my-booked-orders",
        {
          // Adjusted endpoint
          headers: {
            Authorization: `Bearer ${token}`, // Include token in headers
          },
        }
      );
      // Sort the orders by createdAt in descending order
      const sortedOrders = response.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setOrders(sortedOrders);
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching orders");
    }
  };

  useEffect(() => {
    fetchOrders(); // Fetch orders on component mount
  }, []);

  // Function to handle expanding/collapsing an order
  const toggleExpand = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  // Function to handle canceling an order
  const cancelOrder = async (orderId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("User not authenticated. Please log in again.");
      return;
    }

    try {
      await axios.delete(`https://rentoora-backend-rental.onrender.com/order/cancel/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Refresh the orders after cancellation
      fetchOrders(); // Keep fetching the updated list including canceled orders
    } catch (err) {
      setError(err.response?.data?.message || "Error canceling the order");
    }
  };

  // Handle filtering orders
  const handleFilterChange = (type) => {
    setFilter(type);
    setVisibleOrders(5); // Reset visible orders count
  };

  // Load more orders when "View More" is clicked
  const handleViewMore = () => {
    setVisibleOrders((prevVisible) => prevVisible + 5); // Load 5 more orders
  };

  // Filter orders based on the selected filter
  const filteredOrders = orders.filter(
    (order) =>
      (filter === "Booked" && order.orderStatus !== "Order Canceled") ||
      (filter === "Canceled" && order.orderStatus === "Order Canceled")
  );

  return (
    <div className="min-h-screen bg-gray-100 lg:p-6 p-2">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Order Recieved</h1>

      {/* Filter Buttons */}
      <div className="flex mb-4 text-sm">
        <button
          className={`px-4 py-2 mr-2 rounded-md ${
            filter === "Booked"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-black"
          }`}
          onClick={() => handleFilterChange("Booked")}
        >
          Booked Orders
        </button>
        <button
          className={`px-4 py-2 rounded-md ${
            filter === "Canceled"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-black"
          }`}
          onClick={() => handleFilterChange("Canceled")}
        >
          Canceled Orders
        </button>
      </div>

      {filteredOrders.length > 0 ? (
        <div className="w-full flex flex-col gap-10">
          {filteredOrders.slice(0, visibleOrders).map((order) => {
            const isExpanded = expandedOrderId === order._id;

            return (
              <div
                key={order._id}
                className="bg-white relative shadow-md rounded-lg p-6"
              >
                {/* Basic Details - Order ID and Booked By */}
                <div
                  className="cursor-pointer flex items-center justify-between"
                  onClick={() => toggleExpand(order._id)}
                >
                  <div>
                    <p className="lg:text-xl text-md font-semibold text-gray-700">
                      Order ID: {order.orderId}
                    </p>
                    <p className="text-gray-600">
                      Order Date: {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-6  ">
                    <p className="hidden sm:flex">
                      <span
                        className={`text-gray-600 font-extrabold text-md p-2  ${
                          order.orderStatus === "Order Canceled"
                            ? "text-red-500 bg-red-100  rounded"
                            : "text-green-500 bg-green-100 rounded"
                        }`}
                      >
                        {order.orderStatus}
                      </span>
                    </p>

                    {/* Expand/Collapse Icon */}
                    {isExpanded ? (
                      <FiChevronUp className="text-2xl text-gray-600" />
                    ) : (
                      <FiChevronDown className="text-2xl text-gray-600" />
                    )}
                  </div>
                </div>

                {/* Display expanded details if the order is expanded */}
                {isExpanded && (
                  <div className="mt-4 transition-all duration-300 ease-in-out">
                    {/* Additional Details */}
                    <p className="text-gray-600 lg:text-md ">
                      Booked By: {order.userId?.name} (ID: {order.userId?.accountId})
                    </p>
                    <p className="text-gray-600">
                      Rental Post: {order.postId?.postType}
                    </p>
                    <p className="text-gray-600">
                      Location: {order.postId?.location}
                    </p>
                    <p className="text-gray-600">
                      Price: Rs.{order.postId?.price}
                    </p>
                    {/* View Order Button */}
                    <button
                      className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-sm"
                      onClick={() => setSelectedOrder(order)} // Open popup to view order details
                    >
                      View Order
                    </button>
                  </div>
                )}
              </div>
            );
          })}

          {/* View More Button */}
          {visibleOrders < filteredOrders.length && (
            <button
              className="bg-gray-800 text-white px-4 w-32 py-2 mt-4 rounded-md"
              onClick={handleViewMore}
            >
              View More
            </button>
          )}
        </div>
      ) : (
        <p>{error && <p className="text-red-500">{error}</p>}</p>
      )}

      {/* Render OrderPopup component */}
      {selectedOrder && (
        <ReceivedOrder
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)} // Close popup
        />
      )}
    </div>
  );
};

export default MyBookedOrders;
