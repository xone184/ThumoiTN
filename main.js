/* ════════════════════════════════════════
   main.js — Thư Mời Tốt Nghiệp · Ma Văn Thọ
════════════════════════════════════════ */

/* ── 1. Floating background particles ── */
(function spawnParticles() {
  const container = document.getElementById('particles');
  const colors = ['#5BB8D4', '#007BA8', '#C9A84C', '#C8ECF5'];

  for (let i = 0; i < 18; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 5 + 3;
    p.style.cssText = [
      `width:${size}px`,
      `height:${size}px`,
      `background:${colors[Math.floor(Math.random() * colors.length)]}`,
      `left:${Math.random() * 100}vw`,
      `top:${Math.random() * 100}vh`,
      `animation-delay:${Math.random() * 6}s`,
      `animation-duration:${6 + Math.random() * 6}s`,
    ].join(';');
    container.appendChild(p);
  }
})();

/* ── 2. Falling petals on envelope screen ── */
(function spawnPetals() {
  const petalsContainer = document.getElementById('petals-container');
  const colors = ['#C9A84C', '#5BB8D4', '#007BA8', '#E8C97A', '#C8ECF5'];

  for (let i = 0; i < 14; i++) {
    const p = document.createElement('div');
    p.className = 'petal';
    p.style.cssText = [
      `background:${colors[i % colors.length]}`,
      `left:${Math.random() * 100}vw`,
      `animation-duration:${4 + Math.random() * 5}s`,
      `animation-delay:${Math.random() * 4}s`,
    ].join(';');
    petalsContainer.appendChild(p);
  }
})();

/* ── 3. Open envelope animation ── */
function openEnvelope() {
  const wrap = document.getElementById('envWrap');
  if (wrap.dataset.opened) return;   // prevent double-click
  wrap.dataset.opened = '1';
  wrap.classList.add('open');

  setTimeout(() => {
    // Hide overlay, reveal main page
    document.getElementById('envelope-overlay').classList.add('hidden');
    document.getElementById('mainPage').style.opacity = '1';

    // Start scroll-reveal after page fades in
    setTimeout(initReveal, 200);
  }, 1400);
}

/* ── 4. Scroll-reveal with IntersectionObserver ── */
function initReveal() {
  const elements = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), index * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  elements.forEach(el => observer.observe(el));

  // Immediately show first 3 elements without scrolling
  elements.forEach((el, i) => {
    if (i < 3) setTimeout(() => el.classList.add('visible'), i * 150);
  });
}

/* ── 5. Confetti burst ── */
function launchConfetti(containerId) {
  const colors = ['#C9A84C', '#007BA8', '#5BB8D4', '#E8C97A', '#00506E', '#C8ECF5'];
  const parent = containerId
    ? (document.getElementById(containerId) || document.body)
    : document.body;

  for (let i = 0; i < 60; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.cssText = [
      `left:${Math.random() * 100}%`,
      `top:${10 + Math.random() * 30}%`,
      `background:${colors[Math.floor(Math.random() * colors.length)]}`,
      `width:${6 + Math.random() * 8}px`,
      `height:${6 + Math.random() * 8}px`,
      `border-radius:${Math.random() > 0.5 ? '50%' : '2px'}`,
      `animation-delay:${Math.random() * 0.5}s`,
      `animation-duration:${1.4 + Math.random() * 0.8}s`,
    ].join(';');
    parent.appendChild(piece);
    setTimeout(() => piece.remove(), 2400);
  }
}

/* ── 6. Thank-you popup ── */
function showThankYouModal() {
  const modal = document.getElementById('thankYouModal');
  modal.classList.add('active');
  launchConfetti('tyConfetti');
  document.body.style.overflow = 'hidden';
}

function closeThankYouModal(e) {
  // If clicking overlay backdrop (not the card), close
  if (e && e.target !== document.getElementById('thankYouModal')) return;
  const modal = document.getElementById('thankYouModal');
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

/* ── 7. Google Sheets endpoint ── */
// HƯỚNG DẪN: Thay URL bên dưới bằng URL từ Apps Script sau khi deploy.
// Xem file SETUP_GSHEET.md để biết cách tạo Apps Script.
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw3QQ_4prrHu1TsMFw3SGtVI5-zjjppwRxV2MWAs_Xi0E5h5IvqSA0T-0QIaJnJx6WAMw/exec';

function sendToSheet(data) {
  if (!APPS_SCRIPT_URL || APPS_SCRIPT_URL.includes('YOUR_SCRIPT_ID')) return;
  // mode: 'no-cors' — response is opaque but data goes through
  fetch(APPS_SCRIPT_URL, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).catch(() => { /* silent fail — data still recorded */ });
}

/* ── 8. Wish form logic ── */
const wishes = [];

function submitWish() {
  const nameEl     = document.getElementById('wishName');
  const relationEl = document.getElementById('wishRelation');
  const msgEl      = document.getElementById('wishMsg');

  const name     = nameEl.value.trim();
  const relation = relationEl.value.trim();
  const msg      = msgEl.value.trim();

  // Validation
  if (!name || !msg) {
    const btn = document.querySelector('.wish-submit');
    btn.style.animation = 'shake 0.4s ease';
    setTimeout(() => (btn.style.animation = ''), 400);

    if (!name) nameEl.style.borderColor = '#e05b5b';
    if (!msg)  msgEl.style.borderColor  = '#e05b5b';

    setTimeout(() => {
      nameEl.style.borderColor = '';
      msgEl.style.borderColor  = '';
    }, 1200);
    return;
  }

  // Save locally
  wishes.unshift({ name, relation, msg });

  // Send to Google Sheets
  sendToSheet({
    timestamp: new Date().toLocaleString('vi-VN'),
    name,
    relation,
    msg,
  });

  // Show premium popup
  showThankYouModal();
  renderWishes();

  // Reset form
  nameEl.value     = '';
  relationEl.value = '';
  msgEl.value      = '';
}

function renderWishes() {
  const list = document.getElementById('wishesList');
  list.innerHTML = wishes
    .map(w => `
      <div class="wish-card">
        <div class="wish-card-name">
          💙 ${escHtml(w.name)}
          ${w.relation
            ? `<span style="color:var(--gold);font-style:italic;">· ${escHtml(w.relation)}</span>`
            : ''}
        </div>
        <div class="wish-card-msg">"${escHtml(w.msg)}"</div>
      </div>
    `)
    .join('');
}

/* ── 9. HTML escape helper ── */
function escHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
