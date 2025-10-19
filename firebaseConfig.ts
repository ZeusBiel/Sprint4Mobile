import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {

  apiKey: "AIzaSyBWIHOZUBD25QD8kdJ-QJj5l-ugBX-FxYI",

  authDomain: "sprint4-mobile-67835.firebaseapp.com",

  projectId: "sprint4-mobile-67835",

  storageBucket: "sprint4-mobile-67835.firebasestorage.app",

  messagingSenderId: "973094598992",

  appId: "1:973094598992:web:96b5cb59f8e18339239455",

  measurementId: "G-C3YX1RVD62"

};



const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);