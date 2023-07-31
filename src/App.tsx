import './App.css'
import Navigation from './components/Navigation'
import Footer from './components/Footer';
import Home from './views/Home';
import CreatePost from './views/CreatePost';
import Login from './views/Login';
import Register from './views/Register';
import ForgotPassword from './views/ForgotPassword';
import Blogs from './views/Blogs';
import Profile from './views/Profile';
import Admin from './views/Admin';
import BlogPreview from './views/BlogPreview';
import EditPost from './views/EditPost';
import ViewBlog from './views/ViewBlog';
import GuardedRoutes from './GuardedRoutes';
import { useState, useEffect } from 'react'
import { auth } from './firebase/firebase-config';
import { Routes, Route, useLocation } from "react-router-dom";


function App(
	{ 
		isAuth, setIsAuth, 
		isAdmin, profileInfo, postLoaded,
		blogPostList, setBlogPostList
	 }: {
		isAuth: boolean,
		setIsAuth: React.Dispatch<React.SetStateAction<boolean | undefined>>
		isAdmin: boolean,
		profileInfo: {
			id: string, 
			email: string | null; 
			firstName:string | null;
			lastName: string | null;
			userName: string | null;
			initials: string | null;
		},
		postLoaded: boolean,
		blogPostList: {
			blogID: string,
			blogHTML: string,
			blogCoverPhoto: string,
			blogCoverPhotoName: string,
			blogTitle: string,
			blogDate: number,
			welcomeScreen: boolean,
		}[],
		setBlogPostList: React.Dispatch<React.SetStateAction<{
			blogID: string;
			blogHTML: string;
			blogCoverPhoto: string;
			blogCoverPhotoName: string;
			blogTitle: string;
			blogDate: number;
			welcomeScreen: boolean;
		}[]>>
	}
) {
	const disabledRoutes = ["/login", "/register", "/forgot-password"]

	const [editPostEnabled, setEditPostEnabled] = useState<boolean>(false);
	const [blogPost, setBlogPost] = useState<{
		id: string,
		title: string,
		blogHTML: string,
		blogCoverPhoto: string,
		blogCoverPhotoName: string,
        welcomeScreen: boolean,
	}>({ id: "", title: "", blogHTML: "", blogCoverPhoto: "", blogCoverPhotoName: "", welcomeScreen: false});
	

	//fix for strictmode double render

	useEffect(() => {
		console.log("isAuth is " + isAuth)
		console.log("isAdmin is " + isAdmin)
		console.log("isSignOut is " + (!isAuth && !isAdmin))

    }, [auth.currentUser]);


	return (
		<> 
			<div className="app-wrapper">
				<div className="app">
						{ !disabledRoutes.includes(useLocation().pathname) && <Navigation isAuth={isAuth} setIsAuth={setIsAuth} isAdmin={isAdmin} profileInfo={profileInfo} />}
						<Routes>
							{/* Unguarded Routes */}
							<Route path="/" element={<Home isAuth={isAuth} blogPostList={blogPostList} editPostEnabled={editPostEnabled} setBlogPostList={setBlogPostList}/>} />
							<Route path="/blogs" element={<Blogs isAdmin={isAdmin} blogPostList={blogPostList} editPostEnabled={editPostEnabled} setEditPostEnabled={setEditPostEnabled} setBlogPostList={setBlogPostList}/>} />
							<Route path="/view-blog/:blogid" element={<ViewBlog postLoaded={postLoaded} blogPostList={blogPostList} />} />

							{/* Non-Authenticated Routes: accessible only if user in not authenticated */}
							<Route element={<GuardedRoutes isRouteAccessible={!isAuth} redirectRoute={"/"}/>}>
								<Route path="/forgot-password" element={<ForgotPassword />} />
								<Route path="/login" element={<Login setIsAuth={setIsAuth} />} />
								<Route path="/register" element={<Register />} />
							</Route>

							{/* Authenticated Routes */}
							<Route element={<GuardedRoutes isRouteAccessible={isAuth} redirectRoute={"/"}/>}>
								<Route path="/profile" element={<Profile profileInfo={profileInfo} />} />
							</Route>

							{/* Authenticated & Admin Routes */}
							<Route element={<GuardedRoutes isRouteAccessible={isAuth && isAdmin} redirectRoute={"/"}/>}>
								<Route path="/admin" element={<Admin />} />
								<Route path="/blog-preview" element={<BlogPreview blogPost={blogPost} />} />
								<Route path="/create-post" element={<CreatePost profileId={profileInfo.id} blogPost={blogPost} setBlogPost={setBlogPost} setBlogPostList={setBlogPostList} />} />
								<Route path="/edit-blog/:blogid" element={<EditPost blogPost={blogPost} setBlogPost={setBlogPost} blogPostList={blogPostList} setBlogPostList={setBlogPostList} />} />
							</Route>

							{/* Not found Route */}
							<Route path="*" element={<p>Page Not Found</p>} />
						
						</Routes>
						{ !disabledRoutes.includes(useLocation().pathname) && <Footer isAuth={isAuth} isAdmin={isAdmin} />}
				</div>
			</div>
		</>
	)
}

export default App
