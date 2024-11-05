import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Api from '../utils/Api.js';
import Mainlogo from '../assets/img/Main_logo.png';

const ResetPassword = ({ email }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const resetPasswordHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate that both passwords match
    if (newPassword !== confirmPassword) {
      toast.error("Both Password do not match");
      setIsLoading(false);
      return;
    }

    try {
      const response = await Api.post('auth/reset-password', { email, newPassword });
      toast.success(response.data.message);
      navigate('/client-login');

    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <center><img src={Mainlogo} alt="" className="h-12" /></center>
      
    <form onSubmit={resetPasswordHandler} className="p-6 max-w-lg mx-auto bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-6">Reset Password</h2>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="newPassword">
          Enter your new password
        </label>
        <input
          id="newPassword"
          type="password"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="New password"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
          Confirm your new password
        </label>
        <input
          id="confirmPassword"
          type="password"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm password"
          required
        />
      </div>
      <button
        type="submit"
        className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        disabled={isLoading}
      >
        {isLoading ? 'Resetting Password...' : 'Reset Password'}
      </button>
    </form>
    </>
  );
};

export default ResetPassword;
