import '../styles/ViewBlog.css';
import Loading from "../components/Loading";
import { useEffect } from 'react'
import { useParams } from 'react-router-dom';
import parse from 'html-react-parser';

function ViewBlog({ blogPostList }: {
	blogPostList: {
		blogID: string;
		blogHTML: string;
		blogCoverPhoto: string;
		blogTitle: string;
		blogDate: number;
	}[];
}) {
	useEffect(() => {
		document.title = "View Blog | DeadMarket";
		return () => {
			document.title = "DeadMarket";
		};
	}, []);

	const { blogid } = useParams();
	const index = blogPostList.findIndex(item => item.blogID === blogid);

	return (
		<>
			{
				blogPostList.length === 0 ? <Loading /> :
					<div className="post-view">
						<div className="container quillWrapper">
							<h2>{blogPostList[index].blogTitle}</h2>
							<h4>
								Posted on: {
									new Date(blogPostList[index].blogDate)
										.toLocaleString("en-us", { dateStyle: "long" })
								}
							</h4>
							<img src={blogPostList[index].blogCoverPhoto} alt="Blog Cover Photo" />
							<div className="post-content ql-editor">
								{parse(blogPostList[index].blogHTML)}
							</div>
						</div>
					</div>
			}
		</>
	)
}

export default ViewBlog;