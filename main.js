/* ════════════════════════════════════════
   main.js — Thư Mời Tốt Nghiệp · Hà Thị Mai Hương
════════════════════════════════════════ */

/* ── 1. Floating background particles (Pink & Pearl) ── */
(function spawnParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  const colors = ['#FDE6EE', '#FCE2EC', '#FFF0F5', '#F5D0DD', '#FDF2F6'];

  for (let i = 0; i < 20; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 6 + 3;
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

/* ── 2. Falling Sakura / Rose petals on envelope screen ── */
(function spawnPetals() {
  const petalsContainer = document.getElementById('petals-container');
  if (!petalsContainer) return;
  const colors = ['#FFF0F5', '#FCE2EC', '#FDE8F0', '#F8D2DF', '#FFF8FA'];

  for (let i = 0; i < 18; i++) {
    const p = document.createElement('div');
    p.className = 'petal';
    p.style.cssText = [
      `background:${colors[i % colors.length]}`,
      `left:${Math.random() * 100}vw`,
      `animation-duration:${4.5 + Math.random() * 5}s`,
      `animation-delay:${Math.random() * 4}s`,
    ].join(';');
    petalsContainer.appendChild(p);
  }
})();

/* ── 3. Countdown to Graduation (14:00 on 28/11/2026) ── */
(function initCountdown() {
  const targetTime = new Date('2026-11-28T14:00:00+07:00').getTime();
  const dEl = document.getElementById('cdDays');
  const hEl = document.getElementById('cdHours');
  const mEl = document.getElementById('cdMins');
  const sEl = document.getElementById('cdSecs');
  if (!dEl || !hEl || !mEl || !sEl) return;

  function updateClock() {
    const now = Date.now();
    const diff = Math.max(0, targetTime - now);
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((diff / (1000 * 60)) % 60);
    const secs = Math.floor((diff / 1000) % 60);

    dEl.textContent = String(days).padStart(2, '0');
    hEl.textContent = String(hours).padStart(2, '0');
    mEl.textContent = String(mins).padStart(2, '0');
    sEl.textContent = String(secs).padStart(2, '0');
  }

  updateClock();
  setInterval(updateClock, 1000);
})();

/* ── 4. Open envelope animation ── */
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

/* ── 5. Scroll-reveal with IntersectionObserver ── */
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

/* ── 6. Confetti burst ── */
function launchConfetti(containerId) {
  const colors = ['#FCE2EC', '#F5C6D6', '#EAA7BD', '#FFF0F5', '#F8D8E3', '#FFFFFF'];
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

/* ── 7. Thank-you popup modal ── */
function showThankYouModal() {
  const modal = document.getElementById('thankYouModal');
  modal.classList.add('active');
  launchConfetti('tyConfetti');
  document.body.style.overflow = 'hidden';
}

function closeThankYouModal(e) {
  if (e && e.target !== document.getElementById('thankYouModal')) return;
  const modal = document.getElementById('thankYouModal');
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

/* ── 8. Google Sheets endpoint ── */
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyHv2JdjDdC7ghVnQsIWs4It7oduMxAL9REQyhbiZmvTdOYeek-6jG3NC8GdVRZFhOagA/exec';

function sendToSheet(data) {
  if (!APPS_SCRIPT_URL || APPS_SCRIPT_URL.includes('YOUR_SCRIPT_ID')) return;
  fetch(APPS_SCRIPT_URL, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).catch(() => { /* silent fail */ });
}

/* ── 9. Wish form logic ── */
function submitWish() {
  const nameEl = document.getElementById('wishName');
  const relationEl = document.getElementById('wishRelation');
  const msgEl = document.getElementById('wishMsg');
  const rsvpEl = document.querySelector('input[name="rsvp"]:checked');

  const name = nameEl.value.trim();
  const relation = relationEl.value.trim();
  const msg = msgEl.value.trim();
  const rsvp = rsvpEl ? rsvpEl.value : 'Có';

  // Validation
  if (!name || !msg) {
    const btn = document.querySelector('.wish-submit');
    btn.style.animation = 'shake 0.4s ease';
    setTimeout(() => (btn.style.animation = ''), 400);

    if (!name) nameEl.style.borderColor = '#d9537f';
    if (!msg) msgEl.style.borderColor = '#d9537f';

    setTimeout(() => {
      nameEl.style.borderColor = '';
      msgEl.style.borderColor = '';
    }, 1200);
    return;
  }

  // Send to Google Sheets
  sendToSheet({
    timestamp: new Date().toLocaleString('vi-VN'),
    name,
    relation,
    rsvp,
    msg,
  });

  // Show thank you modal popup
  showThankYouModal();

  // Reset form
  nameEl.value = '';
  relationEl.value = '';
  msgEl.value = '';
}
