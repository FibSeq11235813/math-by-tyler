const header = document.querySelector('.site-header');
const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-nav');

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 8);
});

menuButton?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
});

document.querySelectorAll('.site-nav a').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuButton?.setAttribute('aria-expanded', 'false');
    menuButton?.setAttribute('aria-label', 'Open menu');
  });
});

document.querySelector('#year').textContent = new Date().getFullYear();


const studentTypeCards = Array.from(document.querySelectorAll('.fit-row[data-student-type]'));
const studentTypeSelect = document.querySelector('#student-type');
let selectedStudentType = studentTypeSelect?.value || '';

function highlightStudentType(value, { selected = false } = {}) {
  studentTypeCards.forEach(card => {
    const isMatch = card.dataset.studentType === value;
    card.classList.toggle('active', isMatch);
    if (selected) {
      card.classList.toggle('is-selected', isMatch);
      card.setAttribute('aria-pressed', String(isMatch));
    }
  });
}

function chooseStudentType(card) {
  const value = card.dataset.studentType;
  selectedStudentType = value;
  if (studentTypeSelect) studentTypeSelect.value = value;
  highlightStudentType(value, { selected: true });
}

studentTypeCards.forEach(card => {
  card.addEventListener('mouseenter', () => {
    highlightStudentType(card.dataset.studentType);
    // Preserve the clicked selection marker while previewing another card.
    studentTypeCards.forEach(item => {
      item.classList.toggle('is-selected', item.dataset.studentType === selectedStudentType && !!selectedStudentType);
      item.setAttribute('aria-pressed', String(item.dataset.studentType === selectedStudentType && !!selectedStudentType));
    });
  });

  card.addEventListener('focus', () => {
    highlightStudentType(card.dataset.studentType);
    studentTypeCards.forEach(item => {
      item.classList.toggle('is-selected', item.dataset.studentType === selectedStudentType && !!selectedStudentType);
      item.setAttribute('aria-pressed', String(item.dataset.studentType === selectedStudentType && !!selectedStudentType));
    });
  });

  card.addEventListener('click', () => chooseStudentType(card));

  card.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      chooseStudentType(card);
    }
  });
});

studentTypeSelect?.addEventListener('change', () => {
  selectedStudentType = studentTypeSelect.value;
  if (selectedStudentType) {
    highlightStudentType(selectedStudentType, { selected: true });
  } else {
    studentTypeCards.forEach(card => {
      card.classList.remove('active', 'is-selected');
      card.setAttribute('aria-pressed', 'false');
    });
  }
});

// If a selection exists, restore it when the pointer leaves the section.
// Otherwise, leave the most recently hovered card highlighted as a visual preview.
document.querySelector('.fit-stack')?.addEventListener('mouseleave', () => {
  if (selectedStudentType) highlightStudentType(selectedStudentType, { selected: true });
});
