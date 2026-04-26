import '../cursor.js';
import '../lightbox.js';

/* ─────────────────────────────────────────────────────────
   ELEMENTS
───────────────────────────────────────────────────────── */
const glitchWrap  = document.getElementById('glitch-wrap');
const glitchTitle = document.getElementById('glitch-title');
const layerC = document.getElementById('layer-cyan');
const layerM = document.getElementById('layer-magenta');
const content = document.querySelector('.page-content');
const footer  = document.getElementById('footer');

const ri = (a, b) => Math.floor(Math.random() * (b - a)) + a;
const rf = (a, b) => Math.random() * (b - a) + a;

/* ─────────────────────────────────────────────────────────
   TEXTS
───────────────────────────────────────────────────────── */
const T = {
  ru: {
    about_p1:'Профиматика — это ведущая онлайн-школа по подготовке к экзаменам, успешно работающая на рынке более 6 лет. За это время команда сформировала масштабную образовательную экосистему, объединяющую преподавателей с большим практическим опытом подготовки учеников к государственным экзаменам и университетским сессиям.',
    about_p2:'Ключевой особенностью бренда является акцент на системности обучения и высокой экспертности наставников. Передо мной стояла задача создать интерфейс, который поддерживает сложные образовательные процессы и одновременно остаётся понятным для пользователей разного возраста и уровня цифровой грамотности.',
    problem_p1:'Традиционные платформы для подготовки к экзаменам часто обладают устаревшим интерфейсом и разрозненным функционалом. Пользователи вынуждены использовать сразу несколько инструментов: отдельные сервисы для решения заданий, сторонние калькуляторы и мессенджеры для коммуникации с преподавателями.',
    problem_p2:'В ходе предварительного анализа было выявлено, что ключевые сложности пользователей связаны не только с функционалом, но и со структурой интерфейса. Пользователи терялись в навигации, испытывали трудности при поиске нужных заданий и не всегда понимали, какие шаги необходимо выполнить для достижения результата.',
    problem_p3:'Основной задачей было сформировать цифровую среду, где пользователь может быстро переходить от поиска темы к выполнению заданий, анализу ошибок и отслеживанию прогресса без необходимости переключаться между сторонними инструментами.',
    research_p1:'В основу проектирования легли результаты комплексного количественного и качественного исследования пользовательского поведения. На первом этапе был проведён онлайн-опрос среди более чем 240 респондентов с использованием Google Forms.',
    research_p2:'Результаты опроса позволили выявить устойчивые поведенческие паттерны и определить ключевые проблемные зоны. Среди наиболее частых трудностей пользователей были зафиксированы:',
    research_list:['преподаватели тратили значительное количество времени на проверку и сопровождение заданий','ученики регулярно терялись при поиске нужной темы внутри каталога','пользователи сталкивались с недостатком актуальных заданий для отработки конкретных тем','часть материалов воспринималась как устаревшая и не соответствующая текущим требованиям','навигация внутри платформы воспринималась как перегруженная и недостаточно структурированная'],
    research_p3:'Для более глубокого анализа была применена методология AJTBD (Advanced Jobs To Be Done). Такой подход позволил рассматривать пользователей не только как роли, но и как носителей конкретных задач, которые они стремятся выполнить в определённых условиях.',
    research_p4:'На основе полученных данных были сформированы User Persona и разработаны Customer Journey Map (CJM), позволившие визуализировать путь пользователя от первого взаимодействия с платформой до регулярного использования системы.',
    design_p1:'Для обеспечения консистентности интерфейса и ускорения разработки была создана полноценная модульная дизайн-система, ориентированная на масштабируемость. Это позволило значительно сократить время на создание новых экранов и обеспечить единообразие интерфейса на всех уровнях продукта.',
    design_p2:'Все компоненты проектировались с использованием системы свойств и вариантов, что позволяло гибко управлять состояниями элементов и быстро адаптировать интерфейс под новые сценарии использования.',
    design_p3:'Визуальная стратегия строилась вокруг принципов читаемости и визуального спокойствия. Интерфейс проектировался так, чтобы не перегружать пользователя лишними визуальными акцентами и сохранять концентрацию при длительной работе с учебными материалами.',
    design_p4:'В результате была сформирована визуальная система, которая поддерживает сложные сценарии работы и остаётся устойчивой при добавлении новых функций.',
    roles_p1:'В основе платформы лежит ролевая архитектура, включающая три основных сегмента: школьники, студенты и преподаватели. Для каждой роли были определены отдельные пользовательские задачи, точки входа и сценарии взаимодействия с системой.',
    roles_p2:'На этапе проектирования были разработаны подробные User Flow, охватывающие более 12 основных пользовательских сценариев. Дополнительно были проработаны около 30 альтернативных веток поведения, учитывающих возможные ошибки пользователя и нестандартные действия внутри системы.',
    roles_p3:'В результате было создано 80+ экранов интерфейса, объединённых в единую логическую структуру. Каждый экран рассматривался как часть общего сценария, что позволило сохранить связность пользовательского опыта.',
    dashboards_p1:'Отдельное внимание было уделено проектированию аналитических интерфейсов, позволяющих пользователям отслеживать собственный прогресс и выявлять слабые зоны в подготовке.',
    dashboards_p2:'При создании дашбордов я опирался на лучшие практики визуализации данных и результаты конкурентного анализа образовательных платформ. В интерфейсе были использованы различные типы графических представлений данных:',
    dashboards_list:['линейные графики для отображения динамики прогресса','столбчатые диаграммы для сравнения результатов по отдельным темам','индикаторы выполнения для визуального отображения процента завершённых заданий','агрегированные показатели, отражающие общее состояние подготовки'],
    dashboards_p3:'Сложная количественная информация была преобразована в структурированные визуальные блоки, позволяющие пользователю мгновенно оценивать свои результаты и планировать дальнейшую работу.',
    modules_p1:'Платформа включает в себя комплекс функциональных модулей, объединённых в единую экосистему обучения. Центральным элементом стал масштабный каталог заданий, структурированный по предметам, темам и уровням сложности.',
    modules_p2:'Особое внимание было уделено системе навигации внутри каталога. Пользователь мог переходить от общего списка тем к конкретным заданиям за минимальное количество шагов.',
    modules_p3:'Дополнительно был спроектирован конструктор вариантов заданий, позволяющий формировать индивидуальные наборы задач для тренировки.',
    modules_p4:'В интерфейс также были интегрированы инструменты для анализа ошибок и повторного решения заданий, позволяющие системно устранять пробелы в знаниях.',
    modules_p5:'Каждый функциональный блок проектировался как часть единой структуры, что позволило объединить разрозненные образовательные процессы в одном интерфейсе.',
    process_p1:'Для ускорения разработки команда активно использовала AI-инструменты в рамках рабочего процесса. На протяжении более чем полугода я взаимодействовал с AI-ассистентами для подготовки дизайн-спецификаций и проверки логики компонентов.',
    process_p2:'Использование AI позволило быстрее формализовывать требования к интерфейсу и снижать вероятность расхождений между макетами и итоговой реализацией.',
    process_p3:'Дополнительно AI-инструменты использовались для оптимизации повторяющихся процессов, таких как подготовка описаний компонентов и проверка визуальной консистентности.',
    process_p4:'Такой подход позволил ускорить итерации разработки и обеспечить более точную передачу дизайн-решений на этап реализации.',
    metrics_intro:'На этапе проектирования была сформирована система ключевых продуктовых метрик, которые позволят количественно оценивать эффективность интерфейсных решений после запуска платформы. Нажмите на карточку, чтобы узнать больше.',
  },
  en:{
    about_p1:'Profimatika is a leading online school for exam preparation, successfully operating for over 6 years. The team has built a large-scale educational ecosystem uniting teachers with extensive practical experience.',
    about_p2:"The brand's key feature is its focus on systematic learning and the high expertise of mentors. My task was to create an interface that supports complex educational processes while remaining understandable for users of different ages.",
    problem_p1:'Traditional exam prep platforms often have outdated interfaces and fragmented functionality. Users must juggle several tools: separate task-solving services, third-party calculators and messengers for teacher communication.',
    problem_p2:'Preliminary analysis revealed that key user difficulties were related not only to functionality but to interface structure. Users got lost in navigation and struggled to find tasks or understand what steps to take.',
    problem_p3:'The main goal was to create a digital environment where users move quickly from finding a topic to solving tasks, analysing mistakes and tracking progress — without switching between third-party tools.',
    research_p1:'The design was based on comprehensive quantitative and qualitative user behaviour research. The first stage was an online survey of over 240 respondents using Google Forms.',
    research_p2:'Survey results revealed stable behavioural patterns and identified key problem areas:',
    research_list:['teachers spent significant time checking and supporting tasks','students regularly got lost when searching for topics in the catalog','users faced a lack of relevant tasks for practising specific topics','some materials were perceived as outdated and not matching exam requirements','platform navigation was perceived as overloaded and insufficiently structured'],
    research_p3:'For deeper analysis the AJTBD (Advanced Jobs To Be Done) methodology was applied, allowing viewing users not only as roles but as carriers of specific tasks they aim to complete under certain conditions.',
    research_p4:'Based on the data, User Personas and Customer Journey Maps (CJM) were created, visualising the user path from first interaction to regular system use.',
    design_p1:'To ensure interface consistency and accelerate development, a full modular design system focused on scalability was created, significantly reducing time to build new screens.',
    design_p2:'All components were designed using a system of properties and variants, enabling flexible state management and quick adaptation to new use cases.',
    design_p3:'Visual strategy was built around principles of readability and visual calm — not overloading users with unnecessary accents and maintaining concentration during long study sessions.',
    design_p4:'As a result, a visual system was formed that supports complex work scenarios and remains stable when new functions are added.',
    roles_p1:'The platform is based on a role architecture covering three main segments: schoolchildren, students, and teachers. Separate user tasks, entry points and interaction scenarios were defined for each role.',
    roles_p2:'Detailed User Flows were developed covering over 12 main user scenarios. Additionally, around 30 alternative behaviour branches were elaborated, accounting for possible user errors and non-standard actions.',
    roles_p3:'The result was 80+ interface screens combined into a unified logical structure, preserving the coherence of user experience even with many functions.',
    dashboards_p1:'Particular attention was given to designing analytical interfaces that let users track their progress and identify weak areas in their preparation.',
    dashboards_p2:'When creating dashboards, I drew on best data visualisation practices and competitive analysis of educational platforms. Various types of data representation were used:',
    dashboards_list:['line graphs for showing progress dynamics','bar charts for comparing results across topics','progress indicators for visualising task completion percentage','aggregated indicators reflecting overall preparation status'],
    dashboards_p3:'Complex quantitative information was transformed into structured visual blocks, letting users instantly assess their results and plan further work.',
    modules_p1:'The platform includes a complex of functional modules united in a single learning ecosystem. The central element is a large task catalog structured by subjects, topics, and difficulty levels.',
    modules_p2:'Special attention was given to navigation within the catalog — users move from general topic lists to specific tasks in the minimum number of steps.',
    modules_p3:'Additionally, a task variant constructor was designed, allowing users to form individual sets of tasks for training.',
    modules_p4:'Tools for error analysis and task re-solving were also integrated, letting users return to difficult topics and systematically eliminate knowledge gaps.',
    modules_p5:'Each functional block was designed as part of a unified structure, combining fragmented educational processes in a single interface.',
    process_p1:'To accelerate development, the team actively used AI tools in the workflow. For over six months, I worked with AI assistants to prepare design specifications and verify component logic.',
    process_p2:'Using AI allowed faster formalisation of interface requirements and reduced discrepancies between mockups and final implementation.',
    process_p3:'Additionally, AI tools were used to optimise repetitive processes such as preparing component descriptions and checking visual consistency.',
    process_p4:'This approach accelerated development iterations and ensured more accurate transfer of design solutions to the implementation stage.',
    metrics_intro:'At the design stage, a system of key product metrics was formed to evaluate the effectiveness of interface solutions after platform launch. Click on a card to learn more.',
  }
};

