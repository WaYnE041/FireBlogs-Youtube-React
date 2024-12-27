import '../styles/Login.css';
import { ReactComponent as Email } from '../assets/Icons/envelope-regular.svg';
import { ReactComponent as Password } from '../assets/Icons/lock-alt-solid.svg';
import { useAuth } from '../contexts/UserContext';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Login() {
    const [email, setEmail] = useState<string>();
    const [password, setPassword] = useState<string>();
    const [isError, setisError] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>();

    useEffect(() => {
        document.title = "Login | Market";
        return () => {
            document.title = "Market";
        };
    }, []);

    const { login, loginGoogle} = useAuth();
    const navigate = useNavigate();

    const signIn = async (ev: any) => {
        ev.preventDefault();

        //turns empty string and undefined into boolean
        if (!email || !password) {
            setErrorMessage("Please Fill Out All The Fields");
            setisError(true);
        } else {
            setisError(false);

            try {
                await login(email, password);
                navigate("/");
            } catch (error: any) {
                setErrorMessage(`${error.code}: ${error.message}`);
                setisError(true);
            }
        }
    }

    const signInGoogle = async () => {
            
        try {
            const userCred = await loginGoogle();
            console.log(userCred.user?.providerData[0].email)

            const gmail = userCred.user?.providerData[0].email;
            const displayName = userCred.user?.providerData[0].displayName;
            const { doc, setDoc } = await import('firebase/firestore');
            const { db } = await import('../firebase/firebase-config');

            const userCollectionRef = doc(db, "users", userCred.user.uid);
            await setDoc(userCollectionRef, {
                firstName: "firstName",
                lastName: "lastName",
                userName: displayName,
                email: gmail
            });
            navigate("/");
        } catch (error: any) {
            setErrorMessage(`${error.code}: ${error.message}`);
            setisError(true);
        }
    } 

    return (
        <div className="form-wrap">
            <div className="login">
                <form onSubmit={signIn}>
                    <p className="login-register">
                        Don't have an account?
                        <Link className="router-link" to="/register">Register</Link>
                    </p>
                    <h2>Login to Market</h2>
                    <div className="inputs">
                        <div className="input">
                            <input type="text" name="email" placeholder="Email" onChange={(e) => { setEmail(e.target.value) }} />
                            <Email className="icon" />
                        </div>
                        <div className="input">
                            <input type="password" name="password" placeholder="Password" onChange={(e) => { setPassword(e.target.value) }} />
                            <Password className="icon" />
                        </div>
                        {isError && <div className="error">{errorMessage}</div>}
                    </div>
                    <Link className="forgot-password" to="/forgot-password">Forgot Your Password?</Link>
                    <button type="submit">Sign In</button>

                    <div className="angle"></div>
                </form>
                <button onClick={() => signInGoogle()}>Sign In with Google</button>
            </div>
            <div className="background"></div>
        </div>
    )
}

export default Login;