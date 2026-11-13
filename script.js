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


const consultationForm = document.querySelector('#consultation-form');
const consultationSubmit = document.querySelector('#consultation-submit');
const inlineFormStatus = document.querySelector('#form-inline-status');
const submissionDialog = document.querySelector('#submission-dialog');
const submissionClose = document.querySelector('#submission-close');

function openSubmissionDialog() {
  if (!submissionDialog) return;
  if (typeof submissionDialog.showModal === 'function') {
    submissionDialog.showModal();
  } else {
    submissionDialog.setAttribute('open', '');
  }
}

function closeSubmissionDialog() {
  if (!submissionDialog) return;
  if (typeof submissionDialog.close === 'function') {
    submissionDialog.close();
  } else {
    submissionDialog.removeAttribute('open');
  }
}

submissionClose?.addEventListener('click', closeSubmissionDialog);

submissionDialog?.addEventListener('click', event => {
  if (event.target === submissionDialog) closeSubmissionDialog();
});

consultationForm?.addEventListener('submit', async event => {
  event.preventDefault();

  if (!consultationForm.reportValidity()) return;

  const originalButtonText = consultationSubmit?.textContent || 'Request a consultation';
  if (consultationSubmit) {
    consultationSubmit.disabled = true;
    consultationSubmit.textContent = 'Sending…';
  }
  if (inlineFormStatus) {
    inlineFormStatus.textContent = '';
    inlineFormStatus.classList.remove('is-error');
  }

  try {
    const response = await fetch(consultationForm.action, {
      method: 'POST',
      body: new FormData(consultationForm),
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      let message = 'I couldn’t send that form just now. Please check the fields and try again.';
      try {
        const data = await response.json();
        if (Array.isArray(data?.errors) && data.errors.length) {
          message = data.errors.map(error => error.message).filter(Boolean).join(' ');
        }
      } catch (_) {}
      throw new Error(message);
    }

    consultationForm.reset();
    selectedStudentType = '';
    studentTypeCards.forEach(card => {
      card.classList.remove('active', 'is-selected');
      card.setAttribute('aria-pressed', 'false');
    });

    openSubmissionDialog();
  } catch (error) {
    if (inlineFormStatus) {
      inlineFormStatus.textContent = error?.message || 'Something went wrong. Please try again.';
      inlineFormStatus.classList.add('is-error');
    }
  } finally {
    if (consultationSubmit) {
      consultationSubmit.disabled = false;
      consultationSubmit.textContent = originalButtonText;
    }
  }
});
