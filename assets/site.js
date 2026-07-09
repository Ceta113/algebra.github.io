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
function grantTier(t) { try { sessionStorage.setItem(TIER_KEY, String(t)); } catch (e) {} if (typeof DOSSIER === 'object' && t > DOSSIER.maxTier) dmark({ maxTier: t }); applyClearance(); }
function revokeTier() { try { sessionStorage.removeItem(TIER_KEY); } catch (e) {} applyClearance(); }

const TIER_NAMES = { 0: 'NO CLEARANCE', 1: 'ACCESS Ⅰ', 2: 'ACCESS Ⅱ', 3: 'ACCESS Ⅲ' };

/* ═══════════════ OBSERVER — visitor dossier ═══════════════ */
// The site's core premise made literal: it observes YOU and keeps a file.
// Persisted in localStorage so returning visitors are "remembered".
const DKEY = 'ordo_dossier';
function loadDossier() {
  let d;
  try { d = JSON.parse(localStorage.getItem(DKEY)); } catch (e) {}
  if (!d || typeof d !== 'object') {
    d = { firstSeen: Date.now(), visits: 0, routes: {}, foundConsole: false,
          firstCommand: null, commands: 0, veritas: false, ager: false,
          maxTier: 0, playedHymn: false, crows: 0, corvus: false,
          trialBest: 0, trialGrade: null, trialPlays: 0 };
  }
  if (d.trialBest === undefined) { d.trialBest = 0; d.trialGrade = null; d.trialPlays = 0; }
  return d;
}
let DOSSIER = loadDossier();
function saveDossier() { try { localStorage.setItem(DKEY, JSON.stringify(DOSSIER)); } catch (e) {} }
function dmark(patch) { Object.assign(DOSSIER, patch); saveDossier(); }
function droute(r) { DOSSIER.routes[r] = (DOSSIER.routes[r] || 0) + 1; saveDossier(); }

// deterministic pseudo-identity from firstSeen
function dHash() { let h = 2166136261 >>> 0; const s = String(DOSSIER.firstSeen); for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; } return h; }
function dCandidate() { return 'C-' + (200 + (dHash() % 800)); }
function dCoord() { const h = dHash(); return '(' + (((h >> 3) % 480) - 240) + ', ' + (((h >> 11) % 480) - 240) + ')'; }

function dossierAssessment() {
  const t = currentTier();
  const notes = [];
  if (DOSSIER.firstCommand === 'whoami')
    notes.push('첫 명령어가 <em>whoami</em>였다. 도구를 악용하기 전에 자신이 누구인지부터 물은 자. — 관측 우선순위 상향(#DBG-이상).');
  else if (DOSSIER.firstCommand === 'reset')
    notes.push('첫 명령어가 <em>reset</em>이었다. 흔적을 지우려는 본능. — 별도 분류.');
  else if (DOSSIER.firstCommand)
    notes.push('첫 명령어: <em>' + DOSSIER.firstCommand + '</em>. 기록되었다.');
  if (t >= 3) notes.push('까마귀의 언어(2진)로 가장 깊은 문을 열었다. 원점 후보 풀에 잠정 등재.');
  else if (t === 2) notes.push('서기의 언어(16진)를 읽었다. 제Ⅳ급 이상의 자질.');
  else if (t === 1) notes.push('육신의 언어로 첫 문을 열었다. 입회 후보 자격 확인.');
  if (DOSSIER.ager) notes.push('SIEVE의 최후 신호("ager")를 스스로 복호했다. 들판을 아는 자.');
  if (DOSSIER.playedHymn) notes.push('입회 전례 성가 〈Clavis Umbrae〉를 들었다. 아직 서약하지 않았음에도.');
  if (DOSSIER.corvus) notes.push('까마귀를 불렀다(<em>corvus</em>). 우리가 너를 부른 것이 아니라, 네가 우리를 불렀다.');
  const seen = Object.keys(DOSSIER.routes).length;
  if (seen >= 6) notes.push('표면의 모든 전각(殿閣)을 열람했다. 호기심은 소양이자 위험이다.');
  if (DOSSIER.visits >= 3) notes.push('세 번 이상 돌아왔다. 우연은 한 번, 습관은 세 번. — 관측을 유지한다.');
  if (DOSSIER.trialBest >= 800) notes.push('입회 시험에서 ' + DOSSIER.trialBest + '점(' + (DOSSIER.trialGrade || '') + '). <em>판별식 직관 검증 통과 — 기본 소양 제1항 충족.</em>');
  else if (DOSSIER.trialBest > 0) notes.push('입회 시험 최고 ' + DOSSIER.trialBest + '점(' + (DOSSIER.trialGrade || '') + '). 아직 제1항 충족에 미달 — 재응시를 권한다.');
  if (!notes.length) notes.push('아직 판단하기 이르다. 계속 지켜본다.');
  return notes;
}

