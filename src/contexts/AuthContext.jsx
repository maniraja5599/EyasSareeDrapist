import React, { createContext, useContext, useEffect, useState } from 'react';
import {
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

const AuthContext = createContext({});

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                // Fetch optional profile data from Firestore
                let profileData = {};
                try {
                    const docRef = doc(db, 'customers', currentUser.uid);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        profileData = docSnap.data();
                    }
                } catch (e) {
                    console.log("Error fetching user profile:", e);
                }

                setUser({
                    uid: currentUser.uid,
                    email: currentUser.email,
                    displayName: currentUser.displayName || 'User',
                    photoURL: currentUser.photoURL,
                    role: profileData.role || 'user',
                    ...profileData // Merge mobile, address, etc.
                });
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // Google Login
    const loginWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        return await signInWithPopup(auth, provider);
    };

    // Admin Login using Firebase (Email/Password)
    const login = async (email, password) => {
        // Map legacy 'eyas' username to email for backward compatibility if needed,
        // asking user to use email is better.
        // For smoother transition, we'll try to use the email if provided, or mapped.
        // But for now, let's assume usage of email.

        let loginEmail = email;
        if (email === 'eyas') {
            // We can't auto-login 'eyas' without an email.
            // We will throw error asking for email.
            throw new Error("Please use your Admin Email to login.");
        }

        return await signInWithEmailAndPassword(auth, loginEmail, password);
    };

    // Client Login (Keep LocalStorage for now or upgrade later)
    // For now we keep this as "Simulated" for tracking only, 
    // unless we want clients to have Real Auth too.
    // Given the task is "Secure Database", clients reading their own data 
    // without auth is tricky. 
    // We will keep ClientLogin as is (Mock) for now and rely on Order ID for tracking.
    const clientLogin = async (mobile, password) => {
        // ... (Keep existing client login logic if needed for other features, 
        // but ideally we remove it if not used)
        // Assuming we keep it for now for 'My Orders' page if it exists.
        const savedCustomers = localStorage.getItem('eyas_customers');
        const customers = savedCustomers ? JSON.parse(savedCustomers) : [];
        const foundCustomer = customers.find(c => c.mobile === mobile && c.password === password);

        if (foundCustomer) {
            const clientUser = {
                ...foundCustomer,
                role: 'client',
                displayName: foundCustomer.name // Add displayName for personalized greeting
            };
            // We set user state, but this won't be a Firebase User.
            // This might conflict with onAuthStateChanged. 
            // Better to separate "Admin Auth" (Firebase) from "Client Auth" (Local)
            // Or just set User but know it's not firebase authenticated.
            setUser(clientUser);
            return clientUser;
        }
        throw new Error('Invalid Mobile Number or Password');
    };

    const logout = async () => {
        await signOut(auth);
        setUser(null); // Clear local state in case it was a client login
    };

    const value = {
        user,
        loading,
        login,
        loginWithGoogle,
        clientLogin,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
