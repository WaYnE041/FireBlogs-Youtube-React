import '../styles/Login.css'
import { useAuth } from '../contexts/UserContext'
import {ReactComponent as Email} from '../assets/Icons/envelope-regular.svg'
import {ReactComponent as Password} from '../assets/Icons/lock-alt-solid.svg'
import {ReactComponent as User} from '../assets/Icons/user-alt-light.svg'
import { doc, setDoc } from 'firebase/firestore'
import { db } from '../firebase/firebase-config'
import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'


function Register() {

    const { register } = useAuth()
    const [authDetails, setAuthDetails] = useState<{
        firstName: null | string,
        lastName: null | string,
        userName: null | string,
        email: null | string,
        password: null | string
    }>({ firstName: null, lastName: null, userName: null, email: null, password: null });

    const [isError, setisError] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>();

    const navigate = useNavigate();

    useEffect(() => {
        document.title = "Register | DeadMarket"
        return () => {
            document.title = "DeadMarket"
        };
    }, []);

    const signUp = async (ev: any) => {
        ev.preventDefault();
        const isEmpty = Object.values(authDetails).some(x => x === null || x === '');
        if (isEmpty) {
            setisError(true)
            setErrorMessage("Please Fill Out All The Fields")
                console.log(`error is ${isError}`)
                console.log(authDetails)
        } else {
            setisError(false)
                console.log(`error is ${isError}`)
                console.log(authDetails)

            await register(authDetails.email!, authDetails.password!)
            .then(async (userCredential) => {
                const userCollectionRef = doc(db, "users", userCredential.user.uid)
                await setDoc(userCollectionRef, {
                    firstName: authDetails.firstName,
                    lastName: authDetails.lastName,
                    userName: authDetails.userName,
                    email: authDetails.email
                })
                .catch((error) => {
                    setisError(true)
                    console.log(`adddoc ${error.code}: ${error.message}`)
                    setErrorMessage(`adddoc${error.code}: ${error.message}`)
                });
                navigate("/");
            })
            .catch((error) => {
                setisError(true)
                console.log(`${error.code}: ${error.message}`)
                setErrorMessage(`${error.code}: ${error.message}`)
            });

            
            
        } 
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.name
        const value = e.target.value
        setAuthDetails((prevState) => ({
            ...prevState,
            [name]: value
        }))
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
                    { isError && <div className="error">{errorMessage}</div>}
				</div>
				<button type="submit">Sign Up</button>
				<div className="angle"></div>
			</form>
			<div className="background"></div>
		</div>
    )
}

export default Register