import '../styles/Profile.css'
import Modal from '../components/Modal'
import { useState, useEffect } from 'react'
import { ReactComponent as AdminIcon } from '../assets/Icons/user-crown-light.svg'
import {  doc, setDoc } from "firebase/firestore";
import { db } from '../firebase/firebase-config';

function Profile({ profileInfo }: {
	profileInfo: {
		id: null | string,
		email: null | string,
		firstName: null | string,
		lastName: null | string,
		userName: null | string,
		initials: null | string,
	}
}) {

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
			const docRef = doc(db, "users", profileInfo.id!)
			await setDoc(docRef, {
				firstName: profileVal.firstName,
				lastName: profileVal.lastName,
				userName: profileVal.userName,
				email: profileInfo.email
			})
			.then(() => {
				window.location.reload();
			})
			.catch((error) => {
				console.log(`${error.code}: ${error.message}`)
				setModalMessage(`${error.code}: ${error.message}`)
				setModalActive(true)
			});
		}
	}


	return (
		<div className="profile">
			{modalActive && <Modal modalMessage={modalMessage} toggleModal={toggleModal} />}
			<div className="container">
				<h2>Account Settings</h2>
				<div className="profile-info">
					<div className="initials">{profileInfo.initials}</div>
					<div className="admin-badge">
						<AdminIcon className="icon" />
						<span>admin</span>
					</div>
					<form onSubmit={updateProfile}>
						<div className="input">
							<label htmlFor="firstName">First Name:</label>
							<input type="text" id="firstName" name="firstName" placeholder={profileInfo.firstName!}/>
						</div>
						<div className="input">
							<label htmlFor="lastName">Last Name:</label>
							<input type="text" id="lastName" name="lastName" placeholder={profileInfo.lastName!} />
						</div>
						<div className="input">
							<label htmlFor="userName">Username:</label>
							<input type="text" id="userName" name="userName" placeholder={profileInfo.userName!} />
						</div>
						<div className="input">
							<label htmlFor="email">Email:</label>
							<input disabled type="text" id="email" placeholder={profileInfo.email!}/>
						</div>
						<button type='submit'>Save Changes</button>
					</form>
				</div>
			</div>
		</div >
	)
}

export default Profile