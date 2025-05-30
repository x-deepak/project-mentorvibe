import React, { useState, useContext, useEffect } from 'react';
import defaultAvatar from '../assets/dashboard/dashboard-user-avatar.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark, faCircleCheck, faEdit, faTrash, faTimes, faCheck } from '@fortawesome/free-solid-svg-icons';
import { AuthContext } from '../context/AuthContext'; // Import AuthContext

import dp from '../assets/profile/card-sample.jpg';

const apiUrl = import.meta.env.VITE_API_URL;


const Dashboard = () => {
  const { user } = useContext(AuthContext); // Access user data from AuthContext

  const [favorites, setFavorites] = useState([]); // State for favorites
  const [isEditing, setIsEditing] = useState(false);
  const [conversations, setConversations] = useState([]); // <-- Add this state

  // Fetch favorites when the component mounts
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        console.log('token in dashboard', user.token);
        if (!user?.token) {
          console.error('No token found. User might not be authenticated.');
          return;
        }

        const response = await fetch(`${apiUrl}/api/protected/user/favorites`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`, // Include token in the Authorization header
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            console.error('Unauthorized: Invalid or expired token.');
          }
          throw new Error('Failed to fetch favorites');
        }

        const data = await response.json();
        setFavorites(data.favoriteMentors); // Update favorites state with fetched data
      } catch (error) {
        console.error('Error fetching favorites:', error);
      }
    };

    fetchFavorites();
  }, [user]);

  // Fetch conversations on load
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        if (!user?.token) return;
        const response = await fetch(`${apiUrl}/api/protected/user/conversations`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`,
          },
        });
        if (!response.ok) throw new Error('Failed to fetch conversations');
        const data = await response.json();
        setConversations(data.conversations || []);
      } catch (error) {
        console.error('Error fetching conversations:', error);
      }
    };
    fetchConversations();
  }, [user]);

  const handleDelete = async (id) => {
    try {
      if (!user?.token) return;
      const response = await fetch(`${apiUrl}/api/protected/user/favorites/delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ mentorId: id }),
      });
      if (!response.ok) throw new Error('Failed to delete favorite mentor');
      setFavorites(favorites.filter((mentor) => mentor.id !== id));
    } catch (error) {
      console.error('Error deleting favorite mentor:', error);
    }
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
              src={ dp || defaultAvatar} // Use user's avatar if available, fallback to default
              alt="User Avatar"
              className="preview-avatar"
            />
          </div>
          <div className="user-name">{user?.name || 'Guest User'}</div> {/* Display user's name */}
          <div className="verify-status">
            <span className="verify-status-text">
              {user?.isVerified ? 'Verified Profile' : 'Unverified Profile'}
            </span>
            <span className="verify-status-icon">
              {user?.isVerified ? (
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
                    src={mentor.profilePic || defaultAvatar} // Use mentor's profile picture or fallback to default
                    alt="Mentor Avatar"
                    className="request-mentor-avatar"
                  />
                  <span className="mentor-details">
                    <div className="request-mentor-name">{mentor.name}</div>
                    <div className="request-mentor-profession">{mentor.professionalTitle}</div>
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
          <div className="class-request-title">Class Requests Sent</div>
          <div className="class-request-list">
            {conversations.length === 0 ? (
              <div>No class requests found.</div>
            ) : (
              conversations.map((conv) => (
                <div className="class-request-item" key={conv.conversationId}>
                  <div className="mentor-info">
                    <img
                      src={conv.mentor?.profilePicture || defaultAvatar}
                      alt="Mentor Avatar"
                      className="request-mentor-avatar"
                    />
                    <span className="mentor-details">
                      <div className="request-mentor-name">{conv.mentor?.name || "Unknown"}</div>
                      <div className="request-mentor-profession">{conv.mentor?.professionalTitle || "N/A"}</div>
                    </span>
                  </div>
                  <div className="mentor-status">
                    {conv.isActive ? "Approved" : "Pending"}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;