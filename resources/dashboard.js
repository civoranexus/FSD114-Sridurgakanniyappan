const mainContent = document.getElementById("mainContent");
const navLinks = document.querySelectorAll(".sidebar nav a");
const menuBtn = document.getElementById("menuBtn");
const sidebar = document.querySelector(".sidebar");

// ===== MOBILE MENU =====
if (menuBtn) {
  menuBtn.addEventListener("click", () => {
    sidebar.classList.toggle("show");
  });
}

// Close sidebar on link click (mobile)
navLinks.forEach(link => {
  link.addEventListener("click", () => {
    if (window.innerWidth <= 768) {
      sidebar.classList.remove("show");
    }
  });
});

// ===== AUTH CHECK =====
if (!localStorage.getItem("isLoggedIn")) {
  window.location.href = "login.html";
}

// ===== HELPER FUNCTIONS =====
function getProgressBar(percent) {
  return `
    <div class="progress-bar">
      <div class="progress" style="width:${percent}%">${percent}%</div>
    </div>
  `;
}

function getCourseButton(courseId) {
  // Check if course is fully completed (video + assignment)
  const isCertified = localStorage.getItem(`certificate_earned_${courseId}`);
  if (isCertified) {
     return `<button onclick="loadPage('certificates')">View Certificate</button>`;
  }

  // Check if assignment is unlocked
  const videoDone = localStorage.getItem(`course_video_done_${courseId}`);
  if (videoDone) {
    return `<button onclick="loadAssignment('${courseId}')">Take Assignment</button>`;
  }

  const savedLesson = localStorage.getItem(`course_progress_${courseId}`);
  const hasProgress = savedLesson && parseInt(savedLesson) > 0;
  const label = hasProgress ? "Resume Course" : "Start Course";
  return `<button onclick="loadCourse('${courseId}')">${label}</button>`;
}

// ===== QUIZ DATA =====
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
  ],
  'react-fundamentals': [
    { q: "What is React?", options: ["A Library", "A Framework", "A Language", "A Database"], a: 0 },
    { q: "Who maintains React?", options: ["Google", "Facebook (Meta)", "Amazon", "Twitter"], a: 1 },
    { q: "What is JSX?", options: ["A syntax extension for JavaScript", "A new language", "A database", "A style sheet"], a: 0 },
    { q: "Everything in React is a ________", options: ["Module", "Component", "Package", "Class"], a: 1 },
    { q: "What is the virtual DOM?", options: ["A direct copy of the DOM", "A lightweight copy of the DOM", "A database", "A browser"], a: 1 },
    { q: "How do you handle state in a class component?", options: ["this.state", "useState", "state()", "store"], a: 0 },
    { q: "Which hook is used for side effects?", options: ["useState", "useEffect", "useReducer", "useCallback"], a: 1 },
    { q: "Props are __________", options: ["Mutable", "Immutable", "Global", "Private"], a: 1 },
    { q: "What acts as the entry point of a React application?", options: ["App.js", "index.js", "main.js", "server.js"], a: 1 },
    { q: "Which method is used to render content in class components?", options: ["return()", "render()", "display()", "show()"], a: 1 }
  ]
};

// ===== COURSE DATA =====
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
  }
};

let currentCourseId = null;
let currentLessonIndex = 0;

// ===== COURSE PLAYER FUNCTIONS =====
function loadCourse(courseId) {
  currentCourseId = courseId;
  const savedLesson = localStorage.getItem(`course_progress_${courseId}`);
  currentLessonIndex = savedLesson ? parseInt(savedLesson) : 0;
  renderCoursePlayer();
}

