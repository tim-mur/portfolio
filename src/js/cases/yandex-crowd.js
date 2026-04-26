import '../cursor.js'
import '../lightbox.js'

/* ══════════════════════════════════════
   ЭЛЕМЕНТЫ
══════════════════════════════════════ */
const heroWrap = document.getElementById('glitch-wrap');
const title    = document.getElementById('glitch-title');
const layerC   = document.getElementById('layer-cyan');
const layerM   = document.getElementById('layer-magenta');
const content  = document.querySelector('.page-content');

let footerAnimatedFlag = false;

const ri = (a, b) => Math.floor(Math.random() * (b - a)) + a;
const rf = (a, b) => Math.random() * (b - a) + a;

/* ══════════════════════════════════════
   PARALLAX
══════════════════════════════════════ */
function onContentScroll() {
  if (!content) return;
  const sy   = content.scrollTop;
  const winH = content.clientHeight;

  if (heroWrap) heroWrap.style.transform = `translateY(${-sy * 0.25}px)`;

  document.querySelectorAll('.gi img, .gi video').forEach(img => {
    const r = img.parentElement.getBoundingClientRect();
    if (r.top < winH && r.bottom > 0) {
      img.style.transform = `translateY(${(r.top + r.height / 2 - winH / 2) * 0.03}px)`;
    }
  });

  const mockupImg = document.querySelector('.about-mockup img');
  if (mockupImg) {
    const r = mockupImg.closest('.about-mockup').getBoundingClientRect();
    if (r.top < winH && r.bottom > 0) {
      const offset = (r.top + r.height / 2 - winH / 2) * 0.06;
      mockupImg.style.transform = `translateY(${offset}px)`;
    }
  }
}
content.addEventListener('scroll', onContentScroll, { passive: true });

/* ══════════════════════════════════════
   FOOTER (pull-up)
══════════════════════════════════════ */
(function () {
  const footer = document.getElementById('footer');
  if (!content || !footer) return;

  let progress = 0;
  let target   = 0;
  let rafId    = null;
  const SENSITIVITY = 0.8;

  function applyFooter(p) {
    footer.style.transform = `translateY(${(1 - p) * 100}%)`;
    if (p > 0.5 && !footerAnimatedFlag) {
      footerAnimatedFlag = true;
      animateFooterSocial();
    } else if (p < 0.1) {
      footerAnimatedFlag = false;
    }
  }

  function tick() {
    const diff = target - progress;
    if (Math.abs(diff) < 0.001) { progress = target; applyFooter(progress); rafId = null; return; }
    progress += diff * 0.2;
    applyFooter(progress);
    rafId = requestAnimationFrame(tick);
  }
  function run() { if (!rafId) rafId = requestAnimationFrame(tick); }

  function isAtBottom() {
    return content.scrollTop + content.clientHeight >= content.scrollHeight - 2;
  }

  window.addEventListener('wheel', (e) => {
    let dy = e.deltaY;
    if (e.deltaMode === 1) dy *= 32;
    if (e.deltaMode === 2) dy *= 300;

    if (target > 0 || (dy > 0 && isAtBottom())) {
      e.preventDefault();
      target += (dy / window.innerHeight) * SENSITIVITY;
      target = Math.max(0, Math.min(1, target));
      run();
    }
  }, { passive: false });

  let touchStart = null;
  window.addEventListener('touchstart', (e) => { touchStart = e.touches[0].clientY; }, { passive: true });
  window.addEventListener('touchmove', (e) => {
    if (touchStart === null) return;
    const dy = touchStart - e.touches[0].clientY;
    touchStart = e.touches[0].clientY;
    if (target > 0 || (dy > 0 && isAtBottom())) {
      if (e.cancelable) e.preventDefault();
      target += (dy / window.innerHeight) * 1.2;
      target = Math.max(0, Math.min(1, target));
      run();
    }
  }, { passive: false });
  window.addEventListener('touchend', () => {
    touchStart = null;
    target = target > 0.5 ? 1 : 0;
    run();
  });

  applyFooter(0);
})();

