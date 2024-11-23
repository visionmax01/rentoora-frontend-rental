import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Mainlogo from '../assets/img/Main_logo.png';
import { FaSpinner, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaHome } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Api from '../utils/Api.js'

const Login = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const message = location.state?.message || ''; // If there's a message from redirected page

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/client-dashboard'); // Redirect if user is already logged in
    }

    if (message) {
      toast.error(message); // Display error message from previous page
    }
  }, [navigate, message]);

  // Form submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Updated to match backend's expected parameter name
      const response = await Api.post('auth/login', { 
        emailOrAccountId: identifier, // Changed from identifier to emailOrAccountId
        password 
      });

      const { token, result, redirectUrl } = response.data;

      if (token && result?.userId) {
        localStorage.setItem('token', token);
        localStorage.setItem('userId', result.userId);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        // Use the redirectUrl from the backend response
        navigate(redirectUrl);
      } else {
        setError('Invalid response from server.');
      }
    } catch (error) {
      console.error('Error:', error);
      // More specific error handling based on backend responses
      if (error.response?.status === 404) {
        setError('User not found. Please check your email or account ID.');
      } else if (error.response?.status === 400) {
        setError('Invalid password. Please try again.');
      } else {
        setError(error.response?.data?.message || 'An error occurred during login.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-100">
      <div className="absolute top-4 left-4">
        <Link 
          to="/" 
          className="flex items-center justify-center p-3 rounded-full hover:bg-gray-200 transition-colors"
          title="Go to Home"
        >
          <FaHome className="h-6 w-6 text-gray-600 hover:text-gray-800" />
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md mx-2 relative">
        <div className="bg-white rounded-xl p-8 shadow-md">
          <img src={Mainlogo} className="h-12 mx-auto mb-2" alt="Rentoora logo" />
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Welcome Back!
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your credentials to access your account
          </p>
        </div>
      </div>

      <div className="-mt-6  z-30 pb-12 sm:mx-auto sm:w-full sm:max-w-md p-4">
        <div className="bg-white py-8 px-4 shadow-md  rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && <p className="text-red-500 text-sm bg-red-50 p-2 rounded">{error}</p>}
            <div>
              <label htmlFor="identifier" className="block text-sm font-medium text-gray-700">
                Email or Account ID
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="identifier"
                  name="identifier"
                  type="text"
                  autoComplete="username"
                  required
                  placeholder="Enter your email or account ID"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="appearance-none block w-full pl-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full pl-10 pr-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <FaEyeSlash className="h-5 w-5 text-gray-400" />
                  ) : (
                    <FaEye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              <div className="text-right mt-1">
                <Link to="/reset-pass" className="text-red-600 text-right hover:underline">Forget Password?</Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin h-5 w-5 mr-3" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  'Sign in'
                )}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <Link
              to="/register"
              className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium cursor-pointer hover:bg-gray-50 hover:text-indigo-700 hover:border-indigo-700 text-gray-700"
            >
              Create a new account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
