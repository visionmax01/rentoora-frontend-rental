import React, { useState, useEffect, createRef } from 'react';
import { toast } from 'react-toastify';
import { FaSpinner } from 'react-icons/fa';
import Api from '../utils/Api.js';
import Mainlogo from '../assets/img/Main_logo.png';

const OtpPage = ({ email, onOtpVerified }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingr, setIsLoadingr] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const inputRefs = Array(6).fill().map(() => createRef());

  useEffect(() => {
    inputRefs[0].current.focus();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleInputChange = (e, index) => {
    const value = e.target.value;
    if (/^\d?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < 5) {
        inputRefs[index + 1].current.focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      if (otp[index] === '' && index > 0) {
        inputRefs[index - 1].current.focus();
      }
    } else if (/\d/.test(e.key) && index < 5 && e.target.value.length === 1) {
      inputRefs[index + 1].current.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    const digits = pastedData.split('').filter(d => /^\d$/.test(d)).slice(0, 6);
    const newOtp = [...otp];
    digits.forEach((digit, i) => {
      if (i < 6) {
        newOtp[i] = digit;
      }
    });
    setOtp(newOtp);
    if (digits.length > 0 && digits.length < 6) {
      inputRefs[digits.length].current.focus();
    }
  };

  const verifyOTPHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const otpString = otp.join('');
    try {
      const response = await Api.post('auth/verify-otp', { email, otp: otpString });
      toast.success(response.data.message);
      onOtpVerified();
    } catch (error) {
      console.error('Error verifying OTP:', error);
      toast.error(error.response?.data?.message || 'Invalid OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const resendOtpHandler = async () => {
    setIsLoadingr(true);
    try {
      await Api.post('auth/send-otp', { email });
      setCountdown(60);
      toast.success('OTP resent to your email');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setIsLoadingr(false);
    }
  };

  return (
    <div className="relative h-screen flex flex-col justify-center bg-gray-100">
      <div className="sm:mx-auto sm:w-full sm:max-w-md mx-2 relative">
        <div className="bg-white rounded-xl p-8 shadow-md">
          <img src={Mainlogo} className="h-12 mx-auto mb-2" alt="Rentoora logo" />
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Verify OTP
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter the OTP sent to {email}
          </p>
        </div>
      </div>

      <div className="-mt-6 z-30 pb-12 sm:mx-auto sm:w-full sm:max-w-md p-4">
        <div className="bg-white py-8 px-4 shadow-md rounded-lg sm:px-10">
          <form onSubmit={verifyOTPHandler} className="space-y-6">
            <div className="flex justify-between">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  className="w-12 h-12 text-center text-xl border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  value={digit}
                  onChange={(e) => handleInputChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onPaste={handlePaste}
                  ref={inputRefs[index]}
                  onFocus={() => inputRefs[index].current.select()}
                />
              ))}
            </div>
            <div>
              <button
                type="submit"
                className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <FaSpinner className="animate-spin h-5 w-5 mr-3" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  'Verify OTP'
                )}
              </button>
            </div>
          </form>
          <div className="mt-4 text-center">
            {countdown > 0 ? (
              <p className="text-sm text-gray-600">
                Resend OTP in {Math.floor(countdown / 60)}:{('0' + (countdown % 60)).slice(-2)}
              </p>
            ) : (
              <button
                onClick={resendOtpHandler}
                disabled={isLoadingr}
                className="text-sm text-indigo-600 hover:text-indigo-500"
              >
                {isLoadingr ? (
                  <>
                    <FaSpinner className="animate-spin h-4 w-4 mr-2 inline" />
                    <span>Sending OTP...</span>
                  </>
                ) : (
                  'Resend OTP'
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtpPage;
