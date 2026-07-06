/* ═══════════════════════════════════════════════════════════
   ORDO ALGEBRAE — SPA Engine + FX Layer
   router · boot · scramble · global audio · tiered clearance
   crows · observation net · coordinate cursor · wipes · toasts
   ═══════════════════════════════════════════════════════════ */
(function () {
'use strict';

const REDUCED = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const FINE_POINTER = window.matchMedia && window.matchMedia('(pointer: fine)').matches;

/* ───────────────────────── Clearance ───────────────────────── */
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
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          if (e.target.querySelector && e.target.querySelector('[data-count]')) {
            e.target.querySelectorAll('[data-count]').forEach(countUp);
          }
          if (e.target.dataset && e.target.dataset.count !== undefined) countUp(e.target);
          if (e.target.classList.contains('typewrite')) typewrite(e.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
  }
  (scope || document).querySelectorAll('.reveal').forEach(r => {
    r.classList.remove('visible');
    revealObserver.observe(r);
  });
  (scope || document).querySelectorAll('.typewrite').forEach(r => revealObserver.observe(r));
  (scope || document).querySelectorAll('[data-count]').forEach(r => revealObserver.observe(r));
}

function routeFromHash() {
  const h = (location.hash || '#/').replace(/^#\/?/, '').split('?')[0];
  return ROUTES.includes(h) ? h : 'home';
}

let firstRoute = true;
function navigate() {
  const route = routeFromHash();
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
    if (!REDUCED && Math.random() < 0.35) setTimeout(spawnCrow, 1200 + Math.random() * 2000);
  };
  if (firstRoute || REDUCED) { firstRoute = false; show(); return; }
  runWipe(show);
}
window.addEventListener('hashchange', navigate);

/* route wipe */
function runWipe(mid) {
  const wipe = document.getElementById('routeWipe');
  if (!wipe) { mid(); return; }
  const bin = document.getElementById('wipeBin');
  if (bin) {
    let s = '';
    for (let i = 0; i < 28; i++) s += Math.random() < 0.5 ? '0' : '1';
    bin.textContent = s;
  }
  wipe.classList.remove('run');
  void wipe.offsetWidth; // restart animation
  wipe.classList.add('run');
  setTimeout(mid, 250);
  setTimeout(() => wipe.classList.remove('run'), 700);
}

/* ───────────────────── Text scramble ───────────────────── */
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
      if (ch === ' ' || i < settled) out += ch;
      else out += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
    }
    el.textContent = out;
    if (frame >= total) { clearInterval(el._scrTimer); el.textContent = finalText; }
  }, 28);
}
function scrambleHeadings(scope) {
  if (REDUCED) return;
  (scope || document).querySelectorAll('[data-scramble]').forEach(scramble);
}

/* ───────────────────── Count-up ───────────────────── */
function countUp(el) {
  if (el._counted || REDUCED) return;
  el._counted = true;
  const target = parseInt(el.dataset.count, 10);
  if (!Number.isFinite(target)) return;
  const comma = el.dataset.format === 'comma';
  const dur = 1400;
  const t0 = performance.now();
  el.classList.add('counting');
  function step(now) {
    const p = Math.min(1, (now - t0) / dur);
    const eased = 1 - Math.pow(1 - p, 3);
    let v = Math.round(target * eased);
    el.textContent = comma ? v.toLocaleString('en-US') : String(v);
    if (p < 1) requestAnimationFrame(step);
    else el.classList.remove('counting');
  }
  requestAnimationFrame(step);
}

/* ───────────────────── Typewriter ───────────────────── */
function typewrite(el) {
  if (el._typed || REDUCED) { el.style.visibility = 'visible'; return; }
  el._typed = true;
  const full = el.dataset.full || el.textContent;
  el.dataset.full = full;
  el.textContent = '';
  el.style.visibility = 'visible';
  let i = 0;
  const speed = Math.max(8, Math.min(28, 2400 / full.length));
  (function tick() {
    if (i <= full.length) {
      el.textContent = full.slice(0, i) + (i < full.length ? '▌' : '');
      i += 1 + (Math.random() < 0.25 ? 1 : 0);
      setTimeout(tick, speed + Math.random() * speed);
    } else {
      el.textContent = full;
    }
  })();
}

