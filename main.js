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

    // Launch floating wishes after a short delay
    setTimeout(initFloatingWishes, 1000);
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
  const nameEl = document.getElementById('wishName');
  const relationEl = document.getElementById('wishRelation');
  const msgEl = document.getElementById('wishMsg');

  const name = nameEl.value.trim();
  const relation = relationEl.value.trim();
  const msg = msgEl.value.trim();

  // Validation
  if (!name || !msg) {
    const btn = document.querySelector('.wish-submit');
    btn.style.animation = 'shake 0.4s ease';
    setTimeout(() => (btn.style.animation = ''), 400);

    if (!name) nameEl.style.borderColor = '#e05b5b';
    if (!msg) msgEl.style.borderColor = '#e05b5b';

    setTimeout(() => {
      nameEl.style.borderColor = '';
      msgEl.style.borderColor = '';
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

  // Add user's wish as a floating card (highlighted)
  createFloatingWish({ name, relation, msg }, 0, true);

  // Reset form
  nameEl.value = '';
  relationEl.value = '';
  msgEl.value = '';
}

/* ── 9. HTML escape helper ── */
function escHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/* ── 10. Floating wishes system ── */
const sampleWishes = [
  { name: 'Nguyễn Minh Anh', relation: 'Bạn học', msg: 'Chúc mừng Thọ tốt nghiệp! Chúc bạn luôn thành công!' },
  { name: 'Trần Văn Hùng', relation: 'Bạn thân', msg: 'Chúc em vững bước trên con đường phía trước!' },
  { name: 'Lê Thị Hương', relation: 'Bạn thân', msg: 'Tốt nghiệp rồi! Bay cao bay xa nhé bạn! 🎓' },
  { name: 'Phạm Đức Anh', relation: 'Anh họ', msg: 'Gia đình rất tự hào về em! Chúc em thành công!' },
  { name: 'Hoàng Thị Mai', relation: 'Chị gái thân thiết', msg: 'Chúc em gặt hái nhiều thành công trong cuộc sống!' },
  { name: 'Vũ Quốc Bảo', relation: 'Bạn', msg: 'Chúc mừng bro! Hẹn gặp nhau trên đỉnh! 💪' },
  { name: 'Đặng Thu Hà', relation: 'Bạn cùng trung tâm', msg: 'Chúc Thọ luôn giữ vững đam mê và nhiệt huyết!' },
  { name: 'Ngô Thanh Tùng', relation: 'Chú', msg: 'Cháu là niềm tự hào của gia đình! Chúc cháu thành đạt!' },
  { name: 'Bùi Lan Phương', relation: 'Chị em thân thiết', msg: 'Chúc em trai luôn mạnh mẽ, tự tin bước vào đời! ❤️' },
  { name: 'Mai Xuân Đạt', relation: 'Bạn bè', msg: 'Chúc mừng tốt nghiệp! Tương lai tươi sáng chờ bạn!' },
  { name: 'Trịnh Quỳnh Anh', relation: 'Bạn', msg: 'Anh giỏi lắm! 🌟' },
  { name: 'Đỗ Hữu Nghĩa', relation: 'Bạn ngoài xã hội', msg: 'Cuối cùng cũng ra trường! Chúc ông thành công nhé!' },
];

const driftAnimations = ['wishDrift1', 'wishDrift2', 'wishDrift3', 'wishDrift4', 'wishDrift5'];
const floatingPositions = [];

/**
 * Create a floating wish card on the page.
 * @param {Object} wish — { name, relation, msg }
 * @param {number} delayMs — entrance delay in ms
 * @param {boolean} isUser — true = highlight as user-submitted
 */
function createFloatingWish(wish, delayMs, isUser) {
  const container = document.getElementById('floatingWishes');
  const card = document.createElement('div');
  card.className = 'floating-wish' + (isUser ? ' floating-wish--user' : '');

  // Pick random drift animation & duration
  const anim = driftAnimations[Math.floor(Math.random() * driftAnimations.length)];
  const duration = 18 + Math.random() * 14; // 18–32s

  // Position on the far edges to avoid central content
  const sideIndex = floatingPositions.length;
  const isLeftSide = (sideIndex % 2 === 0);

  let left, top, attempts = 0;
  do {
    if (isLeftSide) {
      left = 1 + Math.random() * 12;   // 1–13% (far left column)
    } else {
      left = 82 + Math.random() * 12;  // 82–94% (far right column)
    }
    top = 4 + Math.random() * 82;      // 4–86% vertical spread
    attempts++;
  } while (attempts < 40 && floatingPositions.some(p =>
    Math.abs(p.x - left) < 10 && Math.abs(p.y - top) < 10
  ));
  floatingPositions.push({ x: left, y: top });

  // Initial state: invisible, shifted down
  card.style.cssText = `
    left: ${left}%;
    top: ${top}%;
    opacity: 0;
    transform: translateY(40px) scale(0.85);
  `;

  card.innerHTML = `
    <div class="floating-wish-name">
      💙 ${escHtml(wish.name)}
      ${wish.relation
      ? `<span style="color:var(--gold);font-style:italic;">· ${escHtml(wish.relation)}</span>`
      : ''}
    </div>
    <div class="floating-wish-msg">"${escHtml(wish.msg)}"</div>
  `;

  container.appendChild(card);

  // Animate entrance after delay, then start drift
  setTimeout(() => {
    const finalOpacity = isUser ? 0.92 : (0.65 + Math.random() * 0.15);
    card.style.transition = 'opacity 1s ease, transform 1s ease';
    card.style.opacity = String(finalOpacity);
    card.style.transform = 'translateY(0) scale(1)';

    // After entrance transition, switch to continuous drift
    setTimeout(() => {
      card.style.transition = '';
      card.style.animation = `${anim} ${duration}s ease-in-out infinite`;
    }, 1100);
  }, delayMs);
}

let floatingWishesStarted = false;

/** Spawn all sample wishes as floating cards */
function initFloatingWishes() {
  if (floatingWishesStarted) return;
  floatingWishesStarted = true;
  sampleWishes.forEach((wish, i) => {
    createFloatingWish(wish, i * 350, false); // stagger 350ms each
  });
}

// Auto-launch floating wishes after 3s as fallback
// (in case envelope was already opened or user skipped it)
setTimeout(() => {
  if (!floatingWishesStarted) initFloatingWishes();
}, 3000);
