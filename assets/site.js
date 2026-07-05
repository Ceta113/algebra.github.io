/* ═══════════════════════════════════════════════════════════
   ORDO ALGEBRAE — SPA Engine
   router · boot · scramble · global audio · tiered clearance
   ═══════════════════════════════════════════════════════════ */
(function () {
'use strict';

/* ───────────────────────── Clearance ───────────────────────── */
// The word is one: "algebra". The tongue decides the depth.
//   ACCESS I   — lingua carnis  : plaintext
//   ACCESS II  — lingua scribae : hexadecimal
//   ACCESS III — lingua corvi   : binary (8-bit Unicode)
const WORD = 'algebra';
const KEY_HEX = Array.from(WORD).map(c => c.charCodeAt(0).toString(16)).join('');
const KEY_BIN = Array.from(WORD).map(c => c.charCodeAt(0).toString(2).padStart(8, '0')).join('');

function classifyKey(input) {
  const cleaned = String(input).trim().toLowerCase().replace(/[\s,·:|/_-]+/g, '').replace(/^0x/, '');
  if (cleaned === KEY_BIN) return 3;
  if (cleaned === KEY_HEX) return 2;
  if (cleaned === WORD) return 1;
  return 0;
}

const TIER_KEY = 'ordo_clearance';
function currentTier() {
  const v = parseInt(sessionStorage.getItem(TIER_KEY) || '0', 10);
  return Number.isFinite(v) ? v : 0;
}
function grantTier(t) { try { sessionStorage.setItem(TIER_KEY, String(t)); } catch (e) {} applyClearance(); }
function revokeTier() { try { sessionStorage.removeItem(TIER_KEY); } catch (e) {} applyClearance(); }

const TIER_NAMES = { 0: 'NO CLEARANCE', 1: 'ACCESS Ⅰ', 2: 'ACCESS Ⅱ', 3: 'ACCESS Ⅲ' };

// Reveal/lock everything marked with data-clearance
function applyClearance() {
  const t = currentTier();
  document.querySelectorAll('[data-clearance]').forEach(el => {
    const need = parseInt(el.dataset.clearance, 10) || 0;
    el.classList.toggle('revealed', t >= need);
    el.classList.toggle('granted', t >= need);
  });
  const nav = document.getElementById('navClearance');
  if (nav) {
    nav.textContent = TIER_NAMES[t];
    nav.classList.toggle('lit', t > 0);
  }
  document.querySelectorAll('.file-row[data-need]').forEach(row => {
    const need = parseInt(row.dataset.need, 10) || 0;
    const badge = row.querySelector('.file-badge');
    const locked = t < need;
    row.classList.toggle('locked', locked);
    if (badge && need > 0) {
      badge.textContent = locked ? 'SEALED · ACCESS ' + 'ⅠⅡⅢ'[need - 1] : 'UNSEALED';
      badge.classList.toggle('sealed', locked);
      badge.classList.toggle('open-badge', !locked);
    }
  });
  if (typeof window.__renderTerminal === 'function') window.__renderTerminal();
}

/* ───────────────────────── Router ───────────────────────── */
const ROUTES = ['home', 'codex', 'registry', 'archive', 'signals', 'terminal'];
let revealObserver = null;

function initReveal(scope) {
  if (!revealObserver) {
    revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
  }
  (scope || document).querySelectorAll('.reveal').forEach(r => {
    r.classList.remove('visible');
    revealObserver.observe(r);
  });
}

function routeFromHash() {
  const h = (location.hash || '#/').replace(/^#\/?/, '').split('?')[0];
  return ROUTES.includes(h) ? h : 'home';
}

let firstRoute = true;
function navigate() {
  const route = routeFromHash();
  const main = document.querySelector('main');
  const show = () => {
    document.querySelectorAll('.route').forEach(s => s.classList.remove('active'));
    const target = document.getElementById('route-' + route);
    if (target) target.classList.add('active');
    document.querySelectorAll('.nav-links a[data-route]').forEach(a => {
      a.classList.toggle('active', a.dataset.route === route);
    });
    document.querySelector('.nav-links')?.classList.remove('open');
    window.scrollTo(0, 0);
    initReveal(target);
    scrambleHeadings(target);
    applyClearance();
    main.classList.remove('leaving');
  };
  if (firstRoute) { firstRoute = false; show(); return; }
  main.classList.add('leaving');
  setTimeout(show, 200);
}
window.addEventListener('hashchange', navigate);

/* ───────────────────── Text scramble effect ───────────────────── */
const GLYPHS = '01∑∫√≠≈∆XVIΩ†▲';
function scramble(el) {
  const finalText = el.dataset.text || el.textContent;
  el.dataset.text = finalText;
  const len = finalText.length;
  let frame = 0;
  const total = Math.min(34, 10 + len);
  clearInterval(el._scrTimer);
  el._scrTimer = setInterval(() => {
    frame++;
    const settled = Math.floor((frame / total) * len);
    let out = '';
    for (let i = 0; i < len; i++) {
      const ch = finalText[i];
      if (ch === ' ' || i < settled) { out += ch; }
      else { out += GLYPHS[Math.floor(Math.random() * GLYPHS.length)]; }
    }
    el.textContent = out;
    if (frame >= total) { clearInterval(el._scrTimer); el.textContent = finalText; }
  }, 28);
}
function scrambleHeadings(scope) {
  (scope || document).querySelectorAll('[data-scramble]').forEach(scramble);
}

/* ───────────────────────── Boot sequence ───────────────────────── */
function runBoot() {
  const boot = document.getElementById('boot');
  if (!boot) return;
  if (sessionStorage.getItem('ordo_booted')) { boot.classList.add('done'); setTimeout(() => boot.remove(), 100); return; }
  const lines = [
    { t: '> ESTABLISHING NON-EXISTENT CONNECTION ...', d: 300 },
    { t: '> ROUTE: SURFACE NODE 07 · MASK: ACTIVE', d: 500 },
    { t: '> VISITOR COORDINATES ... <span class="ok">ACQUIRED</span>', d: 550 },
    { t: '> CROSS-REFERENCING REGISTRY ... <span class="ok">NOT FOUND — GOOD</span>', d: 650 },
    { t: '> REMINDER: THIS PAGE DOES NOT EXIST', d: 600 },
    { t: '> <span class="ok">VERITAS IN NUMERIS. 입장을 허가한다.</span>', d: 700 }
  ];
  const box = boot.querySelector('.boot-inner');
  let idx = 0;
  const lineEls = [];
  function next() {
    if (idx >= lines.length) { finish(); return; }
    const div = document.createElement('div');
    div.className = 'boot-line';
    div.innerHTML = lines[idx].t + ' <span class="boot-caret"></span>';
    if (lineEls.length) lineEls[lineEls.length - 1].querySelector('.boot-caret')?.remove();
    box.insertBefore(div, box.querySelector('.boot-skip'));
    lineEls.push(div);
    setTimeout(next, lines[idx].d);
    idx++;
  }
  function finish() {
    try { sessionStorage.setItem('ordo_booted', '1'); } catch (e) {}
    setTimeout(() => { boot.classList.add('done'); setTimeout(() => boot.remove(), 900); }, 500);
  }
  boot.addEventListener('click', () => { finish(); });
  next();
}

/* ───────────────────────── UTC clock ───────────────────────── */
function startClocks() {
  const els = document.querySelectorAll('.utc-clock');
  if (!els.length) return;
  const pad = n => String(n).padStart(2, '0');
  setInterval(() => {
    const d = new Date();
    const s = 'OBS TIME ' + d.getUTCFullYear() + '.' + pad(d.getUTCMonth() + 1) + '.' + pad(d.getUTCDate())
      + ' ' + pad(d.getUTCHours()) + ':' + pad(d.getUTCMinutes()) + ':' + pad(d.getUTCSeconds()) + ' UTC';
    els.forEach(el => el.textContent = s);
  }, 1000);
}

/* ───────────────────── Global audio manager ───────────────────── */
const TRACKS = [
  { id: 'clavis', src: 'assets/audio/clavis-umbrae.mp3', title: 'CLAVIS UMBRAE — 입회 전례 성가' },
  { id: 'glass', src: 'assets/audio/glass-kiss.mp3', title: 'GLASS KISS — 표면 침투용 위장 음원' }
];
const audioMap = {};
let currentId = null;

const fmt = s => {
  if (!isFinite(s)) return '0:00';
  const m = Math.floor(s / 60), sec = Math.floor(s % 60);
  return m + ':' + String(sec).padStart(2, '0');
};

function dockEls() {
  return {
    dock: document.getElementById('audioDock'),
    btn: document.getElementById('dockBtn'),
    title: document.getElementById('dockTitle'),
    fill: document.getElementById('dockFill'),
    time: document.getElementById('dockTime'),
    bar: document.getElementById('dockBar')
  };
}

function trackRow(id) { return document.querySelector('.track[data-id="' + id + '"]'); }

function syncUI(id) {
  const a = audioMap[id];
  const row = trackRow(id);
  const playing = currentId === id && !a.paused;
  if (row) {
    row.classList.toggle('playing', playing);
    row.querySelector('.track-btn').textContent = playing ? '❚❚' : '▶';
    const p = a.duration ? (a.currentTime / a.duration) * 100 : 0;
    row.querySelector('.track-bar-fill').style.width = p + '%';
    row.querySelector('.track-time').textContent = fmt(a.currentTime) + ' / ' + fmt(a.duration);
  }
  const d = dockEls();
  if (d.dock && currentId) {
    const cur = audioMap[currentId];
    const meta = TRACKS.find(t => t.id === currentId);
    const anyStarted = cur.currentTime > 0 || !cur.paused;
    d.dock.classList.toggle('show', anyStarted);
    d.dock.classList.toggle('paused', cur.paused);
    d.btn.textContent = cur.paused ? '▶' : '❚❚';
    d.title.textContent = meta.title;
    const p = cur.duration ? (cur.currentTime / cur.duration) * 100 : 0;
    d.fill.style.width = p + '%';
    d.time.textContent = fmt(cur.currentTime) + ' / ' + fmt(cur.duration);
  }
}

function initAudio() {
  TRACKS.forEach(t => {
    const a = new Audio(t.src);
    a.preload = 'metadata';
    audioMap[t.id] = a;
    ['play', 'pause', 'timeupdate', 'loadedmetadata', 'ended'].forEach(ev =>
      a.addEventListener(ev, () => {
        if (ev === 'ended') { a.currentTime = 0; }
        syncUI(t.id);
        if (currentId && currentId !== t.id) syncUI(currentId);
      })
    );
  });

  document.querySelectorAll('.track').forEach(row => {
    const id = row.dataset.id;
    row.querySelector('.track-btn').addEventListener('click', () => toggle(id));
    row.querySelector('.track-bar').addEventListener('click', e => seek(id, e, row.querySelector('.track-bar')));
  });

  const d = dockEls();
  if (d.btn) d.btn.addEventListener('click', () => { if (currentId) toggle(currentId); });
  if (d.bar) d.bar.addEventListener('click', e => { if (currentId) seek(currentId, e, d.bar); });
}

function toggle(id) {
  const a = audioMap[id];
  if (!a) return;
  if (currentId && currentId !== id) { audioMap[currentId].pause(); syncUI(currentId); }
  currentId = id;
  if (a.paused) a.play(); else a.pause();
  syncUI(id);
}
function seek(id, e, barEl) {
  const a = audioMap[id];
  const r = barEl.getBoundingClientRect();
  const ratio = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
  if (isFinite(a.duration)) a.currentTime = ratio * a.duration;
}

/* ───────────────────── Decode console (signals) ───────────────────── */
// Puzzle chain:
//  step 1 — decode hex intercept  T-093 → "veritas"  → hints the scribe tongue
//  step 2 — decode binary intercept T-101 → "ager"   → the field; SIEVE thread
const PUZZLES = {
  veritas: {
    done: false,
    reply: [
      '[DECODE OK] T-093 → "veritas"',
      '… 확인. 너는 이제 서기의 언어(16진)를 읽는다.',
      '기억하라 — 문(門)은 단어가 아니라 언어를 시험한다.',
      '같은 단어를, 그 언어로, 터미널에 말하라.'
    ]
  },
  ager: {
    done: false,
    reply: [
      '[DECODE OK] T-101 → "ager" (라틴어: 들판)',
      '… SIEVE의 마지막 단어와 원점의 지령이 일치한다.',
      '"들판을 확인하라." — 이것은 우연이 아니다. 해(解)다.',
      '전체 사건 기록은 흑서고 파일 #S-041 (ACCESS Ⅱ 이상).'
    ]
  }
};

function initConsole() {
  const form = document.getElementById('consoleForm');
  if (!form) return;
  const input = document.getElementById('consoleInput');
  const log = document.getElementById('consoleLog');
  const print = (txt, ok) => {
    const div = document.createElement('div');
    if (ok) div.className = 'ok';
    div.textContent = txt;
    log.appendChild(div);
    log.scrollTop = log.scrollHeight;
  };
  form.addEventListener('submit', e => {
    e.preventDefault();
    const raw = input.value.trim().toLowerCase();
    input.value = '';
    if (!raw) return;
    print('> ' + raw);
    const key = raw.replace(/[^a-z]/g, '');
    if (PUZZLES[key]) {
      if (PUZZLES[key].done) { print('… 이미 복호화된 신호다.', true); return; }
      PUZZLES[key].done = true;
      PUZZLES[key].reply.forEach((l, i) => setTimeout(() => print(l, true), 260 * (i + 1)));
    } else if (/^[01\s]+$/.test(raw) || /^[0-9a-f\s]+$/.test(raw)) {
      print('… 부호가 아니라 평문을 입력하라. 복호화는 네 몫이다.');
    } else {
      print('… 일치하는 신호 없음. 감청 기록의 원문을 다시 보라.');
    }
  });
}

/* ───────────────── Archive documents (date-gate 포함) ───────────────── */
function isGaloisDay() {
  const d = new Date();
  return d.getMonth() === 4 && d.getDate() === 30; // May 30
}

function initArchive() {
  const viewer = document.getElementById('docViewer');
  if (!viewer) return;
  const paper = viewer.querySelector('.doc-paper');
  document.querySelectorAll('.file-row').forEach(row => {
    row.addEventListener('click', () => {
      const need = parseInt(row.dataset.need || '0', 10);
      const t = currentTier();
      const docId = row.dataset.doc;
      if (docId === 'galois' && !isGaloisDay() && t < 3) {
        openDoc('galois-sealed'); return;
      }
      if (t < need) { openDoc('denied-' + need); return; }
      openDoc(docId);
    });
  });
  function openDoc(id) {
    const tpl = document.getElementById('doc-' + id);
    if (!tpl) return;
    paper.innerHTML = '<button class="doc-close" aria-label="close">✕</button>' + tpl.innerHTML;
    paper.querySelector('.doc-close').addEventListener('click', close);
    viewer.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function close() {
    viewer.classList.remove('open');
    document.body.style.overflow = '';
  }
  viewer.addEventListener('click', e => { if (e.target === viewer) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
}

/* ───────────────────────── Terminal ───────────────────────── */
const TIER_META = {
  1: { badge: 'ACCESS Ⅰ · LINGUA CARNIS', desc: '평문 인증 — 제Ⅱ·Ⅲ급(변수·함수) 열람 범위' },
  2: { badge: 'ACCESS Ⅱ · LINGUA SCRIBAE', desc: '16진 인증 — 제Ⅳ급·평의회 열람 범위' },
  3: { badge: 'ACCESS Ⅲ · LINGUA CORVI', desc: '2진 인증 — 원점(Origo) 직통 열람 범위' }
};

function failMessage(raw) {
  const cleaned = String(raw).trim().toLowerCase().replace(/[\s,·:|/_-]+/g, '');
  if (/^[01]{8,}$/.test(cleaned)) return '✕ 까마귀의 언어이나, 단어가 틀렸다.';
  if (/^(0x)?[0-9a-f]+$/.test(cleaned) && /\d/.test(cleaned)) return '✕ 서기의 언어이나, 단어가 틀렸다.';
  if (/^[a-z]+$/.test(cleaned)) return '✕ 육신의 언어이나, 그 단어가 아니다. 단어는 하나다.';
  return '✕ 어느 언어에도 속하지 않는다. 문 앞에서 돌아가라.';
}

function initTerminal() {
  const gate = document.getElementById('gate');
  if (!gate) return;
  const shell = document.getElementById('adminShell');
  const input = document.getElementById('gateInput');
  const msg = document.getElementById('gateMsg');
  const badge = document.getElementById('tierBadge');
  const tierDesc = document.getElementById('tierDesc');
  const teaser = document.getElementById('lockedTeaser');

  window.__renderTerminal = function () {
    const t = currentTier();
    if (t > 0) {
      gate.style.display = 'none';
      shell.classList.add('unlocked');
      badge.textContent = TIER_META[t].badge;
      tierDesc.textContent = TIER_META[t].desc;
      if (t < 3) {
        const nextTongue = t === 1
          ? '서기의 언어(16진)로 같은 단어를 다시 말하라. 힌트는 감청 기록 T-093에 있다.'
          : '까마귀의 언어(2진, 8-bit)로 같은 단어를 다시 말하라. 여덟 날개 — a는 01100001이다.';
        teaser.innerHTML = '<div class="locked-block"><div class="lock-glyph">▲</div>'
          + '<div class="lock-title">Deeper Levels Sealed · Access ' + (t === 1 ? 'Ⅱ·Ⅲ' : 'Ⅲ') + ' 봉인됨</div>'
          + '<div class="lock-note">이 아래의 기록은 당신의 언어로는 열리지 않는다.<br>' + nextTongue + '</div></div>';
      } else {
        teaser.innerHTML = '';
      }
    } else {
      gate.style.display = 'flex';
      shell.classList.remove('unlocked');
    }
  };

  document.getElementById('gateForm').addEventListener('submit', e => {
    e.preventDefault();
    const t = classifyKey(input.value);
    input.classList.remove('error');
    if (t > 0) {
      msg.textContent = '✓ ' + TIER_META[t].badge + ' — 봉인 해제.';
      msg.className = 'gate-msg ok';
      setTimeout(() => { grantTier(t); window.scrollTo(0, 0); }, 600);
    } else {
      input.classList.add('error');
      msg.className = 'gate-msg';
      msg.textContent = failMessage(input.value);
      setTimeout(() => input.classList.remove('error'), 450);
    }
  });

  document.getElementById('upgradeForm').addEventListener('submit', e => {
    e.preventDefault();
    const up = document.getElementById('upgradeInput');
    const umsg = document.getElementById('upgradeMsg');
    const t = classifyKey(up.value);
    if (t > currentTier()) {
      grantTier(t);
      umsg.textContent = '✓ 하강 승인 — ' + TIER_META[t].badge;
      up.value = '';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (t > 0) {
      umsg.textContent = '— 이미 그 깊이에 있거나, 그보다 아래에 있다.';
    } else {
      umsg.textContent = failMessage(up.value);
    }
  });

  window.lockTerminal = function () {
    revokeTier();
    input.value = '';
    msg.textContent = '';
    msg.className = 'gate-msg';
    window.scrollTo(0, 0);
  };
}

/* ───────────────────────── Misc ───────────────────────── */
function toggleNav() { document.querySelector('.nav-links')?.classList.toggle('open'); }
window.toggleNav = toggleNav;

/* ───────────────────────── Init ───────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  runBoot();
  initAudio();
  initConsole();
  initArchive();
  initTerminal();
  startClocks();
  navigate();
});

})();