/* ══════════════════════════════════════
   GLITCH EFFECT (HERO)
══════════════════════════════════════ */
function rClip() { return `inset(${ri(0, 75)}% 0 ${ri(0, 75)}% 0)`; }
function setL(el, tx, ty, sk, cl) {
  el.style.transform = `translate(${tx}px, ${ty}px) skewX(${sk}deg)`;
  el.style.clipPath = cl;
  el.style.opacity = '1';
}
function resetL(el) { el.style.opacity = '0'; el.style.transform = ''; el.style.clipPath = ''; }

function introGlitch() {
  const frames = [
    [30,-26,-7,4,24,5,-3,0,0],[20,32,-4,-5,-22,7,4,0,20],[35,-18,10,3,26,-9,-4,0,-16],
    [25,30,-6,-6,-18,6,5,0,12],[30,-22,5,2,20,-5,-3,0,0],[20,18,-9,-4,-24,8,4,0,-14],
    [25,0,0,0,0,0,0,1,0],[20,-30,7,5,26,-6,-4,0,10],[30,22,-5,-3,-20,5,3,0,-12],
    [20,-9,9,2,16,-8,-2,0,7],[25,26,-7,-5,-22,6,4,0,-16],[20,-14,5,2,18,-5,-3,1,0],
    [20,-7,2,-1,9,-3,1,0,-5],[30,0,0,0,0,0,0,1,0],
  ];
  let t = 0;
  frames.forEach(([dur, cx, cy, cs, mx, my, ms, to, ttx]) => {
    setTimeout(() => {
      setL(layerC, cx, cy, cs, rClip());
      setL(layerM, mx, my, ms, rClip());
      title.style.opacity = to;
      title.style.transform = ttx ? `translateX(${ttx}px)` : '';
    }, t);
    t += dur;
  });
  setTimeout(() => {
    resetL(layerC); resetL(layerM);
    title.style.opacity = '1'; title.style.transform = '';
    setTimeout(idleGlitch, ri(700, 1500));
  }, t);
}

function idleGlitch() {
  const count = ri(2, 5);
  let t = 0;
  for (let i = 0; i < count; i++) {
    const dur = ri(20, 55);
    setTimeout(() => {
      setL(layerC, ri(-16, 16), ri(-5, 5), rf(-2, 2), rClip());
      setL(layerM, ri(-16, 16), ri(-5, 5), rf(-2, 2), rClip());
      title.style.transform = `translateX(${ri(-7, 7)}px)`;
    }, t);
    t += dur;
    setTimeout(() => { resetL(layerC); resetL(layerM); title.style.transform = ''; }, t);
    t += ri(15, 45);
  }
  setTimeout(idleGlitch, ri(1000, 3000));
}
introGlitch();

/* ══════════════════════════════════════
   МГНОВЕННАЯ ВСТАВКА ТЕКСТА
══════════════════════════════════════ */
function typeText(el, text) {
  return new Promise(res => {
    el.textContent = text;
    res();
  });
}

/* ══════════════════════════════════════
   ТЕКСТЫ
══════════════════════════════════════ */
const ABOUT_P1_RU = `Я выполнял тестовое задание для компании Яндекс Крауд. Передо мной стояла задача разработать дизайн лендинга для платформы управления интернет-рекламой, созданной специально для медиаиздателей и владельцев ресурсов.`;
const ABOUT_P2_RU = `Основной целью было создать современный и удобный интерфейс в рамках экосистемы Яндекса, который эффективно презентует сложный B2B-продукт целевой аудитории.`;
const ABOUT_P1_EN = `I worked on a test assignment for Yandex Crowd. The task was to design a landing page for an online advertising management platform built specifically for media publishers and resource owners.`;
const ABOUT_P2_EN = `The main goal was to create a modern, user-friendly interface within the Yandex ecosystem that effectively presents a complex B2B product to its target audience.`;

