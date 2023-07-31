import '../styles/Blogs.css'
import BlogCard from '../components/BlogCard'
import { useEffect } from 'react'

function Blogs(
    { isAdmin, blogPostList, editPostEnabled, setEditPostEnabled, setBlogPostList }: {
        isAdmin: boolean,
        blogPostList: {
            blogID: string,
            blogHTML: string,
            blogCoverPhoto: string,
            blogTitle: string,
            blogDate: number,
            welcomeScreen: boolean,
        }[],      
        editPostEnabled: boolean,
        setEditPostEnabled: (active: boolean) => void,
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

    useEffect(() => {
        document.title = "Blogs | DeadMarket"
        return () => {
          setEditPostEnabled(false)
          document.title = "DeadMarket"
        };
      }, []);

    return (
        <div className="blog-card-wrap">
            <div className="blog-cards container">
                { isAdmin &&
                    <div className="toggle-edit">
                        <span>Toggle Editing Post</span>
                        <input type="checkbox" onChange={e => setEditPostEnabled(e.target.checked)} />
                    </div>
                }
                {blogPostList.map((card) => {
                    return (
                        <BlogCard key={card.blogID} editPostEnabled={editPostEnabled} card={card} setBlogPostList={setBlogPostList} />
                    );
                })}
            </div>
        </div>
    )
}

export default Blogs