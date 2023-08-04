import './App.css'
import BlogCard from './components/BlogCard';
import BlogPost from './components/BlogPost';
import Footer from './components/Footer';
import Navigation from './components/Navigation'
import Admin from './views/Admin';
import BlogPreview from './views/BlogPreview';
import Blogs from './views/Blogs';
import CreatePost from './views/CreatePost';
import EditPost from './views/EditPost';
import ForgotPassword from './views/ForgotPassword';
import Home from './views/Home';
import Login from './views/Login';
import Profile from './views/Profile';
import Register from './views/Register';
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

	//Set State Functions ---------------------------------
	const changeAuth = (value: boolean) => {
		setIsAuth(value);
	};

	const toggleEditPost = (value: boolean) => {
		setEditPostEnabled(value)
	}

	const resetCurrentPost = (id: string) => {
		const index = blogPostList.findIndex(item => item.blogID === id);
		setBlogPost({
			id: blogPostList[index].blogID,
			title: blogPostList[index].blogTitle,
			blogHTML: blogPostList[index].blogHTML,
			blogCoverPhoto: blogPostList[index].blogCoverPhoto,
			blogCoverPhotoName: blogPostList[index].blogCoverPhotoName,
			welcomeScreen: false,
		})
	}

	const editCurrentPost = (
		currentPost: { 
			id: string,
			title: string,
			blogHTML: string,
			blogCoverPhoto: string,
			blogCoverPhotoName: string,
			welcomeScreen: boolean
		}) => {
			setBlogPost(currentPost)
	}

	// Realigns Front-End List with Back-End List after Create, Edit or Delete without causing a rerender
	const createPostAlignment = (
		currentPost: {
			blogID: string,
			blogHTML: string,
			blogCoverPhoto: string,
			blogCoverPhotoName: string,
			blogTitle: string,
			blogDate: number
		}) => {
		setBlogPostList(current => [
			{
				blogID: currentPost.blogID,
				blogHTML: currentPost.blogHTML,
				blogCoverPhoto: currentPost.blogCoverPhoto,
				blogCoverPhotoName: currentPost.blogCoverPhotoName,
				blogTitle: currentPost.blogTitle,
				blogDate: currentPost.blogDate,
				welcomeScreen: false
			},
			...current
		])
	}

	const editPostAlignment = (
		currentPost: {
			blogID: string,
			blogHTML: string,
			blogCoverPhoto?: string,
			blogCoverPhotoName?: string,
			blogTitle: string,
		}) => {
			const index = blogPostList.findIndex(item => item.blogID === currentPost.blogID);
			const newBlogPostsList = blogPostList.slice() 

			newBlogPostsList[index] = {
				blogID: newBlogPostsList[index].blogID,
				blogHTML: currentPost.blogHTML,
				blogCoverPhoto: currentPost.blogCoverPhoto ? currentPost.blogCoverPhoto : newBlogPostsList[index].blogCoverPhoto,
				blogCoverPhotoName: currentPost.blogCoverPhotoName ? currentPost.blogCoverPhotoName : newBlogPostsList[index].blogCoverPhotoName,
				blogTitle: currentPost.blogTitle,
				blogDate: newBlogPostsList[index].blogDate,
				welcomeScreen: false
			} 

			setBlogPostList(newBlogPostsList)
	}

	const deletePostAlignment = (id: string) => {
		setBlogPostList(current =>
			current.filter((x) => x.blogID !== id)
	  	)
	};
	// -------------------------------------------------------

	//Return first 2 entries to display as homepage feed
	const blogPostsFeed = () => {
		return blogPostList.slice(0,2)
	}
	//Return next 4 entries to display on homepage as cards
	const blogCardsFeed = () => {
		return blogPostList.slice(2,6)
	}

	const disabledRoutes = ["/login", "/register", "/forgot-password"]

	return (
		<> 
			<div className="app-wrapper">
				<div className="app">
						{ !disabledRoutes.includes(useLocation().pathname) && <Navigation isAuth={isAuth} isAdmin={isAdmin} changeAuth={changeAuth} profileInfo={profileInfo} />}
						<Routes>
							{/* Unguarded Routes */}
							<Route path="/" 
								element={
									<Home isAuth={isAuth}>
										<BlogPost isAuth={isAuth} posts={blogPostsFeed()} />
										<BlogCard editPostEnabled={editPostEnabled} cards={blogCardsFeed()} deletePostAlignment={deletePostAlignment}/>
									</Home>
								} 
							/>
							<Route path="/blogs" 
								element={
									<Blogs isAdmin={isAdmin} toggleEditPost={toggleEditPost}>
										<BlogCard editPostEnabled={editPostEnabled} cards={blogPostList} deletePostAlignment={deletePostAlignment} />
									</Blogs>
								} 
							/>
							<Route path="/view-blog/:blogid" element={<ViewBlog postLoaded={postLoaded} blogPostList={blogPostList} />} />

							{/* Non-Authenticated Routes: accessible only if user in not authenticated */}
							<Route element={<GuardedRoutes isRouteAccessible={!isAuth} redirectRoute={"/"}/>}>
								<Route path="/forgot-password" element={<ForgotPassword />} />
								<Route path="/login" element={<Login changeAuth={changeAuth} />} />
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
								<Route path="/create-post" element={
									<CreatePost profileId={profileInfo.id} blogPost={blogPost} editCurrentPost={editCurrentPost} createPostAlignment={createPostAlignment} />
								} />
								<Route path="/edit-blog/:routeid" element={
									<EditPost blogPost={blogPost} resetCurrentPost={resetCurrentPost} editCurrentPost={editCurrentPost} editPostAlignment={editPostAlignment} />
								} />
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
