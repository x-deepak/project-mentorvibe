import React, { useState } from 'react';
import defaultAvatar from '../assets/dashboard/dashboard-user-avatar.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera, faCheckCircle } from '@fortawesome/free-solid-svg-icons';

const Profile = () => {
  // State for form fields
  const [formData, setFormData] = useState({
    name: 'Hari Kumar',
    gender: '',
    birthDate: '',
    phone: '',
  });

  const [isDeleteSelected, setIsDeleteSelected] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Restrict name input to letters and spaces only
    if (name === 'name' && !/^[a-zA-Z\s]*$/.test(value)) {
      return;
    }

    // Restrict phone input to digits only
    if (name === 'phone' && !/^\d*$/.test(value)) {
      return;
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleSave = () => {
    console.log('Saved Data:', formData);
    alert('Profile information saved successfully!');
  };

  const handleDeleteToggle = () => {
    setIsDeleteSelected(!isDeleteSelected);
  };

  const handleDeleteAccount = () => {
    if (isDeleteSelected) {
      alert('Your account has been deleted.');
      // Add logic to delete the account here
    } else {
      alert('Please select the checkbox to delete your account.');
    }
  };

  return (
    <div className="my-account">
      <div className="first-part">
        <div className="general-info">
          <h1 className="gen-info-title">General Information</h1>

          {/* Name Input */}
          <div className="form-group">
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter your name"
              maxLength={30}
            />
          </div>

          {/* Gender Dropdown */}
          <div className="form-group">
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Birth Date Input */}
          <div className="form-group">
            <input
              type="date"
              id="birthDate"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleInputChange}
            />
          </div>

          {/* Phone Number Input */}
          <div className="form-group">
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Enter your phone number"
              maxLength={10}
            />
          </div>

          {/* Save Button */}
          <button className="save-button" onClick={handleSave}>
            Confirm
          </button>
        </div>
      </div>

      {/* Delete Account Component */}
      <div className="second-part">
        <div className="modify-password">
          <h1 className="gen-info-title">Modify Password 🔒</h1>
          <button className="save-button" onClick={handleSave}>
            Modify Password
          </button>
        </div>
        <div className="delete-account">
          <h1 className="gen-info-title">Delete account </h1>
          <p className="delete-warning">
            ATTENTION! All of your data (messages, favorites,..) will be definitively and irreversibly deleted.
            Please select the checkbox below if you wish to delete your account.
          </p>
          <div
            className={`delete-checkbox ${isDeleteSelected ? 'selected' : ''}`}
            onClick={handleDeleteToggle}
          >
            {isDeleteSelected && (
              <FontAwesomeIcon icon={faCheckCircle} className="delete-icon" />
            )}
            <span>Delete my account</span>
          </div>
          <button
            className={`delete-button ${isDeleteSelected ? 'active' : ''}`}
            onClick={handleDeleteAccount}
          >
            Delete my account
          </button>
        </div>
      </div>

      <div className="third-part">
        <div className="change-profile-pic">
          <h1 className="gen-info-title">Profile Photo</h1>
          <div className="img-wrapper">
            <img
              src={defaultAvatar}
              alt="User Avatar"
              className="profile-edit-avatar"
            />
            <span className="camera-wrapper">
              <FontAwesomeIcon icon={faCamera} style={{ color: 'white' }} />
            </span>
          </div>
        </div>
      
      </div>
    </div>
  );
};

export default Profile;