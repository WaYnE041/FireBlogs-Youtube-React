import '../styles/Login.css';
import { useAuth } from '../contexts/UserContext';
import { ReactComponent as Email } from '../assets/Icons/envelope-regular.svg';
import { ReactComponent as Password } from '../assets/Icons/lock-alt-solid.svg';
import { ReactComponent as User } from '../assets/Icons/user-alt-light.svg';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

function Register() {
    const [isError, setisError] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>();
    const [firstName, setFirstName] = useState<string>();
    const [lastName, setLastName] = useState<string>();
    const [userName, setUserName] = useState<string>();
    const [email, setEmail] = useState<string>();
    const [password, setPassword] = useState<string>();

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

        if (!firstName || !lastName || !userName || !email || !password) {
            setErrorMessage("Please Fill Out All The Fields");
            setisError(true);
        } else {
            setisError(false);
            
            try {
                const { doc, setDoc } = await import('firebase/firestore');
			    const { db } = await import('../firebase/firebase-config');

                const userCred = await register(email, password);
                const userCollectionRef = doc(db, "users", userCred.user.uid);
                await setDoc(userCollectionRef, {
                    firstName: firstName,
                    lastName: lastName,
                    userName: userName,
                    email: email
                });
                navigate("/");
            } catch (error: any) {
                setErrorMessage(`${error.code}: ${error.message}`);
                setisError(true);
            }
        } 
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
						<input type="text" name="firstName" placeholder="First Name" onChange={(e) => {setFirstName(e.target.value)}} />
						<User className="icon"/>
					</div>
                    <div className="input">
						<input type="text" name="lastName"placeholder="Last Name" onChange={(e) => {setLastName(e.target.value)}} />
						<User className="icon"/>
					</div>
                    <div className="input">
						<input type="text" name="userName" placeholder="User Name" onChange={(e) => {setUserName(e.target.value)}} />
						<User className="icon"/>
					</div>
                    <div className="input">
						<input type="text" name="email" placeholder="Email" onChange={(e) => {setEmail(e.target.value)}} />
						<Email className="icon"/>
					</div>
					<div className="input">
						<input type="password" name="password" placeholder="Password" onChange={(e) => {setPassword(e.target.value)}} />
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