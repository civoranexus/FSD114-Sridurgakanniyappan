let isRegister = false;
let role = "student";

// Role selection
function selectRole(selectedRole, el) {
  role = selectedRole;

  document.querySelectorAll(".category-btn").forEach(btn => {
    btn.classList.remove("active");
  });

  el.classList.add("active");
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

  // ✅ REGISTER (JSON)
  if (isRegister) {
    const res = await fetch("http://127.0.0.1:8000/api/auth/register/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, role })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.detail || "Registration failed");
      return;
    }

    alert("Registered successfully. Please login.");
    showLogin();
    return;
  }

  // ✅ LOGIN (FORM DATA for FastAPI)
  const formData = new URLSearchParams();
  formData.append("username", email);
  formData.append("password", password);

  const loginRes = await fetch("http://127.0.0.1:8000/api/auth/login/", {
    method: "POST",
    body: formData
  });

  const loginData = await loginRes.json();

  if (!loginRes.ok) {
    alert("Invalid credentials");
    return;
  }

  // Save token
  localStorage.setItem("token", loginData.access_token);

  // ✅ Get user role from /me
  const meRes = await fetch("http://127.0.0.1:8000/api/auth/me/", {
    headers: {
      Authorization: "Bearer " + loginData.access_token
    }
  });

  const user = await meRes.json();

  // Redirect based on role
  if (user.role === "student")
    window.location.href = "student-dashboard.html";
  else if (user.role === "teacher")
    window.location.href = "teacher-dashboard.html";
  else
    window.location.href = "admin-dashboard.html";
}

// ✅ HELPERS (OUTSIDE)
function showError(id, msg) {
  document.getElementById(id).innerText = msg;
}

function clearErrors() {
  document.querySelectorAll(".error").forEach(e => (e.innerText = ""));
}