function renderCoursePlayer() {
  const course = courseData[currentCourseId];
  if (!course) return;

  const moduleListHtml = course.modules.map((mod, index) => `
    <li class="module-item ${index === currentLessonIndex ? 'active' : ''}" onclick="changeLesson(${index})">
      <span class="module-status">${index < currentLessonIndex ? '✔' : (index === currentLessonIndex ? '▶' : '○')}</span>
      ${mod.title}
    </li>
  `).join('');

  const currentLesson = course.modules[currentLessonIndex];
  const isLastLesson = currentLessonIndex === course.modules.length - 1;

  const playerHtml = `
    <div class="course-player-container">
      <div class="player-sidebar">
        <h3>${course.title}</h3>
        <ul class="module-list">${moduleListHtml}</ul>
        <button class="btn-back" onclick="loadPage('courses')">← Back to My Courses</button>
      </div>

      <div class="player-content">
        <div class="video-wrapper">
          <iframe id="videoPlayer" src="${currentLesson.videoUrl}" frameborder="0" allowfullscreen></iframe>
        </div>
        
        <div class="lesson-controls">
          <button id="prevBtn" onclick="prevLesson()" ${currentLessonIndex === 0 ? 'disabled' : ''}>Previous</button>
          <button id="nextBtn" onclick="nextLesson()">
            ${isLastLesson ? 'Finish & Take Assignment' : 'Next Lesson'}
          </button>
        </div>

        <div class="lesson-info">
          <h2 id="lessonTitle">Lesson ${currentLessonIndex + 1}: ${currentLesson.title}</h2>
          <div class="lesson-notes">
            <h4>Lesson Notes:</h4>
            <p id="lessonNotes">${currentLesson.notes}</p>
          </div>
        </div>
      </div>
    </div>
  `;
  mainContent.innerHTML = playerHtml;
  navLinks.forEach(link => link.classList.remove("active"));
}

function changeLesson(index) {
  currentLessonIndex = index;
  localStorage.setItem(`course_progress_${currentCourseId}`, index);
  renderCoursePlayer();
}

function nextLesson() {
  const course = courseData[currentCourseId];
  if (currentLessonIndex < course.modules.length - 1) {
    changeLesson(currentLessonIndex + 1);
  } else {
    // Finish Course Logic
    localStorage.setItem(`course_video_done_${currentCourseId}`, "true");
    alert("You have completed all video lessons! Redirecting to Assignment...");
    loadAssignment(currentCourseId);
  }
}

function prevLesson() {
  if (currentLessonIndex > 0) {
    changeLesson(currentLessonIndex - 1);
  }
}

// ===== ASSIGNMENT / QUIZ FUNCTIONS =====
function loadAssignment(courseId) {
  currentCourseId = courseId;
  const questions = quizData[courseId];
  
  if (!questions) {
    alert("Assignment not available yet.");
    loadPage('courses');
    return;
  }

  const qHtml = questions.map((q, idx) => `
    <div class="question-box">
      <p class="question-text">${idx + 1}. ${q.q}</p>
      <div class="options-list">
        ${q.options.map((opt, optIdx) => `
          <label class="option-label">
            <input type="radio" name="q${idx}" value="${optIdx}" onchange="checkAssignmentCompletion()">
            ${opt}
          </label>
        `).join('')}
      </div>
    </div>
  `).join('');

  mainContent.innerHTML = `
    <div class="quiz-container">
      <div class="quiz-header">
        <h2>${courseData[courseId].title} - Final Assessment</h2>
        <p>Pass score: 5/10. Good luck!</p>
      </div>
      <form id="quizForm" onsubmit="submitQuiz(event)">
        ${qHtml}
        <button type="submit" id="submitBtn" style="width:100%; margin-top:20px;" disabled>Submit Assessment (0/10 Answered)</button>
      </form>
    </div>
    <div style="text-align:center; margin-top:20px;">
       <button class="btn-back" onclick="loadPage('courses')" style="width:auto;">Cancel & Exit</button>
    </div>
  `;
  navLinks.forEach(link => link.classList.remove("active"));
}