/* ─────────────────────────────────────────────────────────
   LANG HELPERS
───────────────────────────────────────────────────────── */
function getLang() { return localStorage.getItem('userLanguage') || 'ru'; }

function setText(id, val) {
  const el = document.getElementById(id);
  if (el && val !== undefined) el.textContent = val;
}

function setList(id, items) {
  const el = document.getElementById(id);
  if (!el || !Array.isArray(items)) return;
  el.innerHTML = items.map(s => `<li>${s}</li>`).join('');
}

function applyLang() {
  const lang = getLang();
  const t = T[lang] || T.ru;

  /* data-ru / data-en */
  document.querySelectorAll('[data-ru]').forEach(el => {
    const val = el.getAttribute('data-' + lang);
    if (val === null || val === undefined) return;
    if (el.children.length === 0) { el.innerHTML = val; }
    else {
      const tn = Array.from(el.childNodes).find(n => n.nodeType === 3);
      if (tn) tn.textContent = val;
    }
  });

  /* body paragraphs */
  setText('about-p1',       t.about_p1);
  setText('about-p2',       t.about_p2);
  setText('problem-p1',     t.problem_p1);
  setText('problem-p2',     t.problem_p2);
  setText('problem-p3',     t.problem_p3);
  setText('research-p1',    t.research_p1);
  setText('research-p2',    t.research_p2);
  setList('research-list',  t.research_list);
  setText('research-p3',    t.research_p3);
  setText('research-p4',    t.research_p4);
  setText('design-p1',      t.design_p1);
  setText('design-p2',      t.design_p2);
  setText('design-p3',      t.design_p3);
  setText('design-p4',      t.design_p4);
  setText('roles-p1',       t.roles_p1);
  setText('roles-p2',       t.roles_p2);
  setText('roles-p3',       t.roles_p3);
  setText('dashboards-p1',  t.dashboards_p1);
  setText('dashboards-p2',  t.dashboards_p2);
  setList('dashboards-list', t.dashboards_list);
  setText('dashboards-p3',  t.dashboards_p3);
  setText('modules-p1',     t.modules_p1);
  setText('modules-p2',     t.modules_p2);
  setText('modules-p3',     t.modules_p3);
  setText('modules-p4',     t.modules_p4);
  setText('modules-p5',     t.modules_p5);
  setText('process-p1',     t.process_p1);
  setText('process-p2',     t.process_p2);
  setText('process-p3',     t.process_p3);
  setText('process-p4',     t.process_p4);
  setText('metrics-intro',  t.metrics_intro);

  document.documentElement.lang = lang;
}

