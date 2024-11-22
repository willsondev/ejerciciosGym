import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc, updateDoc, arrayUnion, arrayRemove, deleteDoc, collection, getDocs } from "firebase/firestore";

// Configuración de Firebase (cambia estos valores por los de tu proyecto)
const firebaseConfig = {
  apiKey: "AIzaSyDw5CTo7VWxTJwpGDI6dnCnhVHX63CpUG0",
  authDomain: "app-gimnasio-58c86.firebaseapp.com",
  projectId: "app-gimnasio-58c86",
  storageBucket: "app-gimnasio-58c86.firebasestorage.app",
  messagingSenderId: "846330061845",
  appId: "1:846330061845:web:bbe7b4f6645f0f19721a1c"
};

// Inicializar Firebase solo si no existe una instancia activa
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

// Exportar las funciones necesarias
export {
  db,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  deleteDoc,
  collection,
  getDocs,
  getFirestore
};