const RESEARCH_RU = `Работа началась с экспресс-исследования по методологии Advanced JTBD, что позволило быстро структурировать запросы пользователей и выделить ключевые смыслы продукта. Я провёл детальный бенчмаркинг конкурентных платформ, проанализировав их подходы к визуализации данных и подаче сложных B2B-услуг. Этот анализ помог мне выявить лучшие практики на рынке и сформировать гипотезы для создания акцентного и понятного визуального сторителлинга.`;
const RESEARCH_EN = `I started with express research using the Advanced JTBD methodology, which let me quickly structure user needs and extract the product's key messages. I ran a detailed benchmark of competitor platforms, analysing their approaches to data visualisation and how they present complex B2B services. This analysis helped me identify best practices on the market and form hypotheses for accent-driven, clear visual storytelling.`;

const SCENARIO_RU = `На основе текста из ТЗ я спроектировал логическую структуру лендинга и разработал уникальный концепт стиля, отвечающий стандартам качества Яндекса. Я самостоятельно проработал всю визуальную часть, уделив особое внимание аккуратной вёрстке, иерархии блоков и типографике.`;
const SCENARIO_EN = `Based on the brief, I designed the landing page's logical structure and developed a unique style concept matching Yandex's quality standards. I handled the entire visual side myself, with special attention to precise layout, block hierarchy and typography.`;

const UI_RU = `Помимо десктопной версии, я подготовил адаптивные макеты, обеспечив чистоту и удобство интерфейса на любых устройствах. Визуальный язык строился вокруг ясных акцентов, крупной типографики и выверенных отступов — чтобы сложный B2B-продукт считывался на первом экране.`;
const UI_EN = `Alongside the desktop version, I prepared adaptive layouts ensuring a clean, comfortable interface on any device. The visual language is built around clear accents, bold typography and precise spacing — so a complex B2B product reads on the very first screen.`;

const MOTION_RU = `Для полноценной защиты идеи я дополнил статические макеты серией интерфейсных анимаций, собранных в итоговый моушн-ролик. Я самостоятельно смонтировал видео, чтобы продемонстрировать динамику взаимодействия пользователя с платформой и плавность переходов. Такой формат презентации позволил наглядно показать, как именно продукт будет ощущаться в «живом» использовании, и подчеркнул готовность концепта к реализации.`;
const MOTION_EN = `To fully defend the idea, I complemented static mockups with a series of UI animations assembled into a final motion reel. I edited the video myself to show the dynamics of user interaction with the platform and the smoothness of transitions. This presentation format clearly demonstrated how the product would feel in "live" use and highlighted the concept's readiness for implementation.`;

const METRICS_RU = `Для оценки эффективности лендинга я выделил показатели, критичные для B2B-сегмента. Главная метрика — Conversion Rate (CR) в регистрацию, которая напрямую зависит от ясности подачи преимуществ и удобства интерфейса. Вторая метрика — Scroll-through Rate (глубина прокрутки), отражающая интерес пользователя к визуальному повествованию. Продуманная структура и визуальные акценты призваны минимизировать когнитивную нагрузку и повысить лояльность к новому бренду.`;
const METRICS_EN = `To evaluate the landing page's effectiveness, I picked metrics that matter in B2B. The main one is Conversion Rate (CR) to sign-up — directly tied to how clearly benefits are presented and how comfortable the interface is. The second is Scroll-through Rate, reflecting user interest in the visual narrative. A thoughtful structure and visual accents are designed to minimise cognitive load and build loyalty to the new brand.`;

const RESULT_RU = `Несмотря на крайне сжатые сроки тестового задания, мне удалось создать законченный и визуально сильный продукт. Использование методологии Advanced JTBD позволило не терять фокус на задачах бизнеса при высокой скорости генерации макетов. Проект продемонстрировал мою способность быстро погружаться в специфику бренда и выдавать результат, сочетающий в себе глубокую аналитику, качественный UI и навыки моушн-дизайна.`;
const RESULT_EN = `Despite extremely tight test-assignment deadlines, I managed to produce a finished, visually strong product. Using the Advanced JTBD methodology let me stay focused on business goals while keeping a high pace of mockup production. The project demonstrated my ability to quickly get into a brand's specifics and deliver a result that combines deep analytics, quality UI and motion design skills.`;

