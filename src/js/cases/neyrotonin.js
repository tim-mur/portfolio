import '../cursor.js'
import '../lightbox.js'

/* ══════════════════════════════════════
   ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ И ЭЛЕМЕНТЫ
══════════════════════════════════════ */
const heroWrap = document.getElementById('glitch-wrap');
const aboutEl  = document.getElementById('screen-2');
const title    = document.getElementById('glitch-title');
const layerC   = document.getElementById('layer-cyan');
const layerM   = document.getElementById('layer-magenta');

let footerAnimatedFlag = false;
let aboutStarted = false;

const ri = (a, b) => Math.floor(Math.random() * (b - a)) + a;
const rf = (a, b) => Math.random() * (b - a) + a;

/* ══════════════════════════════════════
   SCROLL / PARALLAX LOGIC
══════════════════════════════════════ */
function onContentScroll() {
  const content = document.querySelector('.page-content');
  if (!content) return;
  const sy   = content.scrollTop;
  const winH = content.clientHeight;

  if (heroWrap) heroWrap.style.transform = `translateY(${-sy * 0.4}px)`;

  const aboutRect = aboutEl.getBoundingClientRect();
  if (aboutRect.top < winH && aboutRect.bottom > 0) {
    aboutEl.style.transform = `translateY(${-(sy - aboutEl.offsetTop) * 0.3}px)`;
  }

  document.querySelectorAll('.gi img, .gi video').forEach(img => {
    const r = img.parentElement.getBoundingClientRect();
    if (r.top < winH && r.bottom > 0) {
      img.style.transform = `translateY(${(r.top + r.height / 2 - winH / 2) * 0.12}px)`;
    }
  });
}

document.querySelector('.page-content').addEventListener('scroll', onContentScroll, { passive: true });

/* ══════════════════════════════════════
   FOOTER (WHEEL + TOUCH)
══════════════════════════════════════ */
(function () {
  const content = document.querySelector('.page-content');
  const footer  = document.getElementById('footer');
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
   TYPEWRITER ENGINE
══════════════════════════════════════ */
function typeText(el, text, spd) {
  return new Promise(res => {
    let i = 0; el.innerHTML = '';
    const cur = document.createElement('span');
    cur.className = 'cursor'; el.appendChild(cur);
    const iv = setInterval(() => {
      if (i < text.length) { el.insertBefore(document.createTextNode(text[i++]), cur); }
      else { clearInterval(iv); cur.remove(); res(); }
    }, spd);
  });
}

/* ══════════════════════════════════════
   ТЕКСТЫ (шаблонные строки — апострофы безопасны)
══════════════════════════════════════ */
const T1_RU  = `Проект создан для выездного мероприятия «Мы — команда», где команды соревновались в разных испытаниях. Моей задачей было разработать мерч и визуальный стиль, который отражает характер команды и её цели.`;
const T2_RU  = `«Нейротонин» показывает, что главное в жизни — получать удовольствие от движения и творчества, которое не заменят никакие нейросети. Логотип и стиль передают энергию, скорость и креативность команды. Также в дизайне есть скрытая метафора выбора и осознанности, как в знаменитой сцене с красной таблеткой из фильма «Матрица».`;
const GT1_RU = `Во время выезда я разработал более 25 аватарок для участников команды. Было создано два основных вида аватарок с единым стилем и композицией. Из-за технических ограничений мне пришлось вручную добавлять искусственный свет, чтобы добиться аккуратного и цельного визуала. Участники отличались позировкой и реквизитом, участвовавшим в кадре, что помогло сохранить индивидуальность каждого. В основе каждой аватарки использовался полный логотип команды. Это помогло быстро сформировать узнаваемый образ команды в цифровой среде.`;
const GT2_RU = `Я разработал несколько шаблонов постов для Telegram-канала команды. Этого количества хватило, чтобы создать разнообразный контент в рамках короткого выезда. Каждый шаблон был адаптирован под отдельные рубрики, такие как знакомство с командой, цитата дня и приветственный пост. Во всех макетах использовался единый графический элемент — молния, которая отражает характер команды. Шаблоны упростили создание контента и ускорили работу команды во время мероприятия.`;
const GT3_RU = `Создал два варианта логотипа и на их основе задизайнил мерч команды на время всего мероприятия. Из-за финансовых ограничений было разрешено использование лишь логотипов, но при этом я смог подготовить два отличающихся варианта, которые представляют обе идеи команды и полностью раскрывают суть, которую они пытаются донести.`;

const T1_EN  = `The project was created for the "We Are a Team" retreat, where teams competed in various challenges. My task was to design the merch and visual identity that reflects the team's character and goals.`;
const T2_EN  = `"Neyrotonin" shows that the most important thing in life is to enjoy movement and creativity — something no neural network can replace. The logo and style convey the team's energy, speed and creativity. The design also carries a hidden metaphor of choice and awareness, referencing the famous red pill scene from The Matrix.`;
const GT1_EN = `During the retreat I designed over 25 avatars for team members. Two main avatar styles were created with a unified composition. Due to technical constraints I had to manually add artificial lighting to achieve a clean, cohesive visual. Participants differed in pose and props, which preserved each person's individuality. Every avatar featured the full team logo, helping quickly build a recognisable team identity in the digital space.`;
const GT2_EN = `I designed several post templates for the team's Telegram channel — enough to produce varied content throughout the short retreat. Each template was tailored to a specific section: team introduction, quote of the day, and welcome post. All layouts share a single graphic element — the lightning bolt — that reflects the team's character. The templates simplified content creation and sped up the team's workflow during the event.`;
const GT3_EN = `Created two logo variants and used them to design the team's merch for the entire event. Due to budget constraints only logos were permitted, but I managed to prepare two distinct versions that represent both of the team's ideas and fully convey the message they want to communicate.`;

function getLang() { return localStorage.getItem('userLanguage') || 'ru'; }
const isEn = getLang() === 'en';

const T1  = isEn ? T1_EN  : T1_RU;
const T2  = isEn ? T2_EN  : T2_RU;
const GT1 = isEn ? GT1_EN : GT1_RU;
const GT2 = isEn ? GT2_EN : GT2_RU;
const GT3 = isEn ? GT3_EN : GT3_RU;

/* ══════════════════════════════════════
   TYPEWRITER OBSERVERS
══════════════════════════════════════ */
function startAbout() {
  if (aboutStarted) return; aboutStarted = true;
  document.getElementById('about-label').classList.add('visible');
  typeText(document.getElementById('p1'), T1, 22)
    .then(() => typeText(document.getElementById('p2'), T2, 16));
}

new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) startAbout(); });
}, { threshold: 0.2 }).observe(document.getElementById('screen-2'));

new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) document.getElementById('cta-btn').classList.add('visible'); });
}, { threshold: 0.1 }).observe(document.getElementById('cta-btn'));

function watchType(elId, text, spd) {
  const el = document.getElementById(elId); let s = false;
  new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting && !s) { s = true; typeText(el, text, spd); } });
  }, { threshold: 0.15 }).observe(el);
}
watchType('gt1-text', GT1, 18);
watchType('gt2-text', GT2, 18);
watchType('gt3-text', GT3, 18);

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