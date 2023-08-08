import '../styles/Profile.css';
import { ReactComponent as AdminIcon } from '../assets/Icons/user-crown-light.svg';
import Modal from '../components/Modal';
import { useAuth } from '../contexts/UserContext';
import { useState, useEffect } from 'react'
import {  doc, setDoc } from "firebase/firestore";
import { db } from '../firebase/firebase-config';

function Profile() {
	const [modalActive, setModalActive] = useState<boolean>(false);
	const [modalMessage, setModalMessage] = useState<string | null>(null);

	useEffect(() => {
        document.title = "Profile | DeadMarket";
        return () => {
            document.title = "DeadMarket";
        };
    }, []);

	const { isAdmin, getUser, getProfileInfo, setProfileInfo } = useAuth();

	const toggleModal = (value: boolean) => {
		setModalActive(value);
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
			const docRef = doc(db, "users", getProfileInfo().id!);
			await setDoc(docRef, {
				firstName: profileVal.firstName,
				lastName: profileVal.lastName,
				userName: profileVal.userName,
				email: getProfileInfo().email
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
			{ modalActive && <Modal modalMessage={modalMessage} toggleModal={toggleModal} /> }
			<div className="profile-container">
				<h2>Account Settings</h2>
				<div className="profile-info">
					<div className="initials">{getProfileInfo().initials}</div>
					{ isAdmin && 
						<div className="admin-badge">
							<AdminIcon className="icon" />
							<span>admin</span>
						</div>
					}
					<form onSubmit={updateProfile}>
						<div className="input">
							<label htmlFor="firstName">First Name:</label>
							<input type="text" id="firstName" name="firstName" placeholder={getProfileInfo().firstName!}/>
						</div>
						<div className="input">
							<label htmlFor="lastName">Last Name:</label>
							<input type="text" id="lastName" name="lastName" placeholder={getProfileInfo().lastName!} />
						</div>
						<div className="input">
							<label htmlFor="userName">Username:</label>
							<input type="text" id="userName" name="userName" placeholder={getProfileInfo().userName!} />
						</div>
						<div className="input">
							<label htmlFor="email">Email:</label>
							<input disabled type="text" id="email" placeholder={getProfileInfo().email!}/>
						</div>
						<button type='submit'>Save Changes</button>
					</form>
				</div>
			</div>
		</>
	)
}

export default Profile;