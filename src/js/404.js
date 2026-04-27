document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('back-btn');
    if (!btn) return;

    // Умный реферер
    if (document.referrer && document.referrer.includes(window.location.hostname)) {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = document.referrer;
        });
    } else {
        btn.href = '/portfolio/index.html';
    }

    // Микро-глитч для красоты
    const layers = document.querySelectorAll('.glitch-layer');
    setInterval(() => {
        layers.forEach(l => {
            l.style.transform = Math.random() > 0.95 
                ? `translate(${Math.random() * 6 - 3}px, 0)` 
                : 'translate(0,0)';
        });
    }, 100);
});
