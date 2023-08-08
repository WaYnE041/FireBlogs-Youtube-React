import '../styles/ViewBlog.css';
import { useEffect } from 'react';
import parse from 'html-react-parser';

function BlogPreview({ blogPost }: {
	blogPost: {
		blogHTML: string;
		blogCoverPhoto: string;
		blogTitle: string;
	}
}) {
	useEffect(() => {
        document.title = "Blog Preview | DeadMarket";
        return () => {
            document.title = "DeadMarket";
        };
    }, []);

	return (
		<div className="post-view">
			<div className="container quillWrapper">
				<h2>{ blogPost.blogTitle }</h2>
				<img src={blogPost.blogCoverPhoto} alt="Blog Cover Photo" />
				<div className="post-content ql-editor">
					{ parse(blogPost.blogHTML) }
				</div>
			</div>
		</div>
	)
}

export default BlogPreview;