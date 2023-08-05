import '../styles/BlogCard.css';
import '../assets/blogCards/stock-1.jpg';
import { ReactComponent as Arrow } from '../assets/Icons/arrow-right-light.svg';
import { ReactComponent as Edit } from '../assets/Icons/edit-regular.svg';
import { ReactComponent as Delete } from '../assets/Icons/trash-regular.svg';
import { Link, useNavigate } from "react-router-dom";
import { db } from '../firebase/firebase-config';
import { doc, deleteDoc } from 'firebase/firestore';

function BlogCard({ editPostEnabled, cards, deletePostAlignment }: {
	editPostEnabled: boolean;
	cards: {
		blogID: string;
		blogTitle: string;
		blogDate: number;
		blogCoverPhoto: string;
	}[];
	deletePostAlignment: (id: string) => void;
}) {

	const navigate = useNavigate();

	const deletePost = async (id: string) => {
		const postDoc = doc(db, "blogPosts", id);
		await deleteDoc(postDoc);

		//aligns front end with backend without rerender
		deletePostAlignment(id);
	}

	const editPost = async (id: string) => {
		navigate(`/edit-blog/${id}`);
	}

	return (
		<>
			{cards.map((card) => {
				return (
					<div key={card.blogID} className='blog-card'>
						{editPostEnabled &&
							<div className="icons">
								<div className="icon" onClick={() => editPost(card.blogID)}>
									<Edit className="edit" />
								</div>
								<div className="icon" onClick={() => deletePost(card.blogID)}>
									<Delete className="delete" />
								</div>
							</div>
						}
						<img src={card.blogCoverPhoto} alt="Blog Cover Photo" />
						<div className="info">
							<h4>
								{card.blogTitle}
							</h4>
							<h6>Posted on: {new Date(card.blogDate).toLocaleString("en-us", { dateStyle: "long" })}</h6>
							<Link className="link" to={`/view-blog/${card.blogID}`}>
								View The Post<Arrow className="arrow" />
							</Link>
						</div>
					</div>
				)
			})}
		</>
	)
}

export default BlogCard;