

import logo from '../assets/logo2.png';
import style from './Home.module.css'
import styles from './Header.module.css'
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'


import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import dp from '../assets/profile/card-sample.jpg';

const Header = () => {
    const {
        isAuthenticated,
        user,
        isMentor,
        logout,
        openLoginModal
    } = useContext(AuthContext);

    const [query, setQuery] = useState("");
    const navigate = useNavigate();

    const [dropdownOpen, setDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };


    const handleSearch = (e) => {
        e?.preventDefault();
        if (query.trim()) {
            navigate(`/search?query=${encodeURIComponent(query)}`);
        }
    };
    return (
        <>
            <div className={style["header"]}>

                <div className={style["logo-container"]}>
                    <img className={style["logo-img"]} src={logo} alt="mentorvibe logo image" />
                    <div className={style["logo-text"]}>mentorvibe</div>
                </div>

                <div className={style["search-container"]}>
                    <form action="" className={style["search-form"]}>
                        <input type="text" className={style["search-input"] + " focus-me"} placeholder="Search..." value={query}
                            onChange={(e) => setQuery(e.target.value)} />
                        <button className={style["search-button"]} onClick={handleSearch}><FontAwesomeIcon icon={faSearch} /></button>
                    </form>
                </div>


                <div className={styles["auth-section"]}>
                    {!isAuthenticated ? (
                <ul className={style["nav-links"]}>
                    {/* <li><a className={style['header-link']} href="#">About</a></li> */}
                    {/* <li><a className={style['header-link']} href="#">Contact</a></li> */}
                    <li><button className={style['header-link']} onClick={openLoginModal}>Login / Register</button></li>
                </ul>
                    ) : (
                        <div className={styles["user-menu"]}>
                            <img
                                src={dp}
                                alt="profile"
                                className={styles["profile-pic"]}
                                onClick={toggleDropdown}
                            />
                            {dropdownOpen && (
                                <div className={styles["dropdown"]}>
                                    <p>Hi, {user.name}</p>
                                    <button onClick={logout}>Logout</button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default Header;