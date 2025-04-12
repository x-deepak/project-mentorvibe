import React, { useState } from 'react';

import defaultAvatar from '../assets/dashboard/dashboard-user-avatar.jpg';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark, faCircleCheck, faEdit, faTrash, faTimes, faCheck } from '@fortawesome/free-solid-svg-icons';

const Dashboard = () => {
  // Mock data for analytics
  const profileViews = 35;
  const classRequests = 10;

  // Mock data for favorites
  const [favorites, setFavorites] = useState([
    { id: 1, name: 'Alice', profession: 'Data Scientist' },
    { id: 2, name: 'Bob2', profession: 'AI Engineer' },
  ]);

  const [isEditing, setIsEditing] = useState(false);

  const handleDelete = (id) => {
    setFavorites(favorites.filter((mentor) => mentor.id !== id));
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSaveChanges = () => {
    setIsEditing(false);
    // Save changes logic here (if needed)
  };

  const handleCancelChanges = () => {
    setIsEditing(false);
    // Revert changes logic here (if needed)
  };

  return (
    <div className="dashboard">
      <div className="left-part">
        <div className="user-profile">
          <div className="preview-avatar-container">
            <img
              src={defaultAvatar}
              alt="User Avatar"
              className="preview-avatar"
            />
          </div>
          <div className="user-name">John Doe</div>
          <div className="verify-status">
            <span className="verify-status-text">Verified Profile</span>
            <span className="verify-status-icon">
              {true ? (
                <FontAwesomeIcon icon={faCircleCheck} style={{ color: 'rgb(121, 220, 175)' }} />
              ) : (
                <FontAwesomeIcon icon={faCircleXmark} style={{ color: '#fa6484' }} />
              )}
            </span>
          </div>
        </div>

        {/* Favorites Container */}
        <div className="favorites-container">
          <div className="favorites-header">
            <span>Favorites</span>
            {!isEditing ? (
              <FontAwesomeIcon
                icon={faEdit}
                className="edit-icon"
                style={{ cursor: 'pointer', marginLeft: '10px' }}
                onClick={handleEditToggle}
              />
            ) : (
              <div className="edit-actions">
                <FontAwesomeIcon
                  icon={faCheck}
                  className="save-icon"
                  style={{ cursor: 'pointer', marginRight: '20px', color: 'green' }}
                  onClick={handleSaveChanges}
                />
                <FontAwesomeIcon
                  icon={faTimes}
                  className="cancel-icon"
                  style={{ cursor: 'pointer', color: 'red' }}
                  onClick={handleCancelChanges}
                />
              </div>
            )}
          </div>
          <div className="favorites-list">
            {favorites.map((mentor) => (


              <div key={mentor.id} className="class-request-item">
                <div className="mentor-info">
                  <img
                    src={defaultAvatar}
                    alt="User Avatar"
                    className="request-mentor-avatar"
                  />
                  <span className="mentor-details">
                    <div className="request-mentor-name">{mentor.name}</div>
                    <div className="request-mentor-profession">{mentor.profession} </div>
                  </span>
                </div>
                {isEditing && (
                  <FontAwesomeIcon
                    icon={faTrash}
                    className="delete-icon"
                    style={{ cursor: 'pointer', color: 'red', marginLeft: '10px' }}
                    onClick={() => handleDelete(mentor.id)}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="right-part">
        <div className="class-request-container">
          <div className="class-request-title">Class Requests</div>
          <div className="class-request-list">
            <div className="class-request-item">
              <div className="mentor-info">
                <img
                  src={defaultAvatar}
                  alt="User Avatar"
                  className="request-mentor-avatar"
                />
                <span className="mentor-details">
                  <div className="request-mentor-name">Harry</div>
                  <div className="request-mentor-profession">Software Engineer</div>
                </span>
              </div>
              <div className="mentor-status">Approved{/*Awaiting approval */}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;