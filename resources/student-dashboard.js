// ===== ELEMENTS =====
const mainContent = document.getElementById("mainContent");
const navLinks = document.querySelectorAll(".sidebar nav a");
const menuBtn = document.getElementById("menuBtn");
const sidebar = document.querySelector(".sidebar");
const logoutBtn = document.getElementById("logoutBtn");

// ===== MOBILE MENU =====
if (menuBtn) {
  menuBtn.addEventListener("click", () => {
    sidebar.classList.toggle("show");
  });
}

navLinks.forEach(link => {
  link.addEventListener("click", () => {
    if (window.innerWidth <= 768) sidebar.classList.remove("show");
  });
});

// ===== AUTH CHECK =====
const isLoggedIn = localStorage.getItem("isLoggedIn");
const role = localStorage.getItem("userRole");

if (isLoggedIn !== "true" || role !== "student") {
  window.location.href = "login.html"; // Redirect if not logged in as student
}

// ===== LOGOUT =====
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    localStorage.clear(); // clears login & progress
    window.location.href = "login.html";
  });
}

// ===== HELPER FUNCTIONS =====
function getProgressBar(percent) {
  return `<div class="progress-bar"><div class="progress" style="width:${percent}%">${percent}%</div></div>`;
}

function getCourseButton(courseId) {
  const isCertified = localStorage.getItem(`certificate_earned_${courseId}`);
  if (isCertified) return `<button onclick="loadPage('certificates')">View Certificate</button>`;

  const videoDone = localStorage.getItem(`course_video_done_${courseId}`);
  if (videoDone) return `<button onclick="loadAssignment('${courseId}')">Take Assignment</button>`;

  const savedLesson = localStorage.getItem(`course_progress_${courseId}`);
  const label = savedLesson && parseInt(savedLesson) > 0 ? "Resume Course" : "Start Course";
  return `<button onclick="loadCourse('${courseId}')">${label}</button>`;
}

// ===== COURSE & QUIZ DATA =====
const courseData = {
  'web-development-basics': {
    title: 'Web Development Basics',
    modules: [
      { id: 1, title: 'Introduction to HTML', videoUrl: 'https://www.youtube.com/embed/qz0aGYrrlhU', notes: 'HTML stands for HyperText Markup Language.' },
      { id: 2, title: 'CSS Styling Basics', videoUrl: 'https://www.youtube.com/embed/1Rs2ND1ryYc', notes: 'Cascading Style Sheets (CSS) is a style sheet language.' },
      { id: 3, title: 'JavaScript Essentials', videoUrl: 'https://www.youtube.com/embed/W6NZfCO5SIk', notes: 'JavaScript is a programming language for the web.' }
    ]
  },
  'react-fundamentals': {
    title: 'React Fundamentals',
    modules: [
      { id: 1, title: 'React Components', videoUrl: 'https://www.youtube.com/embed/Y2hgEGPzTZY', notes: 'Components are independent and reusable bits of code.' },
      { id: 2, title: 'State and Props', videoUrl: 'https://www.youtube.com/embed/4ORZ1GmjaMc', notes: 'State contains data specific to a component.' }
    ]
  },
  'full-stack-dev': {
    title: 'Full Stack Development',
    modules: [
      { id: 1, title: 'Front-end Basics', videoUrl: '', notes: 'HTML/CSS/JS basics' },
      { id: 2, title: 'Back-end Basics', videoUrl: '', notes: 'Node.js + Express basics' }
    ]
  },
  'python-beginners': {
    title: 'Python for Beginners',
    modules: [
      { id: 1, title: 'Python Basics', videoUrl: '', notes: 'Variables, loops, functions' },
      { id: 2, title: 'Python Advanced', videoUrl: '', notes: 'OOP, modules, libraries' }
    ]
  }
};