function getLang() {
  return localStorage.getItem('userLanguage')
      || localStorage.getItem('portfolio_lang')
      || 'ru';
}

const ADAPTIVE_RU = `Помимо десктопной версии я разработал адаптивные макеты для мобильных устройств. Интерфейс перестраивается под экран телефона: блоки выстраиваются вертикально, типографика масштабируется, а ключевые действия остаются в зоне большого пальца. Продукт одинаково удобен на любом устройстве.`;
const ADAPTIVE_EN = `Alongside the desktop version I designed mobile adaptive layouts. The interface reorganises itself for phone screens: blocks stack vertically, typography scales down, and key actions stay within thumb reach. The product works equally well on any device.`;

const TEXTS_RU = {
  about_p1: ABOUT_P1_RU, about_p2: ABOUT_P2_RU,
  research: RESEARCH_RU, scenario: SCENARIO_RU,
  ui: UI_RU, motion: MOTION_RU,
  adaptive: ADAPTIVE_RU,
  metrics: METRICS_RU, result: RESULT_RU,
};
const TEXTS_EN = {
  about_p1: ABOUT_P1_EN, about_p2: ABOUT_P2_EN,
  research: RESEARCH_EN, scenario: SCENARIO_EN,
  ui: UI_EN, motion: MOTION_EN,
  adaptive: ADAPTIVE_EN,
  metrics: METRICS_EN, result: RESULT_EN,
};

const TEXTS = new Proxy({}, {
  get(_, key) { return (getLang() === 'en' ? TEXTS_EN : TEXTS_RU)[key]; }
});

function applyLang() {
  const lang = getLang();
  const t = lang === 'en' ? TEXTS_EN : TEXTS_RU;

  document.querySelectorAll('[data-ru][data-en]').forEach(el => {
    const val = el.getAttribute('data-' + lang);
    if (val === null) return;

    if (el.children.length > 0) {
      const hasBr = Array.from(el.children).every(c => c.tagName === 'BR');
      if (hasBr) {
        const ruVal  = el.getAttribute('data-ru');
        const enVal  = el.getAttribute('data-en');
        const chosen = lang === 'en' ? enVal : ruVal;
        const withBr = chosen.replace(/,\s*/, ',<br>');
        el.innerHTML = withBr;
      } else {
        const firstText = Array.from(el.childNodes).find(n => n.nodeType === Node.TEXT_NODE && n.textContent.trim());
        if (firstText) {
          firstText.textContent = val + ' ';
        } else {
          el.insertBefore(document.createTextNode(val + ' '), el.firstChild);
        }
      }
    } else {
      el.textContent = val;
    }
  });

  const map = {
    'about-p1':      'about_p1',
    'about-p2':      'about_p2',
    'research-p1':   'research',
    'scenario-text': 'scenario',
    'ui-p1':         'ui',
    'motion-text':   'motion',
    'adaptive-text': 'adaptive',
    'metrics-text':  'metrics',
    'result-text':   'result'
  };
  Object.entries(map).forEach(([id, key]) => {
    const el = document.getElementById(id);
    if (el && el.textContent.trim()) el.textContent = t[key];
  });
}

window.addEventListener('storage', (e) => {
  if (e.key === 'userLanguage' || e.key === 'portfolio_lang') applyLang();
});

let _lastLang = getLang();
setInterval(() => {
  const cur = getLang();
  if (cur !== _lastLang) { _lastLang = cur; applyLang(); }
}, 200);

applyLang();

/* ══════════════════════════════════════
   НАБЛЮДАТЕЛИ ДЛЯ АНИМАЦИИ
══════════════════════════════════════ */
const SPD_FAST = 8;
const SPD_MED  = 10;

