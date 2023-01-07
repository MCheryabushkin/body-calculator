import * as firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyCk1eYWFOBItNIEWkcKXbaZMNp9C-aqimo",
    authDomain: "bodycalculator-main-api.firebaseapp.com",
    projectId: "bodycalculator-main-api",
    storageBucket: "bodycalculator-main-api.appspot.com",
    messagingSenderId: "499058677838",
    appId: "1:499058677838:web:726e4bda2c7aee0a55cb1f",
    measurementId: "G-EGS3WDF3Z6",
    databaseURL: "https://bodycalculator-main-api-default-rtdb.europe-west1.firebasedatabase.app/"
};
// Initialize Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig);

export {firebaseApp};