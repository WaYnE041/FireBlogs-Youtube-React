import '../styles/BlogPreview.css'
import parse from 'html-react-parser';

function BlogPreview({ blogPost }: {
	blogPost: {
		id: string | null,
		title: string;
		blogHTML: string;
		blogCoverPhoto: string;
		welcomeScreen: boolean;
	}
}) {
	return (
		<div className="post-view">
			<div className="container quillWrapper">
				<h2>{blogPost.title}</h2>
				<img src={blogPost.blogCoverPhoto} alt="Blog Cover Photo" />
				<div className="post-content ql-editor">
					{parse(blogPost.blogHTML)}
				</div>
			</div>
		</div>
	)
}

export default BlogPreview