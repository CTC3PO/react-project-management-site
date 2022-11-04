import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAzIJ6r893VSNH3kyC9J8Md5cHCAYmOlno",
  authDomain: "thedojosite-42a77.firebaseapp.com",
  projectId: "thedojosite-42a77",
  storageBucket: "thedojosite-42a77.appspot.com",
  messagingSenderId: "45061292387",
  appId: "1:45061292387:web:11752c8a24adc443275356",
  measurementId: "G-3R5SSF3GMY",
};

//init firebase
firebase.initializeApp(firebaseConfig);

//init services
const projectFirestore = firebase.firestore();
const projectAuth = firebase.auth();
const projectStorage = firebase.storage();

//timestamp for when adding document
const timestamp = firebase.firestore.Timestamp;

export { projectFirestore, projectAuth, projectStorage, timestamp };
