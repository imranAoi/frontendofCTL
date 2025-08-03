// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider, signInWithPopup } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB37nKb7FOKx1awBXpNcn-Nf6PIffYjRuI",
  authDomain: "task-list-9e7b1.firebaseapp.com",
  projectId: "task-list-9e7b1",
  storageBucket: "task-list-9e7b1.firebasestorage.app",
  messagingSenderId: "272759977055",
  appId: "1:272759977055:web:c12b4dcf3b2b366d4117ea"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

export { auth, googleProvider, facebookProvider, signInWithPopup };