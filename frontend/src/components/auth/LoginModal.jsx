// src/components/auth/LoginModal.js
import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import './AuthModals.css';

const LoginModal = () => {
  const { 
    isLoginModalOpen, 
    closeLoginModal, 
    login, 
    loginWithGoogle, 
    error, 
    switchToRegister 
  } = useContext(AuthContext);
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [role, setRole] = useState('user');
  const [localError, setLocalError] = useState('');
  
  if (!isLoginModalOpen) return null;
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    
    if (!formData.email || !formData.password) {
      setLocalError('Please fill in all fields');
      return;
    }
    
    await login(formData);
  };
  
  const handleGoogleLogin = () => {
    loginWithGoogle(role);
  };
  
  const handleRoleChange = (e) => {
    setRole(e.target.value);
  };
  
  return (
    <div className="modal-overlay">
      <div className="auth-modal">
        <div className="modal-header">
          <h2>Login</h2>
          <button className="close-btn" onClick={closeLoginModal}>×</button>
        </div>
        
        <div className="modal-content">
          {(error || localError) && (
            <div className="error-message">
              {error || localError}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
              />
            </div>
            
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
              />
            </div>
            
            <div className="form-group role-selector">
              <label>Login as:</label>
              <div className="role-options">
                <label>
                  <input
                    type="radio"
                    name="role"
                    value="user"
                    checked={role === 'user'}
                    onChange={handleRoleChange}
                  />
                  User
                </label>
                <label>
                  <input
                    type="radio"
                    name="role"
                    value="mentor"
                    checked={role === 'mentor'}
                    onChange={handleRoleChange}
                  />
                  Mentor
                </label>
              </div>
            </div>
            
            <button type="submit" className="btn btn-primary">
              Login
            </button>
          </form>
          
          <div className="social-login">
            <p>Or login with:</p>
            <button 
              onClick={handleGoogleLogin} 
              className="btn btn-google"
            >
              Google
            </button>
          </div>
          
          <div className="auth-switch">
            <p>
              Don't have an account? 
              <button 
                onClick={switchToRegister} 
                className="switch-btn"
              >
                Register
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;