const quizData = {
  'web-development-basics': [
    { q: "What does HTML stand for?", options: ["Hyper Text Markup Language", "Home Tool Markup Language", "Hyperlinks and Text Markup Language", "None of the above"], a: 0 },
    { q: "Who is making the Web standards?", options: ["Google", "The World Wide Web Consortium", "Microsoft", "Mozilla"], a: 1 },
    { q: "Choose the correct HTML element for the largest heading:", options: ["<h6>", "<head>", "<heading>", "<h1>"], a: 3 },
    { q: "What is the correct HTML element for inserting a line break?", options: ["<lb>", "<br>", "<break>", "<b>"], a: 1 },
    { q: "Which character is used to indicate an end tag?", options: ["^", "<", "/", "*"], a: 2 },
    { q: "What does CSS stand for?", options: ["Creative Style Sheets", "Cascading Style Sheets", "Computer Style Sheets", "Colorful Style Sheets"], a: 1 },
    { q: "Which HTML attribute is used to define inline styles?", options: ["font", "style", "class", "styles"], a: 1 },
    { q: "Which is the correct CSS syntax?", options: ["body {color: black;}", "{body;color:black;}", "body:color=black;", "{body:color=black;}"], a: 0 },
    { q: "Inside which HTML element do we put the JavaScript?", options: ["<scripting>", "<js>", "<script>", "<javascript>"], a: 2 },
    { q: "Where is the correct place to insert a JavaScript?", options: ["The <head> section", "The <body> section", "Both <head> and <body>", "None"], a: 2 }
  ]
};

// ===== COURSE PLAYER =====
let currentCourseId = null;
let currentLessonIndex = 0;

function loadCourse(courseId) {
  currentCourseId = courseId;
  currentLessonIndex = parseInt(localStorage.getItem(`course_progress_${courseId}`) || 0);
  renderCoursePlayer();
}

function renderCoursePlayer() {
  const course = courseData[currentCourseId];
  if (!course) return;

  const moduleListHtml = course.modules.map((mod, idx) => `
    <li class="module-item ${idx === currentLessonIndex ? 'active' : ''}" onclick="changeLesson(${idx})">
      <span>${idx < currentLessonIndex ? '✔' : (idx === currentLessonIndex ? '▶' : '○')}</span>
      ${mod.title}
    </li>
  `).join('');

  const lesson = course.modules[currentLessonIndex];
  const isLast = currentLessonIndex === course.modules.length - 1;

  mainContent.innerHTML = `
    <div class="course-player-container">
      <div class="player-sidebar">
        <h3>${course.title}</h3>
        <ul>${moduleListHtml}</ul>
        <button onclick="loadPage('courses')">← Back to Courses</button>
      </div>
      <div class="player-content">
        <iframe src="${lesson.videoUrl}" frameborder="0" allowfullscreen></iframe>
        <h2>Lesson ${currentLessonIndex + 1}: ${lesson.title}</h2>
        <p>${lesson.notes}</p>
        <button onclick="prevLesson()" ${currentLessonIndex === 0 ? 'disabled' : ''}>Previous</button>
        <button onclick="nextLesson()">${isLast ? 'Finish & Take Assignment' : 'Next'}</button>
      </div>
    </div>
  `;
}

function changeLesson(idx) {
  currentLessonIndex = idx;
  localStorage.setItem(`course_progress_${currentCourseId}`, idx);
  renderCoursePlayer();
}

function nextLesson() {
  const course = courseData[currentCourseId];
  if (currentLessonIndex < course.modules.length - 1) changeLesson(currentLessonIndex + 1);
  else {
    localStorage.setItem(`course_video_done_${currentCourseId}`, 'true');
    alert("You completed all lessons! Redirecting to Assignment...");
    loadAssignment(currentCourseId);
  }
}

function prevLesson() {
  if (currentLessonIndex > 0) changeLesson(currentLessonIndex - 1);
}

// ===== ASSIGNMENT / QUIZ =====
function loadAssignment(courseId) {
  currentCourseId = courseId;
  const questions = quizData[courseId];
  if (!questions) { alert("Assignment not available"); loadPage('courses'); return; }

  const qHtml = questions.map((q, idx) => `
    <div class="question-box">
      <p>${idx + 1}. ${q.q}</p>
      ${q.options.map((o, i) => `<label><input type="radio" name="q${idx}" value="${i}" onchange="checkAssignmentCompletion()">${o}</label>`).join('')}
    </div>
  `).join('');

  mainContent.innerHTML = `
    <form id="quizForm" onsubmit="submitQuiz(event)">
      <h2>${courseData[courseId].title} - Assessment</h2>
      ${qHtml}
      <button type="submit" id="submitBtn" disabled>Submit (0/10)</button>
    </form>
  `;
}

function checkAssignmentCompletion() {
  const form = document.getElementById("quizForm");
  const answered = [...new FormData(form).keys()].filter(k => k.startsWith('q')).length;
  const btn = document.getElementById("submitBtn");
  btn.disabled = answered < 10;
  btn.textContent = answered < 10 ? `Submit (${answered}/10)` : 'Submit';
}

