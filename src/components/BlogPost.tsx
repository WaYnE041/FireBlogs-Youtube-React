import '../styles/BlogPost.css'
import { useAuth } from '../contexts/UserContext';
import { ReactComponent as Arrow } from '../assets/Icons/arrow-right-light.svg'
import { Link } from "react-router-dom";
//import { NavLink } from "react-router-dom";
import parse from 'html-react-parser';


function BlogPost({  posts }: { 
	posts: { 
		blogID: string
		blogTitle: string; 
		blogHTML: string; 
		blogCoverPhoto: string; 
		welcomeScreen: boolean; 
	}[] 
}) 
{
	const { isAuth } = useAuth()
	
	const getImageUrl = (name: string) => {
		return new URL(`../assets/blogPhotos/${name}.jpg`, import.meta.url).href
	}

	return (
		<>
			{posts.map((post) => {
				return (
					<div key={post.blogID} className={!isAuth() ? "blog-wrapper no-user" : "blog-wrapper"}>
						<div className="blog-content">
							<div>
								<h2>{post.blogTitle}</h2>
								{post.welcomeScreen ?
									<p>{post.blogHTML}</p>
									:
									<div className="content-preview">
										{parse(post.blogHTML)}
									</div>
								}

								{post.welcomeScreen ?
									<Link className="link link-light" to="/login">
										Login/Register<Arrow className="arrow arrow-light" />
									</Link>
									:
									<Link className="link" to={`/view-blog/${post.blogID}`} >
										View The Post<Arrow className="arrow" />
									</Link>
								}
							</div>
						</div>
						<div className="blog-photo">
						{	
						post.welcomeScreen ?
							<img src={getImageUrl(post.blogCoverPhoto)} alt="Blog Cover Photo" /> 
							:
							<img src={post.blogCoverPhoto} alt="Blog Cover Photo" /> 
						}
						</div>
					</div>
				)
			})}
		</>	
	)
}

export default BlogPost