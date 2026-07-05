/* ═══════════════════════════════════════════════
   ORDO ALGEBRAE — Shared Script
   ═══════════════════════════════════════════════ */

// ── Mobile nav ──
function toggleNav() {
  const links = document.querySelector('.nav-links');
  if (links) links.classList.toggle('open');
}
window.toggleNav = toggleNav;

// ── Scroll reveal ──
(function () {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  document.querySelectorAll('.reveal').forEach(r => observer.observe(r));
})();

// ── Tiered access keys ─────────────────────────────────────
// The word is one: "algebra". The tongue in which you speak it
// decides how deep the Order lets you descend.
//   ACCESS I   — the flesh tongue   : plaintext
//   ACCESS II  — the scribe tongue  : hexadecimal (0x61 6c 67 65 62 72 61)
//   ACCESS III — the crow tongue    : binary, 8-bit Unicode, 56 bits
const WORD = 'algebra';
const KEY_PLAIN = WORD;
const KEY_HEX = Array.from(WORD).map(c => c.charCodeAt(0).toString(16)).join('');
const KEY_BIN = Array.from(WORD).map(c => c.charCodeAt(0).toString(2).padStart(8, '0')).join('');

function classifyKey(input) {
  const cleaned = String(input).trim().toLowerCase().replace(/[\s,·:|/_-]+/g, '').replace(/^0x/, '');
  if (cleaned === KEY_BIN) return 3;
  if (cleaned === KEY_HEX) return 2;
  if (cleaned === KEY_PLAIN) return 1;
  return 0;
}
window.classifyKey = classifyKey;

const TIER_KEY = 'ordo_clearance';
function currentTier() {
  const v = parseInt(sessionStorage.getItem(TIER_KEY) || '0', 10);
  return Number.isFinite(v) ? v : 0;
}
function grantTier(t) { try { sessionStorage.setItem(TIER_KEY, String(t)); } catch (e) {} }
function revokeTier() { try { sessionStorage.removeItem(TIER_KEY); } catch (e) {} }
window.currentTier = currentTier;
window.grantTier = grantTier;
window.revokeTier = revokeTier;
