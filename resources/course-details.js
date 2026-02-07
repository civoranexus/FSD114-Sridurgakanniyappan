const courses = {
  "web-development-basics": {
    title: "Web Development Basics",
    duration: "4 Weeks",
    about: "Learn HTML, CSS, and JavaScript from scratch and build responsive websites.",
    lessons: [
      "Introduction to HTML",
      "CSS Basics & Layouts",
      "JavaScript Fundamentals",
      "Build a Mini Project"
    ]
  },

  "react-fundamentals": {
    title: "React Fundamentals",
    duration: "5 Weeks",
    about: "Understand components, props, state, and build modern UI applications.",
    lessons: [
      "React Introduction",
      "Components & JSX",
      "State and Props",
      "Hooks Basics"
    ]
  },

  "full-stack-dev": {
    title: "Full Stack Development",
    duration: "6 Weeks",
    about: "Become a full stack developer with frontend and backend knowledge.",
    lessons: [
      "Frontend Basics",
      "Backend with Node.js",
      "Databases",
      "Final Project"
    ]
  }
};

const params = new URLSearchParams(window.location.search);
const courseId = params.get("course");

const course = courses[courseId];
const container = document.getElementById("courseDetails");

if (!course) {
  container.innerHTML = "<p>Course not found</p>";
} else {
  container.innerHTML = `
    <div class="course-details">
      <h2>${course.title}</h2>

      <p><strong>Duration:</strong> ${course.duration}</p>

      <p style="margin-top:15px;">${course.about}</p>

      <h3 style="margin-top:25px;">Lessons Included</h3>
      <ul>
        ${course.lessons.map(l => `<li>${l}</li>`).join("")}
      </ul>

      <button style="margin-top:30px;"
        onclick="startCourse('${courseId}')">
        Start Course
      </button>
    </div>
  `;
}

function startCourse(courseId) {
  // save enrollment
  let enrolled = JSON.parse(localStorage.getItem("enrolledCourses")) || [];
  if (!enrolled.includes(courseId)) {
    enrolled.push(courseId);
    localStorage.setItem("enrolledCourses", JSON.stringify(enrolled));
  }

  window.location.href = `course-player.html?course=${courseId}`;
}
