// Импортируем курсор, если он нужен на этой странице
import './cursor.js';

const glitchWrap = document.getElementById('glitch-wrap');
const layerC = document.getElementById('layer-cyan');
const layerM = document.getElementById('layer-magenta');

if (glitchWrap) {
  window.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 30;
    const y = (e.clientY / window.innerHeight - 0.5) * 30;

    if (layerC) layerC.style.transform = `translate(${x}px, ${y}px)`;
    if (layerM) layerM.style.transform = `translate(${-x}px, ${-y}px)`;
  });
}

setInterval(() => {
  const rx = Math.random() * 6 - 3;
  const ry = Math.random() * 6 - 3;
  if (layerC) layerC.style.marginLeft = `${rx}px`;
  if (layerM) layerM.style.marginTop = `${ry}px`;
}, 150);