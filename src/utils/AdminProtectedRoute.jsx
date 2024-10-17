import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const AdminProtectedRoute = ({ allowedRoles }) => {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/client-login" replace state={{ message: 'Please log in to access admin features.' }} />;
  }

  try {
    const { role } = JSON.parse(atob(token.split('.')[1])); // Decoding the token

    // If the role is admin (role 1), allow access to the route
    if (allowedRoles.includes(role)) {
      return <Outlet />;
    } else {
      return <Navigate to="/client-login" replace state={{ message: ' only admin has access to this page.' }} />;
    }
  } catch (error) {
    console.error("Error decoding token:", error);
    return <Navigate to="/client-login" replace state={{ message: 'Invalid session, please log in again.' }} />;
  }
};

export default AdminProtectedRoute;