function renderDossierDoc() {
  const t = currentTier();
  const since = new Date(DOSSIER.firstSeen);
  const pad = n => String(n).padStart(2, '0');
  const sinceStr = since.getFullYear() + '.' + pad(since.getMonth() + 1) + '.' + pad(since.getDate());
  const routesSeen = Object.keys(DOSSIER.routes);
  const rows = [
    ['최초 관측', sinceStr + ' (누적 방문 ' + DOSSIER.visits + '회)'],
    ['부여 식별', dCandidate() + ' · 좌표 ' + dCoord()],
    ['열람 등급', TIER_NAMES[t]],
    ['열람 전각', routesSeen.length + '/6 (' + (routesSeen.join(', ') || '—') + ')'],
    ['진단 콘솔', DOSSIER.foundConsole ? '발견함 · 명령 ' + DOSSIER.commands + '회' : '미발견'],
    ['복호 신호', (DOSSIER.veritas ? 'veritas ' : '') + (DOSSIER.ager ? 'ager' : '') || '없음'],
    ['성가 청취', DOSSIER.playedHymn ? '예' : '아니오'],
    ['까마귀 소환', DOSSIER.crows + '회' + (DOSSIER.corvus ? ' · corvus 부름 확인' : '')],
    ['입회 시험', DOSSIER.trialBest > 0 ? DOSSIER.trialBest + '점 · ' + DOSSIER.trialGrade + ' (' + DOSSIER.trialPlays + '회 응시)' : '미응시']
  ];
  const rowsHTML = rows.map(r => '<p style="margin:6px 0;"><em style="display:inline-block;min-width:96px;color:#77776f;font-weight:400;">' + r[0] + '</em> ' + r[1] + '</p>').join('');
  const notesHTML = dossierAssessment().map(n => '<p>· ' + n + '</p>').join('');
  return '<div class="doc-classification">관측 기록 · 귀하 전용 · OBSERVER FILE</div>'
    + '<div class="doc-stamp-big">Observed</div>'
    + '<div class="doc-title">' + dCandidate() + ' — 귀하에 관한 관측 기록</div>'
    + '<div class="doc-sub">본 파일은 귀하의 브라우저에만 존재한다. 우리는 아무것도 전송받지 않았다 — 그러나 <em>이만큼</em>은 안다.</div>'
    + '<div class="doc-body"><div class="mono" style="background:#e7e7e2;">' + rowsHTML + '</div>'
    + '<p style="margin-top:22px;font-family:\'Cinzel\',serif;font-size:0.7rem;letter-spacing:0.24em;color:#77776f;text-transform:uppercase;">Assessment · 평가</p>'
    + notesHTML
    + '<p style="margin-top:24px;color:#77776f;font-style:italic;">이 기록을 지우려면 진단 콘솔에 <span class="mono" style="display:inline;padding:2px 6px;">reset</span>. '
    + '그러나 기억하라 — 우리가 잊는 것과, 네가 지운 것은 다르다.</p></div>';
}

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
const ROUTES = ['home', 'codex', 'trial', 'registry', 'geometria', 'archive', 'signals', 'terminal'];
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
    droute(route);
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
  if (a.paused) { a.play(); if (id === 'clavis' && !DOSSIER.playedHymn) dmark({ playedHymn: true }); } else a.pause();
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
      dmark({ [key]: true });
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

