// ================================
// main.js
// (объединено: main.js + main-responsive-patch.js)
// ================================

import './cursor.js'
import './language.js'

// ── Элементы ──────────────────────────────────────────────────────────────
var canvas    = document.getElementById('pixelCanvas');
var ctx       = canvas.getContext('2d');
var btn       = document.getElementById('btn');
var btnRu     = document.getElementById('lang-ru');
var btnEn     = document.getElementById('lang-en');
var lineLeft  = document.getElementById('line-left');
var lineRight = document.getElementById('line-right');
var fillLeft  = document.getElementById('fill-left');
var fillRight = document.getElementById('fill-right');

// ── Язык ──────────────────────────────────────────────────────────────────
var currentLang = localStorage.getItem('userLanguage') || 'ru';

function applyTranslations(lang) {
  document.querySelectorAll('[data-ru], [data-en]').forEach(function(el) {
    var t = el.getAttribute('data-' + lang);
    if (t !== null) el.textContent = t;
  });
  document.documentElement.lang = lang;
}

function updateLangUI(lang) {
  btnRu.classList.toggle('active',   lang === 'ru');
  btnRu.classList.toggle('inactive', lang !== 'ru');
  btnEn.classList.toggle('active',   lang === 'en');
  btnEn.classList.toggle('inactive', lang !== 'en');
  lineLeft.classList.toggle('is-active',  lang === 'ru');
  lineRight.classList.toggle('is-active', lang === 'en');
  document.body.setAttribute('data-lang', lang);
}

window.addEventListener('storage', function(e) {
  if (e.key === 'userLanguage' && e.newValue && e.newValue !== currentLang) {
    currentLang = e.newValue;
    updateLangUI(currentLang);
    applyTranslations(currentLang);
    setFillImmediate('left',  currentLang === 'ru' ? 100 : 0);
    setFillImmediate('right', currentLang === 'en' ? 100 : 0);
  }
});

// ── Анимация fill ─────────────────────────────────────────────────────────
var lineState = {
  left:  { current: 0, target: 0, raf: null },
  right: { current: 0, target: 0, raf: null }
};

var FILL_SPEED = 250; // % в секунду

function getFillEl(side) {
  return side === 'left' ? fillLeft : fillRight;
}

// Заглушка — переопределяется патчем для адаптива
function isVerticalLayout() {
  return false;
}

// Единая точка записи fill: width или height в зависимости от layout
function applyFill(el, pct) {
  if (isVerticalLayout()) {
    el.style.width  = '';
    el.style.height = pct + '%';
  } else {
    el.style.height = '';
    el.style.width  = pct + '%';
  }
}

function setFillImmediate(side, pct) {
  lineState[side].current = pct;
  lineState[side].target  = pct;
  applyFill(getFillEl(side), pct);
}

function animateFill(side, targetPct, onComplete) {
  var state = lineState[side];
  var fill  = getFillEl(side);
  if (state.raf) cancelAnimationFrame(state.raf);
  state.target = targetPct;
  var last = null;

  function step(ts) {
    if (!last) last = ts;
    var dt      = (ts - last) / 1000;
    last = ts;
    var dist    = state.target - state.current;
    var maxStep = FILL_SPEED * dt;

    if (Math.abs(dist) <= maxStep) {
      state.current = state.target;
      applyFill(fill, state.current);
      state.raf = null;
      if (onComplete) onComplete();
      return;
    }
    state.current += dist > 0 ? maxStep : -maxStep;
    applyFill(fill, state.current);
    state.raf = requestAnimationFrame(step);
  }

  state.raf = requestAnimationFrame(step);
}

// ── Логика языка ──────────────────────────────────────────────────────────
function setLang(lang) {
  if (lang === currentLang) return;

  var side    = lang === 'ru' ? 'left'  : 'right';
  var oppSide = lang === 'ru' ? 'right' : 'left';

  // Обновляем состояние сразу, чтобы hover не конфликтовал с анимацией
  currentLang = lang;
  localStorage.setItem('userLanguage', currentLang);
  updateLangUI(currentLang);
  applyTranslations(currentLang);

  animateFill(oppSide, 0);
  animateFill(side, 100);
}

function onHoverEnter(side) {
  var lang = side === 'left' ? 'ru' : 'en';
  if (lang === currentLang) return;
  animateFill(side, 50);
}

function onHoverLeave(side) {
  var lang = side === 'left' ? 'ru' : 'en';
  if (lang === currentLang) return;
  animateFill(side, 0);
}

// ── События ───────────────────────────────────────────────────────────────
btnRu.addEventListener('click',      function() { setLang('ru'); });
btnEn.addEventListener('click',      function() { setLang('en'); });
btnRu.addEventListener('mouseenter', function() { onHoverEnter('left'); });
btnRu.addEventListener('mouseleave', function() { onHoverLeave('left'); });
btnEn.addEventListener('mouseenter', function() { onHoverEnter('right'); });
btnEn.addEventListener('mouseleave', function() { onHoverLeave('right'); });

// Инициализация
updateLangUI(currentLang);
applyTranslations(currentLang);
setFillImmediate('left',  currentLang === 'ru' ? 100 : 0);
setFillImmediate('right', currentLang === 'en' ? 100 : 0);

// ── Пиксельная заливка ────────────────────────────────────────────────────
var PIXEL    = 20;
var DURATION = 1000;

var cols, rows, cells;
var animFrame       = null;
var currentProgress = 0;
var targetProgress  = 0;
var lastTimestamp   = null;
var hasFilledOnce   = false;
var filledSet       = new Set();

