(function() {
    document.addEventListener('DOMContentLoaded', () => {
        const backBtn = document.getElementById('back-btn');
        if (!backBtn) {
            console.error('Кнопка с id="back-btn" не найдена!');
            return;
        }

        const referrer = document.referrer;
        const currentHost = window.location.hostname;

        // Отладочный лог — посмотри его в консоли (F12)
        console.log('Referrer:', referrer);

        // Если есть referrer и он ведет с твоего сайта
        if (referrer && referrer.indexOf(currentHost) !== -1) {
            backBtn.addEventListener('click', (e) => {
                e.preventDefault();
                window.location.href = referrer;
            });
        } else {
            // Если зашли напрямую или извне — просто ставим ссылку на главную
            backBtn.href = '/portfolio/index.html';
        }

        // Минимальный глитч-эффект для слоев
        const layers = document.querySelectorAll('.glitch-layer');
        if (layers.length > 0) {
            setInterval(() => {
                layers.forEach(layer => {
                    if (Math.random() > 0.95) {
                        const x = (Math.random() * 4 - 2) + 'px';
                        layer.style.transform = `translate(${x}, 0)`;
                    } else {
                        layer.style.transform = 'translate(0, 0)';
                    }
                });
            }, 100);
        }
    });
})();
