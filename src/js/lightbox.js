(function () {

  /* ══════════════════════════════════════
     LIGHTBOX — универсальный модуль
     Цепляется к любому элементу с классом .lb-trigger
     Закрытие: клик на фон, кнопка ×, Escape
  ══════════════════════════════════════ */

  const SELECTORS = '.lb-trigger';

  /* ── Стили оверлея ── */
  const style = document.createElement('style');
  style.textContent = `
    #lb-overlay {
      position: fixed;
      inset: 0;
      z-index: 9999;
      background: rgba(0, 0, 0, 0.92);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.25s ease;
      cursor: zoom-out;
    }
    #lb-overlay.lb-open {
      opacity: 1;
      pointer-events: all;
    }
    #lb-media-wrap {
      position: relative;
      max-width: 90vw;
      max-height: 90vh;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: default;
    }
    #lb-media-wrap img,
    #lb-media-wrap video {
      max-width: 90vw;
      max-height: 90vh;
      width: auto;
      height: auto;
      object-fit: contain;
      display: block;
      border-radius: 2px;
      transform: scale(0.96);
      transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
      user-select: none;
    }
    #lb-overlay.lb-open #lb-media-wrap img,
    #lb-overlay.lb-open #lb-media-wrap video {
      transform: scale(1);
    }
    #lb-close {
      position: fixed;
      top: 24px;
      right: 32px;
      font-family: 'PixeloidSans', 'Pixelify Sans', monospace;
      font-size: 28px;
      color: #fff;
      cursor: pointer;
      line-height: 1;
      z-index: 10000;
      mix-blend-mode: difference;
      user-select: none;
      letter-spacing: -0.05em;
      transition: opacity 0.15s;
    }
    #lb-close:hover { opacity: 0.6; }

    /* Курсор-подсказка — задаётся через .lb-trigger в CSS каждой страницы */
  `;
  document.head.appendChild(style);

  /* ── Разметка оверлея ── */
  const overlay = document.createElement('div');
  overlay.id = 'lb-overlay';

  const closeBtn = document.createElement('div');
  closeBtn.id = 'lb-close';
  closeBtn.textContent = '[ × ]';

  const wrap = document.createElement('div');
  wrap.id = 'lb-media-wrap';

  overlay.appendChild(closeBtn);
  overlay.appendChild(wrap);
  document.body.appendChild(overlay);

  /* ── Состояние ── */
  let activeVideo = null;

  /* ── Открыть ── */
  function open(src, isVideo, originalVideo) {
    wrap.innerHTML = '';

    if (isVideo) {
      const v = document.createElement('video');
      v.src = src;
      v.autoplay = true;
      v.loop = true;
      v.muted = true;        // начинаем muted
      v.playsInline = true;
      v.controls = true;     // показываем controls — пользователь сам включит звук
      wrap.appendChild(v);
      activeVideo = v;

      // Пауза оригинального видео пока открыт lightbox
      if (originalVideo) originalVideo.pause();
    } else {
      const img = document.createElement('img');
      img.src = src;
      wrap.appendChild(img);
      activeVideo = null;
    }

    overlay.classList.add('lb-open');
    document.body.style.overflow = 'hidden';
  }

  /* ── Закрыть ── */
  function close() {
    overlay.classList.remove('lb-open');
    document.body.style.overflow = '';

    // Останавливаем видео и очищаем wrap после анимации
    setTimeout(() => {
      if (activeVideo) {
        activeVideo.pause();
        activeVideo = null;
      }
      wrap.innerHTML = '';

      // Возобновляем все фоновые видео
      document.querySelectorAll('.case-media[autoplay], .gi video').forEach(v => {
        v.play().catch(() => {});
      });
    }, 280);
  }

  /* ── Вешаем клики после загрузки DOM ── */
  function bindClicks() {
    document.querySelectorAll(SELECTORS).forEach(el => {
      // Убираем дубли
      el.removeEventListener('click', el._lbHandler);

      el._lbHandler = (e) => {
        e.stopPropagation();
        const isVideo = el.tagName === 'VIDEO';
        open(el.src || el.currentSrc, isVideo, isVideo ? el : null);
      };

      el.addEventListener('click', el._lbHandler);
    });
  }

  /* ── Закрытие по кнопке и фону ── */
  closeBtn.addEventListener('click', (e) => { e.stopPropagation(); close(); });
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });

  /* ── Клик внутри wrap не закрывает ── */
  wrap.addEventListener('click', (e) => e.stopPropagation());

  /* ── Инициализация ── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bindClicks);
  } else {
    bindClicks();
  }

  // Экспортируем для переинициализации (если контент добавляется динамически)
  window.lightboxRebind = bindClicks;

})();