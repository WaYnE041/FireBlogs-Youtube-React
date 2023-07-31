import '../styles/Login.css'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { ReactComponent as Email } from '../assets/Icons/envelope-regular.svg'
import Modal from '../components/Modal'
import Loading from '../components/Loading'
import { auth } from '../firebase/firebase-config'
import { sendPasswordResetEmail } from 'firebase/auth'

function ForgotPassword() {

    const [isLoading, setisLoading] = useState<boolean>(false);
    const [email, setEmail] = useState<string | null>(null);
    const [modalActive, setModalActive] = useState<boolean>(false);
    const [modalMessage, setModalMessage] = useState<string | null>(null);

    useEffect(() => {
        document.title = "Forgot Password | DeadMarket"
        return () => {
            document.title = "DeadMarket"
        };
    }, []);

    const resetPassword = (e: any) => {
        e.preventDefault();
        setisLoading(true);
        if (email === null || email === '') {
            setModalMessage("Please Fill Out All The Fields")
            setisLoading(false)  
            setModalActive(true)          
        } else {
            sendPasswordResetEmail(auth, email)
            .then(() => {
                setModalMessage("Password reset email sent!")
                setisLoading(false)
                setModalActive(true)
            })
            .catch((error) => {
                setModalMessage(`${error.message}`)
                setisLoading(false)
                setModalActive(true)
                console.log(`${error.message}`)
            });
        }
      }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value)
    }

    return (
        <div className="reset-password">
            { modalActive && <Modal modalMessage={modalMessage} setModalActive={setModalActive}/> }
            { isLoading && <Loading /> }
            <div className="form-wrap">
                <form id="reset-form" className="reset" onSubmit={resetPassword}>
                    <p className="login-register">
                        <Link className="router-link" to="/login">Login</Link>
                    </p>
                    <h2>Reset Password</h2>
                    <p>Forgot your password? Enter your email to reset it</p>
                    <div className="inputs">
                        <div className="input">
                            <input type="text" id="email" placeholder="Email" onChange={handleChange}/>
                            <Email className="icon" />
                        </div>
                    </div>
                    <button type='submit'>Reset</button>
                    <div className="angle"></div>
                </form> 
                <div className="background"></div>
            </div>
        </div>
    )
}

export default ForgotPassword