// Mobile nav toggle
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.main-nav');
  if (!toggle || !nav) return;
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  });
});

// "find us" address: tap to choose Apple Maps or Google Maps
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.map-choice').forEach((box) => {
    const toggle = box.querySelector('.map-toggle');
    const options = box.querySelector('.map-options');
    if (!toggle || !options) return;
    box.classList.add('js');
    options.hidden = true;
    const setOpen = (open) => {
      options.hidden = !open;
      toggle.setAttribute('aria-expanded', String(open));
    };
    toggle.addEventListener('click', () => {
      setOpen(options.hidden);
      if (!options.hidden) options.querySelector('a').focus();
    });
    options.addEventListener('click', (e) => { if (e.target.closest('a')) setOpen(false); });
    document.addEventListener('click', (e) => { if (!box.contains(e.target)) setOpen(false); });
    box.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !options.hidden) { setOpen(false); toggle.focus(); }
    });
  });
});
