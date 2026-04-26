/**
 * cursor.js  v3
 * Подключи перед </body>: <script src="cursor.js"></script>
 *
 * ── Система масштабирования ────────────────────────────────────────────────
 * Контейнер курсора всегда 92×92px. Размер управляется через
 * transform: scale(), что даёт анимацию исключительно на GPU
 * без пересчёта layout.
 *
 *   default → scale(0.435)  ≈ 40px
 *   button  → scale(0.695)  ≈ 64px
 *   media   → scale(1.000)  = 92px
 *
 * ── Хореография точка ↔ надпись ──────────────────────────────────────────
 * Переход default→media:
 *   0ms   — точка схлопывается (scale 0)
 *   160ms — надпись появляется (scale 1 + opacity 1)
 *
 * Переход media→default:
 *   0ms   — надпись исчезает (opacity 0 + scale 0)
 *   150ms — точка появляется (scale 1)
 *
 * ── Автоопределение контраста ──────────────────────────────────────────────
 * Каждый кадр: elementFromPoint → findBG → luma (WCAG) → theme-dark/light
 *
 * ── Атрибуты ──────────────────────────────────────────────────────────────
 *   data-cursor="button"           — кнопка
 *   data-cursor="media"            — медиа (фото/видео)
 *   data-cursor-label="СМОТРЕТЬ"   — кастомный текст
 *   data-cursor-bg="#rrggbb"       — явный цвет фона секции
 */

