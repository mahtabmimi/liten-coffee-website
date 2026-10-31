// Mobile nav toggle
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.main-nav');
  if (!toggle || !nav) return;
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.textContent = open ? 'Close' : 'Menu';
  });
});

// "find us" address: Apple Maps on iPhone, iPad and Mac; Google Maps everywhere else
document.addEventListener('DOMContentLoaded', () => {
  const isApple = /iPhone|iPad|iPod|Macintosh/.test(navigator.userAgent);
  if (!isApple) return;
  document.querySelectorAll('.map-link[data-apple-maps]').forEach((link) => {
    link.href = link.dataset.appleMaps;
  });
});
