// ================================
// Smooth scroll for Get Started
// ================================
function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (section) {
    section.scrollIntoView({
      behavior: "smooth"
    });
  }
}

// ================================
// Role-based Login Navigation
// ================================
function goToLogin(role) {
  window.location.href = "login.html?role=" + role;
}

// ================================
// Make sections collapsible
// ================================
const sections = document.querySelectorAll('section');

sections.forEach(section => {
  const heading = section.querySelector('h3');

  // Safety check (prevents JS error)
  if (!heading) return;

  heading.style.cursor = 'pointer';

  heading.addEventListener('click', () => {
    const list = section.querySelector('ul');
    const para = section.querySelector('p');

    // Toggle display safely
    if (list && para) {
      const isHidden = list.style.display === 'none';

      list.style.display = isHidden ? 'block' : 'none';
      para.style.display = isHidden ? 'block' : 'none';
    }
  });
});

