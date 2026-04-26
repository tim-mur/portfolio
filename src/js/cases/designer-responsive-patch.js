(function () {
  var BREAKPOINT = 1024;

  /* Маппинг slug кейса → путь */
  var CASE_URLS = {
    'ЭРМИТАЖ':      '/designer/cases/ermitazh.html',
    'HERMITAGE':    '/designer/cases/ermitazh.html',
    'ПРОФИМАТИКА':  '/designer/cases/profimatika.html',
    'PROFIMATIKA':  '/designer/cases/profimatika.html',
    'RINSER STORE': '/designer/cases/rinser-store.html',
    'ЯНДЕКС КРАУД': '/designer/cases/yandex-crowd.html',
    'YANDEX CROWD': '/designer/cases/yandex-crowd.html',
  };

  var LABEL_RU = '[ ПОСМОТРЕТЬ КЕЙС ]';
  var LABEL_EN = '[ VIEW CASE ]';

  function getLang() {
    return localStorage.getItem('userLanguage') || 'ru';
  }

  function getLabel() {
    return getLang() === 'en' ? LABEL_EN : LABEL_RU;
  }

  function getCaseUrl(card) {
    var titleEl = card.querySelector('.case-title');
    if (!titleEl) return '#';
    var text = (titleEl.textContent || '').trim().toUpperCase();
    return CASE_URLS[text] || '#';
  }

  function removeClones() {
    document.querySelectorAll('.case-view-btn').forEach(function (el) {
      el.remove();
    });
  }

  function addButtons() {
    var lang = getLang();
    var label = lang === 'en' ? LABEL_EN : LABEL_RU;

    document.querySelectorAll('.case-card').forEach(function (card) {
      /* Не дублируем */
      if (card.querySelector('.case-view-btn')) return;

      var mediaWrap = card.querySelector('.case-media-wrap');
      if (!mediaWrap) return;

      var url = getCaseUrl(card);

      var btn = document.createElement('a');
      btn.className = 'case-cta case-view-btn';
      btn.href = url;
      btn.setAttribute('data-ru', LABEL_RU);
      btn.setAttribute('data-en', LABEL_EN);
      btn.textContent = label;

      var wrapper = document.createElement('div');
      wrapper.className = 'case-view-wrap';
      wrapper.appendChild(btn);

      mediaWrap.insertAdjacentElement('afterend', wrapper);
    });
  }

  function update() {
    if (window.innerWidth <= BREAKPOINT) {
      addButtons();
    } else {
      removeClones();
    }
  }

  /* Обновить текст кнопок при смене языка */
  function updateLang() {
    var lang = getLang();
    var label = lang === 'en' ? LABEL_EN : LABEL_RU;
    document.querySelectorAll('.case-view-btn').forEach(function (btn) {
      btn.textContent = label;
    });
  }

  document.addEventListener('DOMContentLoaded', update);
  window.addEventListener('resize', update);

  /* Слушаем смену языка через storage */
  window.addEventListener('storage', function (e) {
    if (e.key === 'userLanguage') updateLang();
  });
})();