/* ───────────────────────── Boot ───────────────────────── */
function runBoot() {
  const boot = document.getElementById('boot');
  if (!boot) return;
  if (sessionStorage.getItem('ordo_booted') || REDUCED) { boot.classList.add('done'); setTimeout(() => boot.remove(), 100); return; }
  // binary drizzle
  const dz = document.createElement('div');
  dz.className = 'boot-drizzle';
  for (let i = 0; i < 12; i++) {
    const col = document.createElement('div');
    col.className = 'boot-col';
    col.style.left = (3 + i * 8.2) + '%';
    col.style.setProperty('--dz', (4 + Math.random() * 6) + 's');
    col.style.animationDelay = (-Math.random() * 8) + 's';
    let s = '';
    for (let j = 0; j < 34; j++) s += Math.random() < 0.5 ? '0' : '1';
    col.textContent = s;
    dz.appendChild(col);
  }
  boot.prepend(dz);

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
  boot.addEventListener('click', finish);
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

/* ───────────────────── Global audio ───────────────────── */
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
    titleText: document.getElementById('dockTitleText'),
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
    if (d.titleText) d.titleText.textContent = meta.title;
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
        if (ev === 'ended') a.currentTime = 0;
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

/* ───────────────────── Decode console ───────────────────── */
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
      if (key === 'ager') setTimeout(() => spawnCrow(), 800);
    } else if (/^[01\s]+$/.test(raw) || /^[0-9a-f\s]+$/.test(raw)) {
      print('… 부호가 아니라 평문을 입력하라. 복호화는 네 몫이다.');
    } else {
      print('… 일치하는 신호 없음. 감청 기록의 원문을 다시 보라.');
    }
  });
}

