// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "feastly-80f01.firebaseapp.com",
    projectId: "feastly-80f01",
    storageBucket: "feastly-80f01.firebasestorage.app",
    messagingSenderId: "60991564810",
    appId: "1:60991564810:web:2b756604a6afdabafc43f3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };