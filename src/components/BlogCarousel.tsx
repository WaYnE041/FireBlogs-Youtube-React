import '../styles/BlogCarousel.css';
import { useState } from 'react';
import { useAuth } from '../contexts/UserContext';
// import { ReactComponent as Arrow } from '../assets/Icons/arrow-right-light.svg';
// import parse from 'html-react-parser';

function BlogPost() {

	const [isLoading, setisLoading] = useState<boolean>(false);
	
	const { getStripeProducts, setCartInfo } = useAuth();

	const addToCart = async (ev: any) => {
        ev.preventDefault();
        setisLoading(true);
        const formData = new FormData(ev.target);
        const id = formData.get('priceId') as string;
        const quantity = formData.get('quantity') as string;
        id && quantity ? setCartInfo(id, parseInt(quantity)) : console.log("null or empty");
        setTimeout(function () {
            setisLoading(false);
        }, 1000);
    }

	return (
		<div className="carousel">
			<div id="slider">
				{getStripeProducts().slice(0, 5).map((_item, index) => {
					return (
						<input key={index} type="radio" name="slider" id={"s" + (index + 1)}></input>
					)
				})}
				
				{getStripeProducts().slice(0, 4).map((item, index) => {
					return (
						<label className="carousel-label" key={index} htmlFor={"s" + (index+1)} id={"slide" + (index+1)}>
						<h2 key={index} id={"title" + (index+1)}>{item.name}</h2>
						<img src={item.image} alt="Blog Cover Photo" />
						<p><strong>Price:</strong> ${(item.price / 100).toFixed(2)} </p>
                        <p><strong>Description:</strong> {item.description}</p>
						{/* <Link className="btn" to={`/cart`} >
							Add To Cart
						</Link> */}
						<form onSubmit={addToCart}>
							<label htmlFor="quantity">Quantity: </label>
							<input type="number" id="quantity" name="quantity" min="1" max="20" required />
							<input type="hidden" id="priceId" name="priceId" value={item.price_id} />
							<button className="checkout" type="submit" disabled={isLoading}>{"Add To Cart"}</button>
						</form>
						</label>
					)
				})}
				<label className="carousel-label" htmlFor="s5" id="slide5">
                    <h2 id="title5">View More</h2>
                    <img src="https://placehold.co/400x400" alt="Blog Cover Photo"/>
					<a className="btn" href="/cart">Go to Catalog</a>
                </label>
			</div>
		</div>
	)
}

export default BlogPost;