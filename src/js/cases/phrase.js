// ── Phrases ──────────────────────────────────────────────

var PHRASES = {
  ru: [
    'АККУРАТНЕЕ, БЕЗЫДЕЙНЫЙ',
    'ТВОРЮ И ВЫТВОРЯЮ',
    'ВАУ-ДИЗАЙНЕР'
  ],
  en: [
    'BE CAREFUL, CREATIVELESS',
    'I CREATE AND RECREATE',
    'WOW-DESIGNER'
  ]
};

var MODE_LABELS = {
  ru: { designer: '[ ДИЗАЙНЕР ]',   photographer: '[ ФОТОГРАФ ]'    },
  en: { designer: '[ DESIGNER ]',   photographer: '[ PHOTOGRAPHER ]' }
};


// ── Easing ────────────────────────────────────────────────

function easeOutQuart(p) {
  return 1 - Math.pow(1 - p, 4);
}

function easeOutCubic(p) {
  return 1 - Math.pow(1 - p, 3);
}


// ── Typewriter ────────────────────────────────────────────

var _lang        = 'ru';
var _phraseIndex = 0;
var _charIndex   = 0;
var _typing      = true;
var _typeTimer   = null;
var _typePaused  = true;

var TYPE_BASE    = 100;
var TYPE_JITTER  = 60;
var DEL_BASE     = 45;
var DEL_JITTER   = 20;
var PAUSE_AFTER  = 2000;
var PAUSE_BEFORE = 500;

function typeDelay(isTyping) {
  return isTyping
    ? TYPE_BASE + Math.random() * TYPE_JITTER
    : DEL_BASE  + Math.random() * DEL_JITTER;
}

function getCurrentPhrase() {
  return PHRASES[_lang][_phraseIndex];
}

function renderHero(text) {
  var base  = document.getElementById('hero-base');
  var green = document.getElementById('hero-green');
  var esc   = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  var html  = esc + '<span class="cursor"></span>';
  base.innerHTML  = html;
  green.innerHTML = html;
}

function typeStep() {
  if (_typePaused) return;
  var phrase = getCurrentPhrase();

  if (_typing) {
    _charIndex++;
    renderHero(phrase.slice(0, _charIndex));
    if (_charIndex >= phrase.length) {
      _typing    = false;
      _typeTimer = setTimeout(typeStep, PAUSE_AFTER);
    } else {
      _typeTimer = setTimeout(typeStep, typeDelay(true));
    }
  } else {
    _charIndex--;
    renderHero(phrase.slice(0, _charIndex));
    if (_charIndex <= 0) {
      _phraseIndex = (_phraseIndex + 1) % PHRASES[_lang].length;
      _typing      = true;
      _typeTimer   = setTimeout(typeStep, PAUSE_BEFORE);
    } else {
      _typeTimer = setTimeout(typeStep, typeDelay(false));
    }
  }
}

function startTypewriter() {
  clearTimeout(_typeTimer);
  _charIndex  = 0;
  _typing     = true;
  _typePaused = false;
  renderHero('');
  _typeTimer  = setTimeout(typeStep, PAUSE_BEFORE);
}


// ── Animate helpers ───────────────────────────────────────

// scaleX 0 → 1 из центра
function animateScaleIn(el, dur, onDone) {
  var start = null;
  requestAnimationFrame(function frame(ts) {
    if (!start) start = ts;
    var p = easeOutQuart(Math.min((ts - start) / dur, 1));
    el.style.transform = 'scaleX(' + p + ')';
    if (p < 1) {
      requestAnimationFrame(frame);
    } else {
      el.style.transform = 'scaleX(1)';
      if (onDone) onDone();
    }
  });
}

// fade opacity from → to
function fadeEl(el, dur, from, to, onDone) {
  var start = null;
  requestAnimationFrame(function frame(ts) {
    if (!start) start = ts;
    var p = easeOutCubic(Math.min((ts - start) / dur, 1));
    el.style.opacity = String(from + (to - from) * p);
    if (p < 1) {
      requestAnimationFrame(frame);
    } else {
      el.style.opacity = String(to);
      if (onDone) onDone();
    }
  });
}


