import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD9wwmDn5qxzsDFcKXcgcQZfrnjc7krgP8",
  authDomain: "multimarket-9fb7c.firebaseapp.com",
  projectId: "multimarket-9fb7c",
  storageBucket: "multimarket-9fb7c.firebasestorage.app",
  messagingSenderId: "471294940973",
  appId: "1:471294940973:web:e32f98d6dd9ee10bda25a4",
  measurementId: "G-R95RN2QTPX"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export default app;
