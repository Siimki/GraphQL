import * as fn from "./functions.js";
console.log("Hello world")
var JWT
// await fn.loginUser(); //
// // https://01.kood.tech/api/auth/signin
// await fn.main(); //
// await fn.addChart();

// login.js

document.getElementById("login-form").addEventListener("submit", async function (event) {
    console.log("Login called")
    event.preventDefault();

    const usernameInput = document.getElementById("username").value;
    const passwordInput = document.getElementById("password").value;   
    // Simulate a server-side authentication check
    console.log("start",await authenticateUser(usernameInput, passwordInput))
    
    if (await authenticateUser(usernameInput, passwordInput) == true) {
        // Authentication successful, redirect to index.html
        window.location.href = "mainpage.html";
    } else {
        // Authentication failed, display an error message

        alert("Invalid username or password. Please try again.");
    }
});

// Function to simulate server-side authentication (replace with actual authentication logic)
async function authenticateUser(username, password) {
    // Replace with your authentication logic (e.g., checking against a database)
    // const username = "siimkiskonen@gmail.com"; 
    // const password = "68vKFrmXqW8v7@f";  
    JWT = await fn.loginUser(username,password)
    console.log(typeof JWT)

    if (typeof JWT === 'string') {
        return true;
    } else {
        return false;
    }
}


