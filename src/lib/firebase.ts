import { getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

export const hasFirebaseConfig = Boolean(
  firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId &&
    firebaseConfig.appId
);

export const hasFirebaseStorageConfig = Boolean(
  hasFirebaseConfig && firebaseConfig.storageBucket
);

const app = getApps().length
  ? getApps()[0]
  : initializeApp(
      hasFirebaseConfig
        ? firebaseConfig
        : {
            apiKey: "demo-key",
            authDomain: "demo.firebaseapp.com",
            projectId: "jurang-jero-digital-demo",
            appId: "demo-app-id"
          }
    );

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export function getSecondaryAuth(appName = "admin-user-creator") {
  if (!hasFirebaseConfig) {
    throw new Error("Konfigurasi database belum tersedia.");
  }

  const existingApp = getApps().find((item) => item.name === appName);
  const secondaryApp = existingApp ?? initializeApp(firebaseConfig, appName);
  return getAuth(secondaryApp);
}

export const sidBridge = {
  endpoint: process.env.NEXT_PUBLIC_SID_API_URL,
  collections: {
    residents: "sid_residents",
    households: "sid_households",
    assistance: "sid_assistance"
  }
};