function observeOnce(targetEl, onEnter, threshold = 0.1) {
  if (!targetEl) return;
  let done = false;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting && !done) {
        done = true;
        onEnter();
        obs.disconnect();
      }
    });
  }, { root: content, threshold, rootMargin: '0px 0px -5% 0px' });
  obs.observe(targetEl);

  requestAnimationFrame(() => {
    const r = targetEl.getBoundingClientRect();
    if (!done && r.top < window.innerHeight && r.bottom > 0) {
      done = true;
      onEnter();
      obs.disconnect();
    }
  });
}

// ── О проекте ──
observeOnce(document.getElementById('screen-about'), () => {
  document.querySelector('#screen-about .s-label').classList.add('visible');
  typeText(document.getElementById('about-p1'), TEXTS.about_p1, SPD_MED)
    .then(() => typeText(document.getElementById('about-p2'), TEXTS.about_p2, SPD_FAST));
});

// ── Исследование ──
observeOnce(document.getElementById('screen-research'), () => {
  document.querySelector('#screen-research .split-label').classList.add('visible');
  typeText(document.getElementById('research-p1'), TEXTS.research, SPD_MED);
});

// ── Проектирование + UI ──
observeOnce(document.getElementById('screen-flow-ui'), () => {
  document.querySelectorAll('#screen-flow-ui .flow-ui-label').forEach((l, i) => {
    setTimeout(() => l.classList.add('visible'), i * 120);
  });
  typeText(document.getElementById('scenario-text'), TEXTS.scenario, SPD_MED);
  typeText(document.getElementById('ui-p1'), TEXTS.ui, SPD_MED);
});

// Вайрфрейминг-видео появляется при скролле
document.querySelectorAll('.flow-ui-video-block').forEach((block, i) => {
  observeOnce(block, () => {
    setTimeout(() => block.classList.add('visible'), i * 180);
  });
});

// ── Моушн и презентация ──
observeOnce(document.getElementById('screen-motion'), () => {
  document.querySelector('#screen-motion .motion-label').classList.add('visible');
  typeText(document.getElementById('motion-text'), TEXTS.motion, SPD_MED);
  const wrap = document.querySelector('#screen-motion .motion-video-wrap');
  if (wrap) setTimeout(() => wrap.classList.add('visible'), 200);
});

// ── Адаптивные макеты: заголовок + текст ──
observeOnce(document.getElementById('screen-adaptive'), () => {
  const label = document.querySelector('#screen-adaptive .adaptive-label');
  if (label) label.classList.add('visible');
  typeText(document.getElementById('adaptive-text'), TEXTS.adaptive, SPD_MED);
});

// ── Метрики + Результат ──
observeOnce(document.getElementById('metrics-text'), () => {
  document.querySelectorAll('#screen-metrics-result .split-label').forEach((l, i) => {
    l.classList.add('glitch-reveal');
    setTimeout(() => l.classList.add('visible'), i * 150);
  });
  typeText(document.getElementById('metrics-text'), TEXTS.metrics, SPD_MED)
    .then(() => typeText(document.getElementById('result-text'), TEXTS.result, SPD_MED));
});

// ── CTA ──
document.querySelectorAll('.cta-btn').forEach(btn => {
  observeOnce(btn, () => btn.classList.add('visible'));
});

/* ══════════════════════════════════════
   FOOTER SOCIAL ANIMATION
══════════════════════════════════════ */
function animateFooterSocial() {
  const icons = document.querySelectorAll('.footer__icon');
  const lines = document.querySelectorAll('.footer__line');
  const dur   = 350;
  const ease  = 'cubic-bezier(0.22, 1, 0.36, 1)';
  const seq   = [
    () => { icons[0].style.animation = `iconIn ${dur}ms ${ease} forwards`; },
    () => { lines[0].style.animation = `lineIn ${dur}ms ${ease} forwards`; },
    () => { icons[1].style.animation = `iconIn ${dur}ms ${ease} forwards`; },
    () => { lines[1].style.animation = `lineIn ${dur}ms ${ease} forwards`; },
    () => { icons[2].style.animation = `iconIn ${dur}ms ${ease} forwards`; },
  ];
  seq.forEach((fn, i) => setTimeout(fn, i * (dur + 40)));
}

