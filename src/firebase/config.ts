import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyAocIHxA_wQEzjDGwQiXlHMl6LeKG0b4mk",
  authDomain: "icecream-baa51.firebaseapp.com",
  projectId: "icecream-baa51",
  storageBucket: "icecream-baa51.appspot.com", // ✅ FIXED
  messagingSenderId: "472193441416",
  appId: "1:472193441416:web:a08610980303ca00d5493d",
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
export default app
