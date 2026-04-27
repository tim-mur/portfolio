/**
 * Скрипт для страницы 404
 */

document.addEventListener('DOMContentLoaded', () => {
    initBackNavigation();
    initGlitchEffect();
    // Если у тебя на сайте есть глобальный переключатель языка, 
    // можно вызвать функцию обновления текстов здесь
});

/**
 * Логика навигации назад
 * Проверяет referrer: если пользователь пришел изнутри сайта — возвращает назад,
 * если зашел по прямой ссылке — отправляет на главную.
 */
function initBackNavigation() {
    const backBtn = document.getElementById('back-btn');
    if (!backBtn) return;

    const referrer = document.referrer;
    const currentHost = window.location.hostname;

    // Проверка: пришел ли пользователь с твоего же домена
    if (referrer && referrer.includes(currentHost)) {
        backBtn.addEventListener('click', (e) => {
            e.preventDefault();
            // Используем location.href вместо history.back для надежности в новых вкладках
            window.location.href = referrer;
        });
    } else {
        // Если зашли "извне", кнопка просто сработает как ссылка на index.html
        backBtn.setAttribute('href', '/portfolio/index.html');
    }
}

/**
 * Дополнительная микро-анимация глитча (по желанию)
 * Можно добавить рандомные скачки слоев через JS для большей "битости"
 */
function initGlitchEffect() {
    const layers = document.querySelectorAll('.glitch-layer');
    
    if (layers.length > 0) {
        setInterval(() => {
            layers.forEach(layer => {
                // Шанс 10% что слой дернется
                if (Math.random() > 0.9) {
                    const x = (Math.random() * 4 - 2) + 'px';
                    const y = (Math.random() * 2 - 1) + 'px';
                    layer.style.transform = `translate(${x}, ${y})`;
                } else {
                    layer.style.transform = 'translate(0, 0)';
                }
            });
        }, 150);
    }
}

/**
 * Функция для смены языка (если планируешь использовать)
 * Ищет элементы с data-ru / data-en и меняет textContent
 */
export function updateLanguage(lang = 'ru') {
    const elements = document.querySelectorAll('[data-' + lang + ']');
    elements.forEach(el => {
        el.textContent = el.getAttribute('data-' + lang);
    });
}
