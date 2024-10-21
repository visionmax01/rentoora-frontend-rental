import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles, redirectPath }) => {
  const token = localStorage.getItem('token');

  if (!token) {
    // If no token, redirect to login
    return <Navigate to="/client-login" replace state={{ message: 'Please log in to access this page.' }} />;
  }

  try {
    // Decode the JWT token (you might need to adjust based on your JWT structure)
    const decodedToken = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000); // Get current time in seconds

    // Check if the token has expired
    if (decodedToken.exp < currentTime) {
      // If expired, remove the token and redirect to login with an expiration message
      localStorage.removeItem('token');
      return <Navigate to="/client-login" replace state={{ message: 'Token expired, please log in again.' }} />;
    }

    // If role is in allowedRoles, allow access to the route
    if (allowedRoles.includes(decodedToken.role)) {
      return <Outlet />;
    }

    // If role doesn't match, redirect based on the role
    if (decodedToken.role === 1) {
      // If admin, redirect to admin dashboard
      return <Navigate to="/admin-dashboard" replace />;
    }

    // If client, redirect to client dashboard
    return <Navigate to={redirectPath} replace />;
  } catch (error) {
    console.error("Error decoding token:", error);

    // If there's an issue decoding the token, remove it and redirect to login
    localStorage.removeItem('token');
    return <Navigate to="/client-login" replace state={{ message: 'Invalid session, please log in again.' }} />;
  }
};

export default ProtectedRoute;
