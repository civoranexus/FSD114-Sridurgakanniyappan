const API_BASE = "http://127.0.0.1:8000/api";

let isRegister = false;
let role = "student";

// ---------------- ROLE UI ----------------
function selectRole(selectedRole, el) {
  role = selectedRole;
  document.querySelectorAll(".category-btn").forEach(btn =>
    btn.classList.remove("active")
  );
  el.classList.add("active");
}

// ---------------- TOGGLE ----------------
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

// ---------------- HELPERS ----------------
function showError(id, msg) {
  document.getElementById(id).innerText = msg;
}

function clearErrors() {
  document.querySelectorAll(".error").forEach(e => (e.innerText = ""));
}

// ---------------- MAIN ----------------
async function handleSubmit() {
  clearErrors();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const confirm = document.getElementById("confirmPassword")?.value;

  if (!email.includes("@")) {
    showError("emailError", "Enter a valid email");
    return;
  }

  if (password.length < 1) {
    showError("passwordError", "Password required");
    return;
  }

  try {
    // ---------- REGISTER ----------
    if (isRegister) {
      if (password !== confirm) {
        showError("confirmError", "Passwords do not match");
        return;
      }

      const res = await fetch(`${API_BASE}/auth/register/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Registration failed");

      alert("Registration successful! Please login.");
      showLogin();
      return;
    }

    // ---------- LOGIN ----------
    const params = new URLSearchParams();
    params.append("username", email);
    params.append("password", password);

    const loginRes = await fetch(`${API_BASE}/auth/login/`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params,
    });

    const loginData = await loginRes.json();
    if (!loginRes.ok) throw new Error(loginData.detail || "Login failed");

    // Save token
    localStorage.setItem("token", loginData.access_token);

    // ---------- GET USER ROLE FROM BACKEND ----------
    const meRes = await fetch(`${API_BASE}/auth/me/`, {
      headers: {
        Authorization: "Bearer " + loginData.access_token,
      },
    });

    const user = await meRes.json();
    if (!meRes.ok) throw new Error("Failed to fetch user info");

    const userRole = user.role;
    localStorage.setItem("role", userRole);

    // ---------- REDIRECT ----------
    if (userRole === "student")
      window.location.href = "../student-dashboard.html";
    else if (userRole === "teacher")
      window.location.href = "../teacher-dashboard.html";
    else if (userRole === "admin")
      window.location.href = "../admin-dashboard.html";
    else alert("Unknown role: " + userRole);

  } catch (err) {
    alert(err.message);
    console.error(err);
  }
}
