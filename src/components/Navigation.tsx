import '../styles/Navigation.css';
import { ReactComponent as MenuIcon } from '../assets/Icons/bars-regular.svg';
import { ReactComponent as CartIcon } from '../assets/Icons/shopping-bag.svg';
import { ReactComponent as UserIcon } from '../assets/Icons/user-alt-light.svg';
import { ReactComponent as AdminIcon } from '../assets/Icons/user-crown-light.svg';
import { ReactComponent as SignOutIcon } from '../assets/Icons/sign-out-alt-regular.svg';
import { useAuth } from '../contexts/UserContext';
import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

function Navigation() {
    const [mobileView, setMobileView] = useState<boolean>(false);
    const [mobileNav, setMobileNav] = useState<boolean>(false);
    const [profileMenu, setProfileMenu] = useState<boolean>(false);
    const [windowWidth, setWindowWith] = useState(0);

    useEffect(() => {
        checkScreen();
        window.addEventListener('resize', checkScreen);
        return () => {
            window.removeEventListener('resize', checkScreen);
        };
    })

    const {
        isAuth,
        isAdmin,
        getProfileInfo,
        logout
    } = useAuth();

    const checkScreen = () => {
        setWindowWith(window.innerWidth);
        if (windowWidth <= 800) {
            setMobileView(true);
        } else {
            setMobileView(false);
            setMobileNav(false);
        }
    }

    const toggleMobileNav = () => {
        setMobileNav(!mobileNav);
    }

    const toggleProfileMenu = () => {
        setMobileNav(false);
        setProfileMenu(!profileMenu);
    }

    const signUserOut = async () => {
        await logout();
    }

    return (
        <header className='header'>
            <nav className="container">
                <div className="branding">
                    <Link className="header" to="/">Dead:Market</Link>
                </div>
                <div className="nav-links">
                    {!mobileView && (
                        <ul>
                            <Link className="link" to="/cart"><CartIcon/></Link>
                            <Link className="link" to="/">Home</Link>
                            <Link className="link" to="/blogs">Blogs</Link>
                            {isAdmin && isAuth && <Link className="link" to="/create-post">Create Post</Link>}
                            {!isAuth && (<Link className="link" to="/login">Login/Register</Link>)}
                        </ul>
                    )}

                    {isAuth && (<div className="profile mobile-user-menu" id="profile" onClick={toggleProfileMenu}>
                        <span>{getProfileInfo().initials}</span>
                        {profileMenu && (
                            <div className="profile-menu">
                                <div className="info">
                                    <p className='initials'>{getProfileInfo().initials}</p>
                                    <div className='right'>
                                        <p>{getProfileInfo().firstName} {getProfileInfo().lastName}</p>
                                        <p>{getProfileInfo().userName}</p>
                                        <p>{getProfileInfo().email}</p>
                                    </div>
                                </div>
                                <div className="options">
                                    <Link className="option" to="/profile">
                                        <div className="option">
                                            <UserIcon className="icon" />
                                            <p>Profile</p>
                                        </div>
                                    </Link>
                                    {isAdmin &&
                                        <Link className="option" to="/admin">
                                            <div className="option">
                                                <AdminIcon className="icon" />
                                                <p>Admin</p>
                                            </div>
                                        </Link>
                                    }
                                    <div className="option" onClick={signUserOut}>
                                        <SignOutIcon className="icon" />
                                        <p>Sign Out</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    )}
                </div>
            </nav>
            
            {mobileView && <MenuIcon onClick={toggleMobileNav} className='menu-icon' />}
            <ul className={mobileNav ? "show-mobile-nav mobile-nav" : "mobile-nav"} onClick={toggleMobileNav}>
                <Link className="link" to="/">Home</Link>
                <Link className="link" to="/blogs">Blogs</Link>
                {isAdmin && isAuth && <Link className="link" to="/create-post">Create Post</Link>}
                {!isAuth && (<Link className="link" to="/login">Login/Register</Link>)}
            </ul>
        </header>
    )
}

export default Navigation;