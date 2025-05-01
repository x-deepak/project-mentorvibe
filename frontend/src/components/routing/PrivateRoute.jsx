// src/components/routing/PrivateRoute.js
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

// Component to protect routes that require authentication
const PrivateRoute = ({ children, isMentorRoute = false, isLearnerRoute = false }) => {
  const { isAuthenticated, loading, isMentor, openLoginModal } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  // If not authenticated, redirect to home and open login modal
  if (!isAuthenticated) {
    openLoginModal();
    return <Navigate to="/" />;
  }

  // For mentor-specific routes, check if user is a mentor
  if (isMentorRoute && !isMentor) {
    return <Navigate to="/learner/dashboard" />;
  }

  // For learner-specific routes, ensure the user is not a mentor
  if (isLearnerRoute && isMentor) {
    return <Navigate to="/mentor/dashboard" />;
  }

  return children;
};

export default PrivateRoute;