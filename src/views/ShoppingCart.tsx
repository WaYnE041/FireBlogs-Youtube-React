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
        document.title = "Shopping Cart | DeadMarket";
        return () => {
            document.title = "DeadMarket";
        };
    }, []);

    useEffect(() => {
		displayProducts();
	}, []);

    const { getCartInfo, setCartInfo } = useAuth();

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
        setTimeout(function(){
            setisLoading(false);
        }, 1000);
    }
    
    const startCheckout = async (id: string) => {
        setisLoading(true);

        console.log(id);
        const { db, auth } = await import('../firebase/firebase-config');
        const { addDoc, collection, onSnapshot } = await import('firebase/firestore');
       
        if (auth.currentUser) {
             let checkoutSessionData = {
                price: id, // price ID from products fetch
                success_url: window.location.origin, // can set this to a custom page
                cancel_url: window.location.origin,   // can set this to a custom page
                mode: "payment" // sets mode as a one-time payment (as opposed to subscription)
            };

            const custCollectionRef = collection(db, "customers", auth.currentUser.uid, "checkout_sessions");

            console.log(auth.currentUser.uid)
            const checkoutSessionRef = await addDoc(
                // currentUser is provided by firebase, via getAuth().currentUser
                custCollectionRef, checkoutSessionData
            );

            // The Stripe extension creates a payment link for us
            onSnapshot(checkoutSessionRef, (snap) => {
                //in case values are null
                const { error, url } = snap.data() || {};

                if (error) {
                // handle error
                }
                if (url) {
                    console.log(url);
                window.location.assign(url);  // redirect to payment link
                }
            });
        }
    }

    const startCheckoutCart = async () => {
        if(getCartInfo().length === 0) {
            console.log("No Items in Cart!");
            return;
        }
        setisLoading(true);

        const { db, auth } = await import('../firebase/firebase-config');
        const { addDoc, collection, onSnapshot } = await import('firebase/firestore');
       
        if (auth.currentUser) {
             let checkoutSessionData = {
                line_items: getCartInfo(), //price IDs & quantities in cart 
                // line_items: [
                //     {
                //         price: "price_1QJRdLBFDsS6bfgy3JLTDAlb",
                //         quantity: 2
                //     },
                //     {
                //         price: "price_1QJRdLBFDsS6bfgy3JLTDAlb",
                //         quantity: 2
                //     }
                // ],
                success_url: window.location.origin, // can set this to a custom page
                cancel_url: window.location.origin,   // can set this to a custom page
                mode: "payment" // sets mode as a one-time payment (as opposed to subscription)
            };

            const custCollectionRef = collection(db, "customers", auth.currentUser.uid, "checkout_sessions");

            console.log(auth.currentUser.uid)
            const checkoutSessionRef = await addDoc(
                // currentUser is provided by firebase, via getAuth().currentUser
                custCollectionRef, checkoutSessionData
            );

            // The Stripe extension creates a payment link for us
            onSnapshot(checkoutSessionRef, (snap) => {
                //in case values are null
                const { error, url } = snap.data() || {};

                if (error) {
                // handle error
                }
                if (url) {
                    console.log(url);
                window.location.assign(url);  // redirect to payment link
                }
            });
        }
    }

    return (
        <div className="blog-card-wrap">
            <button className="checkout" onClick={() => startCheckoutCart()} disabled={isLoading}>
                {isLoading ? "Loading": "Checkout Cart"}
            </button>
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
                                <input type="number" id="quantity" name="quantity" min="1" max="20" required/>
                                <input type="hidden" id="priceId" name="priceId" value={item.price_id} />
                                <button className="checkout" type="submit" disabled={isLoading}>{isLoading ? "Adding!": "Add To Cart"}</button>
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