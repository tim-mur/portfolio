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
   PARALLAX — слабый, только hero
══════════════════════════════════════ */
function onContentScroll() {
  if (!content) return;
  const sy   = content.scrollTop;
  const winH = content.clientHeight;

  if (heroWrap) heroWrap.style.transform = `translateY(${-sy * 0.25}px)`;

  // Параллакс картинок в галереях
  document.querySelectorAll('.gi img, .gi video').forEach(img => {
    const r = img.parentElement.getBoundingClientRect();
    if (r.top < winH && r.bottom > 0) {
      img.style.transform = `translateY(${(r.top + r.height / 2 - winH / 2) * 0.03}px)`;
    }
  });

  // Параллакс картинки в блоке "О проекте" — чуть сильнее для глубины
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
   МГНОВЕННАЯ ВСТАВКА ТЕКСТА (анимация набора убрана)
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
const ABOUT_P1_RU = `Эрмитаж обладает колоссальной исторической ценностью, но его текущий имидж не находит отклика у молодой аудитории. В то время как современные галереи задают тренды, бренд музея остается консервативным, что создает барьер для новых посетителей.`;
const ABOUT_P2_RU = `Моей целью стало расширение спектра взаимодействия с целевой аудиторией через качественное обновление визуального и цифрового опыта. Я стремился превратить сложный и архаичный процесс коммуникации в современную, понятную и эстетичную систему.`;
const ABOUT_P1_EN = `The Hermitage holds colossal historical value, but its current image doesn't resonate with a young audience. While modern galleries set trends, the museum's brand remains conservative, creating a barrier for new visitors.`;
const ABOUT_P2_EN = `My goal was to broaden the range of interactions with the target audience through a quality update of the visual and digital experience. I aimed to transform a complex, archaic communication process into a modern, clear and aesthetic system.`;

const ANALYSIS_RU = `Я начал работу с глубокого аудита текущей архитектуры сайта. Сравнительный анализ российских галерей и New York Art School помог выявить стандарты удобства, которые я адаптировал под задачи музея. Я обнаружил множество дублирующих кнопок и избыточную информацию, которая мешала пользователям быстро находить нужное. В итоге структура стала линейной и логичной, что позволило устранить точки потери трафика на ранних этапах.`;
const ANALYSIS_EN = `I started with a deep audit of the current site architecture. A comparative analysis of Russian galleries and the New York Art School helped me identify usability standards which I adapted to the museum's tasks. I discovered numerous duplicate buttons and redundant information that prevented users from quickly finding what they needed. As a result, the structure became linear and logical, eliminating traffic loss points at early stages.`;

const SCENARIO_RU = `Основное внимание было уделено самому важному целевому действию — процессу приобретения билета. Я полностью переработал интерфейс выбора дат и времени, сделав календарь интуитивно понятным даже для новых пользователей. Кнопка покупки была вынесена в зону активного внимания, избавив посетителей от необходимости искать её среди второстепенного контента. Теперь путь от выбора билета до оплаты занимает минимум времени и не вызывает лишних вопросов.`;
const SCENARIO_EN = `Main focus went to the most important target action — the ticket purchase flow. I completely reworked the date and time picker, making the calendar intuitive even for new users. The purchase button was moved into the zone of active attention, freeing visitors from having to search for it among secondary content. Now the path from ticket choice to payment takes minimal time and raises no unnecessary questions.`;

const UI_RU = `Для упрощения навигации я систематизировал данные об экскурсиях, разделив их на четкие категории по интересам. Слабый и перегруженный UI был заменен на строгий визуальный язык, который подчеркивает статус музея, не мешая восприятию информации. Я удалил лишние элементы управления и выстроил четкую иерархию блоков на главной странице. Это позволило создать современный цифровой сервис, где дизайн помогает пользователю, а не перегружает его.`;
const UI_EN = `To simplify navigation I systematised tour data, splitting it into clear interest-based categories. A weak and overloaded UI was replaced with a strict visual language that emphasises the museum's status without getting in the way of information. I removed unnecessary controls and built a clear hierarchy of blocks on the home page. This allowed me to create a modern digital service where design helps the user instead of overloading them.`;

const METRICS_RU = `Для оценки эффективности редизайна я выделил ключевые показатели, напрямую связанные с качеством пользовательского опыта. Главной метрикой стала конверсия в покупку билета, подтверждающая успешность оптимизированного сценария и устранение барьеров в интерфейсе. Также я сфокусировался на времени выполнения задачи (Time on Task), чтобы доказать, что новая навигация позволяет находить экскурсии значительно быстрее. Снижение показателя отказов на главной странице и рост вовлеченности в соцсетях стали подтверждением того, что бренд успешно заговорил на одном языке с молодой аудиторией.`;
const METRICS_EN = `To measure the redesign's effectiveness I picked key indicators directly tied to UX quality. The main metric was ticket purchase conversion, confirming the success of the optimised flow and the removal of interface barriers. I also focused on Time on Task to prove the new navigation lets users find tours significantly faster. Reduced bounce rate on the home page and growing social engagement confirmed the brand now speaks the same language as a young audience.`;

const RESULT_RU = `В ходе проекта была создана полноценная дизайн-система, основанная на исследовании пользовательского поведения и проверке гипотез. Мне удалось трансформировать сложную архитектуру в прозрачный сервис, где каждый элемент интерфейса работает на удержание внимания. Итоговые макеты демонстрируют, как продуманный UX может осовременить классический бренд, не теряя его исторической значимости. Результатом стал готовый набор инструментов для привлечения лояльной аудитории и повышения удобства цифровых сервисов.`;
const RESULT_EN = `A full design system was built during the project, based on user behaviour research and hypothesis validation. I managed to transform a complex architecture into a transparent service where every interface element works to retain attention. The final mockups show how thoughtful UX can modernise a classical brand without losing its historical significance. The outcome is a ready toolkit for attracting a loyal audience and improving digital service usability.`;

function getLang() {
  return localStorage.getItem('userLanguage')
      || localStorage.getItem('portfolio_lang')
      || 'ru';
}

const TEXTS_RU = {
  about_p1: ABOUT_P1_RU, about_p2: ABOUT_P2_RU,
  analysis: ANALYSIS_RU, scenario: SCENARIO_RU,
  ui: UI_RU, metrics: METRICS_RU, result: RESULT_RU,
};
const TEXTS_EN = {
  about_p1: ABOUT_P1_EN, about_p2: ABOUT_P2_EN,
  analysis: ANALYSIS_EN, scenario: SCENARIO_EN,
  ui: UI_EN, metrics: METRICS_EN, result: RESULT_EN,
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

    // Элементы с дочерними DOM-элементами (SVG, BR и т.п.)
    if (el.children.length > 0) {
      // Проверяем — только BR внутри (как у цитаты): используем innerHTML
      const hasBr = Array.from(el.children).every(c => c.tagName === 'BR');
      if (hasBr) {
        // Для цитаты с <br> — вставляем русскую версию с переносом через innerHTML
        const ruVal  = el.getAttribute('data-ru');
        const enVal  = el.getAttribute('data-en');
        const chosen = lang === 'en' ? enVal : ruVal;
        // Добавляем <br> в середину: ищем запятую или пробел после длинного слова
        const withBr = chosen.replace(/,\s*/, ',<br>');
        el.innerHTML = withBr;
      } else {
        // Элементы с SVG или другими дочерними — обновляем первый текстовый узел
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
    'about-p1': 'about_p1', 'about-p2': 'about_p2',
    'analysis-p1': 'analysis', 'scenario-text': 'scenario',
    'ui-p1': 'ui', 'metrics-text': 'metrics', 'result-text': 'result'
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
   НАБЛЮДАТЕЛИ ДЛЯ АНИМАЦИИ НАБОРА
   Root указываем .page-content — наш реальный скролл-контейнер
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

  // Fallback: если элемент уже видно при загрузке (порог может не сработать на стартовый кадр)
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

// ── Анализ ──
observeOnce(document.getElementById('screen-analysis'), () => {
  document.querySelector('#screen-analysis .split-label').classList.add('visible');
  typeText(document.getElementById('analysis-p1'), TEXTS.analysis, SPD_MED);
});

// ── Объединённый блок User flow + UI ──
observeOnce(document.getElementById('screen-flow-ui'), () => {
  document.querySelectorAll('#screen-flow-ui .flow-ui-label').forEach((l, i) => {
    setTimeout(() => l.classList.add('visible'), i * 120);
  });
  typeText(document.getElementById('scenario-text'), TEXTS.scenario, SPD_MED);
  typeText(document.getElementById('ui-p1'), TEXTS.ui, SPD_MED);
});

// Видео-блоки появляются последовательно при скролле
document.querySelectorAll('.flow-ui-video-block').forEach((block, i) => {
  observeOnce(block, () => {
    setTimeout(() => block.classList.add('visible'), i * 180);
  });
});

// ── Лейбл брендинга ──
observeOnce(document.querySelector('.group-branding .group-label'), () => {
  document.querySelector('.group-branding .group-label').classList.add('visible');
});

// ── Метрики + Результат ──
observeOnce(document.getElementById('metrics-text'), () => {
  // Добавляем класс для спецанимации глитч-появления
  document.querySelectorAll('#screen-metrics-result .split-label').forEach((l, i) => {
    l.classList.add('glitch-reveal');
    setTimeout(() => l.classList.add('visible'), i * 150);
  });
  typeText(document.getElementById('metrics-text'), TEXTS.metrics, SPD_MED)
    .then(() => typeText(document.getElementById('result-text'), TEXTS.result, SPD_MED));
});

// ── CTA кнопки ──
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

// ── Принудительно запускаем inline видео ──
document.querySelectorAll('.flow-ui-video video').forEach(v => {
  const tryPlay = () => v.play().catch(() => {});
  tryPlay();
  v.addEventListener('loadedmetadata', tryPlay);
  document.addEventListener('scroll', tryPlay, { once: true, passive: true });
  document.addEventListener('click', tryPlay, { once: true });
});

/* ══════════════════════════════════════
   LIGHTBOX — клик на картинку открывает её на весь экран с [ X ]
══════════════════════════════════════ */
(function initLightbox() {
  // Создаём оверлей один раз
  const overlay = document.createElement('div');
  overlay.className = 'erm-lightbox';
  overlay.innerHTML = `
    <button class="erm-lightbox__close" aria-label="Close">
      <svg class="px-close" width="80" height="40" viewBox="0 0 80 40" xmlns="http://www.w3.org/2000/svg">
        <!-- Левая скобка [ -->
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
        <!-- Крест X в центре (сетка 5x5 клеток по 4px, x=28..48, y=10..30) -->
        <rect x="28" y="10" width="4" height="4" fill="currentColor"/>
        <rect x="44" y="10" width="4" height="4" fill="currentColor"/>
        <rect x="32" y="14" width="4" height="4" fill="currentColor"/>
        <rect x="40" y="14" width="4" height="4" fill="currentColor"/>
        <rect x="36" y="18" width="4" height="4" fill="currentColor"/>
        <rect x="32" y="22" width="4" height="4" fill="currentColor"/>
        <rect x="40" y="22" width="4" height="4" fill="currentColor"/>
        <rect x="28" y="26" width="4" height="4" fill="currentColor"/>
        <rect x="44" y="26" width="4" height="4" fill="currentColor"/>
        <!-- Правая скобка ] -->
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
    // Не перехватываем клики внутри лайтбокса
    if (e.target.closest('.erm-lightbox')) return;
    const picture = e.target.closest('.gi img, .about-mockup img');
    if (picture && picture.src) {
      e.preventDefault();
      openImage(picture.src);
      return;
    }
    const flowVideoWrap = e.target.closest('.flow-ui-video');
    if (flowVideoWrap) {
      const v = flowVideoWrap.querySelector('video');
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