// ── Intro ─────────────────────────────────────────────────
// Порядок:
//   0 ms  — горизонтальные линии расширяются из центра (750 ms)
// 350 ms  — кнопки designer/photographer и ru/en появляются (fade 450 ms)
// ~750 ms — после завершения линий: hero проявляется (400 ms), затем typewriter

var _introFinished = false;

function playIntro(onFinish) {

  var innerL   = document.querySelector('#mode-line-left .line-inner');
  var innerR   = document.querySelector('#mode-line-right .line-inner');
  var innerLng = document.querySelector('#lang-line .line-inner');
  var btnD     = document.getElementById('mode-designer');
  var btnP     = document.getElementById('mode-photographer');
  var btnRu    = document.getElementById('lang-ru');
  var btnEn    = document.getElementById('lang-en');
  var hero     = document.getElementById('hero');

  // Начальные состояния — всё скрыто
  if (btnD)   btnD.style.opacity   = '0';
  if (btnP)   btnP.style.opacity   = '0';
  if (btnRu)  btnRu.style.opacity  = '0';
  if (btnEn)  btnEn.style.opacity  = '0';
  if (hero)   hero.style.opacity   = '0';

  renderHero('');

  // После завершения линий — hero + typewriter
  function afterLines() {
    if (!hero) return;
    fadeEl(hero, 400, 0, 1, function() {
      _introFinished = true;
      if (onFinish) onFinish();
      startTypewriter();
    });
  }

  // 1. Линии из центра (только те что есть в DOM)
  var linesTotal   = 0;
  var linesDone    = 0;
  function onLineDone() { linesDone++; if (linesDone >= linesTotal) afterLines(); }

  if (innerL)   { linesTotal++; animateScaleIn(innerL,   750, onLineDone); }
  if (innerR)   { linesTotal++; animateScaleIn(innerR,   750, onLineDone); }
  if (innerLng) { linesTotal++; animateScaleIn(innerLng, 750, onLineDone); }

  // Если линий нет вообще — сразу показываем hero
  if (linesTotal === 0) { setTimeout(afterLines, 750); }

  // 2. Кнопки чуть позже старта линий
  setTimeout(function() {

    if (btnD)  { btnD.classList.add('active');  fadeEl(btnD,  450, 0, 1,   null); }
    if (btnP)  {                                fadeEl(btnP,  450, 0, 0.5, null); }
    if (btnRu) {
      if (_activeLang === 'ru') btnRu.classList.add('active');
      fadeEl(btnRu, 450, 0, _activeLang === 'ru' ? 1 : 0.5, null);
    }
    if (btnEn) {
      if (_activeLang === 'en') btnEn.classList.add('active');
      fadeEl(btnEn, 450, 0, _activeLang === 'en' ? 1 : 0.5, null);
    }

  }, 350);

}


// ── Mode switcher ─────────────────────────────────────────

var _activeMode    = 'designer';
var _modeSwitching = false;

function switchMode(mode) {
  if (_activeMode === mode || _modeSwitching) return;
  _modeSwitching = true;

  var btnD   = document.getElementById('mode-designer');
  var btnP   = document.getElementById('mode-photographer');
  var sweepL = document.getElementById('sweep-left');
  var sweepR = document.getElementById('sweep-right');

  if (mode === 'photographer') {
    btnP.classList.add('active');    fadeEl(btnP, 200, 0.5, 1,   null);
    btnD.classList.remove('active'); fadeEl(btnD, 200, 1,   0.5, null);
  } else {
    btnD.classList.add('active');    fadeEl(btnD, 200, 0.5, 1,   null);
    btnP.classList.remove('active'); fadeEl(btnP, 200, 1,   0.5, null);
  }

  var lineEl = mode === 'photographer'
    ? document.getElementById('mode-line-left')
    : document.getElementById('mode-line-right');
  var sweep  = mode === 'photographer' ? sweepL : sweepR;
  var lineW  = lineEl.offsetWidth;

  sweep.style.left    = '0';
  sweep.style.right   = 'auto';
  sweep.style.width   = '0';
  sweep.style.opacity = '1';

  var DUR   = 450;
  var start = null;

  requestAnimationFrame(function frame(ts) {
    if (!start) start = ts;
    var p = easeOutCubic(Math.min((ts - start) / DUR, 1));
    sweep.style.width   = (p * lineW) + 'px';
    sweep.style.opacity = String(1 - p);
    if (p < 1) {
      requestAnimationFrame(frame);
    } else {
      sweep.style.width   = '0';
      sweep.style.opacity = '0';
      _activeMode    = mode;
      _modeSwitching = false;
    }
  });
}


