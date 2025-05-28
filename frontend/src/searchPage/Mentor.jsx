import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';

import './Mentor.css';
import styles from './Search.module.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';

import defaultAvatar from '../assets/dashboard/dashboard-user-avatar.jpg';
import { AuthContext } from '../context/AuthContext';

import dp from '../assets/profile/card-sample.jpg';


const apiUrl = import.meta.env.VITE_API_URL;


const Mentor = () => {
    const { isAuthenticated, user, isMentor, logout, openLoginModal } = useContext(AuthContext);

    const [searchParams] = useSearchParams();
    const [mentor, setMentor] = useState({});
    const [reviews, setReviews] = useState([]); // State for reviews
    const [loading, setLoading] = useState(false);
    const [reviewsLoading, setReviewsLoading] = useState(true); // Loading state for reviews
    const [error, setError] = useState(null);
    const [reviewsError, setReviewsError] = useState(null); // Error state for reviews
    const [conversationStatus, setConversationStatus] = useState(null); // 'active', 'pending', or null
    const [isFavorite, setIsFavorite] = useState(false);

    // Controlled filter state based on URL
    const query = searchParams.get("query") || null;

    // Fetch mentor profile
    useEffect(() => {
        const fetchMentorProfile = async () => {
            setLoading(true);
            setError(null);

            const apiParams = new URLSearchParams(searchParams.toString());

            try {
                const response = await fetch(`${apiUrl}/api/search/mentor?${apiParams.toString()}`, { mode: "cors", method: "GET" });

                if (!response.ok) throw new Error("Failed to fetch mentor profile");
                const data = await response.json();
                setMentor(data);

                // Fetch conversation status if user is logged in
                if (isAuthenticated && data._id && user?._id) {
                    try {
                        const convRes = await fetch(
                            `${apiUrl}/api/protected/user/conversations/status?mentorId=${data._id}`,
                            {
                                headers: {
                                    'Authorization': `Bearer ${user.token}`,
                                    'Content-Type': 'application/json'
                            },
                            credentials: 'include'
                        }
                        );
                        if (convRes.ok) {
                            const convData = await convRes.json();
                            if (!convData.exists) {
                                setConversationStatus(null); // No conversation, keep as "Contact"
                            } else if (convData.isActive) {
                                setConversationStatus('active'); // Conversation active
                            } else {
                                setConversationStatus('pending'); // Conversation exists but not active
                            }
                        } else {
                            setConversationStatus(null);
                        }
                    } catch {
                        setConversationStatus(null);
                    }
                } else {
                    setConversationStatus(null);
                }
            } catch (err) {
                setError(err.message || "Something went wrong");
            } finally {
                setLoading(false);
            }
        };
        fetchMentorProfile();
        // eslint-disable-next-line
    }, [searchParams, isAuthenticated, user]);

    // Fetch reviews
    useEffect(() => {
        const fetchReviews = async () => {
            setReviewsLoading(true);
            setReviewsError(null);

            try {
                const response = await fetch(`${apiUrl}/api/search/mentor/review?id=${mentor._id}`, { mode: "cors", method: "GET" });

                if (!response.ok) throw new Error("Failed to fetch reviews");
                const data = await response.json();
                console.log("Reviews data:", data);
                setReviews(data);
            } catch (err) {
                setReviewsError(err.message || "Something went wrong");
            } finally {
                setReviewsLoading(false);
            }
        };

        if (mentor._id) {
            fetchReviews(); // Fetch reviews only if mentor._id is available
        }
    }, [mentor._id]);

    if (loading) return <div className={styles['card-container']}><p>Loading mentor profile...</p></div>;
    if (error) return <div className={styles['card-container']}><p>{error}</p></div>;

    return (
        <>
            <div className="mentor-profile">
                <div className="mentor-profile-container">
                    <div className="mentor-main-content">
                        <div className="skill-tags">
                            {mentor.skills?.map((skill, index) => (
                                <span key={index} className="skill-tag">{skill}</span>
                            ))}
                        </div>
                        <h1 className="mentor-page-title">{mentor.profileTitle}</h1>
                        <h2 className="location-title">Class location</h2>
                        <div className="location-tags">
                            <span className="location-tag">{mentor.city || "Loading.."}</span>
                            <span className="location-tag">{mentor.teachingMode || "Loading.."}</span>
                        </div>
                        <h2 className="bio-title">About User</h2>
                        <p className="mentor-bio">{mentor.bio || "Loading..."}</p>
                        <h2 className="class-details-title">About the class</h2>
                        <p className="class-details">{mentor.classDetails || "Loading..."}</p>
                        <h2 className="review-title">Reviews</h2>
                        <div className="reviews-container">
                            {reviewsLoading ? (
                                <p>Loading reviews...</p>
                            ) : reviewsError ? (
                                <p>{reviewsError}</p>
                            ) : reviews.length > 0 ? (
                                reviews.map((rating, index) => (
                                    <div key={index} className="review-card">
                                        <div className="review-header">
                                            <span className="review-left">
                                                <img
                                                    src={rating.profileImage || defaultAvatar} // Use user's avatar if available
                                                    alt="User Avatar"
                                                    className="review-avatar"
                                                />
                                                <p className="review-by">{rating.userName || "Anonymous"}</p>
                                            </span>
                                            <span className="review-right">
                                                <FontAwesomeIcon icon={faStar} style={{ color: 'gold' }} />
                                                {rating.rating || 0}
                                            </span>
                                        </div>
                                        <p className="review-text">{rating.review || "No review provided."}</p>
                                    </div>
                                ))
                            ) : (
                                <p>No reviews available.</p>
                            )}
{/* Dummy reviews for testing */}
                            <div className="review-card">
                                <div className="review-header">
                                    <span className="review-left">
                                        <img src={defaultAvatar} alt="User Avatar" className="review-avatar" />
                                        <p className="review-by">
                                            UserName
                                        </p>
                                    </span>
                                    <span className="review-right">
                                        <FontAwesomeIcon icon={faStar} />
                                        5
                                    </span>
                                </div>
                                <p className="review-text">"Great mentor! Helped me a lot with my physics concepts."</p>
                            </div>

                        </div>
                    </div>
                    <div className="mentor-right-card">
                        <img src={mentor.profilePicture? mentor.profilePicture: dp} alt="User Avatar" className="mentor-profile-avatar" />
                        <h2 className="mentor-profile-name">{mentor.name || "Loading..."}</h2>
                        <div className="mentor-rating-stats">
                            <FontAwesomeIcon icon={faStar} style={{ color: 'gold' }} />
                            {mentor.averageRating || 0} ({reviews.length} reviews)
                        </div>
                        <div className="mentor-card-detail">
                            <span className="detail-label">Hourly Fee</span>
                            <span className="detail-value">₹{mentor.fee || "N/A"}</span>
                        </div>
                        <div className="mentor-card-detail">
                            <span className="detail-label">No. Of Students</span>
                            <span className="detail-value">{mentor.studentCount || 0}</span>
                        </div>
                        {/* Favorite button, visible only when authenticated */}
                        {isAuthenticated && (
                            <button
                                className="favorite-icon-btn"
                                title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', position: 'absolute', top: 16, right: 16 }}
                                onClick={async () => {
                                    try {
                                        if (!isFavorite) {
                                            const res = await fetch(`${apiUrl}/api/protected/user/favorites/add`, {
                                                method: 'POST',
                                                headers: {
                                                    'Authorization': `Bearer ${user.token}`,
                                                    'Content-Type': 'application/json'
                                                },
                                                body: JSON.stringify({ mentorId: mentor._id })
                                            });
                                            if (!res.ok) throw new Error('Failed to add favorite');
                                            setIsFavorite(true);
                                        } else {
                                            // Optionally implement remove favorite here
                                            setIsFavorite(false);
                                        }
                                    } catch (err) {
                                        alert('Failed to update favorite.');
                                    }
                                }}
                            >
                                <FontAwesomeIcon icon={isFavorite ? faHeartSolid : faHeartRegular} style={{ color: isFavorite ? 'red' : 'gray', fontSize: 22 }} />
                            </button>
                        )}
                        {!isMentor && (
                        <button
                            className="contact-button"
                            onClick={async () => {
                                if (!isAuthenticated) {
                                    openLoginModal();
                                } else if (conversationStatus === 'active') {
                                    window.location.href = '/learner/dashboard/message';
                                } else if (conversationStatus === null) {
                                    // Create a new conversation
                                    try {
                                        console.log("Sending request to create conversation with mentor:", mentor._id);
                                        const res = await fetch(
                                            `${apiUrl}/api/protected/user/conversations`,
                                            {
                                                method: 'POST',
                                                headers: {
                                                    'Authorization': `Bearer ${user.token}`,
                                                    'Content-Type': 'application/json'
                                                },
                                                credentials: 'include',
                                                body: JSON.stringify({ mentorId: mentor._id })
                                            }
                                        );
                                        if (res.ok) {
                                            setConversationStatus('pending');
                                        } else {
                                            // Optionally handle error
                                            alert('Failed to send request.');
                                        }
                                    } catch (err) {
                                        alert('Failed to send request.');
                                    }
                                }
                            }}
                            disabled={conversationStatus === 'pending'}
                        >
                            {!isAuthenticated
                                ? "Contact"
                                : conversationStatus === 'active'
                                    ? "Message"
                                    : conversationStatus === 'pending'
                                        ? "Request Sent"
                                        : "Contact"}
                        </button>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Mentor;