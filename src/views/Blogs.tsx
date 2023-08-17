import '../styles/Blogs.css';
import { useAuth } from '../contexts/UserContext';
import { useEffect } from 'react';

function Blogs({ toggleEditPost, children }: {
    toggleEditPost: (id: boolean) => void;
    children: React.ReactNode;
}) {
    useEffect(() => {
        document.title = "Blogs | DeadMarket";
        return () => {
            document.title = "DeadMarket";
        };
    }, []);

    const { isAdmin } = useAuth();

    return (
        <div className="blog-card-wrap">
            <div className="blog-cards container">
                {isAdmin &&
                    <div className="toggle-edit">
                        <span>Toggle Editing Post</span>
                        <input type="checkbox" onChange={e => toggleEditPost(e.target.checked)} />
                    </div>
                }
                { children }
            </div>
        </div>
    )
}

export default Blogs;