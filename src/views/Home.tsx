import '../styles/Home.css';
import { useEffect } from 'react';

function Home( { children }: { children: React.JSX.Element }) {

	useEffect(() => {
		document.title = "Home | Market";
		return () => {
			document.title = "Market";
		};
	}, []);

	return (
		<div className='home'>
			{ children }
		</div>
	)
}

export default Home;