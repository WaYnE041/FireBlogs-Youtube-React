import '../styles/Home.css';
import { ReactComponent as Arrow } from '../assets/Icons/arrow-right-light.svg';
import BlogPost from '../components/BlogPost';
import { useAuth } from '../contexts/UserContext';
import { useEffect } from 'react';
import { Link } from "react-router-dom";


function Home( { children }: { children: React.JSX.Element[] }) {
	const welcomeScreenPost = [{
		blogID: "-1",
		blogTitle: "Welcome!",
		blogHTML:
			"Weekly blog articles with all things programming including HTML, CSS, JavaScript and more. Register today to never miss a post!",
		blogCoverPhoto: "coding"
	}];

	useEffect(() => {
		document.title = "Home | DeadMarket";
		return () => {
			document.title = "DeadMarket";
		};
	}, []);

	const { isAuth } = useAuth();

	return (
		<div className='home'>
			{ !isAuth && (<BlogPost posts={welcomeScreenPost} welcomeScreen={true} />) }
			{ children[0] }

			{/* <div className="blog-card-wrap">
				<div className="container">
					<h3>View More Recent Blogs</h3>
					<div className="blog-cards">
						{ children[1] }
					</div>
				</div>
			</div> */}

			{ !isAuth && (
				<div className="updates">
					<div className="container">
						<h2>Never Miss A Post. Register For Your Free Account Today!</h2>
						<Link className="router-button" to="/register">
							Register for FireBlogs <Arrow className="arrow arrow-light" />
						</Link>
					</div>
				</div>
			)}
		</div>
	)
}

export default Home;