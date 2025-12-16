// src/config/firebaseConfig.ts
import { initializeApp } from "firebase/app";

// 1. Dùng @ts-ignore để "bịt miệng" lỗi báo đỏ của TypeScript
// @ts-ignore
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';

import { getFirestore } from "firebase/firestore";
import * as SecureStore from 'expo-secure-store';

const firebaseConfig = {
  apiKey: "AIzaSyCgDNXrnl7CjvOa2PHuObmtsVf5HcuU5Ko",
  authDomain: "potpan.firebaseapp.com",
  projectId: "potpan",
  storageBucket: "potpan.firebasestorage.app",
  messagingSenderId: "13492139007",
  appId: "1:13492139007:web:79f09cddb7bb3694f0adca",
  measurementId: "G-1P9R4XL4W4"
};

const app = initializeApp(firebaseConfig);

// 2. Cầu nối SecureStore (Giữ nguyên)
const ReactNativeAsyncStorage = {
  getItem: async (key: string) => {
    return await SecureStore.getItemAsync(key);
  },
  setItem: async (key: string, value: string) => {
    return await SecureStore.setItemAsync(key, value);
  },
  removeItem: async (key: string) => {
    return await SecureStore.deleteItemAsync(key);
  },
};

// 3. Khởi tạo Auth
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export const db = getFirestore(app);