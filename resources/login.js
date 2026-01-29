let isRegister = false;
let role = "student";

// Role selection
function selectRole(selectedRole) {
  role = selectedRole;

  document.querySelectorAll(".category-btn").forEach(btn => {
    btn.classList.remove("active");
  });

  event.target.classList.add("active");
}

// Toggle functions
function showLogin() {
  isRegister = false;
  document.getElementById("confirmBox").style.display = "none";
  setToggle(0);
}

function showRegister() {
  isRegister = true;
  document.getElementById("confirmBox").style.display = "block";
  setToggle(1);
}

function setToggle(index) {
  document.querySelectorAll(".toggle-btn").forEach((btn, i) => {
    btn.classList.toggle("active", i === index);
  });
}

// Submit handler
async function handleSubmit() {
  clearErrors();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const confirm = document.getElementById("confirmPassword")?.value;

  let valid = true;

  if (!email.includes("@")) {
    showError("emailError", "Enter a valid email");
    valid = false;
  }

  const strongPwd =
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

  if (!strongPwd.test(password)) {
    showError(
      "passwordError",
      "Password must be 8+ chars with uppercase, lowercase, number & symbol"
    );
    valid = false;
  }

  if (isRegister && password !== confirm) {
    showError("confirmError", "Passwords do not match");
    valid = false;
  }

  if (!valid) return;

  const url = isRegister
    ? "http://127.0.0.1:8000/api/auth/register/"
    : "http://127.0.0.1:8000/api/auth/login/";

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email,
      password,
      role
    })
  });

  const data = await response.json();

  if (!response.ok) {
    alert(data.message || "Something went wrong");
    return;
  }

  alert(data.message);

  localStorage.setItem("isLoggedIn", "true");
  localStorage.setItem("userRole", data.role);

  if (data.role === "student") window.location.href = "student-dashboard.html";
  if (data.role === "teacher") window.location.href = "teacher-dashboard.html";
  if (data.role === "admin") window.location.href = "admin-dashboard.html";
}

// Helpers
function showError(id, msg) {
  document.getElementById(id).innerText = msg;
}

function clearErrors() {
  document.querySelectorAll(".error").forEach(e => (e.innerText = ""));
}


