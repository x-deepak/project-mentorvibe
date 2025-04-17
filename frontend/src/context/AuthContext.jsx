// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isMentor, setIsMentor] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  // Load user on initial render
  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setLoading(false);
          return;
        }

        const response = await fetch('/api/auth/me', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          credentials: 'include'
        });

        if (response.ok) {
          const data = await response.json();
          setUser({ ...data.user, token }); // Include token in the user object
          setIsMentor(data.isMentor);
          setIsAuthenticated(true);
        } else {
          // Clear token if invalid
          localStorage.removeItem('token');
        }
      } catch (err) {
        console.error('Error loading user:', err);
        localStorage.removeItem('token');
      }
      
      setLoading(false);
    };

    loadUser();
  }, []);

  // Register user
  const register = async (formData) => {
    try {
      setError(null);
      
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData),
        credentials: 'include'
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }
      
      localStorage.setItem('token', data.token);
      setUser({ ...data.user, token: data.token }); // Include token in the user object
      setIsMentor(data.isMentor);
      setIsAuthenticated(true);
      setIsRegisterModalOpen(false);
      
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  // Login user
  const login = async (formData) => {
    try {
      setError(null);
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData),
        credentials: 'include'
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }
      
      localStorage.setItem('token', data.token);
      setUser({ ...data.user, token: data.token }); // Include token in the user object
      setIsMentor(data.isMentor);
      setIsAuthenticated(true);
      setIsLoginModalOpen(false);
      
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  // Handle Google authentication
  const loginWithGoogle = (role = 'user') => {
    window.location.href = `/api/auth/google?role=${role}`;
  };

  // Handle Google auth success (called by GoogleAuthSuccess component)
  const handleGoogleAuthSuccess = async (token) => {
    try {
      localStorage.setItem('token', token);
console.log('Token set in local storage:', token);
      const response = await fetch('/api/auth/me', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setUser({ ...data.user, token }); // Include token in the user object
        setIsMentor(data.isMentor);
        setIsAuthenticated(true);
      }
    } catch (err) {
      console.error('Error handling Google auth:', err);
    }
  };

  // Logout user
  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'GET',
        credentials: 'include'
      });
    } catch (err) {
      console.error('Logout error:', err);
    }
    
    localStorage.removeItem('token');
    setUser(null);
    setIsMentor(false);
    setIsAuthenticated(false);
  };

  // Modal controls
  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);
  const openRegisterModal = () => setIsRegisterModalOpen(true);
  const closeRegisterModal = () => setIsRegisterModalOpen(false);
  
  // Switch between login and register modals
  const switchToRegister = () => {
    closeLoginModal();
    openRegisterModal();
  };
  
  const switchToLogin = () => {
    closeRegisterModal();
    openLoginModal();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isMentor,
        isAuthenticated,
        loading,
        error,
        register,
        login,
        loginWithGoogle,
        handleGoogleAuthSuccess,
        logout,
        isLoginModalOpen,
        isRegisterModalOpen,
        openLoginModal,
        closeLoginModal,
        openRegisterModal,
        closeRegisterModal,
        switchToRegister,
        switchToLogin
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};