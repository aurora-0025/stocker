// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDJEhmeiQT9GwUm5iXWtYzpmgOvOXxSMxY",
    authDomain: "stocker-aa90c.firebaseapp.com",
    projectId: "stocker-aa90c",
    storageBucket: "stocker-aa90c.firebasestorage.app",
    messagingSenderId: "55760133656",
    appId: "1:55760133656:web:2d7e33b305a54e5e982d6d"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup, signOut };
