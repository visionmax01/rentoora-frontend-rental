import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles }) => {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/client-login" replace state={{ message: 'Please log in to access this page.' }} />;
  }

  try {
    const { role } = JSON.parse(atob(token.split('.')[1])); 

    if (allowedRoles.includes(role)) {
      return <Outlet />;
    } else {
      return <Navigate to="/client-login" replace state={{ message: 'You do not have permission to access this page .' }} />;
    }
  } catch (error) {
    console.error("Error decoding token:", error);
    return <Navigate to="/client-login" replace state={{ message: 'Invalid session, please log in again.' }} />;
  }
};

export default ProtectedRoute;
