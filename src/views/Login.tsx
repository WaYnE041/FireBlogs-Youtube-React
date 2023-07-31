import '../styles/Login.css'
import { Link, useNavigate} from 'react-router-dom'
import { useState, useEffect } from 'react'
import {ReactComponent as Email} from '../assets/Icons/envelope-regular.svg'
import {ReactComponent as Password} from '../assets/Icons/lock-alt-solid.svg'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase/firebase-config'

function Login({ setIsAuth }: {
	setIsAuth: React.Dispatch<React.SetStateAction<boolean | undefined>>
}) 
{
	const [loginDetails, setLoginDetails] = useState<{
		email: null | string, 
		password: null | string
	}>({ email: null, password: null });

	const [isError, setisError] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>();

    const navigate = useNavigate();

	useEffect(() => {
        document.title = "Login | DeadMarket"
        return () => {
          document.title = "DeadMarket"
        };
      }, []);

	
	  const Login = async (ev: any) => {
        ev.preventDefault();
        const isEmpty = Object.values(loginDetails).some(x => x === null || x === '');
        if (isEmpty) {
            setisError(true)
            setErrorMessage("Please Fill Out All The Fields")
                console.log(`error is ${isError}`)
                console.log(loginDetails)
        } else {
            setisError(false)
                console.log(`error is ${isError}`)
                console.log(loginDetails)

            await signInWithEmailAndPassword(auth, loginDetails.email!, loginDetails.password!)
            .then(() => {
				console.log(auth.currentUser?.uid)
				setIsAuth(true);
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
        setLoginDetails((prevState) => ({
            ...prevState,
            [name]: value
        }))
    }

	return (
		<div className="form-wrap">
			<form className="login" onSubmit={Login}>
				<p className="login-register">
					Don't have an account?
					<Link className="router-link" to="/register">Register</Link>
				</p>
				<h2>Login to Dead:Market</h2>
				<div className="inputs">
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
				<Link className="forgot-password" to="/forgot-password">Forgot Your Password?</Link>
				<button type="submit">Sign In</button>
				<div className="angle"></div>
			</form>
			<div className="background"></div>
		</div>
	)
}

export default Login