// Your web app's Firebase configuration
// This is the correct "classic" (compat) version for your project
const firebaseConfig = {
    apiKey: "AIzaSyC0yIavnbiQL5QASL0UwJflMcCwiCkZUY",
    authDomain: "our-website-9ea12.firebaseapp.com",
    databaseURL: "https://our-website-9ea12-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "our-website-9ea12",
    storageBucket: "our-website-9ea12.appspot.com",
    messagingSenderId: "1010747868063",
    appId: "1:1010747868063:web:184399314b0e057cddf3aa"
};

// Initialize Firebase
try {
    // This code works with the scripts you have in your HTML
    firebase.initializeApp(firebaseConfig);
    
    // Declare 'db' in the global scope so main.js can access it
    var db = firebase.firestore(); 
} catch (e) {
    console.error('Error initializing Firebase:', e);
    alert('Could not initialize Firebase. Please check your configuration.');
}