// ── Принудительный запуск inline видео (и вайрфрейм, и моушн) ──
document.querySelectorAll('.flow-ui-media video, .motion-video-wrap video').forEach(v => {
  const tryPlay = () => v.play().catch(() => {});
  tryPlay();
  v.addEventListener('loadedmetadata', tryPlay);
  document.addEventListener('scroll', tryPlay, { once: true, passive: true });
  document.addEventListener('click', tryPlay, { once: true });
});

/* ══════════════════════════════════════
   СЛАЙДЕР АДАПТИВОВ (стрелки + translateX %)
══════════════════════════════════════ */
(function initAdaptiveSlider() {
  const track   = document.getElementById('adaptive-track');
  const btnPrev = document.getElementById('adaptive-prev');
  const btnNext = document.getElementById('adaptive-next');
  if (!track || !btnPrev || !btnNext) return;

  const slides = track.querySelectorAll('.adaptive-slide');
  const total  = slides.length;
  let current  = 0;

  function slideTo(idx) {
    // Зажимаем в диапазон 0..total-1 (не зациклично — на крайних стрелки тускнеют)
    current = Math.max(0, Math.min(total - 1, idx));
    // translateX на 100% = ровно одна ширина трека, без пикселей
    track.style.transform = `translateX(-${current * 100}%)`;
    // Состояние стрелок
    btnPrev.style.opacity = current === 0         ? '0.2' : '';
    btnNext.style.opacity = current === total - 1 ? '0.2' : '';
    btnPrev.style.pointerEvents = current === 0         ? 'none' : '';
    btnNext.style.pointerEvents = current === total - 1 ? 'none' : '';
  }

  btnPrev.addEventListener('click', () => slideTo(current - 1));
  btnNext.addEventListener('click', () => slideTo(current + 1));

  // Свайп на тач
  let startX = null;
  track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    if (startX === null) return;
    const dx = e.changedTouches[0].clientX - startX;
    startX = null;
    if (Math.abs(dx) < 30) return;
    slideTo(dx < 0 ? current + 1 : current - 1);
  });

  // Начальное состояние
  slideTo(0);
})();

// ── Запуск видео в айфоне ──
const iphoneVideo = document.getElementById('iphone-video');
if (iphoneVideo) {
  const tryPlay = () => iphoneVideo.play().catch(() => {});
  tryPlay();
  iphoneVideo.addEventListener('loadedmetadata', tryPlay);
  observeOnce(document.getElementById('screen-adaptive'), () => setTimeout(tryPlay, 100));
  document.addEventListener('click', tryPlay, { once: true });
}