/* ───────────────── Archive documents ───────────────── */
function isGaloisDay() {
  const d = new Date();
  return d.getMonth() === 4 && d.getDate() === 30;
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
      if (docId === 'galois' && !isGaloisDay() && t < 3) { openDoc('galois-sealed'); return; }
      if (t < need) { openDoc('denied-' + need); return; }
      openDoc(docId);
    });
  });
  function openDoc(id) {
    const tpl = document.getElementById('doc-' + id);
    if (!tpl) return;
    paper.innerHTML = '<button class="doc-close" aria-label="close">✕</button>' + tpl.innerHTML;
    paper.classList.remove('slammed');
    void paper.offsetWidth;
    paper.classList.add('slammed');
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
      setTimeout(() => { grantTier(t); window.scrollTo(0, 0); if (t === 3) spawnCrowFlock(5); }, 600);
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
      if (t === 3) spawnCrowFlock(5);
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

/* ═══════════════════════ FX LAYER ═══════════════════════ */

/* observation network canvas */
function initNet() {
  const canvas = document.getElementById('fxCanvas');
  if (!canvas || REDUCED) return;
  const ctx = canvas.getContext('2d');
  let W, H, nodes = [];
  const N = 55, LINK = 130, CURSOR_LINK = 170;
  let mouse = { x: -9999, y: -9999 };

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  function seed() {
    nodes = [];
    for (let i = 0; i < N; i++) {
      nodes.push({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.22, vy: (Math.random() - 0.5) * 0.22,
        r: 0.8 + Math.random() * 1.2
      });
    }
  }
  window.addEventListener('resize', () => { resize(); seed(); });
  window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
  window.addEventListener('mouseout', () => { mouse.x = -9999; mouse.y = -9999; });
  resize(); seed();

  function frame() {
    if (!document.hidden) {
      ctx.clearRect(0, 0, W, H);
      for (const n of nodes) {
        n.x += n.vx; n.y += n.vy;
        if (n.x < -20) n.x = W + 20; if (n.x > W + 20) n.x = -20;
        if (n.y < -20) n.y = H + 20; if (n.y > H + 20) n.y = -20;
      }
      ctx.lineWidth = 0.5;
      for (let i = 0; i < N; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < N; j++) {
          const b = nodes[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < LINK * LINK) {
            const o = 0.10 * (1 - Math.sqrt(d2) / LINK);
            ctx.strokeStyle = 'rgba(242,242,239,' + o.toFixed(3) + ')';
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
        // link to cursor — the network watches you
        const mdx = a.x - mouse.x, mdy = a.y - mouse.y;
        const md2 = mdx * mdx + mdy * mdy;
        if (md2 < CURSOR_LINK * CURSOR_LINK) {
          const o = 0.20 * (1 - Math.sqrt(md2) / CURSOR_LINK);
          ctx.strokeStyle = 'rgba(242,242,239,' + o.toFixed(3) + ')';
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
        }
        ctx.fillStyle = 'rgba(242,242,239,0.35)';
        ctx.fillRect(a.x - a.r / 2, a.y - a.r / 2, a.r, a.r);
      }
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

/* coordinate cursor */
function initCursor() {
  if (!FINE_POINTER || REDUCED) return;
  const ax = document.getElementById('axX');
  const ay = document.getElementById('axY');
  const label = document.getElementById('coordLabel');
  if (!ax) return;
  let raf = null;
  window.addEventListener('mousemove', e => {
    document.body.classList.add('cursor-on');
    if (raf) return;
    raf = requestAnimationFrame(() => {
      ax.style.top = e.clientY + 'px';
      ay.style.left = e.clientX + 'px';
      label.style.left = (e.clientX + 14) + 'px';
      label.style.top = (e.clientY + 12) + 'px';
      label.textContent = '(' + e.clientX + ', ' + (window.innerHeight - e.clientY) + ')';
      raf = null;
    });
  });
  document.addEventListener('mouseleave', () => document.body.classList.remove('cursor-on'));
}

/* crow flybys */
function spawnCrow(opts) {
  if (REDUCED) return;
  const layer = document.getElementById('crowLayer');
  if (!layer) return;
  const o = opts || {};
  const size = o.size || (22 + Math.random() * 34);
  const rtl = o.rtl !== undefined ? o.rtl : Math.random() < 0.5;
  const top = o.top !== undefined ? o.top : (6 + Math.random() * 55);
  const dur = o.dur || (9 + Math.random() * 8);
  const flap = 0.38 + Math.random() * 0.3;
  const el = document.createElement('div');
  el.className = 'crow-flyer' + (rtl ? ' rtl' : '');
  el.style.top = top + 'vh';
  el.style.setProperty('--dur', dur + 's');
  el.style.setProperty('--flap', flap + 's');
  el.style.opacity = (0.35 + (size - 22) / 34 * 0.5).toFixed(2);
  el.innerHTML =
    '<div class="bob"><svg width="' + Math.round(size * 1.6) + '" height="' + size + '" viewBox="0 0 100 60">' +
    '<g class="wingL"><path d="M50 32 Q34 6 6 12 Q26 24 44 34 Z" fill="#f2f2ef"/></g>' +
    '<g class="wingR"><path d="M52 32 Q68 6 96 12 Q76 24 58 34 Z" fill="#f2f2ef"/></g>' +
    '<path d="M40 31 Q51 26 62 31 L74 30 L64 36 Q56 42 51 42 Q45 40 40 31 Z" fill="#f2f2ef"/>' +
    '</svg></div>';
  layer.appendChild(el);
  el.addEventListener('animationend', e => { if (e.target === el) el.remove(); });
  setTimeout(() => el.remove(), (dur + 1) * 1000);
}
function spawnCrowFlock(n) {
  for (let i = 0; i < n; i++) {
    setTimeout(() => spawnCrow({ rtl: Math.random() < 0.5 }), i * (300 + Math.random() * 500));
  }
}
function scheduleCrows() {
  if (REDUCED) return;
  setTimeout(function loop() {
    spawnCrow();
    setTimeout(loop, 16000 + Math.random() * 26000);
  }, 7000);
}

/* easter egg — type "corvus" */
function initEasterEgg() {
  let buf = '';
  document.addEventListener('keydown', e => {
    if (e.target && /INPUT|TEXTAREA/.test(e.target.tagName)) return;
    buf = (buf + e.key.toLowerCase()).slice(-6);
    if (buf === 'corvus') {
      buf = '';
      spawnCrowFlock(12);
      showToast('MURDER OF CROWS', '까마귀는 부름을 기억한다. 너를 부른 것이 우리가 아니라, 네가 우리를 불렀다는 것도.');
    }
  });
}

/* observation toast + idle watcher + tab title */
let toastTimer = null;
function showToast(tag, msg) {
  const t = document.getElementById('obsToast');
  if (!t) return;
  t.innerHTML = '<span class="toast-tag">' + tag + '</span>' + msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 7000);
}
function initWatcher() {
  let idleTimer = null;
  let warned = false;
  function arm() {
    clearTimeout(idleTimer);
    if (warned) return;
    idleTimer = setTimeout(() => {
      warned = true;
      showToast('OBS · PASSIVE', '…아직 화면 앞에 있는가. 관측은 상호적이다 — 네가 멈추면, 우리도 멈추지 않는다.');
      spawnCrow({ size: 40 });
    }, 50000);
  }
  ['mousemove', 'keydown', 'scroll', 'click', 'touchstart'].forEach(ev =>
    window.addEventListener(ev, () => { if (!warned) arm(); }, { passive: true })
  );
  arm();

  const origTitle = document.title;
  document.addEventListener('visibilitychange', () => {
    document.title = document.hidden ? '…어디로 갔는가 — ORDO ALGEBRAE' : origTitle;
  });
}

/* scroll progress */
function initScrollProgress() {
  const bar = document.getElementById('scrollProgress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const h = document.documentElement;
    const max = h.scrollHeight - h.clientHeight;
    bar.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + '%';
  }, { passive: true });
}

/* magnetic buttons */
function initMagnetic() {
  if (!FINE_POINTER || REDUCED) return;
  document.addEventListener('mousemove', e => {
    const btn = e.target.closest && e.target.closest('.btn');
    document.querySelectorAll('.btn._mag').forEach(b => {
      if (b !== btn) { b.style.transform = ''; b.classList.remove('_mag'); }
    });
    if (!btn) return;
    const r = btn.getBoundingClientRect();
    const dx = (e.clientX - (r.left + r.width / 2)) / r.width;
    const dy = (e.clientY - (r.top + r.height / 2)) / r.height;
    btn.classList.add('_mag');
    btn.style.transform = 'translate(' + (dx * 5).toFixed(1) + 'px,' + (dy * 4).toFixed(1) + 'px)';
  });
}

/* hero emblem parallax tilt */
function initTilt() {
  if (!FINE_POINTER || REDUCED) return;
  const em = document.querySelector('.hero-emblem');
  if (!em) return;
  window.addEventListener('mousemove', e => {
    if (!em.closest('.route.active')) return;
    const cx = window.innerWidth / 2, cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx, dy = (e.clientY - cy) / cy;
    em.style.transform = 'perspective(700px) rotateY(' + (dx * 7).toFixed(2) + 'deg) rotateX(' + (-dy * 7).toFixed(2) + 'deg)';
  });
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
  initNet();
  initCursor();
  initEasterEgg();
  initWatcher();
  initScrollProgress();
  initMagnetic();
  initTilt();
  scheduleCrows();
  navigate();
});

})();
