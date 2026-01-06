// Make sections collapsible
const sections = document.querySelectorAll('section');

sections.forEach(section => {
  const heading = section.querySelector('h3');
  heading.style.cursor = 'pointer';

  heading.addEventListener('click', () => {
    const list = section.querySelector('ul');
    const para = section.querySelector('p');

    // Toggle display
    if (list.style.display === 'none') {
      list.style.display = 'block';
      para.style.display = 'block';
    } else {
      list.style.display = 'none';
      para.style.display = 'none';
    }
  });
});