function submitQuiz(e) {
  e.preventDefault();
  const formData = new FormData(document.getElementById("quizForm"));
  const questions = quizData[currentCourseId];
  let score = 0;

  questions.forEach((q, i) => {
    if (parseInt(formData.get(`q${i}`)) === q.a) score++;
  });

  localStorage.setItem(`assignment_score_${currentCourseId}`, score);
  const passed = score >= 5;

  if (passed) {
    localStorage.setItem(`certificate_earned_${currentCourseId}`, 'true');
    generateCertificate(currentCourseId);
    alert(`Passed! Score: ${score}/10`);
    loadPage('certificates');
  } else {
    alert(`Failed! Score: ${score}/10. Try again.`);
  }
}

// ===== CERTIFICATE GENERATION =====
function generateCertificate(courseId) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation: 'landscape' });
  const courseName = courseData[courseId].title;
  const studentName = "Student Name";
  const date = new Date().toLocaleDateString();

  doc.setFontSize(40); doc.text("CERTIFICATE OF COMPLETION", 148.5, 50, { align: "center" });
  doc.setFontSize(30); doc.text(studentName, 148.5, 100, { align: "center" });
  doc.setFontSize(25); doc.text(courseName, 148.5, 140, { align: "center" });
  doc.setFontSize(15); doc.text(`Date: ${date}`, 50, 170);
  doc.text("Civora Nexus | EduVillage", 247, 170, { align: "right" });

  doc.save(`Certificate-${courseName.replace(/\s+/g, '-')}.pdf`);
}

// ===== DASHBOARD & PAGE LOAD =====
const pages = {
  dashboard: '',
  courses: '',
  assignments: '',
  quizzes: '<h2>Quizzes</h2><p>Coming soon</p>',
  certificates: '',
  messages: '<h2>Messages</h2><p>No new messages</p>',
  settings: '<h2>Settings</h2><p>Configure your account</p>'
};

function loadPage(page) {
  navLinks.forEach(link => link.classList.remove('active'));
  document.querySelector(`[data-page="${page}"]`)?.classList.add('active');

  if (page === 'dashboard') {
    let pending = '', completed = '';
    Object.keys(courseData).forEach(id => {
      const progress = parseInt(localStorage.getItem(`course_progress_${id}`) || 0);
      const videoDone = localStorage.getItem(`course_video_done_${id}`);
      const certificate = localStorage.getItem(`certificate_earned_${id}`);
      const percent = certificate ? 100 : (videoDone ? 100 : progress * 33);

      const cardHtml = `
        <div class="course-card">
          <h3>${courseData[id].title}</h3>
          <p>${courseData[id].modules.map(m => m.title).join(', ')}</p>
          ${getProgressBar(percent)}
          ${getCourseButton(id)}
        </div>
      `;

      if (certificate) completed += cardHtml;
      else pending += cardHtml;
    });

    mainContent.innerHTML = `
      <section class="stats">
        <div class="card"><h3>Enrolled Courses</h3><p>${Object.keys(courseData).length}</p></div>
        <div class="card"><h3>Completed</h3><p>${document.querySelectorAll('.course-card button:contains("View Certificate")').length || 0}</p></div>
        <div class="card"><h3>Certificates</h3><p>${document.querySelectorAll('.course-card button:contains("View Certificate")').length || 0}</p></div>
      </section>

      <section class="courses"><h2>Continue Learning</h2>${pending}</section>
      ${completed ? `<section class="courses"><h2>✅ Completed Courses</h2>${completed}</section>` : ''}
    `;
  } else if (page === 'certificates') {
    let html = '';
    Object.keys(courseData).forEach(id => {
      if (localStorage.getItem(`certificate_earned_${id}`)) {
        html += `
          <div class="certificate-card">
            <h3>${courseData[id].title}</h3>
            <button onclick="generateCertificate('${id}')">Download Certificate</button>
          </div>
        `;
      }
    });
    mainContent.innerHTML = html || '<p>No certificates earned yet.</p>';
  } else {
    mainContent.innerHTML = pages[page] || '<p>Page under construction.</p>';
  }
}

// ===== DEFAULT LOAD =====
window.addEventListener('DOMContentLoaded', () => {
  loadPage('dashboard'); // Now only runs if student is logged in
});
