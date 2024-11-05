import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Mainlogo from '../assets/img/Main_logo.png';
import Mainlogo1 from '../assets/img/rentoora_logo_en.png';
import { FaSpinner } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import Api from '../utils/Api.js'

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
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
    setError(''); // Clear previous errors

    try {
      // Send login request to the server
      const response = await Api.post('auth/login', { email, password });
      console.log('Response from server:', response.data);

      const { token, result } = response.data;
      const { role } = result;

      // If token and user ID exist in response, store them and set authorization headers
      if (token && result?.userId) {
        localStorage.setItem('token', token);
        localStorage.setItem('userId', result.userId);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        // Role-based navigation: redirect to appropriate dashboard
        if (role === 1) {
          navigate('/admin-dashboard');
        } else {
          navigate('/');
        }
      } else {
        setError('Invalid response from server.');
      }
    } catch (error) {
      console.log('Error:', error);
      setError(error.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false); // Stop loading spinner
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <img src={Mainlogo1} className="h-12 m-auto rounded-lg" alt="Main logo" />
        <img src={Mainlogo} className="h-12 m-auto" alt="Rentoora logo" />
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
      </div>

      <div className="pb-12 mt-4 sm:mx-auto sm:w-full sm:max-w-md p-4">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && <p className="text-red-500 text-sm bg-red-50 p-2 rounded">{error}</p>}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div className="text-right mt-1">
                <Link to="/reset-pass" className="text-red-700 text-right hover:underline">Forget Password?</Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium cursor-pointer hover:text-opacity-85 text-indigo-600 bg-white hover:bg-gray-50"
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
