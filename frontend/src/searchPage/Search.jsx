import Header from '../home/Header.jsx'
import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import React from 'react';
import styles from './Search.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import dp from '../assets/profile/card-sample.jpg';

function SearchTitle({ query }) {
    return (
        <>
            <h1 className={styles["search-title"]}>
                Mentors Around You
            </h1>
        </>
    );
}

function Filters({ updateFilters, locationAvailable }) {
    const [rating, setRating] = useState(null);
    const [fee, setFee] = useState(5000);
    const [mode, setMode] = useState("online");
    const [distance, setDistance] = useState(50); // Local state for distance

    const handleRatingChange = (e) => {
        const value = e.target.value;
        setRating(value);
        updateFilters({ rating: value });
    };

    const handleFeeChange = (e) => {
        const value = e.target.value;
        setFee(value);
        updateFilters({ fee: value });
    };

    const handleModeChange = (e) => {
        const modeMap = { online: 0, offline: 1, any: 2 };
        const value = modeMap[e.target.value];
        setMode(e.target.value);
        updateFilters({ usermode: value });
    };

    const handleDistanceChange = (e) => {
        const value = e.target.value;
        setDistance(value); // Update local state immediately
    };

    const handleDistanceUpdate = () => {
        updateFilters({ distance: distance * 1000 }); // Update query only when slider stops
    };

    return (
        <div className={styles["filters"]}>
            {/* Mode Filter */}
            <div className={styles["filter-group"]}>
                <span>Mode</span>
                <div className={styles["filter-options"]}>
                    <label>
                        <input
                            type="radio" 
                            className={styles["filter-radio-btn"]} 
                            name="mode"
                            value="online"
                            checked={mode === "online"}
                            onChange={handleModeChange}
                        />
                        <p>Online</p>
                    </label>
                    <label
                        className={!locationAvailable ? styles["disabled-option"] : ""}
                    >
                        <input
                            type="radio"
                            className={styles["filter-radio-btn"]}
                            name="mode"
                            value="offline"
                            checked={mode === "offline"}
                            onChange={handleModeChange}
                            disabled={!locationAvailable} // Disable if location is not available
                        />
                        Offline
                    </label>
                    <label
                        className={!locationAvailable ? styles["disabled-option"] : ""}
                    >
                        <input
                            type="radio"
                            className={styles["filter-radio-btn"]}
                            name="mode"
                            value="any"
                            checked={mode === "any"}
                            onChange={handleModeChange}
                            disabled={!locationAvailable} // Disable if location is not available
                        />
                        Any
                    </label>
                </div>
            </div>

            {/* Distance Filter */}
            <div className={styles["filter-group"]}>
                <div className={styles["title-group"]}>
                    <span>Distance</span>
                    <span>Max: {distance} km</span>
                </div>

                <input
                    type="range"
                    min="1"
                    max="50"
                    step="1"
                    value={distance}
                    onChange={handleDistanceChange} // Update local state while sliding
                    onMouseUp={handleDistanceUpdate} // Update query when slider stops
                    onTouchEnd={handleDistanceUpdate} // Handle touch devices
                    disabled={!locationAvailable} // Disable if location is not available
                />
            </div>

            {/* Fee Filter */}
            <div className={styles["filter-group"]}>
                <div className={styles["title-group"]}>
                    <span>Fee</span>
                    <span>Min: ₹{fee}</span>
                </div>

                <input
                    type="range"
                    min="0"
                    max="5000"
                    step="100"
                    value={fee}
                    onChange={handleFeeChange}
                />
            </div>

            {/* Rating Filter */}
            <div className={styles["filter-group"]}>
                <span>Rating</span>
                <div className={styles["filter-options"]}>
                    <label>
                        <input
                            type="radio"
                            className={styles["filter-radio-btn"]}
                            name="rating"
                            value="5"
                            checked={rating === "5"}
                            onChange={handleRatingChange}
                        />
                        5 only
                    </label>
                    <label>
                        <input
                            type="radio"
                            className={styles["filter-radio-btn"]}
                            name="rating"
                            value="4"
                            checked={rating === "4"}
                            onChange={handleRatingChange}
                        />
                        4 and up
                    </label>
                    <label>
                        <input
                            type="radio"
                            className={styles["filter-radio-btn"]}
                            name="rating"
                            value="3"
                            checked={rating === "3"}
                            onChange={handleRatingChange}
                        />
                        3 and up
                    </label>
                    <label>
                        <input
                            type="radio"
                            className={styles["filter-radio-btn"]}
                            name="rating"
                            value="2"
                            checked={rating === "2"}
                            onChange={handleRatingChange}
                        />
                        2 and up
                    </label>
                    <label>
                        <input
                            type="radio"
                            className={styles["filter-radio-btn"]}
                            name="rating"
                            value="1"
                            checked={rating === "1"}
                            onChange={handleRatingChange}
                        />
                        1 and up
                    </label>
                </div>
            </div>
        </div>
    );
}

