function validateLogin() {
  const email = document.getElementById("email").value;
  const emailError = document.getElementById("emailError");

  emailError.textContent = "";

  if (!email.endsWith("@gmail.com")) {
    emailError.textContent = "Invalid User ID (must end with @gmail.com)";
    return;
  }

  //  Login success
  alert("Login successful (demo)");

  // 🔹 READ ROLE FROM URL
  const params = new URLSearchParams(window.location.search);
  const role = params.get("role");

  // 🔹 ROLE-BASED REDIRECT
  if (role === "student") {
    window.location.href = "resources/dashboard.html";
  } else if (role === "teacher") {
    window.location.href = "resources/teacher-dashboard.html";
  } else if (role === "admin") {
    window.location.href = "resources/admin-dashboard.html";
  }
}
