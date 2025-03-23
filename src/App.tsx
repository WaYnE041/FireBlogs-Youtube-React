import './App.css';
import BlogCarousel from './components/BlogCarousel';
import Loading from "./components/Loading";
import Footer from './components/Footer';
import Navigation from './components/Navigation';
import { useAuth } from './contexts/UserContext';
import GuardedRoutes from './routes/GuardedRoutes';
import Home from './views/Home';
import { useState, useEffect, Suspense, lazy } from 'react';
import { Routes, Route, useLocation } from "react-router-dom";
import About from './views/About';

function App() {
	const ShoppingCart = lazy(() => import('./views/ShoppingCart'));
	const Admin = lazy(() => import('./views/Admin'));
	const ForgotPassword = lazy(() => import('./views/ForgotPassword'));
	const Login = lazy(() => import('./views/Login'));
	const Profile = lazy(() => import('./views/Profile'));
	const Register = lazy(() => import('./views/Register'));

	const location = useLocation();

	const [displayLocation, setDisplayLocation] = useState(location);
	const [transitionStage, setTransistionStage] = useState("fadeIn");
	//const [editPostEnabled, setEditPostEnabled] = useState<boolean>(false);
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
							//setEditPostEnabled(false)

							setTransistionStage("fadeIn");
							setDisplayLocation(location);	
							
						}
					}}
				>
					{!disabledRoutes.includes(location.pathname) && <Navigation />}
					
					<div className="app">
						<Suspense fallback={<Loading />}>
							<Routes location={displayLocation}>
								{/* Unguarded Routes */}
								<Route path="/"
									element={
										<Home>
											<BlogCarousel />
										</Home>
									}
								/>
								<Route path="/cart" element={ <ShoppingCart />} />
								<Route path="/about" element={ <About />} />
								{/* <Route path="/view-blog/:blogid" element={<ViewBlog blogPostList={blogPostList} />} /> */}

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
