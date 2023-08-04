import '../styles/Blogs.css'
import { useEffect } from 'react'

function Blogs(
    { isAdmin, setEditPostEnabled, children}: {
        isAdmin: boolean,
        setEditPostEnabled: (active: boolean) => void,
        children: React.ReactNode

    }
) {
    useEffect(() => {
        document.title = "Blogs | DeadMarket"
        return () => {
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
                { children }
            </div>
        </div>
    )
}

export default Blogs