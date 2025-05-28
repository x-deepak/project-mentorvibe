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
  const [classRequests, setClassRequests] = useState([]); // <-- Add this state

  console.log('user in dashboard', user);

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

  // Fetch class requests (conversations) on load
  useEffect(() => {
    const fetchClassRequests = async () => {
      try {
        if (!user?.token) return;
        const response = await fetch(`${apiUrl}/api/protected/user/mentor/conversations`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`,
          },
        });
        if (!response.ok) throw new Error('Failed to fetch class requests');
        const data = await response.json();
        setClassRequests(data.conversations || []);
      } catch (error) {
        console.error('Error fetching class requests:', error);
      }
    };
    fetchClassRequests();
  }, [user]);

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

  // Accept/Reject handlers
  const handleAccept = async (conversationId) => {
    const confirmed = window.confirm('Are you sure you want to accept this class request?');
    if (!confirmed) return;
    try {
      const res = await fetch(`${apiUrl}/api/protected/user/mentor/conversations/accept`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ conversationId }),
      });
      if (res.ok) {
        setClassRequests((prev) =>
          prev.map((req) =>
            req.conversationId === conversationId
              ? { ...req, isPending: false, isActive: true }
              : req
          )
        );
      }
    } catch (err) {
      console.error('Failed to accept request:', err);
    }
  };

  const handleReject = async (conversationId) => {
    const confirmed = window.confirm('Are you sure you want to reject this class request?');
    if (!confirmed) return;
    try {
      const res = await fetch(`${apiUrl}/api/protected/user/mentor/conversations/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ conversationId }),
      });
      if (res.ok) {
        setClassRequests((prev) =>
          prev.map((req) =>
            req.conversationId === conversationId
              ? { ...req, isPending: false, isActive: false }
              : req
          )
        );
      }
    } catch (err) {
      console.error('Failed to reject request:', err);
    }
  };

  return (
    <div className="dashboard">
      <div className="left-part">
        <div className="user-profile">
          <div className="preview-avatar-container">
            <img
              src={ user?.profilePicture || defaultAvatar} // Use user's avatar if available, fallback to default
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
          <div className="class-request-title">Class Requests Received</div>
          <div className="class-request-list">
            {classRequests.length === 0 ? (
              <div>No class requests found.</div>
            ) : (
              classRequests.map((req) => (
                <div className="class-request-item" key={req.conversationId}>
                  <div className="mentor-info">
                    <img
                      src={req.user?.profileImage || defaultAvatar}
                      alt="User Avatar"
                      className="request-mentor-avatar"
                    />
                    <span className="mentor-details">
                      <div className="request-mentor-name">{req.user?.name || "Unknown"}</div>
                    </span>
                  </div>
                  <div className="mentor-status" style={{minWidth: '180px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end'}}>
                    {req.isPending ? (
                      <div style={{display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap'}}>
                        <button 
                          onClick={() => handleAccept(req.conversationId)} 
                          style={{backgroundColor: '#4CAF50', color: 'white', border: 'none', padding: '6px 16px', borderRadius: '4px', cursor: 'pointer', whiteSpace: 'nowrap'}}>
                          Accept
                        </button>
                        <button 
                          onClick={() => handleReject(req.conversationId)} 
                          style={{backgroundColor: '#fa6484', color: 'white', border: 'none', padding: '6px 16px', borderRadius: '4px', cursor: 'pointer', whiteSpace: 'nowrap'}}>
                          Reject
                        </button>
                      </div>
                    ) : req.isActive ? (
                      "Approved by you"
                    ) : (
                      "Rejected by you"
                    )}
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