import '../styles/Footer.css';
import { ReactComponent as Youtube } from "../assets/Icons/youtube-brands.svg";
import { ReactComponent as Twitter } from "../assets/Icons/twitter-brands.svg";
import { ReactComponent as Instagram } from "../assets/Icons/instagram-brands.svg";
import { ReactComponent as LinkedIn } from "../assets/Icons/linkedin-brands.svg";
import { useAuth } from '../contexts/UserContext';
import { Link } from "react-router-dom";

function Footer() {
    const {
        isAuth,
        isAdmin,
    } = useAuth();

    return (
        <footer>
            <div className="container">
                <div className="left">
                    <div className="col-1">
                        <Link className="header" to="/">Dead:Market</Link>
                        <ul>
                            <li>
                                <a href="https://www.youtube.com/"><Youtube className="svg-icon" /></a>
                            </li>
                            <li>
                                <a href="https://twitter.com/"><Twitter className="svg-icon" /></a>
                            </li>
                            <li>
                                <a href="https://www.instagram.com/"><Instagram className="svg-icon" /></a>
                            </li>
                            <li>
                                <a href="https://www.linkedin.com/"><LinkedIn className="svg-icon" /></a>
                            </li>
                        </ul>
                    </div>
                    <div className="col-2">
                        <ul>
                            <Link className="link" to="/">Home</Link>
                            <Link className="link" to="/blogs">Blogs</Link>
                            {isAdmin && isAuth && <Link v-if="admin" className="link" to="/create-post">Create Post</Link>}
                            {!isAuth && (<Link className="link" to="/login">Login In / Register</Link>)}
                        </ul>
                    </div>
                </div>
                <div className="right">
                    <p>Copyright 2023 All Rights Reserved</p>
                </div>
            </div>
        </footer>
    )
}

export default Footer;