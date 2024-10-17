import { useState, useEffect, createRef } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';
import Mainlogo from '../assets/img/Main_logo.png';

const OtpPage = ({ email, onOtpVerified }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(60); // 2 minutes countdown
  const inputRefs = Array(6).fill().map(() => createRef()); // Array of refs for input fields

  // Focus the first input on mount
  useEffect(() => {
    inputRefs[0].current.focus(); // Focus the first input field
  }, []);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleInputChange = (e, index) => {
    const value = e.target.value;

    // Allow only digits
    if (/^\d?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value; // Set the current input's value
      setOtp(newOtp);

      // Move focus to next input only if current is filled
      if (value && index < 5) {
        inputRefs[index + 1].current.focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    // Allow backspace to move to previous input
    if (e.key === 'Backspace') {
      if (otp[index] === '' && index > 0) {
        inputRefs[index - 1].current.focus();
      }
    } else if (/\d/.test(e.key) && index < 5) {
      // Move focus to the next input if a digit is entered
      if (e.target.value.length === 1) {
        inputRefs[index + 1].current.focus();
      }
    }
  };

  const handlePaste = (e, index) => {
    const pastedData = e.clipboardData.getData('text');
    const digits = pastedData.split('').filter(d => /^\d$/.test(d)); // Filter out non-digit characters

    // Update OTP state and focus the inputs accordingly
    const newOtp = [...otp];
    digits.forEach((digit, i) => {
      if (i < 6) {
        newOtp[i] = digit;
        // Focus on the next input field if within bounds
        if (i < 5) {
          inputRefs[i + 1].current.focus();
        }
      }
    });

    setOtp(newOtp);
    e.preventDefault(); // Prevent default paste behavior
  };

  const verifyOTPHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const otpString = otp.join(''); // Join the OTP array into a string
    try {
      const response = await axios.post('https://rentoora-backend-rental.onrender.com/auth/verify-otp', { email, otp: otpString });
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
    try {
      await axios.post('https://rentoora-backend-rental.onrender.com/auth/send-otp', { email });
      setCountdown(120); // Reset the countdown
      toast.success('OTP resent to your email');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to resend OTP');
    }
  };

  return (
    <>
    <center><img src={Mainlogo} alt="" className="h-12" /></center>
    <form onSubmit={verifyOTPHandler} className="p-6 max-w-lg mx-auto bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-6">Verify OTP</h2>
      <p className="text-center mb-4">OTP has been sent to <strong>{email}</strong></p>
      <div className="mb-4 flex justify-between">
        {otp.map((digit, index) => (
          <input
            key={index}
            id={`otp-${index}`}
            type="text"
            maxLength="1"
            className="shadow appearance-none border rounded w-12 py-2 px-3 text-gray-700 text-center"
            value={digit}
            onChange={(e) => handleInputChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onPaste={(e) => handlePaste(e, index)} // Handle paste event
            ref={inputRefs[index]}
            onFocus={() => inputRefs[index].current.select()} // Select the input text on focus
          />
        ))}
      </div>
      <button
        type="submit"
        className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        disabled={isLoading}
      >
        {isLoading ? 'Verifying OTP...' : 'Verify OTP'}
      </button>
      <div className="mt-4 text-center">
        {countdown > 0 ? (
          <p>Resend OTP in {Math.floor(countdown / 60)}:{('0' + (countdown % 60)).slice(-2)}</p>
        ) : (
          <button onClick={resendOtpHandler} className="text-blue-500 hover:underline">
            Resend OTP
          </button>
        )}
      </div>
    </form>
    </>
  );
};

export default OtpPage;
