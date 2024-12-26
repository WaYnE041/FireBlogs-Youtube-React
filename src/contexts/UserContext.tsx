import React, { useState, useEffect, createContext, useContext, useCallback } from "react";
import { auth } from '../firebase/firebase-config';
import { User, onAuthStateChanged, UserCredential } from "firebase/auth";

interface IContextProps {
    isAuth: boolean | undefined;
    isAdmin: boolean | undefined;
    getUser: () => User | null;

    getProfileInfo: () => {
        id: string | null;
        email: string | null;
        firstName: string | null;
        lastName: string | null;
        userName: string | null;
        initials: string | null;
    };
    setProfileInfo: (user: User) => Promise<void>;

    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    register: (email: string, password: string) => Promise<UserCredential>;
    
    getStripeProducts: () =>  { active: boolean, description: string, image: string, name: string, price: number, price_id: string }[];
    setStripeProducts: () => Promise<void>;

    getCartInfo: () => { price: string, quantity: number }[];
    setCartInfo: (price: string, amount: number) => void;

    startCheckout: (id: string) => Promise<void>;
    startCheckoutCart: () => Promise<void>;
}

const AuthContext = createContext({} as IContextProps);

export function useAuth() {
    return useContext(AuthContext);
}

export function UserContext({ children }: { children: React.ReactNode }) {
    const [authUser, setAuthUser] = useState<boolean>();
    const [adminUser, setAdminUser] = useState<boolean>();
    const [profile, setProfile] = useState<{
        id: string | null;
        email: string | null;
        firstName: string | null;
        lastName: string | null;
        userName: string | null;
        initials: string | null;
    }>({ id: "null", email: null, firstName: null, lastName: null, userName: null, initials: null });
    const [cart, setCart] = useState<{
        price: string,
		quantity: number
	}[]>([]);
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
        setStripeProducts();
    }, []);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, user => {
            if (user) {
                setProfileInfo(user);
            } else {
                resetProfileInfo();
            }
        })

        return unsubscribe;
    }, [auth.currentUser]);

    const getUser = () => {
        return auth.currentUser;
    }

    const getProfileInfo = useCallback(() => {
        return profile;
    }, [profile])

    const resetProfileInfo = () => {
        console.log("user is signed out");
        setProfile({
            id: null,
            email: null,
            firstName: null,
            lastName: null,
            userName: null,
            initials: null
        })
        setAuthUser(false);
        setAdminUser(false);
    }

    const setAdmin = async (user: User | null) => {
        try {
            if (user) {
                const token = await user.getIdTokenResult();
                //converts `truthy/falsy` value to `true/false`
                if (!!token.claims.admin) {
                    return true;
                }
            }
            return false;
        } catch (error: any) {
            console.log(error);
            throw new Error(error);
        }
    }

    const setProfileInfo = async (user: User) => {
        try {
            const { doc, getDoc } = await import('firebase/firestore');
            const { db } = await import('../firebase/firebase-config');

            const docRef = doc(db, "users", user.uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                setProfile({
                    id: docSnap.id,
                    email: docSnap.data().email,
                    firstName: docSnap.data().firstName,
                    lastName: docSnap.data().lastName,
                    userName: docSnap.data().userName,
                    initials: docSnap.data().firstName.match(/(\b\S)?/g).join("") + docSnap.data().lastName.match(/(\b\S)?/g).join("")
                });
                setAuthUser(true);
                const newAdminUser = await setAdmin(user)
                setAdminUser(newAdminUser);
            } else {
                console.log("Document does not exist");
            }
        } catch (error: any) {
            console.log(error);
            throw new Error(error);
        }
    }

    const login = async (email: string, password: string) => {
        try {
            const { signInWithEmailAndPassword } = await import("firebase/auth");
            await signInWithEmailAndPassword(auth, email, password);
            console.log(auth.currentUser?.uid)
        } catch (error: any) {
            console.log(error);
            throw new Error(error);
        }
    }

    const logout = async () => {
        try {
            const { signOut } = await import("firebase/auth");
            await signOut(auth)
        } catch (error: any) {
            console.log(error);
            throw new Error(error);
        }
    }

    const register = async (email: string, password: string) => {
        try {
            const { createUserWithEmailAndPassword } = await import("firebase/auth");
            const userCred = await createUserWithEmailAndPassword(auth, email, password);
            return userCred;
        } catch (error: any) {
            console.log(error);
            throw new Error(error);
        }
    }

    const getStripeProducts = () => {
        return prodList;
    }
    const setStripeProducts = async () => {
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
			// console.log(currentList);
            setProdList(currentList);

        } catch (error) {
            console.log(error);
        }
    }

    const getCartInfo = () => {
        return cart;
    }

    const setCartInfo = (price: string, amount: number) => {
        setCart(current => [
			{
                price: price,
                quantity: amount
			},
			...current
		]);
    }

    const startCheckout = async (id: string) => {
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

    const value = {
        isAuth: authUser,
        isAdmin: adminUser,
        getUser,
        getProfileInfo,
        setProfileInfo,
        login,
        logout,
        register,
        getStripeProducts,
        setStripeProducts,
        getCartInfo,
        setCartInfo,
        startCheckout,
        startCheckoutCart
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}
