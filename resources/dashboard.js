const mainContent = document.getElementById("mainContent");
const navLinks = document.querySelectorAll(".sidebar nav a");

// ===== PAGE CONTENT =====
const pages = {
  dashboard: `
    <section class="stats">
      <div class="card"><h3>Enrolled Courses</h3><p>5</p></div>
      <div class="card"><h3>Completed</h3><p>2</p></div>
      <div class="card"><h3>Pending Tasks</h3><p>3</p></div>
    </section>

    <section class="courses">
      <h2>My Courses</h2>

      <div class="course-card">
        <h3>Web Development Basics</h3>
        <p>HTML, CSS, JavaScript</p>
        <div class="progress-bar">
          <div class="progress" style="width:70%">70%</div>
        </div>
        <button>Continue Learning</button>
      </div>

      <div class="course-card">
        <h3>React Fundamentals</h3>
        <p>Components, Hooks</p>
        <div class="progress-bar">
          <div class="progress" style="width:40%">40%</div>
        </div>
        <button>Continue Learning</button>
      </div>
    </section>
  `,

  courses: `<h2>My Courses</h2><p>List of all enrolled courses.</p>`,
  assignments: `<h2>Assignments</h2><p>No pending assignments.</p>`,
  quizzes: `<h2>Quizzes</h2><p>Upcoming quizzes will appear here.</p>`,
  grades: `<h2>Grades</h2><p>Your grades will be displayed here.</p>`,
  messages: `<h2>Messages</h2><p>No new messages.</p>`,
  settings: `<h2>Settings</h2><p>Update your profile and password.</p>`
};

// ===== LOAD PAGE =====
function loadPage(page) {
  mainContent.innerHTML = pages[page];

  navLinks.forEach(link => link.classList.remove("active"));
  document.querySelector(`[data-page="${page}"]`)?.classList.add("active");
}

// DEFAULT LOAD
loadPage("dashboard");

// ===== SIDEBAR CLICK =====
navLinks.forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();
    const page = link.getAttribute("data-page");
    if (page) loadPage(page);
  });
});

// ===== LOGOUT =====
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("isLoggedIn");
  window.location.href = "../index.html";
});

