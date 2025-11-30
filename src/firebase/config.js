import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAFJnMERQ73mJWdUAkmVHjhLTVekAHYL8Y",
  authDomain: "quizmaster-db75e.firebaseapp.com",
  projectId: "quizmaster-db75e",
  storageBucket: "quizmaster-db75e.firebasestorage.app",
  messagingSenderId: "165041110786",
  appId: "1:165041110786:web:5425731d030321d1100c1b",
  measurementId: "G-DXZE0H4C62"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Enable offline persistence for faster loading
enableIndexedDbPersistence(db).catch((err) => {
  console.log('Persistence error:', err.code);
});

export default app;
