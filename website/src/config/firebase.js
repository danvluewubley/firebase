import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyCrAzLYQVtuTiJ-xtf_JQlxlzs8HtRmjds",
  authDomain: "database-2bfd9.firebaseapp.com",
  projectId: "database-2bfd9",
  storageBucket: "database-2bfd9.firebasestorage.app",
  messagingSenderId: "450743812859",
  appId: "1:450743812859:web:bedcce0be204047581a65e",
  measurementId: "G-CKYS2V44ZB",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const db = getFirestore(app)