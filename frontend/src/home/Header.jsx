

import logo from '../assets/logo2.png';


function Header() {
    return (
        <>
            <div className="header">
                <div className="logo-container">
                    <img className="logo-img" src={logo} alt="mentorvibe logo image" />
                    <div className="logo-text">mentorvibe</div>
                </div>
                <ul className="nav-links">
                    <li><a className='header-link' href="#">About</a></li>
                    <li><a className='header-link' href="#">Contact</a></li>
                    <li><a className='header-link' href="#">Login</a></li>
                </ul>
            </div>
        </>
    );
}

export default Header;