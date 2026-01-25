// ===== ELEMENTS =====
const mainContent = document.getElementById("mainContent");
const navLinks = document.querySelectorAll(".sidebar nav a");
const menuBtn = document.getElementById("menuBtn");
const sidebar = document.querySelector(".sidebar");
const logoutEl = document.getElementById("logoutBtn");

// ===== MOBILE MENU =====
menuBtn?.addEventListener("click", () => sidebar.classList.toggle("show"));
navLinks.forEach(link => link.addEventListener("click", () => { if(window.innerWidth<=768) sidebar.classList.remove("show"); }));

// ===== LOGOUT =====
logoutEl?.addEventListener("click", e => {
  e.preventDefault();
  if(confirm("Are you sure you want to log out?")){
    localStorage.removeItem("isLoggedIn");
    window.location.href = "login.html";
  }
});

// ===== AUTH CHECK =====
if(!localStorage.getItem("isLoggedIn")) window.location.href = "login.html";

// ===== COURSE & QUIZ DATA =====
const courses = {
  'web-development-basics': {
    title:'Web Development Basics',
    modules:[
      {title:'HTML Intro', videoUrl:'https://www.youtube.com/embed/qz0aGYrrlhU', notes:'HTML basics'},
      {title:'CSS Basics', videoUrl:'https://www.youtube.com/embed/1Rs2ND1ryYc', notes:'CSS basics'},
      {title:'JS Essentials', videoUrl:'https://www.youtube.com/embed/W6NZfCO5SIk', notes:'JS basics'},
      {title:'DOM Manipulation', videoUrl:'https://www.youtube.com/embed/0ik6X4DJKCc', notes:'DOM manipulation basics'},
      {title:'Events in JS', videoUrl:'https://www.youtube.com/embed/F6k8lXgVh0c', notes:'Handling events'}
    ]
  },
  'react-fundamentals': {
    title:'React Fundamentals',
    modules:[
      {title:'Components', videoUrl:'https://www.youtube.com/embed/Y2hgEGPzTZY', notes:'Reusable components'},
      {title:'State & Props', videoUrl:'https://www.youtube.com/embed/4ORZ1GmjaMc', notes:'State and props explained'},
      {title:'Hooks', videoUrl:'https://www.youtube.com/embed/dpw9EHDh2bM', notes:'Using useState and useEffect'}
    ]
  }
};

const quizzes = {
  'web-development-basics': [
    {q:"HTML stands for?", options:["Hyper Text Markup Language","Home Tool Markup","Hyperlinks & Text","None"], a:0},
    {q:"Who makes Web standards?", options:["Google","W3C","Microsoft","Mozilla"], a:1},
    {q:"Largest HTML heading?", options:["<h6>","<head>","<heading>","<h1>"], a:3},
    {q:"Line break tag?", options:["<lb>","<br>","<break>","<b>"], a:1},
    {q:"End tag symbol?", options:["^","<","/","*"], a:2},
    {q:"CSS stands for?", options:["Creative","Cascading","Computer","Colorful"], a:1},
    {q:"Inline style attribute?", options:["font","style","class","styles"], a:1},
    {q:"Correct CSS syntax?", options:["body {color:black;}","{body;color:black;}","body:color=black;","{body:color=black;}"], a:0},
    {q:"JS tag in HTML?", options:["<scripting>","<js>","<script>","<javascript>"], a:2},
    {q:"JS placement?", options:["head","body","both","none"], a:2}
  ]
};

// ===== HELPER FUNCTIONS =====
function getProgressBar(percent){ return `<div class="progress-bar"><div class="progress" style="width:${percent}%">${percent}%</div></div>`; }
function getCourseButton(courseId){
  const isCertified = localStorage.getItem(`certificate_earned_${courseId}`);
  if(isCertified) return `<button onclick="loadPage('certificates')">View Certificate</button>`;

  const videoDone = localStorage.getItem(`course_video_done_${courseId}`);
  if(videoDone) return `<button onclick="loadAssignment('${courseId}')">Take Assignment</button>`;

  const saved = localStorage.getItem(`course_progress_${courseId}`);
  return `<button onclick="loadCourse('${courseId}')">${saved? "Resume Course":"Start Course"}</button>`;
}

