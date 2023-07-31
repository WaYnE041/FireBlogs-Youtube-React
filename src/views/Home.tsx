import '../styles/Home.css'
import BlogPost from '../components/BlogPost'
import BlogCard from '../components/BlogCard'
import { ReactComponent as Arrow } from '../assets/Icons/arrow-right-light.svg'
import { Link } from "react-router-dom";
//import { NavLink } from "react-router-dom";
import { useEffect } from 'react'

function Home(
	{ isAuth, blogPostList, editPostEnabled, setBlogPostList }: {
		isAuth: boolean,
		blogPostList: {
            blogID: string,
            blogHTML: string,
            blogCoverPhoto: string,
            blogTitle: string,
            blogDate: number,
            welcomeScreen: boolean,
        }[],
		editPostEnabled: boolean,
		setBlogPostList: React.Dispatch<React.SetStateAction<{
			blogID: string;
			blogHTML: string;
			blogCoverPhoto: string;
			blogCoverPhotoName: string,
			blogTitle: string;
			blogDate: number;
			welcomeScreen: boolean;
		}[]>>
	}
) {

	const blogPostsFeed = () => {
		return blogPostList.slice(0,2)
	}
	const blogCardsFeed = () => {
		return blogPostList.slice(2,6)
	}

	const welcomeScreen = {
		blogID: "",
		blogTitle: "Welcome!",
		blogHTML:
			"Weekly blog articles with all things programming including HTML, CSS, JavaScript and more. Register today to never miss a post!",
		blogCoverPhoto: "coding",
		welcomeScreen: true,
	}

	useEffect(() => {
		document.title = "Home | DeadMarket"
		return () => {
			document.title = "DeadMarket"
		};
	}, []);

	return (
		<div className='home'>
			{!isAuth && (<BlogPost isAuth={isAuth} post={welcomeScreen} />)}
			{blogPostsFeed().map((post) => {
				return (
					<BlogPost isAuth={isAuth} key={post.blogID} post={post} />
				);
			})}

			<div className="blog-card-wrap">
				<div className="container">
					<h3>View More Recent Blogs</h3>
					<div className="blog-cards">
						{blogCardsFeed().map((card) => {
							return (
								<BlogCard key={card.blogID} editPostEnabled={editPostEnabled} card={card} setBlogPostList={setBlogPostList}/>
							);
						})}
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