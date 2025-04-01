

import logo from '../assets/logo2.png';
import style from './Home.module.css'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'


function Header() {

    const [query, setQuery] = useState("");
    const navigate = useNavigate();


    const handleSearch = (e) => {
        e?.preventDefault();
        if (query.trim()) {
            navigate(`/search?q=${encodeURIComponent(query)}`);
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
                <ul className={style["nav-links"]}>
                    {/* <li><a className={style['header-link']} href="#">About</a></li> */}
                    {/* <li><a className={style['header-link']} href="#">Contact</a></li> */}
                    <li><a className={style['header-link']} href="#">Login / Register</a></li>
                </ul>
            </div>
        </>
    );
}

export default Header;