applyLang();
window.addEventListener('storage', e => { if (e.key === 'userLanguage') applyLang(); });
let _langCur = getLang();
setInterval(() => { const c = getLang(); if (c !== _langCur) { _langCur = c; applyLang(); } }, 150);

/* ─────────────────────────────────────────────────────────
   PARALLAX
───────────────────────────────────────────────────────── */
if (content) content.addEventListener('scroll', () => {
  const sy = content.scrollTop;
  const vh = content.clientHeight;

  if (glitchWrap) glitchWrap.style.transform = `translateY(${-sy * 0.25}px)`;

  const mi = document.querySelector('.about-mockup img, .about-mockup video');
  if (mi) {
    const r = mi.closest('.about-mockup').getBoundingClientRect();
    if (r.bottom > 0 && r.top < vh)
      mi.style.transform = `translateY(${(r.top + r.height / 2 - vh / 2) * 0.12}px)`;
  }

  document.querySelectorAll('.gi img, .gi video').forEach(img => {
    const r = img.parentElement.getBoundingClientRect();
    if (r.bottom > 0 && r.top < vh)
      img.style.transform = `translateY(${(r.top + r.height / 2 - vh / 2) * 0.03}px)`;
  });
}, { passive: true });

/* ─────────────────────────────────────────────────────────
   HERO GLITCH
───────────────────────────────────────────────────────── */
function gSet(l, dx, dy, sk, cl) {
  if (!l) return;
  l.style.opacity = '1';
  l.style.transform = `translate(${dx}px,${dy}px) skewX(${sk}deg)`;
  l.style.clipPath = cl;
}
function gReset(l) { if (!l) return; l.style.opacity='0'; l.style.transform=''; l.style.clipPath=''; }
function rClip() { return `inset(${ri(0,80)}% 0 ${ri(0,80)}% 0)`; }

