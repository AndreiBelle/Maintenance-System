import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import { getAuth } from 'https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js';

  // Import the functions you need from the SDKs you need
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyD6B_mMQOp0VkWkDoO2huNLV5sqmyLSTzQ",
    authDomain: "maintenance-system-89786.firebaseapp.com",
    projectId: "maintenance-system-89786",
    storageBucket: "maintenance-system-89786.firebasestorage.app",
    messagingSenderId: "19374155710",
    appId: "1:19374155710:web:19ea42932faf7b39aa7bef"
  };

  // Initialize Firebase
  const firebaseApp = initializeApp(firebaseConfig);

export const auth = getAuth(firebaseApp);