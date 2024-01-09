import * as fn from "./functions.js";

await fn.loginUser(); //
// https://01.kood.tech/api/auth/signin
await fn.main(); //
await fn.addChart();

// login.js

document.getElementById("login-form").addEventListener("submit", function (event) {
    event.preventDefault();

    const usernameInput = document.getElementById("username").value;
    const passwordInput = document.getElementById("password").value;
    alert(username, password)
    console.log("Login called")
    // Simulate a server-side authentication check
    if (authenticateUser(usernameInput, passwordInput)) {
        // Authentication successful, redirect to index.html
        window.location.href = "index.html";
    } else {
        // Authentication failed, display an error message
        alert("Invalid username or password. Please try again.");
    }
});

// Function to simulate server-side authentication (replace with actual authentication logic)
function authenticateUser(username, password) {
    // Replace with your authentication logic (e.g., checking against a database)
    const validUsername = "user123";
    const validPassword = "password123";

    return username === validUsername && password === validPassword;
}
