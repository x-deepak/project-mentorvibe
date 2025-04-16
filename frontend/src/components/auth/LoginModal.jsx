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
            {/* <button
              onClick={handleGoogleLogin}
              className="btn btn-google"
            >
              Google
            </button> */}
<button className="gsi-material-button" onClick={handleGoogleLogin}>
  <div className="gsi-material-button-state"></div>
  <div className="gsi-material-button-content-wrapper">
    <div className="gsi-material-button-icon">
      <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" xmlnsXlink="http://www.w3.org/1999/xlink" style={{ display: "block" }}>
        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
        <path fill="none" d="M0 0h48v48H0z"></path>
      </svg>
    </div>
    <span className="gsi-material-button-contents">Continue with Google</span>
    <span style={{ display: "none" }}>Continue with Google</span>
  </div>
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