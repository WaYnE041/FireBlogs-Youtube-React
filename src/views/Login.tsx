import '../styles/Login.css';
import { ReactComponent as Email } from '../assets/Icons/envelope-regular.svg';
import { ReactComponent as Password } from '../assets/Icons/lock-alt-solid.svg';
import { useAuth } from '../contexts/UserContext';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Login() {
    const [loginDetails, setLoginDetails] = useState<{
        email: null | string;
        password: null | string;
    }>({ email: null, password: null });
    const [isError, setisError] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>();

    useEffect(() => {
        document.title = "Login | DeadMarket";
        return () => {
            document.title = "DeadMarket";
        };
    }, []);

    const { login } = useAuth();
    const navigate = useNavigate();

    const signIn = async (ev: any) => {
        ev.preventDefault();
        const isEmpty = Object.values(loginDetails).some(x => x === null || x === '');

        if (isEmpty) {
            setErrorMessage("Please Fill Out All The Fields");
            setisError(true);
        } else {
            setisError(false);

            try {
                await login(loginDetails.email!, loginDetails.password!);
                navigate("/");
            } catch (error:any) {
                setErrorMessage(`${error.code}: ${error.message}`);
                setisError(true);
            }
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.name;
        const value = e.target.value;
        setLoginDetails((prevState) => ({
            ...prevState,
            [name]: value
        }));
    }

    return (
        <div className="form-wrap">
            <form className="login" onSubmit={signIn}>
                <p className="login-register">
                    Don't have an account?
                    <Link className="router-link" to="/register">Register</Link>
                </p>
                <h2>Login to Dead:Market</h2>
                <div className="inputs">
                    <div className="input">
                        <input type="text" name="email" placeholder="Email" onChange={handleChange} />
                        <Email className="icon" />
                    </div>
                    <div className="input">
                        <input type="password" name="password" placeholder="Password" onChange={handleChange} />
                        <Password className="icon" />
                    </div>
                    { isError && <div className="error">{ errorMessage }</div> }
                </div>
                <Link className="forgot-password" to="/forgot-password">Forgot Your Password?</Link>
                <button type="submit">Sign In</button>
                <div className="angle"></div>
            </form>
            <div className="background"></div>
        </div>
    )
}

export default Login;