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

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

document.querySelector('#year').textContent = new Date().getFullYear();

const form = document.querySelector('#consultation-form');
const status = document.querySelector('#form-status');

form?.addEventListener('submit', (event) => {
  event.preventDefault();

  if (!form.reportValidity()) return;

  const data = new FormData(form);
  const name = data.get('parent_name');
  const email = data.get('email');
  const grade = data.get('grade');
  const format = data.get('format');
  const course = data.get('course') || 'Not specified';
  const message = data.get('message');

  const subject = encodeURIComponent(`Tutoring consultation request — ${name}`);
  const body = encodeURIComponent(
`Hi Tyler,

I'd like to request a tutoring consultation.

Parent / guardian: ${name}
Email: ${email}
Student grade: ${grade}
Preferred format: ${format}
Current math course: ${course}

What's going on:
${message}

Thanks!`
  );

  status.textContent = 'Opening your email app…';
  window.location.href = `mailto:tyler@mathbytyler.com?subject=${subject}&body=${body}`;
});
