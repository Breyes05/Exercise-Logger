// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDR-HcOnCL0CJFXipZd1LaTB0vv0EJZewY",
  authDomain: "exercise-logger-fbdfe.firebaseapp.com",
  projectId: "exercise-logger-fbdfe",
  storageBucket: "exercise-logger-fbdfe.firebasestorage.app",
  messagingSenderId: "646907032753",
  appId: "1:646907032753:web:5db694e41832e0614b9e90",
  measurementId: "G-K0SPHHR32H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };