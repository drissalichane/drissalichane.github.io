import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBlKKQhAAZAtCCnu7tcQ3Ss9ocXWDmmgss",
    authDomain: "summer-467905.firebaseapp.com",
    projectId: "summer-467905",
    storageBucket: "summer-467905.firebasestorage.app",
    messagingSenderId: "1081844669660",
    appId: "1:1081844669660:web:732d5f29cad5e067a46819",
    measurementId: "G-SYK5YQ5CPH"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
