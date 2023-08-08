import React, { useState, useEffect, createContext, useContext, useCallback } from "react";
import { auth, db } from '../firebase/firebase-config';
import { doc, getDoc } from 'firebase/firestore';
import { User, onAuthStateChanged, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword, UserCredential } from "firebase/auth";

//figure out how to deal with promises
interface IContextProps {
    isAuth: boolean | undefined;
    isAdmin: boolean | undefined;
    getUser: () => User | null;
    getProfileInfo: () => {
        id: string;
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
}

const AuthContext = createContext({} as IContextProps);

export function useAuth() {
    return useContext(AuthContext);
}

export function UserContext({ children }: { children: React.ReactNode }) {
    const [authUser, setAuthUser] = useState<boolean>();
    const [adminUser, setAdminUser] = useState<boolean>();
    const [profile, setProfile] = useState<{
        id: string;
        email: string | null;
        firstName: string | null;
        lastName: string | null;
        userName: string | null;
        initials: string | null;
    }>({ id: "null", email: null, firstName: null, lastName: null, userName: null, initials: null });

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
            id: "",
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
            await signInWithEmailAndPassword(auth, email, password);
            console.log(auth.currentUser?.uid)
        } catch (error: any) {
            console.log(error);
            throw new Error(error);
        }
    }

    const logout = async () => {
        try {
            await signOut(auth)
        } catch (error: any) {
            console.log(error);
            throw new Error(error);
        }
    }

    const register = async (email: string, password: string) => {
        try {
            const userCred = await createUserWithEmailAndPassword(auth, email, password);
            return userCred;
        } catch (error: any) {
            console.log(error);
            throw new Error(error);
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
        register
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}
