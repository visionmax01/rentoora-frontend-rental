import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import getLoggedInUserId from "../utils/getLoggedInUserId.jsx"; // Import the utility function

function OrderPopup({ order, onClose }) {
  const [isLoading, setIsLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(""); // State for the preview image

  // Handle cancellation of the order
  const handleCancelOrder = async () => {
    if (window.confirm("Are you sure you want to cancel this order?")) {
      setIsLoading(true);

      try {
        const token = localStorage.getItem("token");
        const userId = getLoggedInUserId(); // Get the logged-in user ID

        if (!userId) {
          toast.error("Failed to retrieve user ID.");
          return; // Exit if user ID could not be retrieved
        }

        await axios.put(
          `https://rentoora-backend-rental.onrender.com/order/orders/${order._id}/cancel`,
          {
            canceledById: userId, // Only send the user ID
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        toast.success("Order canceled successfully!");
        onClose(); // Close the popup after successful cancellation
      } catch (error) {
        toast.error("Failed to cancel the order");
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Set the preview image to the first image when the component mounts
useEffect(() => {
  if (order.postId?.images && order.postId.images.length > 0) {
    // Use the image URL directly from Cloudinary without prepending the local server URL
    setPreviewImage(order.postId.images[0]); // Assuming images are stored as full URLs
  }
}, [order]);

// Function to handle thumbnail click
const handleThumbnailClick = (image) => {
  setPreviewImage(image); // Use the image URL directly
};


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 text-black">
      <div className="relative mx-2   lg:w-3/4">
        <div className="bg-white overflow-y-auto h-[650px]  rounded-lg shadow-lg p-6  lg:flex gap-4">
          {/* Image Section */}
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
                    <td>
                      <strong>Owner Name:</strong>
                    </td>
                    <td>{order.postId?.clientId?.name || "No data found"}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Owner Mobile No:</strong>
                    </td>
                    <td>
                      {order.postId?.clientId?.phoneNo || "No data found"}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Payment Method:</strong>
                    </td>
                    <td className="text-red-700 text-md font-semibold">
                      {order.paymentMethod || "No data found"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Order Details Section */}
          <div className="flex-grow mt-4">
            <h2 className="text-xl font-bold mb-4">Order Details</h2>

            {/* Description Section */}
            <div className="mb-4">
              <strong>Description:</strong>
              {order.postId?.description ? (
                <ul className="list-disc list-inside ml-2">
                  {order.postId.description
                    .split(",")
                    .map((sentence, index) => (
                      <li key={index}>{sentence.trim()}</li>
                    ))}
                </ul>
              ) : (
                <p>No description available</p>
              )}
            </div>

            {/* Order Details Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-1.5 text-left">
                      #
                    </th>
                    <th className="border border-gray-300 px-4 py-1.5 text-left">
                      Details
                    </th>
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
                    <td className="border border-gray-300  lg:px-4 px-1 py-1.5">
                      {order.postId?.address ? (
                        <div className=" text-[14px]">
                          <div>Province: {order.postId.address.province}</div>
                          <div>District: {order.postId.address.district}</div>
                          <div>
                            Municipality: {order.postId.address.municipality}
                          </div>
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
                            hour12: true, // Use 12-hour format
                          }).format(new Date(order.createdAt))
                        : "No data found"}
                    </td>
                  </tr>
                  {order.orderStatus === "Order Canceled" && (
                    <tr>
                      <td className="border border-gray-300 px-4 py-1.5">
                        <strong className="text-sm lg:text-md">
                          CanceledBy:
                        </strong>
                      </td>
                      <td
                        className={`border border-gray-300 font-bold lg:px-4 px-1 text-sm lg:text-md py-1.5 text-red-600`}
                      >
                        {order.canceledBy || "No name found"} (ID:{" "}
                        {order.canceledAccountId || "No data found"})
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Cancel Order Button */}
            <div className="mt-6">
              <button
                className={`text-white px-4 py-1.5 rounded-sm ${
                  isLoading || order.orderStatus === "Order Canceled"
                    ? "bg-red-500 bg-opacity-50 cursor-not-allowed"
                    : "bg-red-500"
                }`}
                onClick={handleCancelOrder}
                disabled={isLoading || order.orderStatus === "Order Canceled"} // Disable if loading or order is canceled
              >
                {isLoading
                  ? "Cancelling..."
                  : order.orderStatus === "Order Canceled"
                  ? "Order Cancelled"
                  : "Cancel Order"}
              </button>
            </div>
          </div>
          {/* Close button */}
          <button
            className="absolute top-0 right-0 px-2 py-1 font-extrabold bg-gray-300 text-gray-500 hover:text-gray-800"
            onClick={onClose}
          >
            X
          </button>

          <div
            className={`absolute top-2 left-2 rounded-md p-2 font-extrabold ${
              order.orderStatus === "Order Canceled"
                ? "bg-red-100"
                : "bg-green-200"
            }`}
          >
            <span
              className={`${
                order.orderStatus === "Order Canceled"
                  ? "text-red-600"
                  : "text-green-600"
              }`}
            >
              {order.orderStatus || "No data found"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderPopup;
