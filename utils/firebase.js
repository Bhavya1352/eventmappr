import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

let app;

// Firebase configuration
const firebaseConfig = {
  apiKey:
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY ||
    "AIzaSyC6SVlrk8ymdPFOqN5FTUQ1QydK8YTlZeU",
  authDomain:
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ||
    "eventmappr-b1b81.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "eventmappr-b1b81",
  storageBucket:
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
    "eventmappr-b1b81.firebasestorage.app",
  messagingSenderId:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "700964450420",
  appId:
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID ||
    "1:700964450420:web:ff727469ff05f049d5a121",
};

// Initialize Firebase
export const initializeFirebase = () => {
  try {
    if (!app) {
      console.log("Initializing Firebase with config:", {
        projectId: firebaseConfig.projectId,
        authDomain: firebaseConfig.authDomain,
        hasApiKey: !!firebaseConfig.apiKey,
        hasAppId: !!firebaseConfig.appId,
      });

      // Check if we have valid configuration
      const hasValidConfig =
        firebaseConfig.apiKey &&
        firebaseConfig.apiKey !== "demo-api-key" &&
        firebaseConfig.projectId &&
        firebaseConfig.projectId !== "demo-project";

      if (!hasValidConfig) {
        console.warn(
          "Firebase not configured properly. Please check your environment variables."
        );
        console.warn("Current config:", firebaseConfig);
        return null;
      }

      app = initializeApp(firebaseConfig);
      console.log(
        "Firebase initialized successfully with project:",
        firebaseConfig.projectId
      );
    }
    return app;
  } catch (error) {
    console.error("Error initializing Firebase:", error);
    console.error("Firebase config:", firebaseConfig);
    return null;
  }
};

// Get Firebase Auth instance
export const getFirebaseAuth = () => {
  const firebaseApp = initializeFirebase();
  if (!firebaseApp) {
    console.error("Firebase app not initialized");
    return null;
  }
  return getAuth(firebaseApp);
};

// Get Firestore instance
export const getFirebaseFirestore = () => {
  const firebaseApp = initializeFirebase();
  if (!firebaseApp) {
    console.error("Firebase app not initialized");
    return null;
  }
  return getFirestore(firebaseApp);
};

// Add more Firebase utility functions as needed
