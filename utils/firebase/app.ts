// This file initializes the firebase app
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyBIdosyPVHJ8-_RdqWoHVYsaJGQ8Y3KU3I",
  authDomain: "race-director.firebaseapp.com",
  projectId: "race-director",
  storageBucket: "race-director.appspot.com",
  messagingSenderId: "624119929447",
  appId: "1:624119929447:web:2d210d8a3f016292b012c2",
  measurementId: "G-QJBDKJPQ34",
};

const app = initializeApp(firebaseConfig);

export default app;
