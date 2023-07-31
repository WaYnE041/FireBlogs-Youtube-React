import '../styles/ViewBlog.css'
import { useParams } from 'react-router-dom';
import parse from 'html-react-parser';

function ViewBlog({ postLoaded, blogPostList }: {
	postLoaded: boolean,
	blogPostList: {
		blogID: string,
		blogHTML: string,
		blogCoverPhoto: string,
		blogTitle: string,
		blogDate: number,
		welcomeScreen: boolean,
	}[]
}
) {
	const { blogid } = useParams()
	const index = blogPostList.findIndex(item => item.blogID === blogid);
	console.log(index)

	return (
		<div className="post-view">
			{ postLoaded &&
				<div className="container quillWrapper">
					<h2>{blogPostList[index].blogTitle}</h2>
					<h4>Posted on: {new Date(blogPostList[index].blogDate).toLocaleString("en-us", {dateStyle: "long"})}</h4>
					<img src={blogPostList[index].blogCoverPhoto} alt="Blog Cover Photo" />
					<div className="post-content ql-editor">
						{parse(blogPostList[index].blogHTML)}
					</div>
				</div>
			}
		</div>
	)
}

export default ViewBlog