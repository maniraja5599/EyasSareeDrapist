// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Firebase project configuration
// For production: Use environment variables (create .env file from .env.example)
// For quick setup: Replace the values below directly
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAO9X3tvqNFAJ9uRTdOJrAr6dNLYGkwihQ",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "eyas-saree-drapist.firebaseapp.com",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "eyas-saree-drapist",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "eyas-saree-drapist.firebasestorage.app",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "419876090748",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:419876090748:web:c643b6042dce59220c2af9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { db, auth, storage };
