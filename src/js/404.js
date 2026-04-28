(function() {
    const init404 = () => {
        const backBtn = document.getElementById('back-btn');
        
        if (backBtn) {
            const referrer = document.referrer;
            const currentHost = window.location.hostname;

            // Если пришли с внутреннего URL — возвращаем назад, иначе на главную
            if (referrer && referrer.includes(currentHost)) {
                backBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    window.location.href = referrer;
                });
            } else {
                backBtn.href = '/portfolio/index.html';
            }
        }

        // Страховка для курсора: если через 500мс его нет, возвращаем дефолтный
        setTimeout(() => {
            if (!document.getElementById('cursor') && !document.querySelector('.cursor')) {
                document.body.style.cursor = 'auto';
            }
        }, 500);
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init404);
    } else {
        init404();
    }
})();
