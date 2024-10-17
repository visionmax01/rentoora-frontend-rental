// src/utils/axiosInstance.js
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:7000', // Replace with your base URL
});

// This function checks if the token is expired
const isTokenExpired = (token) => {
    if (!token) return true; // No token means expired
    const payload = token.split('.')[1];
    if (!payload) return true;
    const decodedPayload = JSON.parse(atob(payload));
    const currentTime = Date.now() / 1000; // Get current time in seconds
    return decodedPayload.exp < currentTime; // Check if expired
};

// Add a request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');

        if (isTokenExpired(token)) {
            // If the token is expired, remove it and redirect to the login page
            localStorage.removeItem('token');
            localStorage.removeItem('userRole');
            window.location.href = '/client-login'; // Redirect to login page
            return Promise.reject(new Error('Token expired')); // Reject the request
        }

        // Add Authorization header
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;
