// Mobile nav toggle
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      nav.classList.toggle('open');
      toggle.textContent = nav.classList.contains('open') ? 'Close' : 'Menu';
    });
  }

  loadFooterContent();
});

// Footer content — pulled from content/footer.json (edit that file directly to update hours/contact details)
function loadFooterContent() {
  const el = document.querySelector('[data-footer-mount]');
  if (!el) return;

  fetch('/content/footer.json')
    .then(res => res.json())
    .then(data => {
      const draftTag = data.draft ? '<span class="draft-inline">DRAFT</span> ' : '';
      const hoursHtml = data.hours.map(h =>
        `<p>${h.days} &nbsp;|&nbsp; ${h.time}</p>`
      ).join('');

      el.innerHTML = `
        <div class="footer-col">
          <h4 class="font-title" style="font-size:20px;">LITEN COFFEE</h4>
          <p class="footer-tagline">${data.tagline}</p>
        </div>
        <div class="footer-col">
          <h4>opening hours</h4>
          ${hoursHtml}
        </div>
        <div class="footer-col">
          <h4>contact</h4>
          <p>${draftTag}<a href="${data.instagram_url}">Instagram</a></p>
          <p>${draftTag}${data.phone}</p>
          <p>${draftTag}${data.email}</p>
        </div>
        <div class="footer-col">
          <h4>find us</h4>
          <p>${data.address_line1}</p>
          <p>${data.address_line2}</p>
          <p>${data.address_line3}</p>
        </div>
      `;
    })
    .catch(() => {
      el.innerHTML = '<p class="draft-inline">Footer content failed to load — check content/footer.json</p>';
    });
}

// FAQ page content — pulled from content/faqs.json
function loadFaqContent() {
  const el = document.querySelector('[data-faq-mount]');
  if (!el) return;

  fetch('/content/faqs.json')
    .then(res => res.json())
    .then(items => {
      el.innerHTML = items.map(item => {
        const q = `<p class="font-subheading" style="margin-bottom:4px;">${item.question}</p>`;
        const a = `<p class="font-body" style="margin-top:0;">${item.answer}</p>`;
        const block = q + a;
        return item.draft
          ? `<div class="draft" style="margin-bottom:28px;">${block}</div>`
          : `<div style="margin-bottom:28px;">${block}</div>`;
      }).join('');
    });
}

// What's On page content — pulled from content/whatson.json
function loadWhatsOnContent() {
  const el = document.querySelector('[data-whatson-mount]');
  if (!el) return;

  fetch('/content/whatson.json')
    .then(res => res.json())
    .then(items => {
      el.innerHTML = items.map(item => {
        const title = `<p class="font-subheading" style="margin-bottom:4px;">${item.title}</p>`;
        const desc = `<p class="font-body" style="margin-top:0;">${item.description}</p>`;
        const block = title + desc;
        return item.draft
          ? `<div class="draft" style="margin-bottom:28px;">${block}</div>`
          : `<div style="margin-bottom:28px;">${block}</div>`;
      }).join('');
    });
}

document.addEventListener('DOMContentLoaded', () => {
  loadFaqContent();
  loadWhatsOnContent();
});
