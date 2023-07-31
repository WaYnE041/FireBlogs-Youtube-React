import { initializeApp, } from "firebase/app";
import { getFirestore, serverTimestamp} from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth"
import { getStorage } from "firebase/storage";

// import "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAfjjW69M6meALXO3mbsnDn1x4koYvR_7U",
  authDomain: "fireblogsyt-f77cc.firebaseapp.com",
  projectId: "fireblogsyt-f77cc",
  storageBucket: "fireblogsyt-f77cc.appspot.com",
  messagingSenderId: "902188478911",
  appId: "1:902188478911:web:85fe078a2156190d92b10a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const storage = getStorage(app)
export const timestamp = serverTimestamp