// ===== LOAD PAGES =====
const pages = {
  dashboard: () => {
    let html = `<h2>Welcome to EduVillage Dashboard</h2><section class="courses">`;
    Object.keys(courses).forEach(id=>{
      const progress = localStorage.getItem(`course_progress_${id}`) || 0;
      html+=`
        <div class="course-card">
          <h3>${courses[id].title}</h3>
          ${getProgressBar(Math.round(progress/courses[id].modules.length*100))}
          ${getCourseButton(id)}
        </div>
      `;
    });
    html+='</section>'; mainContent.innerHTML = html;
  },
  courses: () => { pages.dashboard(); },
  assignments: () => {
    let html = `<h2>Assignments</h2>`;
    Object.keys(courses).forEach(id=>{
      const done = localStorage.getItem(`course_video_done_${id}`);
      html+=`
        <div class="course-card">
          <h3>${courses[id].title}</h3>
          ${done? `<button onclick="loadAssignment('${id}')">Start Assignment</button>`: `<span style="color:red;">Complete all videos first</span>`}
        </div>
      `;
    });
    mainContent.innerHTML = html;
  },
  certificates: () => {
    let html = `<h2>Certificates</h2>`;
    let count=0;
    Object.keys(courses).forEach(id=>{
      if(localStorage.getItem(`certificate_earned_${id}`)){
        count++;
        html+=`<div class="course-card"><h3>${courses[id].title}</h3>
          <button onclick="generateCertificate('${id}')">Download Certificate</button>
        </div>`;
      }
    });
    if(count===0) html+='<p>No certificates earned yet</p>';
    mainContent.innerHTML = html;
  },
  settings: () => mainContent.innerHTML='<h2>Settings</h2>'
};

function loadPage(page){
  pages[page]?.();
  navLinks.forEach(l=>{l.classList.remove("active"); if(l.dataset.page===page) l.classList.add("active");});
}

// ===== COURSE PLAYER =====
let currentCourseId=null;
let currentLesson=0;

function loadCourse(courseId){
  currentCourseId=courseId;
  currentLesson=parseInt(localStorage.getItem(`course_progress_${courseId}`) || 0);
  renderCourse();
}

function renderCourse(){
  const course=courses[currentCourseId];
  const lesson=course.modules[currentLesson];
  const isLast=currentLesson===course.modules.length-1;

  let moduleList='';
  course.modules.forEach((m,i)=> moduleList+=`<li class="${i===currentLesson?'active':''}" onclick="changeLesson(${i})">${i<currentLesson?'✔':(i===currentLesson?'▶':'○')} ${m.title}</li>`);

  mainContent.innerHTML=`
    <div class="course-player">
      <div class="sidebar-player">
        <h3>${course.title}</h3>
        <ul>${moduleList}</ul>
        <button onclick="loadPage('courses')">← Back</button>
      </div>
      <div class="content-player">
        <iframe src="${lesson.videoUrl}" frameborder="0" allowfullscreen style="width:100%; height:300px;"></iframe>
        <h4>${lesson.title}</h4>
        <p>${lesson.notes}</p>
        <button onclick="prevLesson()" ${currentLesson===0?'disabled':''}>Previous</button>
        <button onclick="nextLesson()">${isLast?'Finish & Take Assignment':'Next'}</button>
      </div>
    </div>
  `;
}

function changeLesson(i){
  currentLesson=i;
  localStorage.setItem(`course_progress_${currentCourseId}`,i);
  renderCourse();
}

