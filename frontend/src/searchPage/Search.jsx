
import Header from '../home/Header.jsx'
import { useState, useEffect } from 'react';

import { useSearchParams } from 'react-router-dom';

import React from 'react';
import styles from './Search.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';


function SearchTitle(props) {

    return (
        <>
            <h1 className={styles["search-title"]}>
                {props.skill} Tutors {(props.location == null) ? "Nearby" : "in " + props.location}
            </h1>
        </>
    )
}


function Filters(props) {
    return (
        <>
            <div className={styles["filters"]}>
                <span> Mode</span>
                <span> Distance</span>
                <span> Fee</span>
            </div>
        </>
    )
}



function Search() {
    // const [location, setLocation] = useState(null);
    // const [skill, setSkill] = useState(null);

    // const [online, setOnline] = useState(true);
    // const [offline, setOffline] = useState(true);

    // const [distance, setDistance] = useState(50);

    // const [maxFee, setMaxFee] = useState(5000);

    const [searchParams] = useSearchParams();
    const query = searchParams.get("q");

    // console.log("qery baby", searchParams.get("q"));
    // const [results, setResults] = useState([]);
    const results = [];

    // const [error, setError] = useState(null);
    // const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log("Component Mounted - Query:", searchParams.get("q"));
    }, [searchParams]);

    // useEffect(() => {
    //     fetch("https://jsonplaceholde", { mode: "cors", method: "GET" })
    //         .then((response) => {
    //             if (response.status >= 400) {
    //                 throw new Error("server error");
    //             }
    //             console.log("Response: ",response.json);
    //             return response.json();
    //         })
    //         .then((response) => setProfileCards([...profileCards, ...response]))
    //         .catch((error) => setError(error))
    //         .finally(() => setLoading(false));
    // }, []);

    return (
        <div className={styles.searchpage}>
            <Header />
            <div className={styles["main-content-wrapper"]}>
                <SearchTitle location={"bangalore"} skill={"Yoga"} />
                <div className={styles["main-content"]}>
                    <Filters />
                    <CardContainer results={results}></CardContainer>
                </div>
            </div>
        </div>
    )
}

import dp from '../assets/profile/card-sample.jpg';

function CardContainer({ results, loading, error }) {



    if (loading) return <div className='card-container'><p>Loading...</p></div>;
    if (error) return <div className='card-container'><p>A network error was encountered</p></div>;

    return (
        <>
            <div className={styles['card-container']}>

                <ProfileCard
                    imageUrl={dp}
                    name="Jane Smith"
                    mode="Online & offline"
                    bio="Creative problem solver with a passion for user-centered design. Dedicated to crafting intuitive and engaging digital experiences."
                />
                <ProfileCard
                    imageUrl={dp}
                    name="Jane Smith"
                    mode="Online & offline"
                    bio="Creative problem solver with a passion for user-centered design. Dedicated to crafting intuitive and engaging digital experiences."
                />
                <ProfileCard
                    imageUrl={dp}
                    name="Jane Smith"
                    mode="Online & offline"
                    bio="Creative problem solver with a passion for user-centered design. Dedicated to crafting intuitive and engaging digital experiences."
                />
                <ProfileCard
                    imageUrl={dp}
                    name="Jane Smith"
                    mode="Online & offline"
                    bio="Creative problem solver with a passion for user-centered design. Dedicated to crafting intuitive and engaging digital experiences."
                />
                <ProfileCard
                    imageUrl={dp}
                    name="Jane Smith"
                    mode="Online & offline"
                    bio="Creative problem solver with a passion for user-centered design. Dedicated to crafting intuitive and engaging digital experiences."
                />
                <ProfileCard
                    imageUrl={dp}
                    name="Jane Smith"
                    mode="Online & offline"
                    bio="Creative problem solver with a passion for user-centered design. Dedicated to crafting intuitive and engaging digital experiences."
                />
            </div>
        </>
    )
}





const ProfileCard = ({
    imageUrl = "/api/placeholder/400/400",
    name = "John Doe",
    mode = "Online & offline",
    bio = "Passionate about creating innovative solutions and solving complex problems. Committed to continuous learning and professional growth.",
    rating = 4.9,
    fee = 2000,
    dist = 10,

}) => {
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
                        <h2 className={styles["profile-name"]}>{name}</h2>
                        <p className={styles["profile-profession"]}>{mode}</p>
                    </div>
                </div>
            </div>
            <div className={styles["profile-details"]}>
                <span>
                    <FontAwesomeIcon icon={faStar} className={styles["profile-rating-star"]} />
                    {rating}
                </span>
                <span>₹{fee}/hr</span>
                <span>{dist}km</span>
            </div>

            <div className={styles["profile-bio"]}>
                <p className={styles["profile-bio-text"]}>{bio}</p>
            </div>
        </div>

    );
};





export default Search;

