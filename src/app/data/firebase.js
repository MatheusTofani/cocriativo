import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCSrnpZdKxMbT7DCHcMxq9Gx9JDNXjFDYs",
  authDomain: "co-criativo.firebaseapp.com",
  projectId: "co-criativo",
  storageBucket: "co-criativo.firebasestorage.app",
  messagingSenderId: "259941581852",
  appId: "1:259941581852:web:d79bc4375ebcba76b94bd9",
  measurementId: "G-ES2YK5VBH9"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth };
export { db };