function nextLesson(){
  const course=courses[currentCourseId];
  if(currentLesson<course.modules.length-1) changeLesson(currentLesson+1);
  else{
    localStorage.setItem(`course_video_done_${currentCourseId}`,'true');
    alert("All videos completed! Go to Assignment.");
    loadAssignment(currentCourseId);
  }
}

function prevLesson(){ if(currentLesson>0) changeLesson(currentLesson-1); }

// ===== ASSIGNMENT =====
function loadAssignment(courseId){
  currentCourseId=courseId;
  const q=quizzes[courseId];
  if(!q){ alert("No assignment yet"); return; }
  let qhtml='';
  q.forEach((ques,i)=>{
    qhtml+=`<div class="question-box">
      <p>${i+1}. ${ques.q}</p>
      ${ques.options.map((opt,j)=>`<label><input type="radio" name="q${i}" value="${j}" onchange="checkSubmit()"> ${opt}</label>`).join('')}
    </div>`;
  });
  mainContent.innerHTML=`
    <h2>${courses[courseId].title} - Assignment</h2>
    <form id="quizForm" onsubmit="submitQuiz(event)">
      ${qhtml}
      <button type="submit" id="submitBtn" disabled>Submit Assignment</button>
    </form>
  `;
}

function checkSubmit(){
  const form=document.getElementById('quizForm');
  const answered=[...new FormData(form).keys()].filter(k=>k.startsWith('q')).length;
  const btn=document.getElementById('submitBtn');
  btn.disabled=answered<quizzes[currentCourseId].length;
}

// ===== SUBMIT QUIZ =====
function submitQuiz(e){
  e.preventDefault();
  const form=new FormData(document.getElementById('quizForm'));
  let score=0;
  quizzes[currentCourseId].forEach((q,i)=>{
    if(parseInt(form.get(`q${i}`))===q.a) score++;
  });
  localStorage.setItem(`assignment_score_${currentCourseId}`,score);
  if(score>=5){
    localStorage.setItem(`certificate_earned_${currentCourseId}`,'true');
    mainContent.innerHTML=`<h2>Passed! Score: ${score}/${quizzes[currentCourseId].length}</h2>
      <button onclick="generateCertificate('${currentCourseId}')">Download Certificate</button>
      <button onclick="loadPage('dashboard')">Back to Dashboard</button>`;
  } else {
    alert(`Failed. You scored ${score}. Retry assignment.`);
  }
}

// ===== CERTIFICATE =====
function generateCertificate(courseId){
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({orientation:'landscape'});
  const date=new Date().toLocaleDateString();
  const courseTitle=courses[courseId].title;
  const studentName="Student Name"; // replace dynamically if needed

  doc.setFillColor(224,247,250); doc.rect(0,0,297,210,'F'); // background
  doc.setLineWidth(4); doc.setDrawColor(27,154,170); doc.rect(10,10,277,190); // border

  // Logo
  const logo=new Image();
  logo.src='CivoraNexus_Logo.png';
  logo.onload=function(){
    doc.addImage(logo,'PNG',20,15,50,30);
    doc.setFont('helvetica','bold'); doc.setFontSize(40); doc.setTextColor(27,154,170);
    doc.text("CERTIFICATE OF COMPLETION",148.5,60,{align:'center'});
    doc.setFontSize(30); doc.setTextColor(0,0,0);
    doc.text(studentName,148.5,100,{align:'center'});
    doc.setFontSize(25); doc.setTextColor(20,151,163);
    doc.text(courseTitle,148.5,140,{align:'center'});
    doc.setFontSize(15); doc.setTextColor(60,60,60);
    doc.text(`Date: ${date}`,50,180); doc.text("Civora Nexus | EduVillage",247,180,{align:'right'});
    doc.save(`Certificate-${courseTitle.replace(/\s+/g,'-')}.pdf`);
  };
}

// ===== DEFAULT LOAD =====
window.addEventListener('DOMContentLoaded',()=>loadPage('dashboard'));
