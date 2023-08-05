import '../styles/Profile.css'
import Modal from '../components/Modal'
import { useAuth } from '../contexts/UserContext'
import { useState, useEffect } from 'react'
import { ReactComponent as AdminIcon } from '../assets/Icons/user-crown-light.svg'
import {  doc, setDoc } from "firebase/firestore";
import { db } from '../firebase/firebase-config';

function Profile() {

	const { isAdmin, getUser, getProfileInfo, setProfileInfo } = useAuth()
	const [modalActive, setModalActive] = useState<boolean>(false);
	const [modalMessage, setModalMessage] = useState<string | null>(null);

	useEffect(() => {
        document.title = "Profile | DeadMarket"
        return () => {
            document.title = "DeadMarket"
        };
    }, []);

	const toggleModal = (value: boolean) => {
		setModalActive(value)
	}

	const updateProfile = async (e: any) => {
		e.preventDefault();
		const profileVal = {
			firstName: e.target.elements.firstName.value,
			lastName: e.target.elements.lastName.value,
			userName: e.target.elements.userName.value
		}
		console.log(profileVal)

		const isEmpty = Object.values(profileVal).some(x => x === null || x === '');
		if (isEmpty) {
			setModalMessage("Please Fill Out All The Fields")
			setModalActive(true)
		} else {
			try {
				const docRef = doc(db, "users", getProfileInfo().id!)
				await setDoc(docRef, {
					firstName: profileVal.firstName,
					lastName: profileVal.lastName,
					userName: profileVal.userName,
					email: getProfileInfo().email
				})

				const user = getUser()
				if(user === null) {
					throw new Error('Error: User is not logged in!');
				} 
				
				setProfileInfo(user)

			} catch (error: any) {
				console.log(`${error.message}`)
				setModalMessage(`${error.message}`)
				setModalActive(true)
			}
			
		}
	}


	return (
		<div className="profile">
			{modalActive && <Modal modalMessage={modalMessage} toggleModal={toggleModal} />}
			<div className="container">
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
		</div >
	)
}

export default Profile