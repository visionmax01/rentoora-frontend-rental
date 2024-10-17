// BookedOrder.js
import React from "react";
import { Link } from "react-router-dom";

const BookedOrder = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold text-green-600">Booking Successful!</h1>
      <p className="text-lg text-gray-700 mt-2">
        Your order has been successfully placed.
      </p>
      <Link to="/client-dashboard" className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">
        View My Orders
      </Link>
    </div>
  );
};

export default BookedOrder;
