// ---------------- LOGOUT ----------------
function logout() {
  const confirmLogout = confirm("Are you sure you want to log out?");
  if (!confirmLogout) return;

  localStorage.removeItem("token");
  localStorage.removeItem("role");
  window.location.href = "login.html";
}

// ---------------- AUTH GUARD ----------------
async function requireAuth(requiredRole) {
  const token = localStorage.getItem("token");
  const role = (localStorage.getItem("role") || "").toLowerCase();

  if (!token || !role) {
    console.warn("No token or role found. Redirecting to login.");
    window.location.href = "login.html";
    return;
  }

  if (requiredRole && role !== requiredRole) {
    console.warn("Role mismatch. Redirecting to login.");
    window.location.href = "login.html";
    return;
  }

  try {
    const API_BASE =
      localStorage.getItem("API_BASE") ||
      (location.hostname === "localhost"
        ? "http://127.0.0.1:8000/api"
        : "https://your-backend-domain.com/api");

    const res = await fetch(`${API_BASE}/users/me/`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) throw new Error("Unauthorized");

  } catch (e) {
    console.warn("Auth failed. Redirecting to login.");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "login.html";
  }
}
