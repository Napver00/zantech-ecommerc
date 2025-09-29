import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, token } = useAuth();

  if (!token || !user) {
    // Redirect them to the home page, but save the current location they were
    // trying to go to. This is optional, but a good UX practice.
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;