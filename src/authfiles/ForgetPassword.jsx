import { useState } from 'react';
import toast from 'react-hot-toast';
import Api from '../utils/Api.js';
import Mainlogo from '../assets/img/Main_logo.png';

const ForgotPassword = ({ onOtpSent }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendOTPHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if(!email){
      toast.error("Please give us a Email !")
    }
    try {
      const response = await Api.post('auth/send-otp', { email });
      toast.success(response.data.message);
      onOtpSent(email); // Pass email to parent component
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <center><img src={Mainlogo} alt="" className="h-12" /></center>
      <form onSubmit={sendOTPHandler} className="p-6 max-w-lg mx-auto bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-6">Forgot Password</h2>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
          Enter your email
        </label>
        <input
          id="email"
          type="email"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email address"
        />
      </div>
      <button
        type="submit"
        className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        disabled={isLoading}
      >
        {isLoading ? 'Sending OTP...' : 'Send OTP'}
      </button>
    </form>
    </>
   
  );
};

export default ForgotPassword;
