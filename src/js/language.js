/* Немедленно ставим data-lang на <html> — до парсинга остального body */
document.documentElement.setAttribute('data-lang', localStorage.getItem('userLanguage') || 'ru');

(function() {
    const KEY = 'userLanguage';
    const savedLang = localStorage.getItem(KEY) || 'ru';

    function applyLanguage(lang) {
        const isEn = lang === 'en';
        localStorage.setItem(KEY, lang);
        document.documentElement.lang = lang;
        document.documentElement.setAttribute('data-lang', lang);

        document.querySelectorAll('[data-ru]').forEach(el => {
            const text = isEn ? el.getAttribute('data-en') : el.getAttribute('data-ru');
            if (text !== null) el.textContent = text;
        });

        const btnRu = document.getElementById('lang-ru');
        const btnEn = document.getElementById('lang-en');
        if (btnRu && btnEn) {
            btnRu.style.opacity = isEn ? '0.5' : '1';
            btnEn.style.opacity = isEn ? '1' : '0.5';
        }

        const fixedRu = document.getElementById('lang-ru-fixed');
        const fixedEn = document.getElementById('lang-en-fixed');
        if (fixedRu && fixedEn) {
            fixedRu.style.opacity = isEn ? '0.5' : '1';
            fixedEn.style.opacity = isEn ? '1' : '0.5';
        }
    }

    applyLanguage(savedLang);

    document.addEventListener('DOMContentLoaded', () => {
        applyLanguage(savedLang);

        const btnRu = document.getElementById('lang-ru');
        const btnEn = document.getElementById('lang-en');
        if (btnRu) btnRu.onclick = () => applyLanguage('ru');
        if (btnEn) btnEn.onclick = () => applyLanguage('en');

        const fixedRu = document.getElementById('lang-ru-fixed');
        const fixedEn = document.getElementById('lang-en-fixed');
        if (fixedRu) fixedRu.onclick = () => { applyLanguage('ru'); document.getElementById('lang-ru')?.click(); };
        if (fixedEn) fixedEn.onclick = () => { applyLanguage('en'); document.getElementById('lang-en')?.click(); };
    });

    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(() => {
            setTimeout(() => applyLanguage(savedLang), 0);
        });
    }

    /* Фикс bfcache: когда пользователь возвращается назад,
       браузер восстанавливает страницу из кэша — pageshow срабатывает
       с persisted=true. Перечитываем язык из localStorage и применяем заново. */
    window.addEventListener('pageshow', (e) => {
        if (e.persisted) {
            applyLanguage(localStorage.getItem(KEY) || 'ru');
        }
    });
})();