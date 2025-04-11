// src/components/auth/GoogleAuthSuccess.js
import React, { useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const GoogleAuthSuccess = () => {
  const { handleGoogleAuthSuccess } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const processGoogleAuth = async () => {
      // Get token and role from URL params
      const params = new URLSearchParams(location.search);
      const token = params.get('token');
      const role = params.get('role');
      
      if (token) {
        await handleGoogleAuthSuccess(token);
        
        // Redirect based on role
        if (role === 'mentor') {
          navigate('/mentor/dashboard');
        } else {
          navigate('/dashboard');
        }
      } else {
        navigate('/');
      }
    };
    
    processGoogleAuth();
  }, [location, handleGoogleAuthSuccess, navigate]);

  return (
    <div className="google-auth-success">
      <div className="loading-container">
        <h2>Processing your authentication...</h2>
        <div className="loading-spinner"></div>
      </div>
    </div>
  );
};

export default GoogleAuthSuccess;