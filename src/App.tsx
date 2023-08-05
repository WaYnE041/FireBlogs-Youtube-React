import './App.css';
import BlogCard from './components/BlogCard';
import BlogPost from './components/BlogPost';
import Footer from './components/Footer';
import Navigation from './components/Navigation';
import { useAuth } from './contexts/UserContext';
import GuardedRoutes from './routes/GuardedRoutes';
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
import { useState, useEffect, useRef } from 'react';
import { Routes, Route, useLocation } from "react-router-dom";
import { db } from './firebase/firebase-config';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

function App() {
	const [editPostEnabled, setEditPostEnabled] = useState<boolean>(false);
	const [blogPost, setBlogPost] = useState<{
		blogId: string;
		blogHTML: string;
		blogCoverPhoto: string;
		blogCoverPhotoName: string;
		blogTitle: string;
        welcomeScreen: boolean;
	}>({
		blogId: "", 
		blogHTML: "", 
		blogCoverPhoto: "", 
		blogCoverPhotoName: "", 
		blogTitle: "", 
		welcomeScreen: false
	});
	const [blogPostList, setBlogPostList] = useState<{
		blogID: string;
		blogHTML: string;
		blogCoverPhoto: string;
		blogCoverPhotoName: string;
		blogTitle: string;
		blogDate: number;
        welcomeScreen: boolean;
	}[]>([]);

	//fix for strictmode double render
	const effectRan = useRef(false);
	useEffect(() => {
		if(effectRan.current === false) {
			getPosts();
		}
		return () => {
			effectRan.current = true;
		}
    }, []);

	const getPosts = async () => {
		const postCollectionRef = collection(db, "blogPosts");
		const dataQuery = query(postCollectionRef, orderBy("unixTimestamp", "desc"));
		
		try {
			const dbResult = await getDocs(dataQuery);
			dbResult.docs.forEach((doc) => {
				if (!blogPostList.some(post => post.blogID === doc.id)) {
					const data = {
						blogID: doc.data().blogID,
						blogHTML: doc.data().blogHTML,
						blogCoverPhoto: doc.data().blogCoverPhoto,
						blogCoverPhotoName: doc.data().blogCoverPhotoName,					
						blogTitle: doc.data().blogTitle,
						blogDate: doc.data().unixTimestamp,
						welcomeScreen: false
					};
					setBlogPostList(current => [...current, data]);
				}
			});
		} catch (error) {
            console.log(error);
        }
	}

	//Set State Functions
	const toggleEditPost = (value: boolean) => {
		setEditPostEnabled(value);
	}

	const resetCurrentPost = (id: string) => {
		const index = blogPostList.findIndex(item => item.blogID === id);
		setBlogPost({
			blogId: blogPostList[index].blogID,
			blogHTML: blogPostList[index].blogHTML,
			blogCoverPhoto: blogPostList[index].blogCoverPhoto,
			blogCoverPhotoName: blogPostList[index].blogCoverPhotoName,
			blogTitle: blogPostList[index].blogTitle,
			welcomeScreen: false,
		});
	}

	const editCurrentPost = (
		currentPost: { 
			blogId: string;
			blogHTML: string;
			blogCoverPhoto: string;
			blogCoverPhotoName: string;
			blogTitle: string;
			welcomeScreen: boolean;
		}) => {
			setBlogPost(currentPost);
	}

	// Realigns Front-End List with Back-End List after 
	// Create, Edit or Delete without causing a rerender
	const createPostAlignment = (
		currentPost: {
			blogID: string;
			blogHTML: string;
			blogCoverPhoto: string;
			blogCoverPhotoName: string;
			blogTitle: string;
			blogDate: number;
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
		]);
	}

	const editPostAlignment = (
		currentPost: {
			blogID: string;
			blogHTML: string;
			blogCoverPhoto?: string;
			blogCoverPhotoName?: string;
			blogTitle: string;
		}) => {
			const index = blogPostList.findIndex(item => item.blogID === currentPost.blogID);
			const newBlogPostsList = blogPostList.slice();

			newBlogPostsList[index] = {
				blogID: newBlogPostsList[index].blogID,
				blogHTML: currentPost.blogHTML,
				blogCoverPhoto: currentPost.blogCoverPhoto ? currentPost.blogCoverPhoto : newBlogPostsList[index].blogCoverPhoto,
				blogCoverPhotoName: currentPost.blogCoverPhotoName ? currentPost.blogCoverPhotoName : newBlogPostsList[index].blogCoverPhotoName,
				blogTitle: currentPost.blogTitle,
				blogDate: newBlogPostsList[index].blogDate,
				welcomeScreen: false
			} 

			setBlogPostList(newBlogPostsList);
	}

	const deletePostAlignment = (id: string) => {
		setBlogPostList(current =>
			current.filter((x) => x.blogID !== id)
	  	);
	}

	//Return first 2 entries to display as homepage feed
	const blogPostsFeed = () => {
		return blogPostList.slice(0,2);
	} 
	//Return next 4 entries to display on homepage as cards
	const blogCardsFeed = () => {
		return blogPostList.slice(2,6);
	}

	const { isAuth, isAdmin } = useAuth();
	const disabledRoutes = ["/login", "/register", "/forgot-password"]
	
	return (
		<div className="app-wrapper">
			<div className="app">
					{ !disabledRoutes.includes(useLocation().pathname) && <Navigation /> }
					<Routes>
						{/* Unguarded Routes */}
						<Route path="/" 
							element={
								<Home>
									<BlogPost posts={blogPostsFeed()} />
									<BlogCard editPostEnabled={editPostEnabled} cards={blogCardsFeed()} deletePostAlignment={deletePostAlignment}/>
								</Home>
							} 
						/>
						<Route path="/blogs" 
							element={
								<Blogs toggleEditPost={toggleEditPost}>
									<BlogCard editPostEnabled={editPostEnabled} cards={blogPostList} deletePostAlignment={deletePostAlignment} />
								</Blogs>
							} 
						/>
						<Route path="/view-blog/:blogid" element={<ViewBlog blogPostList={blogPostList} />} />

						{/* Non-Authenticated Routes: accessible only if user in not authenticated */}
						<Route element={<GuardedRoutes isRouteAccessible={!isAuth} redirectRoute={"/"}/>}>
							<Route path="/forgot-password" element={<ForgotPassword />} />
							<Route path="/login" element={<Login />} />
							<Route path="/register" element={<Register />} />
						</Route>

						{/* Authenticated Routes */}
						<Route element={<GuardedRoutes isRouteAccessible={isAuth} redirectRoute={"/"}/>}>
							<Route path="/profile" element={<Profile />} />
						</Route>

						{/* Authenticated & Admin Routes */}
						<Route element={<GuardedRoutes isRouteAccessible={isAuth && isAdmin} redirectRoute={"/"}/>}>
							<Route path="/admin" element={<Admin />} />
							<Route path="/blog-preview" element={<BlogPreview blogPost={blogPost} />} />
							<Route path="/create-post" element={
								<CreatePost blogPost={blogPost} editCurrentPost={editCurrentPost} createPostAlignment={createPostAlignment} />
							} />
							<Route path="/edit-blog/:routeid" element={
								<EditPost blogPost={blogPost} resetCurrentPost={resetCurrentPost} editCurrentPost={editCurrentPost} editPostAlignment={editPostAlignment} />
							} />
						</Route>

						{/* Not found Route */}
						<Route path="*" element={<p>Page Not Found</p>} />
					
					</Routes>
					{ !disabledRoutes.includes(useLocation().pathname) && <Footer /> }
			</div>
		</div>
	)
}

export default App;
