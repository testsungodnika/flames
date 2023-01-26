// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyASKC2BbA0OeWaKGT3r3gH6Uf87aDe_J6c",
  authDomain: "flames-630b0.firebaseapp.com",
  projectId: "flames-630b0",
  storageBucket: "flames-630b0.appspot.com",
  messagingSenderId: "640940741608",
  appId: "1:640940741608:web:4db6cd674b4919e5b84a5d",
  measurementId: "G-ZZC2NY6T8N"
};

const firebase = require('firebase');

const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const allnames = db.collection("names");

module.exports = allnames;
