import logo from '../assets/logo2.png';
import style from './Home.module.css';
import styles from './Header.module.css';
import { useState, useContext, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

import { AuthContext } from '../context/AuthContext';
import dp from '../assets/profile/card-sample.jpg';


import * as React from 'react';
import Avatar from '@mui/material/Avatar';


import Menu from '@mui/material/Menu';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
// import PersonAdd from '@mui/icons-material/PersonAdd';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';



function stringToColor(string) {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';

    for (i = 0; i < 3; i += 1) {
        const value = (hash >> (i * 8)) & 0xff;
        color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
}

function stringAvatar(name) {
    return {
        sx: {
            bgcolor: stringToColor(name),
        },
        children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
    };
}






const Header = () => {
    const {
        isAuthenticated,
        user,
        isMentor,
        logout,
        openLoginModal
    } = useContext(AuthContext);

    const [searchParams] = useSearchParams(); // Hook to access search parameters
    const [query, setQuery] = useState(""); // State for search input
    const navigate = useNavigate();

    const [dropdownOpen, setDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const handleSearch = (e) => {
        e?.preventDefault();

        // Update the search parameters without overwriting the existing ones
        const newParams = new URLSearchParams(searchParams.toString());
        newParams.set("query", query); // Update the "query" parameter
        navigate(`/mentor/search?${newParams.toString()}`, { replace: true }); // Update the URL without reloading
    };

    const handleLogoClick = () => {
        navigate('/'); // Redirect to the root path
    };

    // Dropdown menu for user profile
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    // Populate the search input with the query from search parameters on load
    useEffect(() => {
        const searchQuery = searchParams.get("query") || "";
        setQuery(searchQuery); // Set the query state with the value from search parameters
    }, [searchParams]);

    return (
        <>
            <div className={style["header"]}>

                <div className={style["logo-container"]} onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
                    <img className={style["logo-img"]} src={logo} alt="mentorvibe logo image" />
                    <div className={style["logo-text"]}>mentorvibe</div>
                </div>

                <div className={style["search-container"]}>
                    <form action="" className={style["search-form"]}>
                        <input
                            type="text"
                            className={style["search-input"] + " focus-me"}
                            placeholder="Search..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                        <button className={style["search-button"]} onClick={handleSearch}>
                            <FontAwesomeIcon icon={faSearch} />
                        </button>
                    </form>
                </div>

                <div className={styles["auth-section"]}>
                    {!isAuthenticated ? (
                        <ul className={style["nav-links"]}>
                            <li>
                                <button className={style['header-link']} onClick={openLoginModal}>
                                    Login / Register
                                </button>
                            </li>
                        </ul>
                    ) : (

                        <React.Fragment>
                            <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
                                <Tooltip title="Account settings">
                                    <IconButton
                                        onClick={handleClick}
                                        size="small"
                                        sx={{ ml: 2 }}
                                        aria-controls={open ? 'account-menu' : undefined}
                                        aria-haspopup="true"
                                        aria-expanded={open ? 'true' : undefined}
                                    >
                                        <Avatar
                                            src={user?.profilePicture || dp}
                                            {...stringAvatar('Kent Dodds')}
                                            onClick={toggleDropdown}
                                            sx={{ width: 40, height: 40 }}
                                        />
                                        {/* <Avatar sx={{ width: 32, height: 32 }}>M</Avatar> */}
                                    </IconButton>
                                </Tooltip>
                            </Box>
                            <Menu
                                anchorEl={anchorEl}
                                id="account-menu"
                                open={open}
                                onClose={handleClose}
                                onClick={handleClose}
                                slotProps={{
                                    paper: {
                                        elevation: 0,
                                        sx: {
                                            overflow: 'visible',
                                            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                            mt: 1.5,
                                            '& .MuiAvatar-root': {
                                                width: 32,
                                                height: 32,
                                                ml: -0.5,
                                                mr: 1,
                                            },
                                            '&::before': {
                                                content: '""',
                                                display: 'block',
                                                position: 'absolute',
                                                top: 0,
                                                right: 14,
                                                width: 10,
                                                height: 10,
                                                bgcolor: 'background.paper',
                                                transform: 'translateY(-50%) rotate(45deg)',
                                                zIndex: 0,
                                            },
                                            '& .MuiMenu-list': {
                                                display: 'flex',
                                                flexDirection: 'column', // Force vertical alignment
                                                padding: '4px 0',
                                            },
                                        },
                                    },
                                }}
                                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                            >
                                <MenuItem
                                    onClick={() => {
                                        handleClose(); // Close the menu
                                        if (isMentor) {
                                            navigate('/mentor/dashboard/'); // Redirect to mentor dashboard
                                        } else {
                                            navigate('/learner/dashboard/'); // Redirect to learner dashboard
                                        }
                                    }}
                                >
                                    <Avatar /> Dashboard
                                </MenuItem>
                                <MenuItem
                                    onClick={() => {
                                        handleClose(); // Close the menu
                                        if (isMentor) {
                                            navigate('/mentor/dashboard/account'); // Redirect to mentor account
                                        } else {
                                            navigate('/learner/dashboard/account'); // Redirect to learner account
                                        }
                                    }}
                                >
                                    <Avatar /> My account
                                </MenuItem>
                                <Divider />

                                <MenuItem
                                    onClick={() => {
                                        handleClose(); // Close the menu
                                        if (isMentor) {
                                            navigate('/mentor/dashboard/account'); // Redirect to mentor account
                                        } else {
                                            navigate('/learner/dashboard/account'); // Redirect to learner account
                                        }
                                    }}
                                >
                                    <ListItemIcon>
                                        <Settings fontSize="small" />
                                    </ListItemIcon>
                                    Settings
                                </MenuItem>
                                <MenuItem onClick={logout}>
                                    <ListItemIcon>
                                        <Logout fontSize="small" />
                                    </ListItemIcon>
                                    Logout
                                </MenuItem>
                            </Menu>
                        </React.Fragment>

                    )}
                </div>
            </div >
        </>
    );
};

export default Header;