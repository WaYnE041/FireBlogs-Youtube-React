import '../styles/Blogs.css';
import { useEffect } from 'react';

function ShoppingCart() {
    useEffect(() => {
        document.title = "Shopping Cart | DeadMarket";
        return () => {
            document.title = "DeadMarket";
        };
    }, []);

    return (
        <div className="blog-card-wrap">
        </div>
    )
}

export default ShoppingCart;