function setup() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
  cols = Math.ceil(canvas.width  / PIXEL) + 1;
  rows = Math.ceil(canvas.height / PIXEL) + 1;

  var cx = cols / 2, cy = rows / 2;
  cells = [];
  for (var r = 0; r < rows; r++) {
    for (var c = 0; c < cols; c++) {
      var dx = c - cx, dy = r - cy;
      var dist = Math.max(Math.abs(dx), Math.abs(dy)) * 0.65
               + Math.sqrt(dx*dx + dy*dy) * 0.35;
      cells.push({ c: c, r: r, dist: dist });
    }
  }
  cells.sort(function(a, b) {
    var d = a.dist - b.dist;
    return Math.abs(d) < 1.0 ? Math.random() - 0.5 : d;
  });
}

function draw() {
  var count = Math.floor(currentProgress * cells.length);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#202020';
  filledSet.clear();
  for (var i = 0; i < count; i++) {
    ctx.fillRect(cells[i].c * PIXEL, cells[i].r * PIXEL, PIXEL, PIXEL);
    filledSet.add(cells[i].c + ',' + cells[i].r);
  }
  if (currentProgress >= 0.99) document.body.classList.add('filled');
}

function tick(ts) {
  if (!lastTimestamp) lastTimestamp = ts;
  var dt   = ts - lastTimestamp;
  lastTimestamp = ts;
  var step = dt / DURATION;

  currentProgress = targetProgress > currentProgress
    ? Math.min(currentProgress + step, targetProgress)
    : Math.max(currentProgress - step, targetProgress);

  draw();

  if (Math.abs(currentProgress - targetProgress) > 0.001) {
    animFrame = requestAnimationFrame(tick);
  } else {
    currentProgress = targetProgress;
    draw();
    animFrame = lastTimestamp = null;
  }
}

function startPixelAnim() {
  if (animFrame) cancelAnimationFrame(animFrame);
  lastTimestamp = null;
  animFrame = requestAnimationFrame(tick);
}

var cursorInside = false;

document.addEventListener('mousemove', function(e) {
  if (hasFilledOnce) return;

  var col     = Math.floor(e.clientX / PIXEL);
  var row     = Math.floor(e.clientY / PIXEL);
  var onBlack = filledSet.has(col + ',' + row);
  var r       = btn.getBoundingClientRect();
  var onBtn   = e.clientX >= r.left && e.clientX <= r.right
             && e.clientY >= r.top  && e.clientY <= r.bottom;
  var active  = onBtn || onBlack;

  document.body.classList.toggle('cursor-active', active);

  if (active && !cursorInside) {
    cursorInside = true;
    targetProgress = 1;
    startPixelAnim();
  } else if (!active && cursorInside) {
    cursorInside = false;
    if (currentProgress >= 0.99) {
      hasFilledOnce = true;
      currentProgress = targetProgress = 1;
      draw();
    } else {
      targetProgress = 0;
      startPixelAnim();
    }
  }
});

window.addEventListener('resize', function() {
  setup();
  if (!hasFilledOnce) {
    currentProgress = targetProgress = 0;
    filledSet.clear();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    document.body.classList.remove('filled');
  } else {
    currentProgress = 1;
    draw();
  }
});

setup();
// --- из main-responsive-patch.js ---

// screen-link блокирует клики на btn до полной заливки — отключаем его сразу
var screenLink = document.getElementById('screen-link');
if (screenLink) screenLink.style.pointerEvents = 'none';

// Активируем screen-link только когда заливка завершена
var _slActivated = false;
var _origDraw = draw;
draw = function() {
  _origDraw();
  if (!_slActivated && currentProgress >= 0.99 && screenLink) {
    _slActivated = true;
    screenLink.style.pointerEvents = 'auto';
  }
};
// ══════════════════════════════════════════════════════
// PATCH: подключается ПОСЛЕ main.js
// Адаптив: вертикальные линии + тап по кнопке = пиксельная заливка → переход
// ══════════════════════════════════════════════════════

// Переопределяем заглушку из main.js
isVerticalLayout = function() {
  return window.matchMedia('(max-width: 1024px)').matches;
};

// Пересчитываем fill при смене ориентации/размера
window.addEventListener('resize', function() {
  setFillImmediate('left',  currentLang === 'ru' ? 100 : 0);
  setFillImmediate('right', currentLang === 'en' ? 100 : 0);
});

// Применяем правильный режим (vertical/horizontal) сразу при загрузке патча
setFillImmediate('left',  currentLang === 'ru' ? 100 : 0);
setFillImmediate('right', currentLang === 'en' ? 100 : 0);

// ── Тап по кнопке на адаптиве: пиксельная заливка → переход ──

var _mobileTransitioning = false;

btn.addEventListener('click', function(e) {
  e.preventDefault();
  if (_mobileTransitioning) return;
  _mobileTransitioning = true;

  var dest = btn.getAttribute('href') || '/choice.html';

  // Уже полностью залито — переходим сразу
  if (hasFilledOnce && currentProgress >= 0.99) {
    window.location.href = dest;
    return;
  }

  hasFilledOnce  = true;
  targetProgress = 1;

  if (animFrame) cancelAnimationFrame(animFrame);
  lastTimestamp = null;

  var _lastTs = null;

  function fillTick(ts) {
    if (!_lastTs) _lastTs = ts;
    var dt  = ts - _lastTs;
    _lastTs = ts;
    currentProgress = Math.min(currentProgress + dt / DURATION, 1);
    draw();

    if (currentProgress < 0.999) {
      animFrame = requestAnimationFrame(fillTick);
    } else {
      currentProgress = 1;
      draw();
      animFrame = null;
      setTimeout(function() {
        window.location.href = dest;
      }, 200);
    }
  }

  animFrame = requestAnimationFrame(fillTick);
});