function runGlitch(steps, lo, hi, done) {
  let t = 0;
  for (let i = 0; i < steps; i++) {
    const d = ri(lo, hi);
    setTimeout(() => {
      gSet(layerC, ri(-14,14), ri(-6,6), rf(-3,3), rClip());
      gSet(layerM, ri(-14,14), ri(-6,6), rf(-3,3), rClip());
      if (glitchTitle) glitchTitle.style.transform = `translateX(${ri(-8,8)}px)`;
    }, t);
    t += d;
  }
  setTimeout(() => {
    gReset(layerC); gReset(layerM);
    if (glitchTitle) glitchTitle.style.transform = '';
    done && done();
  }, t);
}

function idleGlitch() { runGlitch(ri(2,5), 20, 55, () => setTimeout(idleGlitch, ri(800,3000))); }

if (glitchTitle) {
  glitchTitle.style.opacity = '1';
  runGlitch(14, 30, 80, () => setTimeout(idleGlitch, ri(600,1400)));
}

/* ─────────────────────────────────────────────────────────
   OBSERVE ONCE
───────────────────────────────────────────────────────── */
function observe(el, cb, thr = 0.12) {
  if (!el) return;
  let done = false;
  const obs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !done) { done = true; obs.disconnect(); cb(); }
  }, { root: content, threshold: thr, rootMargin: '0px 0px -4% 0px' });
  obs.observe(el);
  requestAnimationFrame(() => {
    if (done) return;
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight && r.bottom > 0) { done = true; obs.disconnect(); cb(); }
  });
}