function checkAssignmentCompletion() {
  const form = document.getElementById("quizForm");
  const formData = new FormData(form);
  let answeredCount = 0;
  
  // Count keys starting with 'q'
  for(let pair of formData.entries()) {
    if(pair[0].startsWith('q')) answeredCount++;
  }

  const submitBtn = document.getElementById("submitBtn");
  if (answeredCount === 10) {
    submitBtn.disabled = false;
    submitBtn.textContent = "Submit Assessment";
    submitBtn.style.cursor = "pointer";
    submitBtn.style.background = "var(--secondary)";
  } else {
    submitBtn.disabled = true;
    submitBtn.textContent = `Submit Assessment (${answeredCount}/10 Answered)`;
    submitBtn.style.cursor = "not-allowed";
    submitBtn.style.background = "#ccc";
  }
}

function submitQuiz(e) {
  e.preventDefault();
  const questions = quizData[currentCourseId];
  let score = 0;
  const form = document.getElementById("quizForm");
  const formData = new FormData(form);

  questions.forEach((q, idx) => {
    const selected = formData.get(`q${idx}`);
    if (selected && parseInt(selected) === q.a) {
      score++;
    }
  });

  const passed = score >= 5;
  localStorage.setItem(`assignment_score_${currentCourseId}`, score);
  
  if (passed) {
    localStorage.setItem(`certificate_earned_${currentCourseId}`, "true");
    mainContent.innerHTML = `
      <div class="quiz-container quiz-result">
        <h2>Congratulations!</h2>
        <p>You passed the assessment.</p>
        <div class="score-display">You scored ${score} / 10</div>
        <p>Your certificate has been unlocked.</p>
        <button onclick="generateCertificate('${currentCourseId}')">Download Certificate</button>
        <br><br>
        <button class="btn-back" onclick="loadPage('certificates')">Go to Certificates</button>
      </div>
    `;
  } else {
    mainContent.innerHTML = `
      <div class="quiz-container quiz-result">
        <h2>Assessment Failed</h2>
        <p>You need at least 5 correct answers to pass.</p>
        <div class="score-display" style="color:red">You scored ${score} / 10</div>
        <button onclick="loadAssignment('${currentCourseId}')">Retry Assignment</button>
        <br><br>
        <button class="btn-back" onclick="loadPage('courses')">Back to Courses</button>
      </div>
    `;
  }
}

// ===== CERTIFICATE GENERATION =====
function generateCertificate(courseId) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation: 'landscape' });
  
  const courseName = courseData[courseId].title;
  const studentName = "Student Name"; // In real app, get from auth profile
  const date = new Date().toLocaleDateString();

  // Border
  doc.setLineWidth(3);
  doc.setDrawColor(27, 154, 170); // Primary color
  doc.rect(10, 10, 277, 190);
  
  // Header
  doc.setFont("helvetica", "bold");
  doc.setFontSize(40);
  doc.setTextColor(27, 154, 170);
  doc.text("CERTIFICATE OF COMPLETION", 148.5, 50, { align: "center" });
  
  // Body
  doc.setFont("helvetica", "normal");
  doc.setFontSize(20);
  doc.setTextColor(60, 60, 60);
  doc.text("This is to certify that", 148.5, 80, { align: "center" });
  
  doc.setFontSize(30);
  doc.setFont("helvetica", "bold");
  doc.text(studentName, 148.5, 100, { align: "center" });
  
  doc.setFontSize(20);
  doc.setFont("helvetica", "normal");
  doc.text("has successfully completed the course", 148.5, 120, { align: "center" });
  
  doc.setFontSize(25);
  doc.setFont("helvetica", "bold");
  doc.text(courseName, 148.5, 140, { align: "center" });
  
  // Footer
  doc.setFontSize(15);
  doc.setFont("helvetica", "normal");
  doc.text(`Date: ${date}`, 50, 170);
  doc.text("Civora Nexus | EduVillage", 247, 170, { align: "right" });
  
  doc.save(`Certificate-${courseName.replace(/\s+/g, '-')}.pdf`);
}