let openDocFn = null; // lifted for diagnostic console
let openHTMLFn = null; // lifted for observer dossier

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
  openDocFn = openDoc;
  openHTMLFn = function (html) {
    paper.innerHTML = '<button class="doc-close" aria-label="close">✕</button>' + html;
    paper.querySelector('.doc-close').addEventListener('click', close);
    paper.classList.remove('slammed'); void paper.offsetWidth; paper.classList.add('slammed');
    viewer.classList.add('open'); document.body.style.overflow = 'hidden';
  };
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
  if (typeof DOSSIER === 'object') { DOSSIER.crows++; saveDossier(); }
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
      dmark({ corvus: true });
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

/* ═══════════════════ PROBATIO — discriminant trial ═══════════════════ */
const TRIAL_GRADES = [
  { min: 3000, name: '행렬', sub: 'Gradus Ⅳ · Custos', verdict: '판별식이 눈이 되었다. 이 속도는 훈련이 아니라 <em>천성</em>이다. 지부 수호자의 자질 — 회는 이미 너를 안다.' },
  { min: 1500, name: '함수', sub: 'Gradus Ⅲ · Operarius', verdict: '부호가 보이는 자다. 계산하지 않고 <em>선언</em>했다. 실무 단원의 자질 — 검은 봉투가 준비된다.' },
  { min: 800,  name: '변수', sub: 'Gradus Ⅱ · Initiatus', verdict: '기본 소양 제1항을 충족했다. <em>입회 후보 자격</em>이 확인되었다. 이제 남은 것은 침묵의 검증이다.' },
  { min: 300,  name: '계수', sub: 'Gradus Ⅰ · Observatus', verdict: '관측할 가치가 있다. 아직 즉답에 이르지 못했으나, 헛된 계산에 시간을 버리지는 않았다. — 관측 대상 등재.' },
  { min: 0,    name: '무명수', sub: 'Incognita', verdict: '아직은 근의 공식을 <em>외우는</em> 자다. 부호를 보는 눈은 반복으로 열린다. 다시 응시하라 — 문은 닫히지 않았다.' }
];
function trialGradeFor(score) { return TRIAL_GRADES.find(g => score >= g.min); }