['screen-about','screen-problem','screen-research','screen-design',
 'screen-roles','screen-dashboards','screen-modules','screen-process']
.forEach(id => {
  observe(document.getElementById(id), () => {
    document.getElementById(id)?.querySelectorAll('.s-label,.split-label')
      .forEach(l => l.classList.add('visible'));
  });
});

observe(document.getElementById('about-cta-btn'), () => {
  document.getElementById('about-cta-btn')?.classList.add('visible');
});

document.querySelectorAll('.split-with-media__media').forEach(el =>
  observe(el, () => el.classList.add('visible'))
);

document.querySelectorAll('.flow-ui-video-block').forEach(el =>
  observe(el, () => el.classList.add('visible'))
);

observe(document.getElementById('screen-metrics'), () => {
  const lbl = document.querySelector('#screen-metrics .split-label');
  if (lbl) { lbl.classList.add('glitch-reveal'); requestAnimationFrame(() => lbl.classList.add('visible')); }
  document.querySelectorAll('.metric-card').forEach((c, i) =>
    setTimeout(() => c.classList.add('visible'), 120 + i * 120)
  );
});

/* ─────────────────────────────────────────────────────────
   METRICS ACCORDION
───────────────────────────────────────────────────────── */
document.querySelectorAll('.metric-card').forEach(card => {
  const tog = () => { const o = card.classList.toggle('is-open'); card.setAttribute('aria-expanded', String(o)); };
  card.addEventListener('click', tog);
  card.addEventListener('keydown', e => { if (e.key==='Enter'||e.key===' ') { e.preventDefault(); tog(); } });
});

/* ─────────────────────────────────────────────────────────
   VIDEO LIGHTBOX
───────────────────────────────────────────────────────── */
let _lb = null;

