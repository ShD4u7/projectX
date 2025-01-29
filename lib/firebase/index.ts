import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';

// Конфигурация Firebase из переменных окружения
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Инициализация Firebase
let app: FirebaseApp;
let auth: Auth;
let firestore: Firestore;
let storage: FirebaseStorage;

if (!getApps().length) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  firestore = getFirestore(app);
  storage = getStorage(app);
} else {
  app = getApps()[0];
  auth = getAuth(app);
  firestore = getFirestore(app);
  storage = getStorage(app);
}

export { 
  app, 
  auth, 
  firestore, 
  storage,
  FirebaseApp,
  Auth,
  Firestore,
  FirebaseStorage 
};
