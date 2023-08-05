import '../styles/Login.css';
import { useAuth } from '../contexts/UserContext';
import { ReactComponent as Email } from '../assets/Icons/envelope-regular.svg';
import { ReactComponent as Password } from '../assets/Icons/lock-alt-solid.svg';
import { ReactComponent as User } from '../assets/Icons/user-alt-light.svg';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase-config';

function Register() {
    const [isError, setisError] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>();
    const [authDetails, setAuthDetails] = useState<{
        firstName: string | null;
        lastName: string | null;
        userName: string | null;
        email: string | null;
        password:string | null;
    }>({ firstName: null, lastName: null, userName: null, email: null, password: null });
    
    useEffect(() => {
        document.title = "Register | DeadMarket";
        return () => {
            document.title = "DeadMarket";
        };
    }, []);

    const { register } = useAuth();
    const navigate = useNavigate();

    const signUp = async (ev: any) => {
        ev.preventDefault();
        const isEmpty = Object.values(authDetails).some(x => x === null || x === '');

        if (isEmpty) {
            setErrorMessage("Please Fill Out All The Fields");
            setisError(true);
        } else {
            setisError(false);
            
            try {
                const userCred = await register(authDetails.email!, authDetails.password!);
                const userCollectionRef = doc(db, "users", userCred.user.uid);
                await setDoc(userCollectionRef, {
                    firstName: authDetails.firstName,
                    lastName: authDetails.lastName,
                    userName: authDetails.userName,
                    email: authDetails.email
                });
                navigate("/");
            } catch (error: any) {
                setErrorMessage(`${error.code}: ${error.message}`);
                setisError(true);
            }
        } 
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.name;
        const value = e.target.value;
        setAuthDetails((prevState) => ({
            ...prevState,
            [name]: value
        }));
    }

    return (
        <div className="form-wrap">
			<form className="register" onSubmit={signUp}>
				<p className="login-register">
					Already have an account?
					<Link className="router-link" to="/login">Login</Link>
				</p>
				<h2>Create Your Account</h2>
				<div className="inputs">
					<div className="input">
						<input type="text" name="firstName" placeholder="First Name" onChange={handleChange} />
						<User className="icon"/>
					</div>
                    <div className="input">
						<input type="text" name="lastName"placeholder="Last Name" onChange={handleChange} />
						<User className="icon"/>
					</div>
                    <div className="input">
						<input type="text" name="userName" placeholder="User Name" onChange={handleChange} />
						<User className="icon"/>
					</div>
                    <div className="input">
						<input type="text" name="email" placeholder="Email" onChange={handleChange} />
						<Email className="icon"/>
					</div>
					<div className="input">
						<input type="password" name="password" placeholder="Password" onChange={handleChange} />
						<Password className="icon"/>
					</div>
                    { isError && <div className="error">{ errorMessage }</div> }
				</div>
				<button type="submit">Sign Up</button>
				<div className="angle"></div>
			</form>
			<div className="background"></div>
		</div>
    )
}

export default Register;