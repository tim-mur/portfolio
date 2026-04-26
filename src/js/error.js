document.addEventListener('DOMContentLoaded', () => {
    // Логика кнопок (универсальная)
    const setupSwitcher = (containerId) => {
        const container = document.getElementById(containerId);
        if (!container) return;
        const btns = container.querySelectorAll('.mode-btn, .lang-btn');
        btns.forEach(btn => {
            btn.addEventListener('click', () => {
                btns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
    };

    setupSwitcher('mode-switcher');
    setupSwitcher('lang-switcher');

    // Глитч 302 (из profimatika.js)
    const wrap = document.getElementById('glitch-wrap');
    const layers = document.querySelectorAll('.glitch-layer');
    let interval;

    wrap.addEventListener('mouseenter', () => {
        layers.forEach(l => l.style.display = 'block');
        interval = setInterval(() => {
            layers.forEach(l => {
                const x = (Math.random() - 0.5) * 10;
                const y = (Math.random() - 0.5) * 5;
                l.style.transform = `translate(${x}px, ${y}px)`;
            });
        }, 40);
    });

    wrap.addEventListener('mouseleave', () => {
        clearInterval(interval);
        layers.forEach(l => {
            l.style.display = 'none';
            l.style.transform = 'translate(0, 0)';
        });
    });
});