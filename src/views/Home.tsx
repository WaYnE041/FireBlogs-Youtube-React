import '../styles/Home.css';
import { ReactComponent as Arrow } from '../assets/Icons/arrow-right-light.svg';
import { useAuth } from '../contexts/UserContext';
import { useEffect } from 'react';
import { Link } from "react-router-dom";


function Home( { children }: { children: React.JSX.Element }) {

	useEffect(() => {
		document.title = "Home | Market";
		return () => {
			document.title = "Market";
		};
	}, []);

	const { isAuth } = useAuth();

	return (
		<div className='home'>
			{ children }

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