function initTrial() {
  const root = document.getElementById('route-trial');
  if (!root) return;
  const $ = id => document.getElementById(id);
  const startS = $('trialStart'), playS = $('trialPlay'), endS = $('trialEnd');
  const eqEl = $('trialEq'), stage = $('trialStage'), fill = $('trialTimerfill'), tbar = $('trialTimerbar');
  const answers = Array.from(root.querySelectorAll('.trial-ans'));
  let mode = 'trial', muted = false;
  let cur = null, correctCount = 0, total = 0, score = 0, streak = 0, bestStreak = 0,
      level = 1, lives = 3, locked = false;
  let rafId = null, qStart = 0, qLimit = 0;

  // tiny WebAudio blip (never throws)
  let actx = null;
  function blip(freq, dur) {
    if (muted) return;
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      const o = actx.createOscillator(), g = actx.createGain();
      o.type = 'square'; o.frequency.value = freq;
      g.gain.value = 0.04; o.connect(g); g.connect(actx.destination);
      o.start(); g.gain.exponentialRampToValueAtTime(0.0001, actx.currentTime + (dur || 0.08));
      o.stop(actx.currentTime + (dur || 0.08));
    } catch (e) {}
  }

  const rint = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
  function fmtEq(a, b, c) {
    let s = '';
    s += (a === 1 ? '' : a === -1 ? '−' : (a < 0 ? '−' + Math.abs(a) : a)) + 'x<span class="sup2">2</span>';
    if (b !== 0) s += ' ' + (b < 0 ? '− ' : '+ ') + (Math.abs(b) === 1 ? '' : Math.abs(b)) + 'x';
    if (c !== 0) s += ' ' + (c < 0 ? '− ' : '+ ') + Math.abs(c);
    return s;
  }
  // generate a quadratic with a controlled discriminant outcome
  function genQ() {
    const mag = 2 + level;
    const maxA = level < 3 ? 1 : level < 6 ? 2 : 3;
    const roll = Math.random();
    const outcome = roll < 0.34 ? 'pos' : roll < 0.67 ? 'neg' : 'zero';
    let a, b, c;
    if (outcome === 'zero') {
      a = rint(1, maxA);
      const r = rint(1, Math.max(2, Math.floor(mag / 1.4))) * (Math.random() < 0.5 ? 1 : -1);
      b = -2 * a * r; c = a * r * r;
    } else if (outcome === 'pos') {
      a = rint(1, maxA);
      let p = rint(-mag, mag), q = rint(-mag, mag);
      while (p === q) q = rint(-mag, mag);
      b = -a * (p + q); c = a * p * q;
    } else { // neg: a>0, choose c above b^2/(4a)
      a = rint(1, maxA);
      b = rint(-mag, mag);
      const cmin = Math.floor((b * b) / (4 * a)) + 1;
      c = cmin + rint(0, mag);
    }
    if (level >= 7 && Math.random() < 0.4) { a = -a; b = -b; c = -c; } // sign-flip for reading difficulty
    return { a, b, c, outcome };
  }

  function updHUD() {
    $('hudLevel').textContent = level;
    $('hudScore').textContent = score;
    $('hudStreak').textContent = streak;
    let lv = ''; for (let i = 0; i < 3; i++) lv += i < lives ? '●' : '<span class="spent">●</span>';
    $('hudLives').innerHTML = mode === 'practice' ? '∞' : lv;
  }

  function nextQ() {
    locked = false;
    answers.forEach(b => b.classList.remove('correct', 'wrong', 'reveal-correct'));
    cur = genQ();
    eqEl.innerHTML = fmtEq(cur.a, cur.b, cur.c);
    if (mode === 'trial') {
      qLimit = Math.max(1800, 6000 - (level - 1) * 500); // ms
      qStart = performance.now();
      tbar.style.display = '';
      runTimer();
    } else {
      tbar.style.display = 'none';
    }
  }

  function runTimer() {
    cancelAnimationFrame(rafId);
    const tick = () => {
      const elapsed = performance.now() - qStart;
      const frac = Math.max(0, 1 - elapsed / qLimit);
      fill.style.transform = 'scaleX(' + frac + ')';
      tbar.classList.toggle('warn', frac < 0.34);
      if (frac <= 0) { timeout(); return; }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
  }

  function timeout() {
    if (locked) return;
    locked = true; cancelAnimationFrame(rafId);
    answers.find(b => b.dataset.ans === cur.outcome)?.classList.add('reveal-correct');
    blip(160, 0.16);
    stage.classList.remove('flash-bad'); void stage.offsetWidth; stage.classList.add('flash-bad');
    loseLife();
  }

  function answer(pick) {
    if (locked || !cur) return;
    locked = true; cancelAnimationFrame(rafId);
    total++;
    const right = pick === cur.outcome;
    const btn = answers.find(b => b.dataset.ans === pick);
    if (right) {
      correctCount++;
      const frac = mode === 'trial' ? Math.max(0, 1 - (performance.now() - qStart) / qLimit) : 0.5;
      const gain = 100 + Math.round(120 * frac) + streak * 15;
      score += gain; streak++; bestStreak = Math.max(bestStreak, streak);
      if (mode === 'trial' && correctCount % 5 === 0) level++;
      btn.classList.add('correct');
      blip(660, 0.07);
      stage.classList.remove('flash-ok'); void stage.offsetWidth; stage.classList.add('flash-ok');
      updHUD();
      setTimeout(() => { if (isActive()) nextQ(); }, 340);
    } else {
      streak = 0;
      btn.classList.add('wrong');
      answers.find(b => b.dataset.ans === cur.outcome)?.classList.add('reveal-correct');
      blip(160, 0.16);
      stage.classList.remove('flash-bad'); void stage.offsetWidth; stage.classList.add('flash-bad');
      loseLife();
    }
  }

  function loseLife() {
    if (mode === 'practice') { updHUD(); setTimeout(() => { if (isActive()) nextQ(); }, 700); return; }
    lives--; updHUD();
    if (lives <= 0) setTimeout(endGame, 700);
    else setTimeout(() => { if (isActive()) nextQ(); }, 700);
  }

  function isActive() { return playS.classList.contains('on'); }
  function show(el) { [startS, playS, endS].forEach(s => s.classList.remove('on')); el.classList.add('on'); }

  function start() {
    correctCount = total = score = streak = bestStreak = 0; level = 1; lives = 3; locked = false;
    updHUD(); show(playS); nextQ();
  }

  function endGame() {
    cancelAnimationFrame(rafId);
    show(endS);
    const g = trialGradeFor(score);
    const acc = total ? Math.round((correctCount / total) * 100) : 0;
    $('endGrade').textContent = g.name;
    $('endGradeSub').textContent = g.sub;
    $('endScore').textContent = score;
    $('endCorrect').textContent = correctCount;
    $('endStreak').textContent = bestStreak;
    $('endLevel').textContent = level;
    $('endAcc').textContent = acc + '%';
    $('endVerdict').innerHTML = g.verdict;
    let nb = '';
    if (mode === 'trial') {
      DOSSIER.trialPlays++;
      if (score > DOSSIER.trialBest) { DOSSIER.trialBest = score; DOSSIER.trialGrade = g.name; nb = '<span class="trial-newbest">New Best · 최고 기록 갱신</span>'; }
      saveDossier();
    } else {
      $('endGradeSub').textContent = 'Practice · 연습 (기록 없음)';
      $('endVerdict').innerHTML = '연습 정확도 ' + acc + '%. 시험 모드에서 <em>시간 압박</em>을 이겨야 진짜 소양이다.';
    }
    $('endNewBest').innerHTML = nb;
    renderBest();
  }

  function renderBest() {
    const el = $('trialBest');
    if (!el) return;
    el.innerHTML = DOSSIER.trialBest > 0
      ? '최고 기록 <b>' + DOSSIER.trialBest + '</b>점 · 등급 <b>' + DOSSIER.trialGrade + '</b> · 응시 ' + DOSSIER.trialPlays + '회'
      : '최고 기록 없음 — 아직 시험받지 않았다.';
  }

  // wiring
  root.querySelectorAll('.trial-mode').forEach(m => m.addEventListener('click', () => {
    root.querySelectorAll('.trial-mode').forEach(x => x.classList.remove('sel'));
    m.classList.add('sel'); mode = m.dataset.mode;
    $('trialStartBtn').textContent = mode === 'practice' ? '연습 시작' : '시험 시작';
  }));
  $('trialStartBtn').addEventListener('click', start);
  $('trialRetry').addEventListener('click', () => show(startS));
  $('trialQuit').addEventListener('click', () => { if (mode === 'trial' && score > 0) endGame(); else show(startS); });
  $('trialMute').addEventListener('click', () => { muted = !muted; $('trialMute').textContent = muted ? '🔇' : '🔈'; });
  answers.forEach(b => b.addEventListener('click', () => answer(b.dataset.ans)));
  document.addEventListener('keydown', e => {
    if (!isActive()) return;
    if (e.key === '1') answer('pos');
    else if (e.key === '2') answer('zero');
    else if (e.key === '3') answer('neg');
  });
  // leaving the route ends any run cleanly
  window.addEventListener('hashchange', () => { if (routeFromHash() !== 'trial') { cancelAnimationFrame(rafId); if (isActive()) show(startS); } });
  renderBest();
}