// ── Lang switcher ─────────────────────────────────────────

var _activeLang    = 'ru';
var _langSwitching = false;

function switchLang(lang) {

  // Во время intro переключение языка только меняет _lang и подписи,
  // не трогая opacity — чтобы не сломать анимацию появления.
  if (!_introFinished) {
    _lang       = lang;
    _activeLang = lang;
    var btnD = document.getElementById('mode-designer');
    var btnP = document.getElementById('mode-photographer');
    if (btnD) btnD.textContent = MODE_LABELS[lang].designer;
    if (btnP) btnP.textContent = MODE_LABELS[lang].photographer;
    return;
  }

  if (_activeLang === lang || _langSwitching) return;
  _langSwitching = true;

  var btnRu = document.getElementById('lang-ru');
  var btnEn = document.getElementById('lang-en');
  var btnD  = document.getElementById('mode-designer');
  var btnP  = document.getElementById('mode-photographer');

  if (lang === 'en') {
    if (btnEn) { btnEn.classList.add('active');    fadeEl(btnEn, 250, 0.5, 1,   null); }
    if (btnRu) { btnRu.classList.remove('active'); fadeEl(btnRu, 250, 1,   0.5, null); }
  } else {
    if (btnRu) { btnRu.classList.add('active');    fadeEl(btnRu, 250, 0.5, 1,   null); }
    if (btnEn) { btnEn.classList.remove('active'); fadeEl(btnEn, 250, 1,   0.5, null); }
  }

  if (btnD) btnD.textContent = MODE_LABELS[lang].designer;
  if (btnP) btnP.textContent = MODE_LABELS[lang].photographer;

  _lang          = lang;
  _activeLang    = lang;
  _langSwitching = false;

  _phraseIndex = 0;
  startTypewriter();
}


// ── Init ──────────────────────────────────────────────────

function init() {

  var btnD  = document.getElementById('mode-designer');
  var btnP  = document.getElementById('mode-photographer');
  var btnRu = document.getElementById('lang-ru');
  var btnEn = document.getElementById('lang-en');

  // Читаем сохранённый язык сразу — до intro, чтобы не было мелькания
  var _initLang = localStorage.getItem('portfolio_lang') || localStorage.getItem('userLanguage') || 'ru';
  if (_initLang !== 'ru') {
    _lang       = _initLang;
    _activeLang = _initLang;
  }

  if (btnD) btnD.textContent = MODE_LABELS[_lang].designer;
  if (btnP) btnP.textContent = MODE_LABELS[_lang].photographer;

  if (btnD) {
    btnD.addEventListener('click', function() {
      switchMode('designer');
    });
  }
  if (btnP) {
    btnP.addEventListener('click', function() {
      switchMode('photographer');
    });
  }
  if (btnRu) btnRu.addEventListener('click', function() { switchLang('ru'); });
  if (btnEn) btnEn.addEventListener('click', function() { switchLang('en'); });

  playIntro();
}

if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(init);
} else {
  window.addEventListener('load', init);
}


// ── Language persistence ──────────────────────────────────

(function() {

  var KEY = 'portfolio_lang';

  var _origSwitch = switchLang;

  switchLang = function(lang) {
    localStorage.setItem(KEY, lang);
    _origSwitch(lang);
  };

  // Язык применяется сразу в init() — дополнительный поллинг не нужен

})();