(function () {

  // ── Parallax multi-slide ──────────────────────────────

  var slides = Array.prototype.slice.call(document.querySelectorAll('.slide'));
  var N      = slides.length;

  if (N < 2) return;

  slides.forEach(function (el, i) {
    el.style.zIndex = String(i + 1);
  });

  var progress  = 0;
  var target    = 0;
  var rafId     = null;
  var snapTimer = null;
  var snapping  = false;

  var LERP      = 0.11;
  var SNAP_LERP = 0.09;
  var PARALLAX  = 0.35;
  var THRESHOLD = 0.5;

  function apply(p) {
    slides.forEach(function (el, i) {
      var ty;
      if (i === 0) {
        ty = -Math.min(p, 1) * PARALLAX * 100;
      } else {
        var entry = p - (i - 1);
        if (entry <= 0) {
          ty = 100;
        } else if (entry <= 1) {
          ty = (1 - entry) * 100;
        } else {
          ty = -Math.min(entry - 1, 1) * PARALLAX * 100;
        }
      }
      el.style.transform = 'translateY(' + ty + '%)';
    });
  }

  function tick() {
    var speed = snapping ? SNAP_LERP : LERP;
    var diff  = target - progress;
    if (Math.abs(diff) < 0.0003) {
      progress = target;
      apply(progress);
      rafId = null;
      return;
    }
    progress += diff * speed;
    apply(progress);
    rafId = requestAnimationFrame(tick);
  }

  function run() {
    if (!rafId) rafId = requestAnimationFrame(tick);
  }

  function scheduleSnap() {
    clearTimeout(snapTimer);
    snapTimer = setTimeout(function () {
      snapping = true;
      var frac = progress - Math.floor(progress);
      target   = frac >= THRESHOLD ? Math.ceil(progress) : Math.floor(progress);
      target   = Math.max(0, Math.min(N - 1, target));
      run();
    }, 160);
  }

  window.addEventListener('wheel', function (e) {
    e.preventDefault();
    snapping = false;
    clearTimeout(snapTimer);
    var dy = e.deltaY;
    if (e.deltaMode === 1) dy *= 32;
    if (e.deltaMode === 2) dy *= 300;
    target += dy / window.innerHeight;
    target  = Math.max(0, Math.min(N - 1, target));
    run();
    scheduleSnap();
  }, { passive: false });

  var touchY = null;

  window.addEventListener('touchstart', function (e) {
    touchY   = e.touches[0].clientY;
    snapping = false;
    clearTimeout(snapTimer);
  }, { passive: true });

  window.addEventListener('touchmove', function (e) {
    if (touchY === null) return;
    e.preventDefault();
    var dy = touchY - e.touches[0].clientY;
    touchY = e.touches[0].clientY;
    target += dy / window.innerHeight;
    target  = Math.max(0, Math.min(N - 1, target));
    run();
  }, { passive: false });

  window.addEventListener('touchend', function () {
    touchY = null;
    scheduleSnap();
  });

  window.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
      e.preventDefault();
      snapping = true;
      target   = Math.min(Math.round(progress) + 1, N - 1);
      run();
    }
    if (e.key === 'ArrowUp' || e.key === 'PageUp') {
      e.preventDefault();
      snapping = true;
      target   = Math.max(Math.round(progress) - 1, 0);
      run();
    }
  });

  apply(0);


  // ── Синхронизация высоты левой колонки с медиа ────────
  // После загрузки медиа (.case-media) берём её реальную высоту
  // и выставляем её же на .case-left — тогда кнопка точно по низу медиа.

  function syncCardHeights() {
    var cards = document.querySelectorAll('.case-card');
    cards.forEach(function (card) {
      var media = card.querySelector('.case-media');
      var left  = card.querySelector('.case-left');
      if (!media || !left) return;

      function doSync() {
        var h = media.offsetHeight;
        if (h > 0) left.style.height = h + 'px';
      }

      if (media.tagName === 'VIDEO') {
        if (media.readyState >= 1) {
          doSync();
        } else {
          media.addEventListener('loadedmetadata', doSync);
        }
      } else {
        if (media.complete && media.naturalHeight > 0) {
          doSync();
        } else {
          media.addEventListener('load', doSync);
        }
      }
    });
  }

  window.addEventListener('load', syncCardHeights);
  window.addEventListener('resize', syncCardHeights);


  // ── i18n: перевод карточек ────────────────────────────

  function applyLangToCards(lang) {
    var els = document.querySelectorAll('[data-ru][data-en]');
    for (var i = 0; i < els.length; i++) {
      var val = els[i].getAttribute('data-' + lang);
      if (val !== null) els[i].textContent = val;
    }
    // После перевода текст мог изменить высоту — пересинхронизируем
    syncCardHeights();
  }

  applyLangToCards('ru');

  // Перехватываем switchLang из phrase.js
  if (typeof switchLang === 'function') {
    var _orig = switchLang;
    switchLang = function (lang) {
      _orig(lang);
      applyLangToCards(lang);
      updateOverlayLang(lang);
    };
  }


  // ── Overlay lang-switcher (независимый от phrase.js) ──
  // phrase.js управляет #lang-ru / #lang-en внутри #phrase-screen.
  // Здесь управляем #lang-ru-fixed / #lang-en-fixed в overlay.

  var btnRuFixed = document.getElementById('lang-ru-fixed');
  var btnEnFixed = document.getElementById('lang-en-fixed');
  var _overlayLang = 'ru';

  function updateOverlayLang(lang) {
    _overlayLang = lang;
    if (lang === 'ru') {
      btnRuFixed.classList.add('active');
      btnEnFixed.classList.remove('active');
    } else {
      btnEnFixed.classList.add('active');
      btnRuFixed.classList.remove('active');
    }
  }

  updateOverlayLang('ru');

  if (btnRuFixed) {
    btnRuFixed.addEventListener('click', function () {
      if (typeof switchLang === 'function') switchLang('ru');
    });
  }

  if (btnEnFixed) {
    btnEnFixed.addEventListener('click', function () {
      if (typeof switchLang === 'function') switchLang('en');
    });
  }

}());

// Добавить внутрь IIFE (после syncCardHeights или в конце)

function syncCategoriesWidth() {
  var cards = document.querySelectorAll('.case-card');
  cards.forEach(function (card) {
    var title = card.querySelector('.case-title');
    var cats  = card.querySelector('.case-cats');
    if (!title || !cats) return;
    var titleWidth = title.offsetWidth;
    if (titleWidth > 0) {
      cats.style.width = titleWidth + 'px';
    }
  });
}

// Вызываем после загрузки, ресайза и смены языка
window.addEventListener('load', syncCategoriesWidth);
window.addEventListener('resize', syncCategoriesWidth);

// Дополним applyLangToCards, чтобы после перевода тоже синхронизировать
function applyLangToCards(lang) {
  var els = document.querySelectorAll('[data-ru][data-en]');
  for (var i = 0; i < els.length; i++) {
    var val = els[i].getAttribute('data-' + lang);
    if (val !== null) els[i].textContent = val;
  }
  syncCardHeights();
  syncCategoriesWidth();  // добавить эту строку
}

// ── Навигация на страницу фотографа ──────────────────────

document.addEventListener('DOMContentLoaded', function () {
  var btnP = document.getElementById('mode-photographer');
  if (btnP) {
    btnP.addEventListener('click', function () {
      setTimeout(function () {
        window.location.href = 'photographer.html?mode=photographer';
      }, 300);
    });
  }
});