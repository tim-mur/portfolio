(function() {
    const init404 = () => {
        const backBtn = document.getElementById('back-btn');
        
        // 1. Умная навигация
        if (backBtn) {
            const referrer = document.referrer;
            const currentHost = window.location.hostname;

            // Проверяем, что пользователь пришел с твоего сайта
            if (referrer && referrer.includes(currentHost)) {
                backBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    window.location.href = referrer;
                });
            } else {
                // Если зашли по прямой ссылке, кнопка просто ведет на главную
                backBtn.href = '/portfolio/index.html';
            }
        }

        // 2. Глитч-эффект для слоев (только по X, чтобы не дергалось слишком сильно)
        const layers = document.querySelectorAll('.glitch-layer');
        if (layers.length > 0) {
            setInterval(() => {
                layers.forEach(layer => {
                    if (Math.random() > 0.97) {
                        const x = (Math.random() * 4 - 2) + 'px';
                        layer.style.transform = `translate(${x}, 0)`;
                    } else {
                        layer.style.transform = 'translate(0, 0)';
                    }
                });
            }, 120);
        }
    };

    // Ждем загрузки DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init404);
    } else {
        init404();
    }
})();
