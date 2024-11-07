// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
    getAuth,
    signInWithPopup,
    GoogleAuthProvider,
    onAuthStateChanged,
    User
} from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDbddRSG2pXmaXioGAaasj9nrHmwJTh62M",
  authDomain: "yt-clone-4a581.firebaseapp.com",
  projectId: "yt-clone-4a581",
  appId: "1:1082678433237:web:05b61314416925bd16d95c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export function signInWithGoogle(){
    return signInWithPopup(auth, new GoogleAuthProvider());
}

export function signOut() {
    return auth.signOut();
}

export function onAuthStateChangedHelper(callback: (
    user: User | null)=> void){
        return onAuthStateChanged(auth,callback);
    }