import React from 'react';
import { Navigate } from 'react-router-dom';

// Route protection component to prevent unauthorized access
const ProtectedRoute = ({ children, user, allowedRoles = [] }) => {
  // If no user, redirect to login
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // If roles specified and user doesn't have required role, redirect to home
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    console.warn(`Access denied: User role '${user.role}' not in allowed roles:`, allowedRoles);
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;