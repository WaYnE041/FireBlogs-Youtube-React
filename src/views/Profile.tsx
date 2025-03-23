import '../styles/Profile.css';
import Modal from '../components/Modal';
import { useAuth } from '../contexts/UserContext';
import { useState, useEffect } from 'react'
import { ReactComponent as SignOutIcon } from '../assets/Icons/sign-out-alt-regular.svg';

function Profile() {
	const [modalActive, setModalActive] = useState<boolean>(false);
	const [modalMessage, setModalMessage] = useState<string>();

	useEffect(() => {
        document.title = "Profile | Market";
        return () => {
            document.title = "Market";
        };
    }, []);

	const { getUser, getProfileInfo, setProfileInfo, logout, } = useAuth();
	const profileInfo = getProfileInfo();

	const toggleModal = (value: boolean) => {
		setModalActive(value);
	}

	const signUserOut = async () => {
        await logout();
    }

	const updateProfile = async (e: any) => {
		e.preventDefault();
		const profileVal = {
			firstName: e.target.elements.firstName.value,
			lastName: e.target.elements.lastName.value,
			userName: e.target.elements.userName.value
		}

		const isEmpty = Object.values(profileVal).some(x => x === null || x === '');
		if (isEmpty) {
			setModalMessage("Please Fill Out All The Fields");
			setModalActive(true);
			return;
		} 

		const user = getUser();
		if(user === null) {
			setModalMessage("Error: User is not logged in!");
			setModalActive(true);
			return;
		} 
		
		try {
			if(!profileInfo.id) {
				throw new Error("user is not logged in");
			}

			const { doc, setDoc } = await import('firebase/firestore');
			const { db } = await import('../firebase/firebase-config');

			const docRef = doc(db, "users", profileInfo.id);
			await setDoc(docRef, {
				firstName: profileVal.firstName,
				lastName: profileVal.lastName,
				userName: profileVal.userName,
				email: profileInfo.email
			})
			console.log("successfully saved to backend!");

			await setProfileInfo(user);
			setModalMessage("Saved Changes");
			
		} catch (error: any) {
			console.log(`${error.message}`);
			setModalMessage(`${error.message}`);
		}

		setModalActive(true);
	}

	return (
		<>
			{ modalActive && <Modal modalMessage={modalMessage || ""} toggleModal={toggleModal} /> }
			<div className="profile-container">
				<h2>Account Settings</h2>
				<div className="profile-info">
					<div className="initials">{getProfileInfo().initials}</div>
					<button className="sign-out-btn"  onClick={signUserOut}>
						<SignOutIcon className="icon" />Logout
					</button>
					<form onSubmit={updateProfile}>
						<div className="input">
							<label htmlFor="firstName">First Name:</label>
							<input type="text" id="firstName" name="firstName" placeholder={profileInfo.firstName || ''}/>
						</div>
						<div className="input">
							<label htmlFor="lastName">Last Name:</label>
							<input type="text" id="lastName" name="lastName" placeholder={profileInfo.lastName || ''} />
						</div>
						<div className="input">
							<label htmlFor="userName">Username:</label>
							<input type="text" id="userName" name="userName" placeholder={profileInfo.userName || ''} />
						</div>
						<div className="input">
							<label htmlFor="email">Email:</label>
							<input disabled type="text" id="email" placeholder={profileInfo.email || ''}/>
						</div>
						<button type='submit'>Save Changes</button>
					</form>
				</div>
			</div>
		</>
	)
}

export default Profile;