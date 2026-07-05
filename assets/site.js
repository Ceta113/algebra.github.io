/* ═══════════════════════════════════════════════
   대수교 · La Foi l'Algèbre — Shared Site Script
   ═══════════════════════════════════════════════ */

// ── Ambient floating particles ──
(function () {
  if (document.getElementById('particles')) return;
  const container = document.createElement('div');
  container.className = 'particles';
  container.id = 'particles';
  document.body.prepend(container);
  for (let i = 0; i < 35; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.cssText = `
      left: ${Math.random() * 100}%;
      animation-delay: ${Math.random() * 15}s;
      animation-duration: ${12 + Math.random() * 18}s;
      --dx: ${(Math.random() - 0.5) * 120}px;
      width: ${1 + Math.random() * 2}px;
      height: ${1 + Math.random() * 2}px;
    `;
    container.appendChild(p);
  }
})();

// ── Scroll reveal ──
(function () {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  document.querySelectorAll('.reveal').forEach(r => observer.observe(r));
  window.__revealObserver = observer;
})();

// ── Mobile nav toggle ──
function toggleNav() {
  const links = document.querySelector('.nav-links');
  if (links) links.classList.toggle('open');
}
window.toggleNav = toggleNav;

// ── Admin authentication ─────────────────────────────
// The sacred key: the name of the faith, rendered in the
// binary tongue of George Boole (8-bit Unicode/ASCII).
// "algebra" → 01100001 01101100 01100111 01100101 01100010 01110010 01100001
const ADMIN_KEY_BITS = Array.from('algebra')
  .map(c => c.charCodeAt(0).toString(2).padStart(8, '0'))
  .join('');

function checkAdminKey(input) {
  const cleaned = String(input).replace(/[\s,·|/-]+/g, '');
  return /^[01]+$/.test(cleaned) && cleaned === ADMIN_KEY_BITS;
}
window.checkAdminKey = checkAdminKey;

const ADMIN_SESSION_KEY = 'algebra_admin_session';
function adminSessionActive() {
  try { return sessionStorage.getItem(ADMIN_SESSION_KEY) === 'granted'; }
  catch (e) { return false; }
}
function grantAdminSession() {
  try { sessionStorage.setItem(ADMIN_SESSION_KEY, 'granted'); } catch (e) {}
}
function revokeAdminSession() {
  try { sessionStorage.removeItem(ADMIN_SESSION_KEY); } catch (e) {}
}
window.adminSessionActive = adminSessionActive;
window.grantAdminSession = grantAdminSession;
window.revokeAdminSession = revokeAdminSession;
