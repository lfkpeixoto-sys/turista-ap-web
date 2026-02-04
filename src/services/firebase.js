// src/services/firebase.js
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyD4mZXVjqUNPgfggq8j-kN941ldnBB02Ys",
  authDomain: "turista-web.firebaseapp.com",
  projectId: "turista-web",
  storageBucket: "turista-web.firebasestorage.app",
  messagingSenderId: "879293781144",
  appId: "1:879293781144:web:d257828166295f6cfc56ed",
  measurementId: "G-Q77I7XMLQ2",
};

// ✅ Evita inicializar duas vezes (principalmente no Vite / Hot Reload)
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