function getLightbox() {
  if (_lb) return _lb;
  _lb = document.createElement('div');
  _lb.className = 'erm-lightbox';
  _lb.innerHTML = `<button class="erm-lightbox__close" aria-label="Закрыть"><svg class="px-close" width="28" height="28" viewBox="0 0 28 28" fill="none"><path d="M4 4L24 24M24 4L4 24" stroke="currentColor" stroke-width="2.5" stroke-linecap="square"/></svg></button><div class="erm-lightbox__inner"></div>`;
  document.body.appendChild(_lb);
  const close = () => {
    _lb.classList.remove('is-open');
    const v = _lb.querySelector('video');
    if (v) { v.pause(); v.src = ''; }
    setTimeout(() => { _lb.querySelector('.erm-lightbox__inner').innerHTML = ''; }, 280);
  };
  _lb.querySelector('.erm-lightbox__close').addEventListener('click', close);
  _lb.addEventListener('click', e => { if (e.target === _lb) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  return _lb;
}

function openVideoLightbox(src) {
  if (typeof window.openLightbox === 'function') { window.openLightbox({ type:'video', src }); return; }
  const lb = getLightbox();
  lb.querySelector('.erm-lightbox__inner').innerHTML =
    `<video class="erm-lightbox__video" src="${src}" controls autoplay playsinline></video>`;
  lb.classList.add('is-open');
  lb.querySelector('video').play().catch(()=>{});
}

document.querySelectorAll('.split-with-media__media, .flow-ui-media').forEach(box => {
  box.addEventListener('click', () => {
    const v = box.querySelector('video');
    if (v) openVideoLightbox(v.src || v.getAttribute('src'));
  });
});

/* ─────────────────────────────────────────────────────────
   FOOTER PULL-UP
───────────────────────────────────────────────────────── */
(function() {
  if (!footer || !content) return;
  let prog = 0, target = 0, raf = null, socialDone = false;
  const SENS = 0.75;

  function apply(p) {
    footer.style.transform = `translateY(${(1-p)*100}%)`;
    if (p > 0.55 && !socialDone) { socialDone = true; animateFooterSocial(); }
    else if (p < 0.1) socialDone = false;
  }

  function tick() {
    const d = target - prog;
    if (Math.abs(d) < 0.0008) { prog = target; apply(prog); raf = null; return; }
    prog += d * 0.18;
    apply(prog);
    raf = requestAnimationFrame(tick);
  }
  function run() { if (!raf) raf = requestAnimationFrame(tick); }
  function atBot() { return content.scrollTop + content.clientHeight >= content.scrollHeight - 2; }

  window.addEventListener('wheel', e => {
    let dy = e.deltaY;
    if (e.deltaMode === 1) dy *= 32;
    if (e.deltaMode === 2) dy *= 300;
    if (target > 0 || (dy > 0 && atBot())) {
      e.preventDefault();
      target = Math.min(1, Math.max(0, target + dy * SENS / window.innerHeight));
      run();
    }
  }, { passive: false });

  let ty0 = null;
  window.addEventListener('touchstart', e => { ty0 = e.touches[0].clientY; }, { passive: true });
  window.addEventListener('touchmove', e => {
    if (ty0 === null) return;
    const dy = ty0 - e.touches[0].clientY; ty0 = e.touches[0].clientY;
    if (target > 0 || (dy > 0 && atBot())) {
      if (e.cancelable) e.preventDefault();
      target = Math.min(1, Math.max(0, target + dy * 1.3 / window.innerHeight));
      run();
    }
  }, { passive: false });
  window.addEventListener('touchend', () => { ty0 = null; target = target > 0.45 ? 1 : 0; run(); }, { passive: true });

  apply(0);
})();

/* ─────────────────────────────────────────────────────────
   FOOTER SOCIAL ANIMATION
───────────────────────────────────────────────────────── */
function animateFooterSocial() {
  const icons = [...document.querySelectorAll('.footer__icon')];
  const lines = [...document.querySelectorAll('.footer__line')];
  const D = 340, E = 'cubic-bezier(0.22,1,0.36,1)';
  [
    () => icons[0]?.style.setProperty('animation', `iconIn ${D}ms ${E} forwards`),
    () => lines[0]?.style.setProperty('animation', `lineIn ${D}ms ${E} forwards`),
    () => icons[1]?.style.setProperty('animation', `iconIn ${D}ms ${E} forwards`),
    () => lines[1]?.style.setProperty('animation', `lineIn ${D}ms ${E} forwards`),
    () => icons[2]?.style.setProperty('animation', `iconIn ${D}ms ${E} forwards`),
  ].forEach((fn, i) => setTimeout(fn, i * (D + 35)));
}

/* ─────────────────────────────────────────────────────────
   AUTOPLAY VIDEOS
───────────────────────────────────────────────────────── */
document.querySelectorAll('video[autoplay]').forEach(v => {
  const play = () => v.play().catch(()=>{});
  play();
  v.addEventListener('loadedmetadata', play);
  ['click','touchstart','keydown'].forEach(ev =>
    document.addEventListener(ev, play, { once: true, passive: true })
  );
});