import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCssH7hL2HoyMv3CTMpG815PWtNzKmucKY",
    authDomain: "portfolio-decf5.firebaseapp.com",
    projectId: "portfolio-decf5",
    storageBucket: "portfolio-decf5.firebasestorage.app",
    messagingSenderId: "971894159126",
    appId: "1:971894159126:web:a22ad707349ff9d0b1c237",
    measurementId: "G-5BLRZ1MGBD"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
