import '../styles/Login.css';
import { ReactComponent as Email } from '../assets/Icons/envelope-regular.svg';
import Modal from '../components/Modal';
import Loading from '../components/Loading';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function ForgotPassword() {
    const [isLoading, setisLoading] = useState<boolean>(false);
    const [email, setEmail] = useState<string>();
    const [modalActive, setModalActive] = useState<boolean>(false);
    const [modalMessage, setModalMessage] = useState<string>();

    useEffect(() => {
        document.title = "Forgot Password | Market";
        return () => {
            document.title = "Market";
        };
    }, []);

    const toggleModal = (value: boolean) => {
        setModalActive(value);
    }

    const resetPassword = async (e: any) => {
        e.preventDefault();
        setisLoading(true);

        if (!email) {
            setModalMessage("Please Fill Out All The Fields");
            setisLoading(false);
        } else {
            try {
                const { auth } = await import('../firebase/firebase-config');
                const { sendPasswordResetEmail } = await import('firebase/auth');

                await sendPasswordResetEmail(auth, email);
                setModalMessage("Password reset email sent!");
                setisLoading(false);

                const element = (document.getElementById("email") as HTMLInputElement | null)
                if(element){
                    element.value = ""
                    setEmail("")
                }
            } catch (error: any) {
                setModalMessage(`${error.message}`);
                setisLoading(false);
            }
            setModalActive(true);
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    }

    return (
        <div className="reset-password">
            {modalActive && <Modal modalMessage={modalMessage || ""} toggleModal={toggleModal} />}
            {isLoading && <Loading />}
            <div className="form-wrap">
                <form id="reset-form" className="reset" onSubmit={resetPassword}>
                    <p className="login-register">
                        <Link className="router-link" to="/login">Login</Link>
                    </p>
                    <h2>Reset Password</h2>
                    <p>Forgot your password? Enter your email to reset it</p>
                    <div className="inputs">
                        <div className="input">
                            <input type="text" id="email" placeholder="Email" onChange={handleChange} />
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

export default ForgotPassword;