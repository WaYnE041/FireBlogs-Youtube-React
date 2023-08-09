import '../styles/ViewBlog.css';
import { useEffect } from 'react';
import parse from 'html-react-parser';
import { useLocation } from 'react-router-dom';

function BlogPreview() {
	useEffect(() => {
        document.title = "Blog Preview | DeadMarket";
        return () => {
            document.title = "DeadMarket";
        };
    }, []);

	const location = useLocation();
  const data = location.state || undefined;

	return (
		<>
		{ data &&
			<div className="post-view">
			<div className="container quillWrapper">
				<h2>{ data.blogTitle }</h2>
				<img src={data.blogCoverPhoto} alt="Blog Cover Photo" />
				<div className="post-content ql-editor">
					{ parse(data.blogHTML) }
				</div>
			</div>
		</div>}
		</>
	)
}

export default BlogPreview;