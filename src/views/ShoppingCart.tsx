import '../styles/ViewBlog.css';
import { useState, useEffect } from 'react';

function ShoppingCart() {
    const [isLoading, setisLoading] = useState<boolean>(false);
    const [prodList, setProdList] = useState<{
		// id: string,
        // object: string,
        // active: boolean,
        // created: number,
        // default_price: string,
        // description: string,
        // images: [],
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
                    price: priceDoc.data().unit_amount,
                    price_id: priceDoc.id
				}
			})

            const currentList = await Promise.all(currentListPromise);
            //console.log(currentList);
            setProdList(currentList);
			
		} catch (error) {
			console.log(error);
		}
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


    return (
        <div className="post-view">
			<div className="container quillWrapper">
            {prodList.map((item, index) => {
				return (
                    <div key={index}>
                        <p>Item: {item.name} <br/>Price: ${(item.price / 100).toFixed(2)} </p>
                        <button onClick={() => startCheckout(item.price_id)} disabled={isLoading}>
                            {isLoading ? "Loading": "Checkout"}
                        </button>
                    </div>   
				)
			})}
			</div>
		</div>
    )
}

export default ShoppingCart;