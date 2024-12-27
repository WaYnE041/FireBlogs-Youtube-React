import '../styles/Admin.css';
import { useState, useEffect } from 'react';

function Admin() {
	const [adminEmail, setAdminEmail] = useState<string>();
	const [message, setMessage] = useState<string>("");

	useEffect(() => {
        document.title = "Admin | Market";
        return () => {
            document.title = "Market";
        };
    }, []);
	
	const addAdmin = async () => {
		try {
			const { app } = await import("../firebase/firebase-config");
			const { getFunctions, httpsCallable } = await import("firebase/functions");

			const functions = getFunctions(app, 'us-central1');
			if(!!adminEmail) {
				const addAdminRole = httpsCallable<{ email: string }, Promise<{message: string}>>(functions, 'addAdminRole');
				const p = await addAdminRole({ email: adminEmail });
				const data = await p.data;
				setMessage(data.message);
			}
		} catch (error:any) {
			console.log(error);
		}	
	}

	return (
		<div className="admin">
			<div className="container">
				<h2>Administration</h2>
				<div className="admin-info">
					<h2>Add Admin</h2>
					<div className="input">
						<input placeholder="Enter user email to make them an admin" type="text" id="addAdmins" onChange={e => setAdminEmail(e.target.value)} />
					</div>
					<span>{message}</span>
					<button onClick={addAdmin} className="button">Submit</button>
				</div>
			</div>
		</div>
	)
}

export default Admin;