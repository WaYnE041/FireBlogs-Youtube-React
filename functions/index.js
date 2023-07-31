/**
* See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onCall, HttpsError} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const { getAuth } = require("firebase-admin/auth");
const { initializeApp } = require('firebase-admin/app');
const admin = initializeApp();

exports.addAdminRole = onCall((request)  => {
  return getAuth(admin).getUserByEmail(request.data.email)
    .then((user) => {
      return getAuth(admin).setCustomUserClaims(user.uid, {
        admin: true,
      });
    })
    .then(() => {
      return {
        message: `Success! ${request.data.email} has been made an admin!!`,
      };
    })
    .catch((err) => {
      console.log(err);
			return {
        message: `Failure! ${err} `,
      };
    });
});


