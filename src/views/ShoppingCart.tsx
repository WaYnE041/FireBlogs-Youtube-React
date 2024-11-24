import '../styles/ShoppingCart.css';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/UserContext';

function ShoppingCart() {
    const [isLoading, setisLoading] = useState<boolean>(false);
    const [prodList, setProdList] = useState<{
        // id: string,
        // object: string,
        active: boolean,
        // created: number,
        // default_price: string,
        description: string,
        image: string,
        // marketing_features: [],
        // livemode: boolean,
        // metadata: {},
        name: string,
        // package_dimensions: {},
        // shippable: boolean,
        // statement_descriptor: string,
        // tax_code: string,
        // unit_label: string,
        // updated: number,
        // url: string
        price: number,
        price_id: string
    }[]>([]);

    useEffect(() => {
        document.title = "Catalog | DeadMarket";
        return () => {
            document.title = "DeadMarket";
        };
    }, []);

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

    const checkOut = async () => {
        if (getCartInfo().length === 0) {
            alert("Please Add Items To Cart");
        }
        else {
            setisLoading(true);
            await startCheckoutCart();
        }
    }

    return (
        <div className="blog-card-wrap">
             <div className="container">
            <button className="checkout" onClick={() => checkOut()} disabled={isLoading}>
                {isLoading ? "Loading" : "Checkout Cart"}
            </button>
             </div>
            
            <div className="container blog-cards">
                {prodList.map((item, index) => {
                    return (
                        <div key={index} className='blog-card'>
                            <img src={item.image} alt="Blog Cover Photo" />
                            <div className="info">
                                <h3>{item.name}</h3>
                                <p><strong>Price:</strong> ${(item.price / 100).toFixed(2)} </p>
                                <p><strong>Description:</strong> {item.description}</p>
                                {/* <br />
                            {item.active ? <p>This Item Is Currently Available</p> : <p>This Item Is Not Available</p>} */}
                                {/* <button className="checkout" onClick={() => startCheckout(item.price_id)} disabled={isLoading}>
                                {isLoading ? "Loading": "Checkout"}
                            </button> */}
                                <br />
                                <form onSubmit={addToCart}>
                                    <label htmlFor="quantity">Quantity: </label>
                                    <input type="number" id="quantity" name="quantity" min="1" max="20" required />
                                    <input type="hidden" id="priceId" name="priceId" value={item.price_id} />
                                    <button className="checkout" type="submit" disabled={isLoading}>{"Add To Cart"}</button>
                                </form>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default ShoppingCart;