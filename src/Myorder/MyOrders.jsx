import React, { useEffect, useState } from "react";
import Api from '../utils/Api.js'
import OrderPopup from "./OrderPopup";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [expandedOrderId, setExpandedOrderId] = useState(null); 
  const [selectedOrder, setSelectedOrder] = useState(null); 
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState("All"); 
  const [displayedOrders, setDisplayedOrders] = useState([]);
  const [ordersPerPage, setOrdersPerPage] = useState(5); 
  const [noDataMessage, setNoDataMessage] = useState(""); 

  // Fetch orders from the server
  const fetchOrders = async () => {
    const userId = localStorage.getItem("userId"); 
    const token = localStorage.getItem("token"); 

    if (!token || !userId) {
      setError("User not authenticated. Please log in again.");
      return;
    }

    try {
      const response = await Api.get(
        "order/user-orders",
        {
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
      setDisplayedOrders(sortedOrders.slice(0, ordersPerPage)); // Display the first set of orders
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching orders");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Filter orders by status
  const filterOrders = (status) => {
    setFilterStatus(status); 
    let filteredOrders;

    if (status === "Booked") {
      filteredOrders = orders.filter(
        (order) => order.orderStatus !== "Order Canceled"
      );
    } else if (status === "Canceled") {
      filteredOrders = orders.filter(
        (order) => order.orderStatus === "Order Canceled"
      );
    } else {
      filteredOrders = orders; // Show all orders
    }

    setDisplayedOrders(filteredOrders.slice(0, ordersPerPage)); 

    // Set no data message based on filtered orders
    if (filteredOrders.length === 0) {
      setNoDataMessage(
        status === "All" 
          ? "No Confirmed or Canceled Orders Found."
          : status === "Booked" 
            ? "No booked orders available."
            : "No canceled orders available."
      );
    } else {
      setNoDataMessage("");
    }
  };
  const toggleExpand = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  // Handle "View More" to show more orders
  const handleViewMore = () => {
    const nextSetOfOrders = displayedOrders.length + ordersPerPage;
    let filteredOrders = orders;

    if (filterStatus === "Booked") {
      filteredOrders = orders.filter(
        (order) => order.orderStatus !== "Order Canceled"
      );
    } else if (filterStatus === "Canceled") {
      filteredOrders = orders.filter(
        (order) => order.orderStatus === "Order Canceled"
      );
    }

    setDisplayedOrders(filteredOrders.slice(0, nextSetOfOrders));
  };

  // Check if there are more orders to load
  const hasMoreOrders = () => {
    let filteredOrders = orders;

    if (filterStatus === "Booked") {
      filteredOrders = orders.filter(
        (order) => order.orderStatus !== "Order Canceled"
      );
    } else if (filterStatus === "Canceled") {
      filteredOrders = orders.filter(
        (order) => order.orderStatus === "Order Canceled"
      );
    }

    return displayedOrders.length < filteredOrders.length; 
  };

  return (
    <div className="min-h-screen bg-gray-100 lg:p-6 ">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 ml-2">My Orders</h1>

      {/* Filter Buttons */}
      <div className="flex lg:gap-4 gap-2 mb-6 px-2">
        <button
          className={`lg:px-4 lg:py-2 text-md px-2 rounded-md ${
            filterStatus === "All"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
          onClick={() => filterOrders("All")}
        >
          All Orders
        </button>
        <button
          className={`lg:px-4 lg:py-2 text-md px-2 rounded-md ${
            filterStatus === "Booked"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
          onClick={() => filterOrders("Booked")}
        >
          Booked Orders
        </button>
        <button
          className={`lg:px-4 lg:py-2 text-md px-2 rounded-md ${
            filterStatus === "Canceled"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
          onClick={() => filterOrders("Canceled")}
        >
          Canceled Orders
        </button>
      </div>

      {/* Display orders or no data message */}
      {noDataMessage && (
        <p className="text-red-500 font-semibold mb-4 ml-2">{noDataMessage}</p>
      )}

      {displayedOrders.length > 0 ? (
        <div className="w-full flex flex-col gap-10 px-2">
          {displayedOrders.map((order) => {
            const isExpanded = expandedOrderId === order._id;

            return (
              <div
                key={order._id}
                className="bg-white relative shadow-md rounded-lg p-6"
              >
                {/* Basic Details - Order ID and Date */}
                <div
                  className="cursor-pointer flex items-center justify-between"
                  onClick={() => toggleExpand(order._id)} // Toggle expand on click
                >
                  <div>
                    <p className="lg:text-xl text-sm font-semibold text-gray-700">
                      Order ID: {order.orderId}
                    </p>
                    <p className="text-gray-600">
                      {order.createdAt
                        ? new Intl.DateTimeFormat("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true, // Use 12-hour format
                          }).format(new Date(order.createdAt))
                        : "No data found"}
                    </p>
                  </div>

                  <div className="flex lg:gap-8">
                    {/* Display Order Status */}
                    {/* for small device  */}
                    <div
                      className={`absolute top-0 lg:hidden left-0 px-2 rounded  ${
                        order.orderStatus === "Order Canceled"
                          ? "bg-red-200"
                          : "bg-green-200"
                      }`}
                    >
                      <div
                        className={`font-bold ${
                          order.orderStatus === "Order Canceled"
                            ? "text-red-600"
                            : "text-green-600"
                        }`}
                      >
                        {order.orderStatus || "No data found"}
                      </div>
                    </div>

                    {/* for biger device  */}
                    <div
                      className={`sm:flex p-2 rounded-lg hidden ${
                        order.orderStatus === "Order Canceled"
                          ? "bg-red-200"
                          : "bg-green-200"
                      }`}
                    >
                      <div
                        className={`font-bold ${
                          order.orderStatus === "Order Canceled"
                            ? "text-red-600"
                            : "text-green-600"
                        }`}
                      >
                        {order.orderStatus || "No data found"}
                      </div>
                    </div>
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
                    {/* Display Post Image */}
                    {order.postId &&
                      order.postId.images &&
                      order.postId.images.length > 0 && (
                        <img
                          src={order.postId.images[0]} // Adjust this based on your server path
                          alt={`Post ${order.postId.title}`}
                          className="w-full h-40 object-cover rounded-md mb-4"
                        />
                      )}

                    {/* Display Post Details */}
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">
                      {order.postId
                        ? `Post Type: ${order.postId.postType}`
                        : "Post details not available"}
                    </h3>
                   

                    {/* Display Order Details */}
                    <div className="mt-4">
                      <p className="text-gray-600 lg:text-md text-sm">
                        <strong>Payment Method:</strong> {order.paymentMethod}
                      </p>
                      <div className="flex items-center">
                        <div className="font-bold text-sm lg:text-md  text-black">Order On:</div>
                        <div className="text-black">
                          {order.createdAt
                            ? new Intl.DateTimeFormat("en-GB", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true, // Use 12-hour format
                              }).format(new Date(order.createdAt))
                            : "No data found"}
                        </div>
                      </div>
                    </div>

                    {/* View Order Button Only */}
                    <div className="mt-6">
                      <button
                        className="bg-blue-500 text-white px-4 py-2 rounded-sm"
                        onClick={() => setSelectedOrder(order)} // Open popup to view order details
                      >
                        View Order
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* View More Button */}
          {hasMoreOrders() && (
            <button
              className="bg-gray-800 text-white px-4 w-32 py-2 mt-4 rounded-md mb-6 "
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
        <OrderPopup
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
};

export default MyOrders;
