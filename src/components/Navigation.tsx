import '../styles/Navigation.css';
import { ReactComponent as MenuIcon } from '../assets/Icons/bars-regular.svg';
import { ReactComponent as CartIcon } from '../assets/Icons/shopping-bag.svg';
import { ReactComponent as Loading } from '../assets/Icons/shopping-cart-loading.svg';
import { ReactComponent as UserIcon } from '../assets/Icons/user-alt-light.svg';
import { ReactComponent as AdminIcon } from '../assets/Icons/user-crown-light.svg';
import { ReactComponent as SignOutIcon } from '../assets/Icons/sign-out-alt-regular.svg';
import { useAuth } from '../contexts/UserContext';
import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

function Navigation() {
    const [isLoading, setisLoading] = useState<boolean>(false);
    const [mobileView, setMobileView] = useState<boolean>(false);
    const [mobileNav, setMobileNav] = useState<boolean>(false);
    const [profileMenu, setProfileMenu] = useState<boolean>(false);
    //const [windowWidth, setWindowWidth] = useState(0);

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
        logout,
        getCartInfo,
        startCheckoutCart
    } = useAuth();

    const checkScreen = () => {
        //setWindowWidth(window.innerWidth);
        console.log("hi");
        if (window.innerWidth <= 1024) {
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

    const checkOut = async () => {
        if(getCartInfo().length === 0) {
            alert("Please Add Items To Cart");
        }
        else {
            setisLoading(true);
            await startCheckoutCart();
        }
    }

    return (
        <header className='header'>
            <nav className="container">
                <div className="branding">
                    <Link className="header" to="/">Dead:Market</Link>         
                </div>
                
                <div className="nav-links">
                {!mobileView && (
                        <>
                            <a className="link" onClick={() => checkOut()}>
                                <div className='branding'>
                                    {isLoading && (<Loading/> )}
                                    <CartIcon/>
                                    <div className="badge">{getCartInfo().length}</div>
                                </div>
                            </a>
                            <Link className="link desktop-link" to="/">Home</Link>
                            {/* <Link className="link desktop-link" to="/blogs">Blogs</Link> */}
                            <Link className="link desktop-link" to="/cart">Catalog</Link>
                            <Link className="link desktop-link" to="/about">About</Link>
                            {isAdmin && isAuth && <Link className="link desktop-link" to="/create-post">Create Post</Link>}
                            {!isAuth && (<Link className="link desktop-link" to="/login">Login/Register</Link>)}
                            
                        </>
                    )}
                </div>
                <div className="profile-link">
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
                <Link className="link" to="/cart">Catalog</Link>
                <Link className="link" to="/about">About</Link>
                {isAdmin && isAuth && <Link className="link" to="/create-post">Create Post</Link>}
                {!isAuth && (<Link className="link" to="/login">Login/Register</Link>)}
            </ul>
        </header>
    )
}

export default Navigation;