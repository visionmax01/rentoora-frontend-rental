import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { FaSpinner, FaEnvelope } from 'react-icons/fa';
import Api from '../utils/Api.js';
import Mainlogo from '../assets/img/Main_logo.png';

const ForgotPassword = ({ onOtpSent }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendOTPHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (!email) {
      toast.error("Please enter an email address!");
      setIsLoading(false);
      return;
    }
    try {
      const response = await Api.post('auth/send-otp', { email });
      toast.success(response.data.message);
      onOtpSent(email); 
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative h-screen flex flex-col justify-center bg-gray-100 ">
      <div className="sm:mx-auto sm:w-full sm:max-w-md mx-2 relative">
        <div className="bg-white rounded-xl p-8 shadow-md">
          <img src={Mainlogo} className="h-12 mx-auto mb-2" alt="Rentoora logo" />
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Forgot Password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your email to receive a password reset OTP
          </p>
        </div>
      </div>

      <div className="-mt-6 z-30 pb-12 sm:mx-auto sm:w-full sm:max-w-md p-4">
        <div className="bg-white py-8 px-4 shadow-md rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={sendOTPHandler}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full pl-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <FaSpinner className="animate-spin h-5 w-5 mr-3" />
                    <span>Sending OTP...</span>
                  </>
                ) : (
                  'Send OTP'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
