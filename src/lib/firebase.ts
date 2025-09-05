// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  projectId: "snapverse-803lq",
  appId: "1:298314408533:web:bd1bbf0406ff19e189eadc",
  storageBucket: "snapverse-803lq.appspot.com",
  apiKey: "AIzaSyD-0akA5rLDrnFQu1_HJv4LxE84fwu5np8",
  authDomain: "snapverse-803lq.firebaseapp.com",
  messagingSenderId: "298314408533",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const storage = getStorage(app);

export { app, db, storage };
