// Firebase Configuration für StreamMatrix Analytics
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDRW5hsVeR5TdwlcuM5i88PC2E3oXAdQQI",
  authDomain: "streammatrix-731e0.firebaseapp.com",
  projectId: "streammatrix-731e0",
  storageBucket: "streammatrix-731e0.firebasestorage.app",
  messagingSenderId: "594038498844",
  appId: "1:594038498844:web:e48b1f099d553ad2cfa1d9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Auth (für Admin-Dashboard)
export const auth = getAuth(app);

export default app;
