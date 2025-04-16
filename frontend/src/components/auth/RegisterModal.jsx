// src/components/auth/RegisterModal.js
import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import './AuthModals.css';

const RegisterModal = () => {
  const { 
    isRegisterModalOpen, 
    closeRegisterModal, 
    register, 
    loginWithGoogle, 
    error, 
    switchToLogin 
  } = useContext(AuthContext);
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user',
    // Mentor-specific fields
    expertise: [],
    bio: '',
    yearsOfExperience: '',
    hourlyRate: ''
  });
  
  const [localError, setLocalError] = useState('');
  
  if (!isRegisterModalOpen) return null;
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleExpertiseChange = (e) => {
    const value = e.target.value;
    let expertise = [...formData.expertise];
    
    if (expertise.includes(value)) {
      expertise = expertise.filter(item => item !== value);
    } else {
      expertise.push(value);
    }
    
    setFormData({
      ...formData,
      expertise
    });
  };
  
  const handleRoleChange = (e) => {
    setFormData({
      ...formData,
      role: e.target.value
    });
  };
  
  const validateStep1 = () => {
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setLocalError('Please fill in all fields');
      return false;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setLocalError('Passwords do not match');
      return false;
    }
    
    if (formData.password.length < 6) {
      setLocalError('Password must be at least 6 characters');
      return false;
    }
    
    return true;
  };
  
  const validateStep2 = () => {
    if (formData.role === 'mentor') {
      if (formData.expertise.length === 0) {
        setLocalError('Please select at least one expertise');
        return false;
      }
      
      if (!formData.bio) {
        setLocalError('Please provide a bio');
        return false;
      }
      
      if (!formData.yearsOfExperience || formData.yearsOfExperience < 0) {
        setLocalError('Please provide valid years of experience');
        return false;
      }
      
      if (!formData.hourlyRate || formData.hourlyRate <= 0) {
        setLocalError('Please provide a valid hourly rate');
        return false;
      }
    }
    
    return true;
  };
  
  const nextStep = () => {
    if (step === 1 && validateStep1()) {
      setLocalError('');
      setStep(2);
    }
  };
  
  const prevStep = () => {
    setStep(1);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    
    if (step === 1) {
      nextStep();
    } else if (step === 2) {
        // Validate step 2 if we're on step 2
        if (!validateStep2()) {
          return;
        }
        
        // Remove confirmPassword before sending to backend
        const { confirmPassword, ...registrationData } = formData;

        console.log("form data:: -->",registrationData)
        
        // Send registration data
        const result = await register(registrationData);
        
        if (result.success) {
          closeRegisterModal();
        }
      }
    };
    
    const handleGoogleRegister = () => {
      loginWithGoogle(formData.role);
    };
    
    // Expertise options (for mentors)
    const expertiseOptions = [
      'Web Development',
      'Mobile Development',
      'Data Science',
      'Machine Learning',
      'UI/UX Design',
      'DevOps',
      'Cloud Computing',
      'Cybersecurity',
      'Blockchain',
      'Project Management'
    ];
    
    return (
      <div className="modal-overlay">
        <div className="auth-modal">
          <div className="modal-header">
            <h2>Register {formData.role === 'mentor' ? 'as Mentor' : 'as User'}</h2>
            <button className="close-btn" onClick={closeRegisterModal}>×</button>
          </div>
          
          <div className="modal-content">
            {(error || localError) && (
              <div className="error-message">
                {error || localError}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              {step === 1 && (
                <>
                  <div className="form-group">
                    <label>Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                    />
                  </div>
                  
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
                  
                  <div className="form-group">
                    <label>Confirm Password</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm your password"
                    />
                  </div>
                  
                  <div className="form-group role-selector">
                    <label>Register as:</label>
                    <div className="role-options">
                      <label>
                        <input
                          type="radio"
                          name="role"
                          value="user"
                          checked={formData.role === 'user'}
                          onChange={handleRoleChange}
                        />
                        User
                      </label>
                      <label>
                        <input
                          type="radio"
                          name="role"
                          value="mentor"
                          checked={formData.role === 'mentor'}
                          onChange={handleRoleChange}
                        />
                        Mentor
                      </label>
                    </div>
                  </div>
                  
                  <button 
                    type="button" 
                    className="btn btn-primary"
                    onClick={nextStep}
                  >
                    Next
                  </button>
                </>
              )}
              
              {step === 2 && (
                <>
                  {formData.role === 'mentor' ? (
                    <>
                      <div className="form-group">
                        <label>Expertise (select at least one)</label>
                        <div className="checkbox-group">
                          {expertiseOptions.map(option => (
                            <label key={option} className="checkbox-label">
                              <input
                                type="checkbox"
                                name="expertise"
                                value={option}
                                checked={formData.expertise.includes(option)}
                                onChange={handleExpertiseChange}
                              />
                              {option}
                            </label>
                          ))}
                        </div>
                      </div>
                      
                      <div className="form-group">
                        <label>Professional Bio</label>
                        <textarea
                          name="bio"
                          value={formData.bio}
                          onChange={handleChange}
                          placeholder="Describe your experience and expertise"
                          rows="4"
                        />
                      </div>
                      
                      <div className="form-group">
                        <label>Years of Experience</label>
                        <input
                          type="number"
                          name="yearsOfExperience"
                          value={formData.yearsOfExperience}
                          onChange={handleChange}
                          placeholder="Enter years of experience"
                          min="0"
                        />
                      </div>
                      
                      <div className="form-group">
                        <label>Hourly Rate ($)</label>
                        <input
                          type="number"
                          name="hourlyRate"
                          value={formData.hourlyRate}
                          onChange={handleChange}
                          placeholder="Enter your hourly rate"
                          min="1"
                          step="0.01"
                        />
                      </div>
                    </>
                  ) : (
                    <div className="user-confirmation">
                      <p>You're registering as a User with the following details:</p>
                      <ul>
                        <li><strong>Name:</strong> {formData.name}</li>
                        <li><strong>Email:</strong> {formData.email}</li>
                      </ul>
                    </div>
                  )}
                  
                  <div className="buttons-group">
                    <button 
                      type="button" 
                      className="btn btn-secondary"
                      onClick={prevStep}
                    >
                      Back
                    </button>
                    <button 
                      type="submit" 
                      className="btn btn-primary"
                    >
                      Register
                    </button>
                  </div>
                </>
              )}
            </form>
            
            <div className="social-login">
              <p>Or register with:</p>
              {/* <button 
                onClick={handleGoogleRegister} 
                className="btn btn-google"
              >
                Google
              </button> */}
              <button className="gsi-material-button" onClick={handleGoogleRegister}>
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
    <span className="gsi-material-button-contents">Sign in with Google</span>
    <span style={{ display: "none" }}>Sign in with Google</span>
  </div>
</button>
            </div>
            
            <div className="auth-switch">
              <p>
                Already have an account? 
                <button 
                  onClick={switchToLogin} 
                  className="switch-btn"
                >
                  Login
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default RegisterModal;