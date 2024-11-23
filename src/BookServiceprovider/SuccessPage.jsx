import React from 'react';
import success from '../assets/gif/success-mesage-gif.gif'
import { Link } from 'react-router-dom';
const SuccessPage = () => {
  return (
    <div className="text-center px-2 sm:px-0 mt-8 flex justify-center items-center flex-col lg:w-3/4" >
      <img src={success}  className="w-44 h-36" alt="" />
      <h2 className="text-3xl font-semibold">Booking Successful!</h2>
      <p className="mt-4 text-lg">Your booking has been confirmed once provoder recieved your booking.<br/> You will receive an email with the details shortly.</p>
      <Link className="px-4 py-1 bg-gray-500 hover:bg-gray-600 text-white rounded mt-6" to='/'>Back to Home</Link>
    </div>
  );
};

export default SuccessPage;