// ===== PAGE CONTENT =====
const pages = {
  dashboard: `
    <section class="stats">
      <div class="card">
        <h3>Enrolled Courses</h3>
        <p>2</p>
      </div>
      <div class="card">
        <h3>Completed</h3>
        <p>0</p>
      </div>
      <div class="card">
        <h3>Certificates</h3>
        <p>0</p>
      </div>
    </section>

    <section class="courses">
      <h2>Active Courses</h2>

      <div class="course-card">
        <h3>Web Development Basics</h3>
        <p>HTML, CSS, JavaScript fundamentals</p>
        ${getProgressBar(70)}
        ${getCourseButton('web-development-basics')}
      </div>

      <div class="course-card">
        <h3>React Fundamentals</h3>
        <p>Components, Hooks, State</p>
        ${getProgressBar(40)}
        ${getCourseButton('react-fundamentals')}
      </div>
    </section>
  `,

  courses: `
    <h2>My Courses</h2>
    <div class="course-list">
      <div class="course-card">
        <h3>Web Development Basics</h3>
        <p>HTML, CSS, JavaScript fundamentals.</p>
        ${getProgressBar(70)}
        ${getCourseButton('web-development-basics')}
      </div>
      <div class="course-card">
        <h3>React Fundamentals</h3>
        <p>Components, Hooks, State.</p>
        ${getProgressBar(40)}
        ${getCourseButton('react-fundamentals')}
      </div>
    </div>
  `,

  certificates: `
    <h2>My Certificates</h2>
    <div id="certList" class="list-container">
      <p>Complete courses and pass assignments to earn certificates.</p>
      <!-- Populated by script -->
    </div>
  `,

  assignments: `
    <h2>Assignments</h2>
    <p>Assignments become available after completing all video lessons.</p>
    <div class="list-container">
       <div class="list-item">
        <div class="item-details">
          <h3>Web Development Final</h3>
          <p>10 Questions • Pass Mark: 5</p>
        </div>
        <div class="item-actions">
           ${getCourseButton('web-development-basics').includes('Take Assignment') ? 
             `<button onclick="loadAssignment('web-development-basics')">Start Now</button>` : 
             `<span class="status pending">Locked</span>`}
        </div>
      </div>
      <div class="list-item">
        <div class="item-details">
          <h3>React Fundamentals Final</h3>
          <p>10 Questions • Pass Mark: 5</p>
        </div>
        <div class="item-actions">
           ${getCourseButton('react-fundamentals').includes('Take Assignment') ? 
             `<button onclick="loadAssignment('react-fundamentals')">Start Now</button>` : 
             `<span class="status pending">Locked</span>`}
        </div>
      </div>
    </div>
  `,
  
  quizzes: `<h2>Quizzes</h2><p>Practice quizzes (non-graded) coming soon.</p>`,
  messages: `<h2>Messages</h2><p>No new messages.</p>`,
  settings: `<h2>Settings</h2><p>Settings panel.</p>`
};

// ===== LOAD PAGE MODIFICATION =====
// Overwrite helper to inject certificates list dynamically
const originalLoadPage = loadPage; // preserve ref if needed, but we redefine
function loadPage(page) {
  if (pages[page]) {
      mainContent.innerHTML = pages[page];
      
      navLinks.forEach(link => {
          link.classList.remove("active");
          if (link.getAttribute("data-page") === page) {
              link.classList.add("active");
          }
      });
      
      // Dynamic content for Certificates page
      if (page === 'certificates') {
        const list = document.getElementById('certList');
        let html = '';
        let count = 0;
        
        ['web-development-basics', 'react-fundamentals'].forEach(id => {
           if (localStorage.getItem(`certificate_earned_${id}`)) {
             count++;
             const title = courseData[id].title;
             html += `
               <div class="certificate-card">
                 <div class="cert-info">
                   <h3>${title}</h3>
                   <p>Issued: ${new Date().toLocaleDateString()}</p>
                 </div>
                 <button class="btn-download" onclick="generateCertificate('${id}')">Download PDF</button>
               </div>
             `;
           }
        });
        
        if (count > 0) list.innerHTML = html;
        else list.innerHTML = '<p>No certificates earned yet. Complete a course to unlock!</p>';
      }
  }
}
