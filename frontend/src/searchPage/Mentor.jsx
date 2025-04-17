import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';

import './Mentor.css';
import styles from './Search.module.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

import defaultAvatar from '../assets/dashboard/dashboard-user-avatar.jpg';
import { AuthContext } from '../context/AuthContext';

import dp from '../assets/profile/card-sample.jpg';

const Mentor = () => {
    const { isAuthenticated, user, isMentor, logout, openLoginModal } = useContext(AuthContext);

    const [searchParams] = useSearchParams();
    const [mentor, setMentor] = useState({});
    const [reviews, setReviews] = useState([]); // State for reviews
    const [loading, setLoading] = useState(false);
    const [reviewsLoading, setReviewsLoading] = useState(true); // Loading state for reviews
    const [error, setError] = useState(null);
    const [reviewsError, setReviewsError] = useState(null); // Error state for reviews

    // Controlled filter state based on URL
    const query = searchParams.get("query") || null;

    // Fetch mentor profile
    useEffect(() => {
        const fetchMentorProfile = async () => {
            setLoading(true);
            setError(null);

            const apiParams = new URLSearchParams(searchParams.toString());

            try {
                const response = await fetch(`/api/search/mentor?${apiParams.toString()}`, { mode: "cors", method: "GET" });

                if (!response.ok) throw new Error("Failed to fetch mentor profile");
                const data = await response.json();
                console.log("Mentor data:", data);
                setMentor(data);
            } catch (err) {
                setError(err.message || "Something went wrong");
            } finally {
                setLoading(false);
            }
        };
        fetchMentorProfile();
    }, [searchParams]);

    // Fetch reviews
    useEffect(() => {
        const fetchReviews = async () => {
            setReviewsLoading(true);
            setReviewsError(null);

            try {
                const response = await fetch(`/api/search/mentor/review?id=${mentor._id}`, { mode: "cors", method: "GET" });

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
                        <button className="contact-button">Contact</button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Mentor;