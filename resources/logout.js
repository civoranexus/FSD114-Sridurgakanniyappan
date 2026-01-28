document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById("logoutBtn");

  if (!logoutBtn) return;

  logoutBtn.addEventListener("click", function (e) {
    e.preventDefault();

    const confirmLogout = confirm("Are you sure you want to log out?");

    if (confirmLogout) {
      // OPTIONAL: Clear session/local storage if used
      localStorage.clear();
      sessionStorage.clear();

      // Redirect to login page
      window.location.href = "index.html";
    }
  });
});
