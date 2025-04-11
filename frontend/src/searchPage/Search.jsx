
import Header from '../home/Header.jsx'
import { useState, useEffect } from 'react';

import { useSearchParams } from 'react-router-dom';

import React from 'react';
import styles from './Search.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';


function SearchTitle({ query }) {

    // const title_start = (query)? query.charAt(0).toUpperCase() + query.slice(1) : null;

    return (
        <>
            <h1 className={styles["search-title"]}>
                {/* {title_start}  */}
                Tutors Around You
            </h1>
        </>
    )
}


function Filters(props) {
    return (
        <>
            <div className={styles["filters"]}>
                <span> Rating</span>
                <span> Fee</span>
                <span> Mode</span>
                <span> Distance</span>
            </div>
        </>
    )
}


function Search() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [mentors, setMentors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Controlled filter state based on URL
    const query = searchParams.get("query") || null;
    const mode = searchParams.get("mode") || 0;
    const distance = parseInt(searchParams.get("distance")) || 50000;    //in meters
    const maxFee = parseInt(searchParams.get("fee")) || 5000;


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

    useEffect(() => {
        const fetchMentors = async () => {
            setLoading(true);
            setError(null);
            
            const apiParams = new URLSearchParams(searchParams.toString());


            try {
              const response = await fetch(`/api/mentor?${apiParams.toString()}`, { mode: "cors", method: "GET" });

              if (!response.ok) throw new Error("Failed to fetch mentors");
              const data = await response.json();
              console.log(data)
              setMentors(data);
            } catch (err) {
              setError(err.message || "Something went wrong");
            } finally {
              setLoading(false);
            }
          };
          fetchMentors();
    }, [searchParams]);

    return (
        <div className={styles.searchpage}>
            <div className={styles["main-content-wrapper"]}>
                <SearchTitle query={query} />
                <div className={styles["main-content"]}>
                    <Filters />
                    <CardContainer {...{ mentors, loading, error }} />
                </div>
            </div>
        </div>
    )
}

import dp from '../assets/profile/card-sample.jpg';

function CardContainer({ mentors, loading, error }) {



    if (loading) return <div className={styles['card-container']}><p>Loading...</p></div>;
    if (error) return <div className={styles['card-container']}><p>{error}</p></div>;

    return (
        <>
            <div className={styles['card-container']}>

            {mentors.map(mentor => (
            <ProfileCard key={mentor._id} mentor={ mentor} />
          ))}

            </div>
        </>
    )
}





const ProfileCard = ( {mentor} ) => {

    const imageUrl = dp;
    
    const distance = (mentor.distance)? (mentor.distance/1000).toFixed(1) : null;



    return (
        <div className={styles["user-profile-card"]}>
            <div className={styles["profile-image-container"]}>
                <div
                    className={styles["profile-image-wrapper"]}
                >
                    <div
                        className={styles["profile-image"]}
                        style={{ backgroundImage: `url(${imageUrl})` }}
                    />
                    <div className={styles["name-overlay"]}>
                        <h2 className={styles["profile-name"]}>{mentor.name}</h2>
                        <div className={styles["profile-details"]}>

                            <span>{mentor.city} ({mentor.teachingMode})</span>
                            <span>₹{mentor.fee}/hr</span>
                        </div>
                    </div>
                    <div className={styles["top-overlay"]}>
                            <span>
                                <FontAwesomeIcon icon={faStar} className={styles["profile-rating-star"]} />
                                {mentor.averageRating}
                            </span>
                            <span>{distance? distance+"km" : null }</span>
                            
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

