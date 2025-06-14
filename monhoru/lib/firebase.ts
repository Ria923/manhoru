import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDZD5w4oXQy0Twu1XmPDXgPKocIVx6HgFU",
  authDomain: "monhoru-4dd61.firebaseapp.com",
  projectId: "monhoru-4dd61",
  storageBucket: "monhoru-4dd61.appspot.com",
  messagingSenderId: "613318080473",
  appId: "1:613318080473:web:4f584853efcd1964eccbc8",
  measurementId: "G-XLBSV7D7QK",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
