import './cursor.js';

const glitchWrap = document.getElementById('glitch-wrap');
const layerC = document.getElementById('layer-cyan');
const layerM = document.getElementById('layer-magenta');

const ri = (a, b) => Math.floor(Math.random() * (b - a)) + a;
const rf = (a, b) => Math.random() * (b - a) + a;

// 1. Движение слоев за мышью
if (glitchWrap) {
  window.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 40;
    const y = (e.clientY / window.innerHeight - 0.5) * 40;

    if (layerC) layerC.style.transform = `translate(${x}px, ${y}px)`;
    if (layerM) layerM.style.transform = `translate(${-x}px, ${-y}px)`;
  });
}

// 2. Рандомный "дерганый" глитч (как в кейсе)
function startGlitchLoop() {
  setInterval(() => {
    if (layerC && layerM) {
      // Кратковременное смещение
      layerC.style.clipPath = `inset(${ri(0, 100)}% 0 ${ri(0, 100)}% 0)`;
      layerM.style.clipPath = `inset(${ri(0, 100)}% 0 ${ri(0, 100)}% 0)`;
      
      setTimeout(() => {
        layerC.style.clipPath = 'none';
        layerM.style.clipPath = 'none';
      }, ri(50, 150));
    }
  }, ri(2000, 4000));
}

startGlitchLoop();

// 3. Постоянная микро-вибрация слоев
setInterval(() => {
  if (layerC) layerC.style.marginLeft = `${rf(-2, 2)}px`;
  if (layerM) layerM.style.marginTop = `${rf(-2, 2)}px`;
}, 80);
