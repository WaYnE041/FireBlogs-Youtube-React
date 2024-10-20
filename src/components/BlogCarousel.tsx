import '../styles/BlogCarousel.css';
import { ReactComponent as Arrow } from '../assets/Icons/arrow-right-light.svg';
// import { useAuth } from '../contexts/UserContext';
import { Link } from "react-router-dom";
// import parse from 'html-react-parser';

function BlogPost({ posts, welcomeScreen }: {
	posts: {
		blogID: string;
		blogTitle: string;
		blogHTML: string;
		blogCoverPhoto: string;
	}[];
	welcomeScreen: boolean;
}) {
	// const { isAuth } = useAuth();

	// const getImageUrl = (name: string) => {
	// 	return new URL(`../assets/blogPhotos/${name}.webp`, import.meta.url).href;
	// }

	return (
		<div className="carousel">
			<div id="slider">
				{posts.map((_post, index) => {
					return (
						<><input type="radio" name="slider" id={"s" + (index + 1)}></input>
						</>
					)
				})}
				{posts.map((post, index) => {
					return (
						<>
							{welcomeScreen ? <h2 id={"title" + (index+1)}>{post.blogTitle}</h2> : <h2 id={"title" + (index+1)}>{post.blogTitle}</h2>}
						</>
					)
				})}
				{posts.map((post, index) => {
					return (
						<label htmlFor={"s" + (index+1)} id={"slide" + (index+1)}>
							<img src={post.blogCoverPhoto} alt="Blog Cover Photo" />
							<Link className="btn" to={`/view-blog/${post.blogID}`} >
											View The Post<Arrow className="arrow" />
										</Link>
							</label>
					)
				})}
			</div>

		</div>
	)
}

export default BlogPost;