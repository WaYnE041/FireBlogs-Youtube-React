import './App.css';
import BlogCard from './components/BlogCard';
// import BlogPost from './components/BlogPost';
import BlogCarousel from './components/BlogCarousel';
import Loading from "./components/Loading";
import Footer from './components/Footer';
import Navigation from './components/Navigation';
import { useAuth } from './contexts/UserContext';
import GuardedRoutes from './routes/GuardedRoutes';
import Home from './views/Home';
import Blogs from './views/Blogs';
import ShoppingCart from './views/ShoppingCart';
import { useState, useEffect, Suspense, lazy } from 'react';
import { Routes, Route, useLocation } from "react-router-dom";
import About from './views/About';

function App() {

	const Admin = lazy(() => import('./views/Admin'));
	const BlogPreview = lazy(() => import('./views/BlogPreview'));
	const CreatePost = lazy(() => import('./views/CreatePost'));
	const EditPost = lazy(() => import('./views/EditPost'));
	const ForgotPassword = lazy(() => import('./views/ForgotPassword'));
	const Login = lazy(() => import('./views/Login'));
	const Profile = lazy(() => import('./views/Profile'));
	const Register = lazy(() => import('./views/Register'));
	const ViewBlog = lazy(() => import('./views/ViewBlog'));

	const location = useLocation();

	const [displayLocation, setDisplayLocation] = useState(location);
	const [transitionStage, setTransistionStage] = useState("fadeIn");
	const [editPostEnabled, setEditPostEnabled] = useState<boolean>(false);
	const [blogPostList, setBlogPostList] = useState<{
		blogID: string;
		blogHTML: string;
		blogCoverPhoto: string;
		blogCoverPhotoName: string;
		blogTitle: string;
		blogDate: number;
	}[]>([]);

	useEffect(() => {
		getPosts();
	}, []);

	//fade route transitions
	useEffect(() => {
		if (location !== displayLocation) setTransistionStage("fadeOut");
	}, [location]);

	const getPosts = async () => {
		try {
			const { db } = await import('./firebase/firebase-config');
			const { collection, getDocs, query, orderBy } = await import('firebase/firestore');

			const postCollectionRef = collection(db, "blogPosts");
			const dataQuery = query(postCollectionRef, orderBy("unixTimestamp", "desc"));

			const dbResult = await getDocs(dataQuery);
			const currentList = dbResult.docs.map((doc) => {
				return {
					blogID: doc.data().blogID,
					blogHTML: doc.data().blogHTML,
					blogCoverPhoto: doc.data().blogCoverPhoto,
					blogCoverPhotoName: doc.data().blogCoverPhotoName,
					blogTitle: doc.data().blogTitle,
					blogDate: doc.data().unixTimestamp
				}
			})

			setBlogPostList(currentList);
		} catch (error) {
			console.log(error);
		}
	}

	//Set State Functions
	const toggleEditPost = (value: boolean) => {
		setEditPostEnabled(value);
	}

	//gets post from id for edit post page
	const getCurrentPost = (id: string) => {
		const index = blogPostList.findIndex(item => item.blogID === id);
		return {
			blogId: blogPostList[index].blogID,
			blogHTML: blogPostList[index].blogHTML,
			blogCoverPhoto: blogPostList[index].blogCoverPhoto,
			blogCoverPhotoName: blogPostList[index].blogCoverPhotoName,
			blogTitle: blogPostList[index].blogTitle
		}
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
				blogDate: currentPost.blogDate
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
		return blogPostList.slice(0, 5);
	}
	//Return next 4 entries to display on homepage as cards
	const blogCardsFeed = () => {
		return blogPostList.slice(2, 6);
	}

	const disabledRoutes = ["/login", "/register", "/forgot-password"]

	const { isAuth, isAdmin } = useAuth();

	const isPageLoading = () => {
		if (isAuth === undefined || isAdmin === undefined || blogPostList.length === 0) {
			return true;
		}
		return false;
	}
	
	return (
		<>
			{isPageLoading() ? <Loading /> :
				<div
					className={`app-wrapper ${transitionStage}`}
					onAnimationEnd={() => {
						if (transitionStage === "fadeOut") {
							//Scroll To Top when Route Changes and fadeout ends
							window.scrollTo(0, 0);
							setEditPostEnabled(false)

							setTransistionStage("fadeIn");
							setDisplayLocation(location);	
							
						}
					}}
				>
					<div className="app">
						{!disabledRoutes.includes(location.pathname) && <Navigation />}
						<Suspense fallback={<Loading />}>
							<Routes location={displayLocation}>
								{/* Unguarded Routes */}
								<Route path="/"
									element={
										<Home>
											<BlogCarousel posts={blogPostsFeed()} welcomeScreen={false} />
											<BlogCard editPostEnabled={editPostEnabled} cards={blogCardsFeed()} deletePostAlignment={deletePostAlignment} />
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

								<Route path="/cart" element={ <ShoppingCart />} />

								<Route path="/about" element={ <About />} />

								{/* Non-Authenticated Routes: accessible only if user in not authenticated */}
								<Route element={<GuardedRoutes isRouteAccessible={!isAuth} redirectRoute={"/"} />}>
									<Route path="/forgot-password" element={<ForgotPassword />} />
									<Route path="/login" element={<Login />} />
									<Route path="/register" element={<Register />} />
								</Route>

								{/* Authenticated Routes */}
								<Route element={<GuardedRoutes isRouteAccessible={isAuth} redirectRoute={"/"} />}>
									<Route path="/profile" element={<Profile />} />
								</Route>

								{/* Authenticated & Admin Routes */}
								<Route element={<GuardedRoutes isRouteAccessible={isAuth && isAdmin} redirectRoute={"/"} />}>
									<Route path="/admin" element={<Admin />} />
									<Route path="/blog-preview" element={<BlogPreview />} />
									<Route path="/create-post" element={
										<CreatePost createPostAlignment={createPostAlignment} />
									} />
									<Route path="/edit-post/:routeid" element={
										<EditPost getCurrentPost={getCurrentPost} editPostAlignment={editPostAlignment} />
									} />
								</Route>

								{/* Not found Route */}
								<Route path="*" element={<p style={{ marginTop: 100 }}>Page Not Found</p>} />

							</Routes>
						</Suspense>
						{!disabledRoutes.includes(location.pathname) && <Footer />}
					</div>
				</div>
			}
		</>
	)
}

export default App;
