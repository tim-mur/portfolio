import './cursor.js';

const glitchWrap = document.getElementById('glitch-wrap');
const layerC = document.getElementById('layer-cyan');
const layerM = document.getElementById('layer-magenta');

const ri = (a, b) => Math.floor(Math.random() * (b - a)) + a;
const rf = (a, b) => Math.random() * (b - a) + a;

// 1. Реакция на мышь
if (glitchWrap) {
  window.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 40;
    const y = (e.clientY / window.innerHeight - 0.5) * 40;

    if (layerC) layerC.style.transform = `translate(${x}px, ${y}px)`;
    if (layerM) layerM.style.transform = `translate(${-x}px, ${-y}px)`;
  });
}

// 2. Тот самый глитч-эффект со скачками
function glitchEffect() {
  const nextGlitch = ri(1500, 4000);
  
  setTimeout(() => {
    if (layerC && layerM) {
      const clip = `inset(${ri(0, 80)}% 0 ${ri(0, 80)}% 0)`;
      layerC.style.clipPath = clip;
      layerM.style.clipPath = clip;
      
      const offset = ri(-15, 15);
      layerC.style.left = `${offset}px`;
      layerM.style.left = `${-offset}px`;

      setTimeout(() => {
        layerC.style.clipPath = 'none';
        layerM.style.clipPath = 'none';
        layerC.style.left = '0';
        layerM.style.left = '0';
      }, ri(50, 150));
    }
    glitchEffect();
  }, nextGlitch);
}

glitchEffect();

// 3. Микро-дрожание
setInterval(() => {
  if (layerC) layerC.style.marginLeft = `${rf(-1.5, 1.5)}px`;
  if (layerM) layerM.style.marginTop = `${rf(-1.5, 1.5)}px`;
}, 60);
