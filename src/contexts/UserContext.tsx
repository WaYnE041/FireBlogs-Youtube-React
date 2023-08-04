import React, { useState, useEffect, createContext, useContext } from "react";
import { auth, db } from '../firebase/firebase-config';
import { doc, getDoc } from 'firebase/firestore';
import { User, onAuthStateChanged, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword, UserCredential } from "firebase/auth";

//figure out how to deal with promises
interface IContextProps {
    isAuth: boolean | undefined;
    isAdmin: boolean | undefined;
    getProfileInfo: () => {
        id: string;
        email: string | null;
        firstName: string | null;
        lastName: string | null;
        userName: string | null;
        initials: string | null;
    },
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    register: (email: string, password: string) => Promise<UserCredential>;
}

const AuthContext = createContext({} as IContextProps)

export function useAuth() {
    return useContext(AuthContext)
}

export function UserContext({ children }: { children: React.ReactNode }) {

    const [isAdmin, setIsAdmin] = useState<boolean>();
    const [isAuth, setIsAuth] = useState<boolean>();
    const [loading, setLoading] = useState(true)
    const [profile, setProfile] = useState<{
        id: string,
        email: string | null;
        firstName: string | null;
        lastName: string | null;
        userName: string | null;
        initials: string | null;
    }>({ id: "null", email: null, firstName: null, lastName: null, userName: null, initials: null });

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, user => {
            if (user) {
                setProfileInfo(user)
            } else {
                resetProfileInfo()
            }
            setLoading(false)
        })

        return unsubscribe
    }, [auth.currentUser])

    // const getUser = () => {
    //     return auth.currentUser
    // }

    const getProfileInfo = () => {
        return profile
    }

    const resetProfileInfo = () => {
        console.log("user is signed out")
        setProfile({
            id: "",
            email: null,
            firstName: null,
            lastName: null,
            userName: null,
            initials: null
        })
        setIsAuth(false)
        setIsAdmin(false)
    }

    const setAdmin = async (user: User | null) => {
        if(user) {
            const token = await user.getIdTokenResult()
            if (!!token.claims.admin) {
                return true
            } 
        }
        return false
    }

    const setProfileInfo = async (user: User) => {
        const docRef = doc(db, "users", user.uid);
        try {
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setProfile({
                    id: docSnap.id,
                    email: docSnap.data().email,
                    firstName: docSnap.data().firstName,
                    lastName: docSnap.data().lastName,
                    userName: docSnap.data().userName,
                    initials: docSnap.data().firstName.match(/(\b\S)?/g).join("") + docSnap.data().lastName.match(/(\b\S)?/g).join("")
                })
                setIsAuth(true)
                setAdmin(user)
                console.log(`isAdmin ${user.email} is ${isAdmin}`)
            } else {
                console.log("Document does not exist")
            }

        } catch (error) {
            console.log(error)
        }
    }


    const login = (email: string, password: string) => {
        return signInWithEmailAndPassword(auth, email, password)
            .then(() => {
                console.log(auth.currentUser?.uid)
                setIsAuth(true)
            })
            .catch((error) => {
                console.log(`${error.code}: ${error.message}`)
            });
    }

    const logout = () => {
        return signOut(auth)
            .then(() => {
                setIsAuth(false)
            })
            .catch((error) => {
                console.log(`${error.code}: ${error.message}`)
            });
    }

    const register = (email: string, password: string) => {
        return createUserWithEmailAndPassword(auth, email, password)
    }

    const value = {
        isAuth,
        isAdmin,
        getProfileInfo,
        login,
        logout,
        register
    }

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}
