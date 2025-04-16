import { useState } from 'react';
import dotsImg from '../assets/dots.png';
import homeBannerImg from '../assets/home-banner.png';

import style from './Home.module.css';
import { useNavigate } from 'react-router-dom';

export function Hero() {
    const [query, setQuery] = useState("");
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e?.preventDefault();
        navigate(`/search?q=${encodeURIComponent(query)}`);
    };

    const redirectToSearch = () => {
        navigate('/mentor/search'); // Redirect to /search
    };

    return (
        <>
            <div className={style["hero-container"]}>
                <div className={style["hero-text"]}>
                    <img src={dotsImg} alt="" className={style["dots"]} />
                    <p className={style["hero-title"]}>Discover Your Perfect Skill Mentor</p>
                    <p className={style["hero-info"]}>
                        Transform your career with personalized mentorship that connects you with experts in your field to guide you.
                    </p>
                    <button className={style["normal-button"]} onClick={redirectToSearch}>
                        Search
                    </button>
                </div>
                <img src={homeBannerImg} alt="" />
            </div>
        </>
    );
}