(function () {
  'use strict';

  /* ─────────────────────────────────────────────────────────────────────────
     1. DOM
     ───────────────────────────────────────────────────────────────────────── */
  const cursor = document.createElement('div');
  cursor.id = 'custom-cursor';
  cursor.innerHTML =
    '<div class="cursor-ring"></div>' +
    '<div class="cursor-dot"></div>' +
    '<span class="cursor-label"></span>';
  document.body.appendChild(cursor);

  const dot   = cursor.querySelector('.cursor-dot');
  const label = cursor.querySelector('.cursor-label');

  /* ─────────────────────────────────────────────────────────────────────────
     2. Scale-таблица состояний
        Контейнер = 92px. scale = желаемый_диаметр / 92
     ───────────────────────────────────────────────────────────────────────── */
  const SCALE = {
    default : 0.435,  /* ≈ 40px */
    button  : 0.695,  /* ≈ 64px */
    media   : 1.000,  /*   92px */
  };

  /* dot внутри 92px-контейнера: при scale=0.435 нужна ≈14px чтобы выглядеть как 6px */
  const DOT_BASE_SCALE  = 1;    /* нормальный размер точки */
  const DOT_HIDDEN_SCALE = 0;   /* схлопнута */

  /* label: при state-media масштаб контейнера = 1, шрифт ≈10px — норм */

  let currentState = null;  /* 'default' | 'button' | 'media' */
  let morphTimer   = null;

  function setScale(s) {
    /* Используем translateZ(0) чтобы форсировать GPU-слой */
    cursor.style.transform = `translate(-50%, -50%) scale(${s}) translateZ(0)`;
  }

  /* Применяем начальный масштаб сразу */
  setScale(SCALE.default);

  /* ─────────────────────────────────────────────────────────────────────────
     3. Машина состояний с хореографией
     ───────────────────────────────────────────────────────────────────────── */
  function applyState(newState, labelText) {
    if (newState === currentState) return;
    const prevState = currentState;
    currentState = newState;

    clearTimeout(morphTimer);

    /* ── Убираем все классы состояния ── */
    cursor.classList.remove('state-button', 'state-media');

    if (newState === 'button') {
      /* button: просто расширяем кружок, точка остаётся */
      cursor.classList.add('state-button');
      setScale(SCALE.button);

      /* Если переходим из media — сначала убираем надпись, потом показываем точку */
      if (prevState === 'media') {
        label.style.opacity   = '0';
        label.style.transform = 'translate(-50%, -50%) scale(0)';
        morphTimer = setTimeout(function () {
          dot.style.opacity   = '1';
          dot.style.transform = 'translate(-50%, -50%) scale(1)';
        }, 140);
      }

    } else if (newState === 'media') {
      cursor.classList.add('state-media');
      label.textContent = labelText || 'ПОСМОТРЕТЬ';
      setScale(SCALE.media);

      /* Шаг 1: точка схлопывается */
      dot.style.transform = 'translate(-50%, -50%) scale(0)';
      dot.style.opacity   = '0';

      /* Шаг 2: надпись вырастает с задержкой */
      morphTimer = setTimeout(function () {
        label.style.opacity   = '1';
        label.style.transform = 'translate(-50%, -50%) scale(1)';
      }, 160);

    } else {
      /* default */
      setScale(SCALE.default);

      if (prevState === 'media') {
        /* Надпись исчезает */
        label.style.opacity   = '0';
        label.style.transform = 'translate(-50%, -50%) scale(0)';

        /* Точка появляется чуть позже */
        morphTimer = setTimeout(function () {
          dot.style.opacity   = '1';
          dot.style.transform = 'translate(-50%, -50%) scale(1)';
        }, 150);
      } else {
        /* Из button: точка уже видна */
        dot.style.opacity   = '1';
        dot.style.transform = 'translate(-50%, -50%) scale(1)';
      }
    }
  }

  /* Инициализация: точка видна, надпись скрыта */
  dot.style.opacity     = '1';
  dot.style.transform   = 'translate(-50%, -50%) scale(1)';
  label.style.opacity   = '0';
  label.style.transform = 'translate(-50%, -50%) scale(0)';
  currentState = 'default';

  /* ─────────────────────────────────────────────────────────────────────────
     4. Движение с инерцией (lerp на RAF)
     ───────────────────────────────────────────────────────────────────────── */
  let mouseX = -300, mouseY = -300;
  let curX   = -300, curY   = -300;
  let visible = false;
  let pressing = false;

  function lerp(a, b, t) { return a + (b - a) * t; }

  (function loop() {
    curX = lerp(curX, mouseX, 0.15);
    curY = lerp(curY, mouseY, 0.15);

    cursor.style.left = Math.round(curX * 10) / 10 + 'px';
    cursor.style.top  = Math.round(curY * 10) / 10 + 'px';

    detectTheme(curX, curY);

    requestAnimationFrame(loop);
  })();

  document.addEventListener('mousemove', function (e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (!visible) {
      curX = mouseX; curY = mouseY;
      cursor.style.opacity = '1';
      visible = true;
    }
  }, { passive: true });

  document.addEventListener('mouseleave', function () {
    cursor.style.opacity = '0';
    visible = false;
  });
  document.addEventListener('mouseenter', function () {
    cursor.style.opacity = '1';
    visible = true;
  });

  /* ─────────────────────────────────────────────────────────────────────────
     5. Автодетект контраста (WCAG luma)
     ───────────────────────────────────────────────────────────────────────── */
  function parseRGB(str) {
    if (!str) return null;
    const m = str.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
    if (!m) return null;
    const a = m[4] !== undefined ? parseFloat(m[4]) : 1;
    if (a < 0.05) return null;
    return [+m[1], +m[2], +m[3]];
  }

  function luma(r, g, b) {
    function lin(c) {
      c /= 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    }
    return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
  }

  function findBG(el) {
    /* Явный цвет на секции */
    const sec = el.closest('[data-cursor-bg]');
    if (sec) {
      const hex = sec.dataset.cursorBg;
      if (hex && hex[0] === '#') {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        if (!isNaN(r)) return [r, g, b];
      }
    }
    /* Поднимаемся по DOM */
    let node = el;
    while (node && node !== document.documentElement) {
      const rgb = parseRGB(window.getComputedStyle(node).backgroundColor);
      if (rgb) return rgb;
      node = node.parentElement;
    }
    return [255, 255, 255];
  }

  let lastTheme = '';

  function detectTheme(x, y) {
    cursor.style.visibility = 'hidden';
    const el = document.elementFromPoint(x, y);
    cursor.style.visibility = '';
    if (!el) return;

    const [r, g, b] = findBG(el);
    const theme = luma(r, g, b) > 0.35 ? 'theme-dark' : 'theme-light';

    if (theme !== lastTheme) {
      cursor.classList.remove('theme-dark', 'theme-light');
      cursor.classList.add(theme);
      lastTheme = theme;
    }
  }

  /* ─────────────────────────────────────────────────────────────────────────
     6. Детект состояния элемента под курсором
     ───────────────────────────────────────────────────────────────────────── */
  const BTN_SEL = [
    'a', 'button', 'label', 'select',
    '[role="button"]', '[role="link"]', '[role="tab"]', '[role="menuitem"]',
    'input[type="submit"]', 'input[type="button"]', 'input[type="reset"]',
    'input[type="checkbox"]', 'input[type="radio"]',
    '[data-cursor="button"]',
  ].join(',');

  const MEDIA_SEL = [
    'img', 'video', 'figure', 'picture', '[data-cursor="media"]',
  ].join(',');

  function resolveState(el) {
    if (!el) return null;

    /* Явный атрибут */
    const attrEl = el.closest('[data-cursor]');
    if (attrEl) {
      const type = attrEl.dataset.cursor;
      if (type === 'button') return { s: 'button', label: null };
      if (type === 'media')  return { s: 'media',  label: attrEl.dataset.cursorLabel || 'ПОСМОТРЕТЬ' };
    }

    /* Автодетект медиа */
    const mediaEl = el.closest(MEDIA_SEL);
    if (mediaEl) {
      const def = mediaEl.tagName === 'VIDEO' ? 'СМОТРЕТЬ' : 'ПОСМОТРЕТЬ';
      return { s: 'media', label: mediaEl.dataset.cursorLabel || def };
    }

    /* Автодетект кнопки */
    if (el.closest(BTN_SEL)) return { s: 'button', label: null };

    return null;
  }

  document.addEventListener('mouseover', function (e) {
    const info = resolveState(e.target);
    applyState(info ? info.s : 'default', info ? info.label : null);
  }, { passive: true });

  document.addEventListener('mouseout', function (e) {
    const related = resolveState(e.relatedTarget);
    if (!related) applyState('default', null);
  }, { passive: true });

  /* ─────────────────────────────────────────────────────────────────────────
     7. Клик — кратковременный scale–squish
     ───────────────────────────────────────────────────────────────────────── */
  document.addEventListener('mousedown', function () {
    pressing = true;
    cursor.classList.add('is-pressing');
    const s = SCALE[currentState] * 0.80;
    cursor.style.transition = 'transform 0.12s ease, opacity 0.2s ease';
    cursor.style.transform  = `translate(-50%, -50%) scale(${s}) translateZ(0)`;
  });

  document.addEventListener('mouseup', function () {
    if (!pressing) return;
    pressing = false;
    cursor.classList.remove('is-pressing');
    cursor.style.transition = '';
    setScale(SCALE[currentState] || SCALE.default);
  });

})();