import '../styles/Home.css'
import BlogPost from '../components/BlogPost'
import { ReactComponent as Arrow } from '../assets/Icons/arrow-right-light.svg'
import { Link } from "react-router-dom";
//import { NavLink } from "react-router-dom";
import { useEffect } from 'react'

function Home( { isAuth, children }: 
	{  isAuth: boolean, children: React.JSX.Element[],}) {

	const welcomeScreen = [{
		blogID: "",
		blogTitle: "Welcome!",
		blogHTML:
			"Weekly blog articles with all things programming including HTML, CSS, JavaScript and more. Register today to never miss a post!",
		blogCoverPhoto: "coding",
		welcomeScreen: true,
	}]

	useEffect(() => {
		document.title = "Home | DeadMarket"
		return () => {
			document.title = "DeadMarket"
		};
	}, []);

	return (
		<div className='home'>
			{!isAuth && (<BlogPost isAuth={isAuth} posts={welcomeScreen} />)}
			{children[0]}

			<div className="blog-card-wrap">
				<div className="container">
					<h3>View More Recent Blogs</h3>
					<div className="blog-cards">
						{children[1]}
					</div>
				</div>
			</div>
			{!isAuth && (
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

export default Home