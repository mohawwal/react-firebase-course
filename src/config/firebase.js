import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth";
import {getFirestore} from 'firebase/firestore'
import {getStorage} from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyD11Yw2Jcu7OVhj2UIz7SbepTxupJ-SdWc",
  authDomain: "fir-course-a9c24.firebaseapp.com",
  projectId: "fir-course-a9c24",
  storageBucket: "fir-course-a9c24.appspot.com",
  messagingSenderId: "453532531957",
  appId: "1:453532531957:web:2dd1310b3773b8f96099bc",
  measurementId: "G-PMEGEC292F"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider()
export const storage = getStorage(app)

export const db = getFirestore(app);