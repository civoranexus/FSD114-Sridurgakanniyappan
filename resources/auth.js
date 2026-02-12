// ---------------- LOGOUT ----------------
function logout() {
  const confirmLogout = confirm("Are you sure you want to log out?");
  if (!confirmLogout) return;

  localStorage.removeItem("token");
  localStorage.removeItem("role");
  window.location.href = "login.html";
}

// ---------------- AUTH GUARD ----------------
function requireAuth(requiredRole) {
  const token = localStorage.getItem("token");
  const role = (localStorage.getItem("role") || "").toLowerCase();

  // Not logged in
  if (!token || !role) {
    window.location.href = "login.html";
    return;
  }

  // Role mismatch
  if (requiredRole && role !== requiredRole) {
    window.location.href = "login.html";
    return;
  }

  // ✅ Nothing else here
  // ❌ NO fetch
  // ❌ NO /auth/me
  // ❌ NO async / await
}

