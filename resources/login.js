function validateLogin() {
  const email = document.getElementById("email").value;
  const emailError = document.getElementById("emailError");
  const password = document.getElementById("password").value;
  const passwordError = document.getElementById("passwordError");

  emailError.textContent = "";
  if (passwordError) passwordError.textContent = "";

  if (!email.endsWith("@gmail.com")) {
    emailError.textContent = "Invalid User ID (must end with @gmail.com)";
    return;
  }

  // password validation: at least 6 chars and must include '@'
  if (password.length < 6 || !password.includes("@")) {
    if (passwordError) {
      passwordError.textContent = "Password must be at least 6 characters and include @";
    } else {
      alert("Password must be at least 6 characters and include @");
    }
    return;
  }

  //  Login success
  localStorage.setItem("isLoggedIn", "true"); // Set session
  alert("Login successful (demo)");

  // 🔹 READ ROLE FROM URL
  const params = new URLSearchParams(window.location.search);
  const role = params.get("role");

  // 🔹 ROLE-BASED REDIRECT
  // 🔹 ROLE-BASED REDIRECT
  // If no role is provided (e.g. user came from dashboard logout),
  // default to student dashboard so login proceeds as expected.
  if (role === "teacher") {
    window.location.href = "resources/teacher-dashboard.html";
  } else if (role === "admin") {
    window.location.href = "resources/admin-dashboard.html";
  } else {
    // default / student
    window.location.href = "dashboard.html";
  }
}
