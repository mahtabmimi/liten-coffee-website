/* Preview-only text editor for the Liten site.
   Adds an "Edit text" button. Edits are saved to the preview's database so
   Claude can read them back and apply them to the real site.
   This file is NOT part of the live site. */
(function () {
  if (window.name === 'lpe-phone') return; // running inside the phone preview frame
  const PAGE = (location.pathname.split('/').pop() || 'index.html').replace(/^$/, 'index.html');
  const SELECTOR = [
    'main h1', 'main h2', 'main h3', 'main p', 'main li:not(.mi)', 'main .mi-name', 'main .mi-price', 'main dt', 'main dd',
    'main summary > span', 'main .pill',
    '.site-footer p', '.site-footer h2', '.site-footer .map-toggle span:not(.sr-only)'
  ].join(',');

  let editing = false;
  let db = null;
  let saved = {};          // key -> {original, text}
  const timers = {};

  // ---- styles ----
  const css = document.createElement('style');
  css.textContent = `
    body{padding-bottom:48px}
    .lpe-bar{position:fixed;z-index:9999;right:calc(16px + env(safe-area-inset-right,0px));bottom:calc(16px + env(safe-area-inset-bottom,0px));
      display:flex;flex-wrap:wrap;align-items:center;gap:8px;max-width:calc(100vw - 32px);padding:10px 12px;background:#fff;
      border:3px solid #C7E2FF;border-radius:20px;box-shadow:0 6px 24px rgba(2,55,105,.15);font-family:'Inter Display',Helvetica,Arial,sans-serif;font-size:14px;color:#023769}
    .lpe-bar button{font:inherit;cursor:pointer;border-radius:999px;padding:7px 14px;border:2px solid #C7E2FF;background:#fff;color:#01529E}
    .lpe-bar button.on{background:#023769;border-color:#023769;color:#fff}
    .lpe-bar button:focus-visible{outline:2px solid #023769;outline-offset:2px}
    .lpe-status{color:#616161;font-size:13px;min-width:0}
    body.lpe-editing [data-lpe]{outline:1px dashed rgba(1,82,158,.35);outline-offset:3px;cursor:text}
    body.lpe-editing [data-lpe]:hover{outline-color:#01529E}
    body.lpe-editing [data-lpe]:focus{outline:2px solid #01529E;background:rgba(199,226,255,.25)}
    [data-lpe].lpe-changed{background:rgba(199,226,255,.45);border-radius:3px}
    .lpe-panel{position:fixed;z-index:9999;right:calc(16px + env(safe-area-inset-right,0px));bottom:calc(84px + env(safe-area-inset-bottom,0px));
      width:min(420px,calc(100vw - 32px));max-height:50vh;overflow:auto;padding:14px 16px;background:#fff;border:3px solid #C7E2FF;border-radius:16px;
      font-family:'Inter Display',Helvetica,Arial,sans-serif;font-size:13px;color:#023769}
    .lpe-panel h4{margin:0 0 8px;font-size:15px}
    .lpe-phone-wrap{position:fixed;inset:0;z-index:9998;background:rgba(2,55,105,.35);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px}
    .lpe-device{box-sizing:content-box;width:390px;height:844px;flex:none;border:12px solid #023769;border-radius:44px;overflow:hidden;background:#fff;box-shadow:0 20px 60px rgba(2,55,105,.35);transform-origin:center center}
    .lpe-device iframe{width:100%;height:100%;border:0;display:block}
    .lpe-phone-close{font:14px 'Inter Display',Helvetica,Arial,sans-serif;cursor:pointer;border-radius:999px;padding:8px 16px;border:3px solid #C7E2FF;background:#fff;color:#01529E}
    .lpe-panel ol{margin:0;padding-left:18px;display:grid;gap:8px}
    .lpe-panel del{color:#8A8A8A}
  `;
  document.head.appendChild(css);

  // ---- mark editable elements with a stable key per page ----
  const els = [...document.querySelectorAll(SELECTOR)].filter(el => el.textContent.trim() && !el.classList.contains('sr-only') && !el.closest('.lpe-bar'));
  els.forEach((el, i) => {
    const area = el.closest('.site-footer') ? 'footer' : PAGE.replace('.html', '');
    el.dataset.lpe = area + '-' + i;
    el.dataset.lpeOriginal = el.innerText || el.textContent.trim(); // closed past events have no innerText
  });
  // footer keys must match across pages, so renumber footer items from 0
  let f = 0;
  els.filter(el => el.closest('.site-footer')).forEach(el => { el.dataset.lpe = 'footer-' + (f++); });

  // ---- toolbar ----
  const bar = document.createElement('div');
  bar.className = 'lpe-bar';
  bar.innerHTML = '<button type="button" id="lpe-toggle" aria-pressed="false">Edit text</button>' +
                  '<button type="button" id="lpe-list">Changes (0)</button>' +
                  '<button type="button" id="lpe-phone">Phone view</button>' +
                  '<span class="lpe-status" id="lpe-status" aria-live="polite">Preview only</span>';
  document.body.appendChild(bar);
  const $ = id => document.getElementById(id);

  function status(t) { $('lpe-status').textContent = t; }
  function count() { const n = Object.values(saved).filter(s => s.text !== s.original).length; $('lpe-list').textContent = 'Changes (' + n + ')'; }

  function setEditing(on) {
    editing = on;
    document.body.classList.toggle('lpe-editing', on);
    els.forEach(el => { if (on) el.setAttribute('contenteditable', 'plaintext-only'); else el.removeAttribute('contenteditable'); });
    if (on && els[0] && els[0].contentEditable !== 'plaintext-only') els.forEach(el => el.setAttribute('contenteditable', 'true'));
    $('lpe-toggle').classList.toggle('on', on);
    $('lpe-toggle').setAttribute('aria-pressed', String(on));
    $('lpe-toggle').textContent = on ? 'Done editing' : 'Edit text';
    status(on ? 'Click any text to change it' : (db ? 'Changes are saved' : 'Preview only'));
  }
  $('lpe-toggle').addEventListener('click', () => setEditing(!editing));

  // links and buttons don't fire while editing
  document.addEventListener('click', e => {
    if (!editing) return;
    const a = e.target.closest('a, button, summary');
    if (!a || a.closest('.lpe-bar') || a.closest('.lpe-panel')) return;
    if (a.tagName === 'SUMMARY' && !e.target.closest('[data-lpe]')) return; // the +/− still opens past events
    e.preventDefault();
  }, true);

  // ---- saving ----
  function key(el) { return PAGE.replace('.html', '') + '__' + el.dataset.lpe; }
  function docId(el) { return el.dataset.lpe.startsWith('footer-') ? 'all__' + el.dataset.lpe : key(el); }

  function save(el) {
    const id = docId(el);
    const text = el.innerText.replace(/ /g, ' ');
    const original = el.dataset.lpeOriginal;
    saved[id] = { original, text };
    el.classList.toggle('lpe-changed', text !== original);
    count();
    if (!db) { try { localStorage.setItem('lpe:' + id, JSON.stringify(saved[id])); } catch (e) {} status('Saved in this browser only'); return; }
    status('Saving…');
    db.collection('edits').doc(id).set({
      page: el.dataset.lpe.startsWith('footer-') ? 'all pages (footer)' : PAGE,
      element: el.dataset.lpe, original, text, updatedAt: new Date().toISOString()
    }).then(() => status('Saved'), () => status('Not saved. Check your connection'));
  }
  els.forEach(el => {
    el.addEventListener('input', () => { clearTimeout(timers[el.dataset.lpe]); timers[el.dataset.lpe] = setTimeout(() => save(el), 600); });
    el.addEventListener('blur', () => { if (editing) { clearTimeout(timers[el.dataset.lpe]); save(el); } });
    el.addEventListener('keydown', e => { if (e.key === 'Escape') el.blur(); });
  });

  function apply(id, d) {
    saved[id] = { original: d.original, text: d.text };
    const el = els.find(x => docId(x) === id);
    if (el && document.activeElement !== el && el.innerText !== d.text) el.innerText = d.text;
    if (el) el.classList.toggle('lpe-changed', d.text !== d.original);
  }

  // ---- phone preview: the current page in a 390 x 844 frame ----
  let phone = null;
  $('lpe-phone').addEventListener('click', () => {
    if (phone) { phone.remove(); phone = null; $('lpe-phone').textContent = 'Phone view'; return; }
    phone = document.createElement('div');
    phone.className = 'lpe-phone-wrap';
    phone.innerHTML = '<div class="lpe-device"><iframe name="lpe-phone" title="Phone preview" src="' + location.pathname.split('/').pop() + '"></iframe></div>' +
                      '<button type="button" class="lpe-phone-close">Close phone view</button>';
    document.body.appendChild(phone);
    const fit = () => { const dev = phone && phone.querySelector('.lpe-device'); if (!dev) return;
      const s = Math.min(1, (innerHeight - 120) / 868, (innerWidth - 32) / 414); dev.style.transform = 'scale(' + s + ')'; };
    fit(); addEventListener('resize', fit);
    phone.querySelector('.lpe-phone-close').addEventListener('click', () => $('lpe-phone').click());
    phone.addEventListener('click', e => { if (e.target === phone) $('lpe-phone').click(); });
    $('lpe-phone').textContent = 'Close phone view';
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && phone) $('lpe-phone').click(); });

  // ---- changes panel ----
  let panel = null;
  $('lpe-list').addEventListener('click', () => {
    if (panel) { panel.remove(); panel = null; return; }
    panel = document.createElement('div'); panel.className = 'lpe-panel';
    const items = Object.entries(saved).filter(([, s]) => s.text !== s.original);
    const h = document.createElement('h4'); h.textContent = items.length ? 'Your changes (all pages)' : 'No changes yet';
    panel.appendChild(h);
    if (items.length) {
      const ol = document.createElement('ol');
      items.forEach(([id, s]) => {
        const li = document.createElement('li');
        const del = document.createElement('del'); del.textContent = s.original;
        const ins = document.createElement('div'); ins.textContent = '→ ' + s.text;
        li.append(del, ins); ol.appendChild(li);
      });
      panel.appendChild(ol);
    } else {
      const p = document.createElement('p'); p.textContent = 'Press "Edit text", then click any text on the page.'; panel.appendChild(p);
    }
    document.body.appendChild(panel);
  });

  // ---- connect to the preview's database ----
  try { Object.keys(localStorage).filter(k => k.startsWith('lpe:')).forEach(k => apply(k.slice(4), JSON.parse(localStorage.getItem(k)))); } catch (e) {}
  count();
  (async () => {
    db = window.claude ? await window.claude.use('db') : null;
    if (!db) { status('Saved in this browser only'); return; }
    status('Changes are saved');
    db.collection('edits').onSnapshot(snap => {
      snap.docs.forEach(d => apply(d.id, d.data()));
      count();
    }, () => status('Couldn\'t load saved changes. Refresh to try again'));
  })();
})();
