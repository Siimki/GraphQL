import * as fn from "./functions.js";
console.log("Hello world")
var JWT

// await fn.loginUser(); //
// // https://01.kood.tech/api/auth/signin
// await fn.main(); //
// await fn.addChart();

// login.js

if (!window.location.href.endsWith('mainpage.html')) {
document.getElementById("login-form").addEventListener("submit", async function (event) {
    console.log("Login called")
    event.preventDefault();

    const usernameInput = document.getElementById("username").value;
    const passwordInput = document.getElementById("password").value;   
    // Simulate a server-side authentication check
    console.log("start",await authenticateUser(usernameInput, passwordInput))
    
    if (await authenticateUser(usernameInput, passwordInput) == true) {
        // Authentication successful, redirect to index.html

            console.log("Delayed value of JWT", JWT)
            sessionStorage.setItem('JWT', JWT);

    
            window.location.href = "mainpage.html";


        
    } else {
        // Authentication failed, display an error message
        alert("Invalid username or password. Please try again.");
    }
});
}

// Function to simulate server-side authentication (replace with actual authentication logic)
async function authenticateUser(username, password) {
    // Replace with your authentication logic (e.g., checking against a database)
    // const username = "siimkiskonen@gmail.com"; 
    // const password = "68vKFrmXqW8v7@f";  

    try {
        JWT = await fn.loginUser(username, password);
        setTimeout(() => {
            console.log("Delayed value of JWT", JWT)
        }, 2000)
        return typeof JWT === 'string';
    } catch (error) {
        console.error("Authentication error:", error);
        return false;
    }
    
}

export function getJWT() {
    console.log("Current JWT", JWT )
    return JWT
}


