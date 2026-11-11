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

// Collapsible sections (Menus categories, What's On past events):
// one open per group, opening and closing smoothly like a door easing shut.
document.addEventListener('DOMContentLoaded', () => {
  const reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  const DUR = reduce ? 0 : 360, EASE = 'cubic-bezier(.25, .8, .25, 1)';
  const all = [...document.querySelectorAll('details.past-event')];
  all.forEach((d) => { d.dataset.group = d.getAttribute('name') || 'past'; d.removeAttribute('name'); });
  const body = (d) => d.querySelector('.menu-body, .past-body');
  function run(d, from, to, done) {
    const b = body(d);
    if (d._anim) d._anim.cancel();
    if (!b || !DUR || !b.animate) { if (done) done(); return; }
    // animate the padding too, otherwise it pops at the end (the "bump")
    const cs = getComputedStyle(b);
    const shut = { height: '0px', paddingTop: '0px', paddingBottom: '0px', opacity: 0 };
    const full = { height: (from || to) + 'px', paddingTop: cs.paddingTop, paddingBottom: cs.paddingBottom, opacity: 1 };
    b.style.overflow = 'hidden';
    b.style.willChange = 'height';
    d._anim = b.animate(from ? [full, shut] : [shut, full], { duration: DUR, easing: EASE });
    d._anim.onfinish = () => { b.style.overflow = ''; b.style.willChange = ''; d._anim = null; if (done) done(); };
  }
  function close(d) {
    if (!d.open || d._closing) return;
    d._closing = true;
    run(d, body(d).offsetHeight, 0, () => { d.open = false; d._closing = false; });
  }
  function open(d) {
    d._closing = false;
    d.open = true;
    run(d, 0, body(d).offsetHeight);
  }
  all.forEach((d) => {
    d.querySelector('summary').addEventListener('click', (e) => {
      e.preventDefault();
      if (d.open && !d._closing) { close(d); return; }
      all.forEach((o) => { if (o !== d && o.dataset.group === d.dataset.group) close(o); });
      open(d);
    });
  });
});
