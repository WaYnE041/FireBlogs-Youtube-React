/**
* See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const { onCall } = require("firebase-functions/v2/https");
const { getAuth } = require("firebase-admin/auth");
const { initializeApp } = require('firebase-admin/app');
const admin = initializeApp();

exports.addAdminRole = onCall(async (request) => {
	try {
		const user = await getAuth(admin).getUserByEmail(request.data.email)
		await getAuth(admin).setCustomUserClaims(user.uid, {admin: true});
		return {message: `Success! ${request.data.email} has been made an admin!!`};
	} catch (error) {
		console.log(error)
		throw new Error({
			message: `Failure! ${error} `,
		});
	}
});


