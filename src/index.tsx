import React, { useState, useEffect, useRef } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { BrowserRouter } from "react-router-dom";
import { auth, db } from './firebase/firebase-config';
import { onAuthStateChanged } from "firebase/auth";
import { doc, collection, getDoc, getDocs, query, orderBy } from 'firebase/firestore';
import Loading from './components/Loading.tsx';


function AppWithCallbackAfterRender() {
	const [isAuth, setIsAuth] = useState<boolean>();
	const [isAdmin, setIsAdmin] = useState<boolean>(false);
	const [profileInfo, setProfileInfo] = useState<{
		id: string, 
			email: string | null; 
			firstName:string | null;
			lastName: string | null;
			userName: string | null;
			initials: string | null;
	}>({ id: "null", email: null, firstName: null, lastName: null, userName: null, initials: null});
	const [blogPostList, setBlogPostList] = useState<{
		blogID: string,
		blogHTML: string,
		blogCoverPhoto: string,
		blogCoverPhotoName: string,
		blogTitle: string,
		blogDate: number,
        welcomeScreen: boolean,
	}[]>([]);
	const [postLoaded, setPostLoaded] = useState<boolean>(false);

	const getCurrentUser = async () => {
		onAuthStateChanged(auth, async (user) => {
			if (user) {
				user.getIdTokenResult()
					.then(tokenResult => {
						//console.log(`${user.email} user token is ${tokenResult.claims.admin}`);
						if(tokenResult.claims.admin === true ){
							setIsAdmin(true)		
						} else {
							setIsAdmin(false)
						}
						//console.log(`isAdmin ${user.email} is ${isAdmin}`)
					});
				const docRef = doc(db, "users", user.uid);
				try {
					const docSnap = await getDoc(docRef);
					if(docSnap.exists()) {
						setProfileInfo({
							id: docSnap.id,
							email: docSnap.data().email,
							firstName: docSnap.data().firstName,
							lastName: docSnap.data().lastName,
							userName: docSnap.data().userName,
							initials: docSnap.data().firstName.match(/(\b\S)?/g).join("") + docSnap.data().lastName.match(/(\b\S)?/g).join("")
						})
						//console.log(profileInfo)
						setIsAuth(true)
					} else {
						console.log("Document does not exist")
					}
				
				} catch(error) {
					console.log(error)
				}
			} else {
				console.log("user is signed out")
				setProfileInfo({
					id: "",
					email: null,
					firstName: null,
					lastName: null,
					userName: null,
					initials: null
				})
				setIsAuth(false)
			}
		})
	}
	const getPosts = async () => {
		const postCollectionRef = collection(db, "blogPosts",)
		const dataQuery = query(postCollectionRef, orderBy("unixTimestamp", "desc"));
		const dbResult = await getDocs(dataQuery)
    	dbResult.docs.forEach((doc) => {
			if (!blogPostList.some(post => post.blogID === doc.id)){
				const data: {
					blogID: string,
					blogHTML: string,
					blogCoverPhoto: string,
					blogCoverPhotoName: string
					blogTitle: string,
					blogDate: number,
					welcomeScreen: boolean
				} = {
					blogID: doc.data().blogID,
					blogHTML: doc.data().blogHTML,
					blogCoverPhoto: doc.data().blogCoverPhoto,
					blogCoverPhotoName: doc.data().blogCoverPhotoName,					
					blogTitle: doc.data().blogTitle,
					blogDate: doc.data().unixTimestamp,
					welcomeScreen: false
				}
				setBlogPostList(current => [...current, data])
				setPostLoaded(true)
			}
		})
	}

	//fix for strictmode double render
	const effectRan = useRef(false)

	useEffect(() => {
		console.log(isAuth)
		getCurrentUser();
		if(effectRan.current === false) {
			getPosts();
		}
		return () => {
			effectRan.current = true
		}

    }, [auth.currentUser]);


return (
	<>
	{ isAuth === undefined ?
	<Loading />
	:
	<BrowserRouter>
		<App isAuth={isAuth} setIsAuth={setIsAuth} 
			 isAdmin={isAdmin} profileInfo={profileInfo} postLoaded={postLoaded}
			 blogPostList={blogPostList} setBlogPostList={setBlogPostList}/>
	</BrowserRouter>
	}
	</>
	)
}

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<AppWithCallbackAfterRender/>
	</React.StrictMode>,
)
