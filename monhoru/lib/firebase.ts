// lib/firebase.ts

import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Firebase 設定
const firebaseConfig = {
  apiKey: "AIzaSyDZD5w4oXQy0Twu1XmPDXgPKocIVx6HgFU",
  authDomain: "monhoru-4dd61.firebaseapp.com",
  projectId: "monhoru-4dd61",
  storageBucket: "monhoru-4dd61.appspot.com",
  messagingSenderId: "613318080473",
  appId: "1:613318080473:web:4f584853efcd1964eccbc8",
  measurementId: "G-XLBSV7D7QK",
};

// Firebase アプリを初期化（既に初期化済みなら再利用）
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// ✅ 認証モジュールのエクスポート（型指定しない！）
export const auth = getAuth(app);

// 任意で使うなら app も export してOK
export { app };
