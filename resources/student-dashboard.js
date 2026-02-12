// ===== CONFIG =====
const API_BASE = "http://127.0.0.1:8000/api";

const token = localStorage.getItem("token");
const role = localStorage.getItem("role");

// ===== STATE =====
let allCourses = [];
let myCourses = [];
let myCertificates = [];
let notifications = [];
let currentCourseId = null;
let currentLessonIndex = 0;

// ===== AUTH CHECK =====
if (!token || role !== "student") {
  localStorage.clear();
  window.location.href = "login.html";
}

// ===== ELEMENTS =====
const mainContent = document.getElementById("mainContent");
const sidebar = document.querySelector(".sidebar");
const menuBtn = document.getElementById("menuBtn");

// ===== MOBILE MENU =====
if (menuBtn) {
  menuBtn.addEventListener("click", () => sidebar.classList.toggle("show"));
}

// ===== API HELPERS =====
async function authFetch(endpoint, options = {}) {
  const headers = {
    ...(options.headers || {}),
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
  if (res.status === 401) {
    localStorage.clear();
    window.location.href = "login.html";
    throw new Error("Unauthorized");
  }
  return res;
}

// ===== DATA FETCHING =====
async function fetchAllData() {
  try {
    const [coursesRes, myCoursesRes, certsRes, notifsRes] = await Promise.all([
      authFetch("/courses/browse"),
      authFetch("/courses/my"),
      authFetch("/certificates/my"),
      authFetch("/notifications/")
    ]);

    if (coursesRes.ok) {
      allCourses = await coursesRes.json();
      console.log("All courses fetched:", allCourses);
    }
    if (myCoursesRes.ok) {
      myCourses = await myCoursesRes.json();
      console.log("My courses fetched:", myCourses);
    }
    if (certsRes.ok) {
      myCertificates = await certsRes.json();
      console.log("Certificates fetched:", myCertificates);
    }
    if (notifsRes.ok) {
      notifications = await notifsRes.json();
    }

  } catch (err) {
    console.error("Error fetching data:", err);
  }
}

// ===== ENROLLMENT =====
async function enrollCourse(courseId) {
  try {
    const res = await authFetch("/enrollment/", {
      method: "POST",
      body: JSON.stringify({ course_id: courseId })
    });
    if (res.ok) {
      alert("Enrolled successfully!");
      await fetchAllData();
      renderCurrentPage();
    } else {
      const data = await res.json();
      alert(data.detail || "Enrollment failed");
    }
  } catch (err) {
    console.error(err);
  }
}

// ===== LOGOUT =====
function logout() {
  localStorage.clear();
  window.location.href = "login.html";
}

// ===== RENDER HELPERS =====
function getProgressBar(percent) {
  return `<div class="progress-bar"><div class="progress" style="width:${percent}%">${percent}%</div></div>`;
}

function getCourseButton(courseId) {
  const isEnrolled = myCourses.some(c => c.id == courseId);
  const isCertified = myCertificates.some(c => c.course_id == courseId);

  if (isCertified) return `<button onclick="window.location.href='certificates.html'">View Certificate</button>`;

  if (isEnrolled) {
    const progressIdx = parseInt(localStorage.getItem(`course_progress_${courseId}`) || 0);
    return `<button onclick="loadCourse(${courseId})">${progressIdx > 0 ? 'Resume' : 'Start'} learning</button>`;
  }

  return `<button class="btn-enroll" onclick="enrollCourse(${courseId})">Enroll Now</button>`;
}

// ===== PAGE RENDERERS =====
// ===== DASHBOARD FILTERS =====
let searchFilter = "";
let categoryFilter = "all";
let levelFilter = "all";

function renderDashboard() {
  const enrolledCount = myCourses.length;
  const pendingCertsCount = myCourses.filter(c => {
    const progress = parseInt(localStorage.getItem(`course_progress_${c.id}`) || 0);
    return progress >= (c.lessons ? c.lessons.length : 0) && !myCertificates.some(cert => cert.course_id === c.id);
  }).length;
  const availableCount = allCourses.length - enrolledCount;

  mainContent.innerHTML = `
    <section class="stats">
      <div class="card"><h3>Enrolled</h3><p>${enrolledCount}</p></div>
      <div class="card"><h3>Pending Certs</h3><p>${pendingCertsCount}</p></div>
      <div class="card"><h3>Available</h3><p>${availableCount}</p></div>
    </section>

    <!-- ===== BROWSE COURSES SECTION ===== -->
    <section class="browse-section" id="browseCoursesSection">
      <div class="section-header">
        <div>
          <h2 class="section-title">Browse Courses</h2>
          <p class="section-subtitle">Explore courses and enroll to start learning</p>
        </div>
        <div class="search-wrap">
          <input type="text" id="courseSearchInput" placeholder="Search courses (HTML, Python...)" value="${searchFilter}" oninput="updateSearch(this.value)" />
        </div>
      </div>

      <!-- Filters -->
      <div class="filters-grid">
        <select id="filterCategory" onchange="updateCategory(this.value)">
          <option value="all" ${categoryFilter === 'all' ? 'selected' : ''}>All Categories</option>
          <option value="Development" ${categoryFilter === 'Development' ? 'selected' : ''}>Development</option>
          <option value="Design" ${categoryFilter === 'Design' ? 'selected' : ''}>Design</option>
          <option value="Data" ${categoryFilter === 'Data' ? 'selected' : ''}>Data</option>
          <option value="Business" ${categoryFilter === 'Business' ? 'selected' : ''}>Business</option>
        </select>

        <select id="filterLevel" onchange="updateLevel(this.value)">
          <option value="all" ${levelFilter === 'all' ? 'selected' : ''}>All Levels</option>
          <option value="Beginner" ${levelFilter === 'Beginner' ? 'selected' : ''}>Beginner</option>
          <option value="Intermediate" ${levelFilter === 'Intermediate' ? 'selected' : ''}>Intermediate</option>
          <option value="Advanced" ${levelFilter === 'Advanced' ? 'selected' : ''}>Advanced</option>
        </select>

        <button class="btn btn-outline" onclick="resetFilters()">Reset</button>
      </div>

      <div class="courses-grid" id="browseCoursesGrid">
        <!-- Filled by updateDashboardGrids() -->
      </div>
    </section>

    <section class="courses">
      <h2>My Active Courses</h2>
      <div class="course-grid" id="myActiveCoursesGrid">
        <!-- Filled by updateDashboardGrids() -->
      </div>
    </section>
  `;

  updateDashboardGrids();
}

function updateSearch(val) { searchFilter = val; updateDashboardGrids(); }
function updateCategory(val) { categoryFilter = val; updateDashboardGrids(); }
function updateLevel(val) { levelFilter = val; updateDashboardGrids(); }
function resetFilters() { searchFilter = ""; categoryFilter = "all"; levelFilter = "all"; renderDashboard(); }

function updateDashboardGrids() {
  const browseGrid = document.getElementById('browseCoursesGrid');
  const myGrid = document.getElementById('myActiveCoursesGrid');
  if (!browseGrid || !myGrid) return;

  // Render My Courses
  myGrid.innerHTML = myCourses.map(course => {
    const totalLessons = course.lessons ? course.lessons.length : 0;
    const progressIdx = parseInt(localStorage.getItem(`course_progress_${course.id}`) || 0);
    const percent = totalLessons > 0 ? Math.round((progressIdx / totalLessons) * 100) : 0;
    return `
      <div class="course-card">
        <h3>${course.title}</h3>
        <p>${course.description || "No description"}</p>
        ${getProgressBar(percent)}
        <button onclick="loadCourse(${course.id})">Continue Learning</button>
      </div>
    `;
  }).join('') || '<p>You have not enrolled in any courses yet.</p>';

  // Render Browse (Filtered)
  const filtered = allCourses.filter(c => {
    const isEnrolled = myCourses.some(m => m.id === c.id);
    if (isEnrolled) return false;

    const matchesSearch = c.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      (c.description && c.description.toLowerCase().includes(searchFilter.toLowerCase()));
    const matchesCategory = categoryFilter === "all" || c.category === categoryFilter;
    const matchesLevel = levelFilter === "all" || c.level === levelFilter;

    return matchesSearch && matchesCategory && matchesLevel;
  });

  browseGrid.innerHTML = filtered.map(course => `
    <div class="course-card">
      <h3>${course.title}</h3>
      <p>${course.description || "No description"}</p>
      <div class="course-meta">
        <span class="badge">${course.category || 'General'}</span>
        <span class="badge">${course.level || 'All Levels'}</span>
      </div>
      <button class="btn-enroll" onclick="enrollCourse(${course.id})">Enroll Now</button>
    </div>
  `).join('') || '<p>No courses found matching your filters.</p>';
}

function renderMyCoursesPage() {
  let html = myCourses.map(course => {
    const id = course.id;
    const totalLessons = course.lessons ? course.lessons.length : 0;
    const progressIdx = parseInt(localStorage.getItem(`course_progress_${id}`) || 0);
    const percent = totalLessons > 0 ? Math.round((progressIdx / totalLessons) * 100) : 0;
    return `
          <div class="course-card">
            <h3>${course.title}</h3>
            <p>${course.description || "No description"}</p>
            ${getProgressBar(percent)}
            <button onclick="loadCourse(${id})">Resume Course</button>
          </div>
        `;
  }).join('') || '<p>No courses enrolled yet.</p>';

  mainContent.innerHTML = `<h2>My Enrolled Courses</h2><div class="course-grid">${html}</div>`;
}

function renderCertificatesPage() {
  let html = myCertificates.map(cert => `
      <div class="certificate-card">
        <div class="cert-info">
            <h3>${cert.course_title}</h3>
            <p>Issued on: ${new Date(cert.issued_date).toLocaleDateString()}</p>
        </div>
        <button onclick="downloadCertificate(${cert.course_id})">Download PDF</button>
      </div>
    `).join('') || '<p>No certificates earned yet.</p>';

  mainContent.innerHTML = `<h2>My Certificates</h2><div class="list-container">${html}</div>`;
}

function renderAssignmentsPage() {
  const pendingHtml = myCourses.filter(c => {
    const progress = parseInt(localStorage.getItem(`course_progress_${c.id}`) || 0);
    return progress >= (c.lessons ? c.lessons.length : 0);
  }).map(c => `
    <div class="assignment-card">
      <h4>${c.title} Assessment</h4>
      <p>Complete the final quiz to earn your certificate.</p>
      <button onclick="window.location.href='assignments.html?course_id=${c.id}'">Start Quiz</button>
    </div>
  `).join('') || '<p>No pending assessments. Complete your lessons first!</p>';

  mainContent.innerHTML = `
      <section class="assignments-page">
          <h2 class="page-title">My Assessments</h2>
          <div class="assignment-section">
              <h3>Pending Quizzes</h3>
              <div class="assignment-list">${pendingHtml}</div>
          </div>
      </section>
  `;

  const params = new URLSearchParams(window.location.search);
  const courseId = params.get('course_id');
  if (courseId) {
    initQuiz(courseId);
  }
}

async function initQuiz(courseId) {
  const course = allCourses.find(c => c.id == courseId);
  if (!course) return;

  mainContent.innerHTML = `
      <div class="quiz-view-wrapper">
        <h2>${course.title} - Final Assessment</h2>
        <div class="card quiz-card" id="quizContainer">
          <p>Loading quiz questions...</p>
        </div>
        <button class="btn btn-outline" style="margin-top:20px;" onclick="window.location.href='course-player.html?course_id=${courseId}'">Back to Lessons</button>
      </div>
  `;

  try {
    const res = await authFetch(`/assignments/course/${courseId}`);
    const assignments = res.ok ? await res.json() : [];

    if (assignments.length === 0) {
      const mockQuestions = [
        { id: 1, text: "What is HTML?", options: ["Markup Language", "Programming Language", "Database", "OS"], correct: 0 },
        { id: 2, text: "What does CSS stand for?", options: ["Cascading Style Sheets", "Computer Style Sheets", "Creative Style Sheets", "None"], correct: 0 },
        { id: 3, text: "Which tag is used for 1st level heading?", options: ["<h6>", "<head>", "<h1>", "<heading>"], correct: 2 },
        { id: 4, text: "What is JavaScript used for?", options: ["Interactivity", "Static Layout", "Databases Only", "None"], correct: 0 },
        { id: 5, text: "Is React a Library or Framework?", options: ["Library", "Framework", "Language", "Database"], correct: 0 }
      ];
      window.currentQuizQuestions = mockQuestions;
      renderQuizQuestions(courseId, mockQuestions);
    } else {
      const a = assignments[0];
      document.getElementById('quizContainer').innerHTML = `
          <h3>${a.title}</h3>
          <p>${a.description}</p>
          <textarea id="quizResponse" rows="5" style="width:100%; margin-top:10px; padding:10px; border-radius:8px; border:1px solid #ddd;" placeholder="Enter your response or answers here..."></textarea>
          <button class="btn btn-primary" style="margin-top:20px;" onclick="submitAssignmentResp(${a.id}, ${courseId})">Submit Assignment</button>
      `;
    }
  } catch (e) {
    console.error(e);
  }
}

function renderQuizQuestions(courseId, questions) {
  const html = questions.map((q, idx) => `
      <div class="quiz-q-block" style="margin-bottom: 20px; padding:15px; background:#f8fafc; border-radius:12px;">
        <p><strong>${idx + 1}. ${q.text}</strong></p>
        ${q.options.map((opt, oIdx) => `
          <label style="display: block; margin: 8px 0; cursor:pointer;">
            <input type="radio" name="q-${idx}" value="${oIdx}"> ${opt}
          </label>
        `).join('')}
      </div>
  `).join('');

  document.getElementById('quizContainer').innerHTML = html + `
      <button class="btn btn-primary" style="margin-top:20px; width:100%;" onclick='evaluateLocalQuiz(${courseId})'>Submit Quiz</button>
  `;
}

async function evaluateLocalQuiz(courseId) {
  const questions = window.currentQuizQuestions;
  let score = 0;
  questions.forEach((q, idx) => {
    const selected = document.querySelector(`input[name="q-${idx}"]:checked`);
    if (selected && parseInt(selected.value) === q.correct) score++;
  });

  alert(`Your score: ${score} / ${questions.length}`);
  if (score >= 4) {
    alert("Passed! Generating certificate...");
    await downloadCertificate(courseId);
    window.location.href = 'certificates.html';
  } else {
    alert("You need at least 4 correct answers to pass.");
  }
}

async function submitAssignmentResp(assignmentId, courseId) {
  const content = document.getElementById('quizResponse').value;
  if (!content) return alert("Please enter your response");

  const res = await authFetch("/assignments/submit", {
    method: "POST",
    body: JSON.stringify({ content, assignment_id: assignmentId })
  });

  if (res.ok) {
    alert("Submitted! We'll mark it as passed for this demo.");
    await downloadCertificate(courseId);
    window.location.href = 'certificates.html';
  }
}

// ===== COURSE PLAYER =====
function loadCourse(courseId) {
  window.location.href = `course-player.html?course_id=${courseId}`;
}

async function initCoursePlayer() {
  const params = new URLSearchParams(window.location.search);
  const courseId = params.get('course_id');
  if (!courseId) return;

  await fetchAllData();
  const course = allCourses.find(c => c.id == courseId);
  if (!course) {
    mainContent.innerHTML = "<h2>Course not found</h2>";
    return;
  }

  currentCourseId = courseId;
  currentLessonIndex = parseInt(localStorage.getItem(`course_progress_${courseId}`) || 0);
  renderPlayer(course);
}

function renderPlayer(course) {
  const lessons = course.lessons || [];
  const lesson = lessons[currentLessonIndex] || { title: "No Lesson Found", content: "Please contact support." };
  const isLast = currentLessonIndex === lessons.length - 1;

  const moduleItems = lessons.map((l, idx) => `
        <li class="module-item ${idx === currentLessonIndex ? 'active' : ''}" onclick="changeLesson(${idx})">
            <span>${idx < currentLessonIndex ? '✔' : (idx === currentLessonIndex ? '▶' : '○')}</span>
            ${l.title}
        </li>
    `).join('');

  mainContent.innerHTML = `
        <div class="player-layout">
            <div class="player-sidebar-col">
                <h3>${course.title}</h3>
                <ul class="lesson-list-sidebar">${moduleItems}</ul>
                <button onclick="window.location.href='student-dashboard.html'">← Back</button>
            </div>
            <div class="player-main-col">
                <div class="video-container-wrap">
                    ${lesson.video_url ?
      `<iframe src="video.html?url=${encodeURIComponent(lesson.video_url)}" frameborder="0" allowfullscreen></iframe>` :
      '<div class="no-video">No Video Available</div>'
    }
                </div>
                <div class="lesson-info">
                    <h2>${lesson.title}</h2>
                    <div class="lesson-notes">${lesson.content || "No notes available for this lesson."}</div>
                </div>
                <div class="player-controls">
                    <button onclick="prevLesson()" ${currentLessonIndex === 0 ? 'disabled' : ''}>Previous</button>
                    <button onclick="nextLesson()">${isLast ? 'Finish & Take Quiz' : 'Next Lesson'}</button>
                </div>
            </div>
        </div>
    `;
}

function changeLesson(idx) {
  currentLessonIndex = idx;
  localStorage.setItem(`course_progress_${currentCourseId}`, idx);
  const course = allCourses.find(c => c.id == currentCourseId);
  renderPlayer(course);
}

function nextLesson() {
  const course = allCourses.find(c => c.id == currentCourseId);
  if (currentLessonIndex < (course.lessons ? course.lessons.length - 1 : 0)) {
    changeLesson(currentLessonIndex + 1);
  } else {
    localStorage.setItem(`course_progress_${currentCourseId}`, (course.lessons ? course.lessons.length : 0));
    window.location.href = `assignments.html?course_id=${currentCourseId}`;
  }
}

function prevLesson() {
  if (currentLessonIndex > 0) changeLesson(currentLessonIndex - 1);
}

// ===== DOWNLOAD CERT =====
async function downloadCertificate(courseId) {
  try {
    const res = await authFetch(`/certificates/generate/${courseId}`, { method: "POST" });
    const data = await res.json();
    if (data.certificate_id) {
      const blobRes = await authFetch(`/certificates/download/${data.certificate_id}`);
      const blob = await blobRes.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Certificate-${courseId}.pdf`;
      a.click();
    }
  } catch (e) {
    console.error(e);
  }
}

// ===== INITIALIZATION =====
function renderCurrentPage() {
  const path = window.location.pathname;
  if (path.includes('student-dashboard.html')) renderDashboard();
  else if (path.includes('mycourses.html')) renderMyCoursesPage();
  else if (path.includes('certificates.html')) renderCertificatesPage();
  else if (path.includes('course-player.html')) initCoursePlayer();
  else if (path.includes('assignments.html')) renderAssignmentsPage();
}

window.addEventListener('DOMContentLoaded', async () => {
  await fetchAllData();
  renderCurrentPage();
});
