import '../styles/Navigation.css';
import { ReactComponent as MenuIcon } from '../assets/Icons/bars-regular.svg';
import { ReactComponent as CartIcon } from '../assets/Icons/shopping-bag.svg';
import { ReactComponent as Loading } from '../assets/Icons/shopping-cart-loading.svg';
import { useAuth } from '../contexts/UserContext';
import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

function Navigation() {
    const [isLoading, setisLoading] = useState<boolean>(false);
    const [mobileView, setMobileView] = useState<boolean>(false);
    const [mobileNav, setMobileNav] = useState<boolean>(false);

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
        logout,
        getCartInfo,
        startCheckoutCart
    } = useAuth();

    const checkScreen = () => {
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
                    <Link className="header" to="/">Market</Link>         
                </div>
                
                <div className="nav-links">
                    {!mobileView && (
                        <>
                            <Link className="link" to="/cart">Catalog</Link>
                            <Link className="link" to="/about">About Us</Link>
                            {isAuth && (<Link className="link" to="/profile">Profile</Link>)}
                            {isAdmin && (<Link className="link" to="/admin">Admin</Link>)}
                            {!isAuth && (<Link className="link" to="/login">Login/Register</Link>)}
                            {isAuth && (
                                <a className="link" onClick={() => checkOut()}>
                                    <div className='branding'>
                                        {isLoading && (<Loading/> )}
                                        <CartIcon/>
                                        <div className="badge">{getCartInfo().length}</div>
                                    </div>
                                </a>
                            )}    
                        </>
                    )}
                </div>
                {mobileView && <MenuIcon onClick={toggleMobileNav} className='menu-icon' />}
                <ul className={mobileNav ? "show-mobile-nav mobile-nav" : "mobile-nav"} onClick={toggleMobileNav}>
                    <Link className="link" to="/">Home</Link>
                    <a className="link" onClick={() => checkOut()}>Checkout</a>
                    <Link className="link" to="/cart">Catalog</Link>
                    <Link className="link" to="/about">About Us</Link>
                    {isAuth && (<Link className="link" to="/profile">Profile</Link>)}
                    {isAdmin && (<Link className="link" to="/admin">Admin</Link>)}
                    {!isAuth && (<Link className="link" to="/login">Login/Register</Link>)}
                    {isAuth && (<a className="link" onClick={signUserOut}>Logout</a>)}
                </ul>
            </nav>      
        </header>
    )
}

export default Navigation;