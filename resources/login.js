// ================= CONFIG =================
const API_BASE = "http://127.0.0.1:8000/api";

let role = "student"; // default

// ================= ROLE UI =================
function selectRole(selectedRole, el) {
  role = selectedRole;
  document.querySelectorAll(".category-btn").forEach(btn =>
    btn.classList.remove("active")
  );
  el.classList.add("active");
}

// ================= TOGGLE =================
function showLogin() {
  document.getElementById("confirmBox").style.display = "none";
  document.querySelectorAll(".toggle-btn").forEach((btn, i) =>
    btn.classList.toggle("active", i === 0)
  );
}

function showRegister() {
  alert("Registration is handled by admin. Please login.");
  showLogin();
}

// ================= HELPERS =================
function showError(id, msg) {
  document.getElementById(id).innerText = msg;
}

function clearErrors() {
  document.querySelectorAll(".error").forEach(e => (e.innerText = ""));
}

// ================= MAIN LOGIN =================
async function handleSubmit() {
  clearErrors();

  const email = document.getElementById("email").value.trim().toLowerCase();
  const password = document.getElementById("password").value;

  if (!email) {
    showError("emailError", "Email required");
    return;
  }

  if (password.length < 1) {
    showError("passwordError", "Password required");
    return;
  }

  try {
    const params = new URLSearchParams();
    params.append("username", email);
    params.append("password", password);

    const res = await fetch(`${API_BASE}/auth/login/`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params,
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || "Login failed");

    // Save token
    localStorage.setItem("token", data.access_token);

    // Get user info
    const meRes = await fetch(`${API_BASE}/auth/me`, {
      headers: {
        Authorization: "Bearer " + data.access_token,
      },
    });

    if (!meRes.ok) throw new Error("Unauthorized");

    const user = await meRes.json();
    const userRole = (user.role || "").toLowerCase();
    console.log("User role:", userRole);
    localStorage.setItem("role", userRole);

    // Redirect
    if (userRole === "student") {
      window.location.href = "student-dashboard.html";
    } else if (userRole === "teacher") {
      window.location.href = "teacher-dashboard.html";
    } else if (userRole === "admin") {
      window.location.href = "admin-dashboard.html";
    } else {
      alert("Unknown role");
    }

  } catch (err) {
    alert(err.message);
    console.error(err);
  }
}
