const API = "http://127.0.0.1:8000/api";

// Save token after login
function saveToken(token) {
    localStorage.setItem("token", token);
}

// Get token for future calls
function getToken() {
    return localStorage.getItem("token");
}

// Common fetch function
async function apiCall(url, method = "GET", data = null) {
    const res = await fetch(API + url, {
        method: method,
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + getToken()
        },
        body: data ? JSON.stringify(data) : null
    });

    return res.json();
}
