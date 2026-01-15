function validateLogin() {
  const email = document.getElementById("email").value;
  const emailError = document.getElementById("emailError");

  emailError.textContent = "";

  if (!email.endsWith("@gmail.com")) {
    emailError.textContent = "Invalid User ID (must end with @gmail.com)";
    return;
  }

  alert("Login successful (demo)");
}
