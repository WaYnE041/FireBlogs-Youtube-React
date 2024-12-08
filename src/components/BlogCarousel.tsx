import '../styles/BlogCarousel.css';
import { useState, useEffect } from 'react';
// import { ReactComponent as Arrow } from '../assets/Icons/arrow-right-light.svg';
import { useAuth } from '../contexts/UserContext';
import { Link } from "react-router-dom";
// import parse from 'html-react-parser';

function BlogPost({ welcomeScreen }: {
	welcomeScreen: boolean;
}) {
	
	// const { isAuth } = useAuth();

	// const getImageUrl = (name: string) => {
	// 	return new URL(`../assets/blogPhotos/${name}.webp`, import.meta.url).href;
	// }

	const [isLoading, setisLoading] = useState<boolean>(false);
	const [prodList, setProdList] = useState<{
        active: boolean,
        description: string,
        image: string,
        name: string,
        price: number,
        price_id: string
    }[]>([]);

	useEffect(() => {
        displayProducts();
    }, []);

	const { getCartInfo, setCartInfo, startCheckoutCart } = useAuth();


	const displayProducts = async () => {
        try {
            const { db } = await import('../firebase/firebase-config');
            const { collection, getDocs, query, where } = await import('firebase/firestore');

            const postCollectionRef = collection(db, "products");
            const dataQuery = query(postCollectionRef, where("active", "==", true));
            const dbResult = await getDocs(dataQuery);

            const currentListPromise = dbResult.docs.map(async (doc) => {
                const pricesCollectionRef = collection(db, "products", doc.id, "prices");
                const pricesQuery = await getDocs(pricesCollectionRef);

                // assume there is only one price per product
                const priceDoc = pricesQuery.docs[0];

                return {
                    name: doc.data().name,
                    image: doc.data().images[0],
                    description: doc.data().description,
                    active: doc.data().active,
                    price: priceDoc.data().unit_amount,
                    price_id: priceDoc.id
                }
            })

            const currentList = await Promise.all(currentListPromise);
			console.log(currentList);
            setProdList(currentList);

        } catch (error) {
            console.log(error);
        }
    }

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
				{prodList.slice(0, 5).map((_post, index) => {
					return (
						<input key={index} type="radio" name="slider" id={"s" + (index + 1)}></input>
					)
				})}
				{prodList.slice(0, 5).map((post, index) => {
					return (
						// key props needed
						<>
							{/* {welcomeScreen ? <h2 key={index} id={"title" + (index+1)}>{post.name}</h2> : <h2 key={index} id={"title" + (index+1)}>{post.name}</h2>} */}
						</>
					)
				})}
				{prodList.slice(0, 5).map((post, index) => {
					return (
						<label className="carousel-label" key={index} htmlFor={"s" + (index+1)} id={"slide" + (index+1)}>
						<h2 key={index} id={"title" + (index+1)}>{post.name}</h2>
						<img src={post.image} alt="Blog Cover Photo" />
						{/* <Link className="btn" to={`/cart`} >
							Add To Cart
						</Link> */}
						<form onSubmit={addToCart}>
							<label htmlFor="quantity">Quantity: </label>
							<input type="number" id="quantity" name="quantity" min="1" max="20" required />
							<input type="hidden" id="priceId" name="priceId" value={post.price_id} />
							<button className="checkout" type="submit" disabled={isLoading}>{"Add To Cart"}</button>
						</form>
						</label>
					)
				})}
			</div>
		</div>
	)
}

export default BlogPost;