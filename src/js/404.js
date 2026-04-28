(function() {
    /**
     * Инициализация функционала страницы 404
     */
    const init404Page = () => {
        const backBtn = document.getElementById('back-btn');
        
        // 1. Настройка "умной" навигации кнопки назад
        if (backBtn) {
            const referrer = document.referrer;
            const currentHost = window.location.hostname;

            // Проверяем: если пользователь пришел с вашего сайта (любой внутренней страницы)
            if (referrer && referrer.includes(currentHost)) {
                backBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    // Возвращаем его ровно туда, откуда он пришел
                    window.location.href = referrer;
                });
            } else {
                // Если зашли по прямой ссылке или извне, кнопка ведет на главную
                backBtn.href = '/portfolio/index.html';
            }
        }

        // 2. Дополнительная проверка для кастомного курсора
        // Если курсор не инициализировался из cursor.js, принудительно показываем стандартный
        setTimeout(() => {
            const customCursor = document.getElementById('cursor') || document.querySelector('.cursor');
            if (!customCursor) {
                document.body.style.cursor = 'auto';
            }
        }, 500);
    };

    // Запуск после загрузки DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init404Page);
    } else {
        init404Page();
    }
})();
