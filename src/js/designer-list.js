(function () {
  var slides = Array.prototype.slice.call(document.querySelectorAll('.slide'));
  var N = slides.length;
  if (N < 2) return;

  slides.forEach(function (el, i) {
    el.style.zIndex = String(i + 1);
  });

  var progress = 0;
  var target = 0;
  var rafId = null;
  var LERP = 0.11;
  var PARALLAX = 0.35;

  function apply(p) {
    slides.forEach(function (el, i) {
      var ty;
      if (i === 0) {
        ty = -Math.min(p, 1) * PARALLAX * 100;
      } else {
        var entry = p - (i - 1);
        if (entry <= 0) ty = 100;
        else if (entry <= 1) ty = (1 - entry) * 100;
        else ty = -Math.min(entry - 1, 1) * PARALLAX * 100;
      }
      el.style.transform = 'translateY(' + ty + '%)';
    });
  }

  function tick() {
    var diff = target - progress;
    if (Math.abs(diff) < 0.001) {
      progress = target;
      apply(progress);
      rafId = null;
      return;
    }
    progress += diff * LERP;
    apply(progress);
    rafId = requestAnimationFrame(tick);
  }

  window.addEventListener('wheel', function (e) {
    e.preventDefault();
    target += e.deltaY / window.innerHeight;
    target = Math.max(0, Math.min(N - 1, target));
    if (!rafId) rafId = requestAnimationFrame(tick);
  }, { passive: false });

  // Начальная установка
  apply(0);
})();