function Search() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [mentors, setMentors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [locationAvailable, setLocationAvailable] = useState(false); // Track if location is available
    const [page, setPage] = useState(1); // Track the current page

    // Controlled filter state based on URL
    const query = searchParams.get("query") || null;

    // Function to update search parameters
    const updateFilters = (updates) => {
        const newParams = new URLSearchParams(searchParams.toString());
        Object.entries(updates).forEach(([key, value]) => {
            if (value === null || value === undefined) {
                newParams.delete(key);
            } else {
                newParams.set(key, value);
            }
        });
        setSearchParams(newParams);
    };

    // Ask for location and set search parameters
    useEffect(() => {
        const setLocation = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const { latitude, longitude } = position.coords;
                        updateFilters({
                            lat: latitude,
                            lon: longitude
 // Set mode to 2 for location-based search
                        });
                        setLocationAvailable(true); // Location is available
                    },
                    (error) => {
                        console.error("Error getting location:", error);
                        setLocationAvailable(false); // Location is not available
                    }
                );
            } else {
                alert("Geolocation is not supported by your browser.");
                setLocationAvailable(false); // Location is not available
            }
        };

        setLocation();
    }, []); // Runs only once when the component mounts

    // Fetch mentors based on search parameters and page
    useEffect(() => {
        const fetchMentors = async () => {
            setLoading(true);
            setError(null);

            const apiParams = new URLSearchParams(searchParams.toString());
            apiParams.set("page", page); // Add the page parameter

            try {
                const response = await fetch(`/api/search?${apiParams.toString()}`, { mode: "cors", method: "GET" });

                if (!response.ok) throw new Error("Failed to fetch mentors");
                const data = await response.json();
                console.log(data);
                setMentors(data);
            } catch (err) {
                setError(err.message || "Something went wrong");
            } finally {
                setLoading(false);
            }
        };
        fetchMentors();
    }, [searchParams, page]); // Re-fetch mentors when searchParams or page changes

    // Handle pagination
    const handleNextPage = () => {
        setPage((prevPage) => prevPage + 1); // Increment the page number
    };

    const handlePrevPage = () => {
        setPage((prevPage) => Math.max(prevPage - 1, 1)); // Decrement the page number, but not below 1
    };

    return (
        <div className={styles.searchpage}>
            <div className={styles["main-content-wrapper"]}>
                <SearchTitle query={query} />
                <div className={styles["main-content"]}>
                    <Filters updateFilters={updateFilters} locationAvailable={locationAvailable} />
                    <CardContainer {...{ mentors, loading, error }} />
                </div>
                <div className={styles["pagination-controls"]}>
                    <button
                        className={styles["pagination-button"]}
                        onClick={handlePrevPage}
                        disabled={page === 1} // Disable "Previous" button on the first page
                    >
                        Previous
                    </button>
                    <span>Page {page}</span>
                    <button
                        className={styles["pagination-button"]}
                        onClick={handleNextPage}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}



function CardContainer({ mentors, loading, error }) {
    if (loading) return <div className={styles['card-container']}><p>Loading...</p></div>;
    if (error) return <div className={styles['card-container']}><p>{error}</p></div>;

    return (
        <>
            <div className={styles['card-container']}>
                {mentors.map((mentor) => (
                    <ProfileCard key={mentor._id} mentor={mentor} />
                ))}
            </div>
        </>
    );
}

const ProfileCard = ({ mentor }) => {
    console.log(mentor);
    const navigate = useNavigate(); // Hook to navigate programmatically
    const imageUrl = mentor.profilePicture? mentor.profilePicture: dp;
    const distance = mentor.distance ? (mentor.distance / 1000).toFixed(1) : null;
    const teachingModelocal = (mentor.teachingMode=="Hybrid") ? "Online & Offline" : mentor.teachingMode;

    const handleCardClick = () => {
        navigate(`/mentor/profile?id=${mentor._id}`); // Redirect to profile page with mentor ID
    };

    return (
        <div className={styles["user-profile-card"]} onClick={handleCardClick} style={{ cursor: 'pointer' }}>
            <div className={styles["profile-image-container"]}>
                <div className={styles["profile-image-wrapper"]}>
                    <div
                        className={styles["profile-image"]}
                        style={{ backgroundImage: `url(${imageUrl})` }}
                    />
                    <div className={styles["name-overlay"]}>
                        <h2 className={styles["profile-name"]}>{mentor.name}</h2>
                        <div className={styles["profile-details"]}>
                            <span>{mentor.city} ({teachingModelocal})</span>
                            <span>₹{mentor.fee}/hr</span>
                        </div>
                    </div>
                    <div className={styles["top-overlay"]}>
                        <span>
                            <FontAwesomeIcon icon={faStar} className={styles["profile-rating-star"]} />
                            {mentor.averageRating}
                        </span>
                        <span>{distance ? distance + "km" : null}</span>
                    </div>
                </div>
            </div>

            <div className={styles["profile-bio"]}>
                <p className={styles["profile-bio-text"]}>{mentor.classDetails}{mentor.classDetails}</p>
            </div>
        </div>
    );
};

export default Search;

