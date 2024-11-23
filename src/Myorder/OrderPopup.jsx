import React, { useState, useEffect } from "react";
import Api from '../utils/Api.js';
import { toast } from "react-toastify";
import getLoggedInUserId from "../utils/getLoggedInUserId.jsx";

function OrderPopup({ order, onClose, onOrderUpdate }) {
  const [isLoading, setIsLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [orderDetails, setOrderDetails] = useState(order);

  const handleCancelOrder = async () => {
    if (window.confirm("Are you sure you want to cancel this order?")) {
      setIsLoading(true);

      try {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");
        const userName = localStorage.getItem("userName");

        if (!userId) {
          toast.error("Failed to retrieve user ID.");
          return;
        }

        await Api.put(
          `order/orders/${order._id}/cancel`,
          { canceledById: userId },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setOrderDetails({
          ...orderDetails,
          orderStatus: "Order Canceled",
          canceledBy: userName,
          canceledAccountId: userId
        });
        
        onOrderUpdate(order._id);
        toast.success("Order canceled successfully!");
      } catch (error) {
        console.error("Failed to cancel the order:", error);
        toast.error("Failed to cancel the order");
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    if (order.postId?.images && order.postId.images.length > 0) {
      setPreviewImage(order.postId.images[0]);
    }
  }, [order]);

  const handleThumbnailClick = (image) => {
    setPreviewImage(image);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 text-black">
      <div className="relative mx-2 lg:w-3/4">
        <div className="bg-white overflow-y-auto h-[650px] rounded-lg shadow-lg p-6 lg:flex gap-4">
          <div className="flex-none lg:w-1/2 pr-4">
            {previewImage ? (
              <img
                src={previewImage}
                alt="Main Preview"
                className="w-full lg:h-80 h-44 object-cover rounded-md border border-gray-200 mb-4"
              />
            ) : (
              <p>No preview available</p>
            )}
            <h3 className="text-lg font-semibold mb-2">Images</h3>
            <div className="flex flex-wrap gap-2">
              {order.postId?.images && order.postId.images.length > 0 ? (
                order.postId.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Post Image ${index + 1}`}
                    className="w-12 h-12 object-cover rounded-md border border-gray-200 cursor-pointer"
                    onClick={() => handleThumbnailClick(image)}
                  />
                ))
              ) : (
                <p>No images available</p>
              )}
            </div>
            <div className="lg:mt-12 mt-2 text-sm">
              <table>
                <tbody>
                  <tr>
                    <td><strong>Owner Name:</strong></td>
                    <td>{order.postId?.clientId?.name || "No data found"}</td>
                  </tr>
                  <tr>
                    <td><strong>Owner Mobile No:</strong></td>
                    <td>{order.postId?.clientId?.phoneNo || "No data found"}</td>
                  </tr>
                  <tr>
                    <td><strong>Payment Method:</strong></td>
                    <td className="text-red-700 text-md font-semibold">
                      {order.paymentMethod || "No data found"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="flex-grow mt-4">
            <h2 className="text-xl font-bold mb-4">Order Details</h2>
            <div className="mb-4">
              <strong>Description:</strong>
              {order.postId?.description ? (
                <ul className="list-disc list-inside ml-2">
                  {order.postId.description.split(",").map((sentence, index) => (
                    <li key={index}>{sentence.trim()}</li>
                  ))}
                </ul>
              ) : (
                <p>No description available</p>
              )}
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-1.5 text-left">#</th>
                    <th className="border border-gray-300 px-4 py-1.5 text-left">Details</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 lg:px-4 px-1 py-1.5">
                      <strong>Order ID:</strong>
                    </td>
                    <td className="border border-gray-300 lg:px-4 px-1 py-1.5">
                      {order.orderId || "No data found"}
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 lg:px-4 px-1 py-1.5">
                      <strong>Post Type:</strong>
                    </td>
                    <td className="border border-gray-300 lg:px-4 px-1 py-1.5">
                      {order.postId?.postType || "No data found"}
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 lg:px-4 px-1 py-1.5">
                      <strong>Address:</strong>
                    </td>
                    <td className="border border-gray-300 lg:px-4 px-1 py-1.5">
                      {order.postId?.address ? (
                        <div className="text-[14px]">
                          <div>Province: {order.postId.address.province}</div>
                          <div>District: {order.postId.address.district}</div>
                          <div>Municipality: {order.postId.address.municipality}</div>
                          <div>Landmark: {order.postId.address.landmark}</div>
                        </div>
                      ) : (
                        "No data found"
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 lg:px-4 px-1 py-1.5">
                      <strong>Order On:</strong>
                    </td>
                    <td className="border border-gray-300 lg:px-4 px-1 py-1.5">
                      {order.createdAt
                        ? new Intl.DateTimeFormat("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          }).format(new Date(order.createdAt))
                        : "No data found"}
                    </td>
                  </tr>
                  {orderDetails.orderStatus === "Order Canceled" && (
                    <tr>
                      <td className="border border-gray-300 px-4 py-1.5">
                        <strong className="text-sm lg:text-md">Canceled By:</strong>
                      </td>
                      <td className="border border-gray-300 font-bold lg:px-4 px-1 text-sm lg:text-md py-1.5 text-red-600">
                        {orderDetails.canceledBy || "No name found"} (ID: {orderDetails.canceledAccountId || "No data found"})
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="mt-6">
              <button
                className={`text-white px-4 py-1.5 rounded-sm ${
                  isLoading || orderDetails.orderStatus === "Order Canceled"
                    ? "bg-red-500 bg-opacity-50 cursor-not-allowed"
                    : "bg-red-500"
                }`}
                onClick={handleCancelOrder}
                disabled={isLoading || orderDetails.orderStatus === "Order Canceled"}
              >
                {isLoading
                  ? "Cancelling..."
                  : orderDetails.orderStatus === "Order Canceled"
                  ? "Order Cancelled"
                  : "Cancel Order"}
              </button>
            </div>
          </div>
          <button
            className="absolute top-0 right-0 px-2 py-1 font-extrabold bg-gray-300 text-gray-500 hover:text-gray-800"
            onClick={onClose}
          >
            X
          </button>
          <div
            className={`absolute top-2 left-2 rounded-md p-2 font-extrabold ${
              orderDetails.orderStatus === "Order Canceled" ? "bg-red-100" : "bg-green-200"
            }`}
          >
            <span className={`${
              orderDetails.orderStatus === "Order Canceled" ? "text-red-600" : "text-green-700"
            }`}>
              {orderDetails.orderStatus || "No status available"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderPopup;