/* ═══════════════════ DIAGNOSTIC CONSOLE (debug) ═══════════════════ */
// In-world: 관측 부서 진단 콘솔이 표면 빌드에 유출됨. Real: dev/debug tool.
const BUILD = 'v389.7 · surface';
function initDiag() {
  const panel = document.getElementById('diag');
  if (!panel) return;
  const logEl = document.getElementById('diagLog');
  const inEl = document.getElementById('diagIn');
  const stateEl = document.getElementById('diagState');

  const enc = (w, base) => Array.from(String(w)).map(c => c.charCodeAt(0).toString(base).padStart(base === 2 ? 8 : 2, '0')).join(' ');
  const log = (t, cls) => {
    const d = document.createElement('div');
    if (cls) d.className = cls;
    d.textContent = t;
    logEl.appendChild(d); logEl.scrollTop = logEl.scrollHeight;
  };
  const audioLine = () => {
    if (!currentId) return 'idle';
    const a = audioMap[currentId];
    return currentId + (a.paused ? ' ⏸ ' : ' ▶ ') + fmt(a.currentTime) + '/' + fmt(a.duration);
  };
  function renderState() {
    const t = currentTier();
    stateEl.innerHTML =
      '<div><span class="k">BUILD</span><span class="v">' + BUILD + '</span></div>' +
      '<div><span class="k">ROUTE</span><span class="v">#/' + routeFromHash() + '</span></div>' +
      '<div><span class="k">CLEARANCE</span><span class="v ' + (t ? '' : 'warn') + '">' + TIER_NAMES[t] + ' (' + t + ')</span></div>' +
      '<div><span class="k">AUDIO</span><span class="v">' + audioLine() + '</span></div>' +
      '<div><span class="k">DECODE</span><span class="v">veritas:' + (PUZZLES.veritas.done ? '✓' : '·') + '  ager:' + (PUZZLES.ager.done ? '✓' : '·') + '</span></div>' +
      '<div><span class="k">CROWS</span><span class="v">' + document.querySelectorAll('.crow-flyer').length + ' aloft</span></div>' +
      '<div><span class="k">MOTION</span><span class="v">' + (REDUCED ? 'reduced' : 'full') + '</span></div>';
  }

  const open = () => { panel.classList.add('open'); if (!DOSSIER.foundConsole) dmark({ foundConsole: true }); renderState(); setTimeout(() => inEl.focus(), 200); };
  const close = () => panel.classList.remove('open');
  const toggle = () => panel.classList.contains('open') ? close() : open();
  window.__diagToggle = toggle;

  const COMMANDS = {
    help() {
      log('COMMANDS —', 'ok');
      log('  tier <0-3>       열람 등급 설정 (평문/16진/2진 없이 즉시)');
      log('  go <route>       라우트 이동 (home codex registry geometria archive signals terminal)');
      log('  doc <id>         흑서고 문서 열기 (descartes boole schism lindemann sieve omega galois …)');
      log('  reveal           모든 검열(redacted) 해제');
      log('  crow [n]         까마귀 소환');
      log('  hex <말> / bin <말>   서기·까마귀 언어 변환기');
      log('  decode           감청 퍼즐(veritas·ager) 즉시 해결');
      log('  audio play|pause|clavis|glass');
      log('  file / dossier   귀하에 관한 관측 기록 열람');
      log('  whoami           관측 상태 조회');
      log('  reset            세션 초기화(부팅·등급·퍼즐) 후 새로고침');
      log('  clear            로그 지우기');
    },
    tier(a) {
      const n = parseInt(a, 10);
      if (![0,1,2,3].includes(n)) return log('✕ tier 0..3', 'bad');
      if (n === 0) revokeTier(); else grantTier(n);
      log('→ CLEARANCE = ' + TIER_NAMES[n], 'ok'); renderState();
    },
    go(a) {
      if (!ROUTES.includes(a)) return log('✕ unknown route: ' + a, 'bad');
      location.hash = '#/' + a; log('→ #/' + a, 'ok'); setTimeout(renderState, 300);
    },
    doc(a) {
      if (!a) return log('✕ doc <id>', 'bad');
      if (routeFromHash() !== 'archive') location.hash = '#/archive';
      log('→ opening doc: ' + a, 'ok');
      close(); // panel would cover the viewer otherwise
      setTimeout(() => { if (!openDocFn) return; openDocFn(a); }, 160);
    },
    reveal() {
      document.querySelectorAll('.clearance-reveal').forEach(el => el.classList.add('revealed'));
      log('→ all redactions lifted (visual only)', 'ok');
    },
    crow(a) { const n = Math.max(1, Math.min(20, parseInt(a, 10) || 1)); spawnCrowFlock(n); log('→ ' + n + ' crow(s)', 'ok'); },
    hex(a) { if (!a) return log('✕ hex <word>', 'bad'); log(a + ' → ' + enc(a, 16), 'ok'); },
    bin(a) { if (!a) return log('✕ bin <word>', 'bad'); log(a + ' → ' + enc(a, 2), 'ok'); },
    decode() { PUZZLES.veritas.done = true; PUZZLES.ager.done = true; dmark({ veritas: true, ager: true }); log('→ intercepts T-093·T-101 marked decoded', 'ok'); renderState(); },
    file() { log('→ opening YOUR observation file…', 'ok'); close(); setTimeout(() => { if (openHTMLFn) openHTMLFn(renderDossierDoc()); }, 160); },
    dossier() { this.file(); },
    audio(a) {
      if (a === 'play' || a === 'pause') { if (currentId) { const x = audioMap[currentId]; a === 'play' ? x.play() : x.pause(); } }
      else if (a === 'clavis' || a === 'glass') { toggle_(a); }
      log('→ audio ' + (a || ''), 'ok'); renderState();
      function toggle_(id){ if (currentId && currentId!==id) audioMap[currentId].pause(); currentId=id; audioMap[id].play(); }
    },
    whoami() {
      log('식별 ' + dCandidate() + ' · 좌표 ' + dCoord() + ' · 등급 ' + TIER_NAMES[currentTier()], 'ok');
      log('최초 관측 이래 ' + DOSSIER.visits + '회 방문 · 열람 전각 ' + Object.keys(DOSSIER.routes).length + '/6');
      dossierAssessment().slice(0, 2).forEach(n => log('· ' + n.replace(/<[^>]+>/g, '')));
      log('전체 기록: `file` 입력. 이 콘솔은 관측 부서 도구다 — 지금 이 조회 또한 기록되었다.');
    },
    reset() {
      try { sessionStorage.clear(); localStorage.removeItem(DKEY); } catch (e) {}
      log('→ session + observation file cleared. reloading…', 'ok'); setTimeout(() => location.reload(), 600);
    },
    clear() { logEl.innerHTML = ''; }
  };

  function run(raw) {
    const line = raw.trim(); if (!line) return;
    log('> ' + line, 'cmd');
    const [cmd, ...rest] = line.split(/\s+/);
    const lc = cmd.toLowerCase();
    if (!DOSSIER.firstCommand) dmark({ firstCommand: lc });
    DOSSIER.commands++; saveDossier();
    const fn = COMMANDS[lc];
    if (fn) { try { fn(rest.join(' ')); } catch (e) { log('✕ ' + e.message, 'bad'); } }
    else log('✕ unknown: ' + cmd + '  (help)', 'bad');
  }

  document.getElementById('diagRun').addEventListener('click', () => { run(inEl.value); inEl.value = ''; });
  inEl.addEventListener('keydown', e => { if (e.key === 'Enter') { run(inEl.value); inEl.value = ''; } if (e.key === 'Escape') close(); });
  panel.querySelector('.x').addEventListener('click', close);
  document.getElementById('diagHint')?.addEventListener('click', open);
  panel.querySelectorAll('.diag-btn').forEach(b => b.addEventListener('click', () => { run(b.dataset.cmd); }));

  // toggle via backtick (when not typing) or Ctrl/Cmd+`
  document.addEventListener('keydown', e => {
    const typing = e.target && /INPUT|TEXTAREA/.test(e.target.tagName);
    if (e.key === '`' && (!typing || e.target === inEl ? e.target !== inEl : false)) { /* noop guard */ }
    if (e.key === '`' && !typing) { e.preventDefault(); toggle(); }
  });

  log('DIAGNOSTIC CONSOLE — 관측 부서 진단 콘솔.', 'ok');
  log('내부 빌드가 표면에 유출되었습니다. `help` 입력.');
  renderState();
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
  initTrial();
  initDiag();
  DOSSIER.visits++; saveDossier();
  scheduleCrows();
  navigate();
});

})();
