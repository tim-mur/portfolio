import './cursor.js';

const layerC = document.getElementById('layer-cyan');
const layerM = document.getElementById('layer-magenta');

const ri = (a, b) => Math.floor(Math.random() * (b - a)) + a;
const rf = (a, b) => Math.random() * (b - a) + a;

// Реакция на движение мыши
window.addEventListener('mousemove', (e) => {
  const x = (e.clientX / window.innerWidth - 0.5) * 35;
  const y = (e.clientY / window.innerHeight - 0.5) * 35;
  if (layerC) layerC.style.transform = `translate(${x}px, ${y}px)`;
  if (layerM) layerM.style.transform = `translate(${-x}px, ${-y}px)`;
});

// "Ломаный" глитч через clip-path
function triggerGlitch() {
  const duration = ri(50, 150);
  const clip = `inset(${ri(0, 70)}% 0 ${ri(0, 70)}% 0)`;
  
  [layerC, layerM].forEach(l => {
    if (l) {
      l.style.clipPath = clip;
      l.style.opacity = '1';
    }
  });

  setTimeout(() => {
    [layerC, layerM].forEach(l => {
      if (l) {
        l.style.clipPath = 'none';
        l.style.opacity = '0.8';
      }
    });
    setTimeout(triggerGlitch, ri(2000, 5000));
  }, duration);
}

// Постоянная микро-вибрация
setInterval(() => {
  if (layerC) layerC.style.marginLeft = `${rf(-1, 1)}px`;
  if (layerM) layerM.style.marginTop = `${rf(-1, 1)}px`;
}, 70);

triggerGlitch();