/* ══════════════════════════════════════
   LIGHTBOX
══════════════════════════════════════ */
(function initLightbox() {
  const overlay = document.createElement('div');
  overlay.className = 'erm-lightbox';
  overlay.innerHTML = `
    <button class="erm-lightbox__close" aria-label="Close">
      <svg class="px-close" width="80" height="40" viewBox="0 0 80 40" xmlns="http://www.w3.org/2000/svg">
        <rect x="0"  y="4"  width="4" height="4" fill="currentColor"/>
        <rect x="4"  y="4"  width="4" height="4" fill="currentColor"/>
        <rect x="8"  y="4"  width="4" height="4" fill="currentColor"/>
        <rect x="0"  y="8"  width="4" height="4" fill="currentColor"/>
        <rect x="0"  y="12" width="4" height="4" fill="currentColor"/>
        <rect x="0"  y="16" width="4" height="4" fill="currentColor"/>
        <rect x="0"  y="20" width="4" height="4" fill="currentColor"/>
        <rect x="0"  y="24" width="4" height="4" fill="currentColor"/>
        <rect x="0"  y="28" width="4" height="4" fill="currentColor"/>
        <rect x="0"  y="32" width="4" height="4" fill="currentColor"/>
        <rect x="4"  y="32" width="4" height="4" fill="currentColor"/>
        <rect x="8"  y="32" width="4" height="4" fill="currentColor"/>
        <rect x="28" y="10" width="4" height="4" fill="currentColor"/>
        <rect x="44" y="10" width="4" height="4" fill="currentColor"/>
        <rect x="32" y="14" width="4" height="4" fill="currentColor"/>
        <rect x="40" y="14" width="4" height="4" fill="currentColor"/>
        <rect x="36" y="18" width="4" height="4" fill="currentColor"/>
        <rect x="32" y="22" width="4" height="4" fill="currentColor"/>
        <rect x="40" y="22" width="4" height="4" fill="currentColor"/>
        <rect x="28" y="26" width="4" height="4" fill="currentColor"/>
        <rect x="44" y="26" width="4" height="4" fill="currentColor"/>
        <rect x="68" y="4"  width="4" height="4" fill="currentColor"/>
        <rect x="72" y="4"  width="4" height="4" fill="currentColor"/>
        <rect x="76" y="4"  width="4" height="4" fill="currentColor"/>
        <rect x="76" y="8"  width="4" height="4" fill="currentColor"/>
        <rect x="76" y="12" width="4" height="4" fill="currentColor"/>
        <rect x="76" y="16" width="4" height="4" fill="currentColor"/>
        <rect x="76" y="20" width="4" height="4" fill="currentColor"/>
        <rect x="76" y="24" width="4" height="4" fill="currentColor"/>
        <rect x="76" y="28" width="4" height="4" fill="currentColor"/>
        <rect x="68" y="32" width="4" height="4" fill="currentColor"/>
        <rect x="72" y="32" width="4" height="4" fill="currentColor"/>
        <rect x="76" y="32" width="4" height="4" fill="currentColor"/>
      </svg>
    </button>
    <div class="erm-lightbox__inner">
      <img class="erm-lightbox__img" alt="" style="display:none">
      <video class="erm-lightbox__video" controls loop style="display:none"></video>
    </div>
  `;
  document.body.appendChild(overlay);

  const img   = overlay.querySelector('.erm-lightbox__img');
  const vid   = overlay.querySelector('.erm-lightbox__video');
  const close = overlay.querySelector('.erm-lightbox__close');

  function openImage(src) {
    img.src = src;
    img.style.display = 'block';
    vid.style.display = 'none';
    overlay.classList.add('is-open');
  }
  function openVideo(src) {
    vid.src = src;
    vid.style.display = 'block';
    img.style.display = 'none';
    vid.play().catch(() => {});
    overlay.classList.add('is-open');
  }
  function closeFn() {
    overlay.classList.remove('is-open');
    vid.pause();
    setTimeout(() => { img.src = ''; vid.src = ''; }, 300);
  }

  close.addEventListener('click', closeFn);
  overlay.addEventListener('click', (e) => { if (e.target === overlay || e.target.classList.contains('erm-lightbox__inner')) closeFn(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeFn(); });

  document.addEventListener('click', (e) => {
    if (e.target.closest('.erm-lightbox')) return;

    // Клик по картинкам (адаптивные, логотип "о проекте")
    const picture = e.target.closest('.gi img, .about-mockup img, .flow-ui-media img');
    if (picture && picture.src) {
      e.preventDefault();
      openImage(picture.src);
      return;
    }

    // Клик по моушн-видео
    const motionWrap = e.target.closest('.motion-video-wrap');
    if (motionWrap) {
      const v = motionWrap.querySelector('video');
      if (v && (v.currentSrc || v.src)) {
        e.preventDefault();
        openVideo(v.currentSrc || v.src);
        return;
      }
    }

    // Клик по вайрфрейм-видео
    const flowMedia = e.target.closest('.flow-ui-media');
    if (flowMedia) {
      const v = flowMedia.querySelector('video');
      if (v && (v.currentSrc || v.src)) {
        e.preventDefault();
        openVideo(v.currentSrc || v.src);
        return;
      }
    }

    const video = e.target.closest('.gi video, .about-mockup video');
    if (video && video.currentSrc) {
      e.preventDefault();
      openVideo(video.currentSrc);
    }
  });
})();