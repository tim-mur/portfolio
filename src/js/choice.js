// ================================
// choice.js
// (объединено: choice.js + choice-responsive-patch.js)
// ================================

import './cursor.js'
import './language.js'

// ── Easing ─────────────────────────────────────────────

function easeOutExpo(p){

  if (p === 1) return 1;

  return 1 - Math.pow(2, -14 * p);

}

function easeOutCubic(p){

  return 1 - Math.pow(1 - p, 3);

}


// ── Hover animation (title words) ───────────────────────

function animClip(el, fromPct, toPct, isTop){

  var start=null;

  var dur=380;

  function frame(ts){

    if(!start)
      start=ts;

    var p=Math.min((ts-start)/dur,1);

    p=easeOutExpo(p);

    var val=fromPct+(toPct-fromPct)*p;

    var clip=isTop
      ? 'inset(0 0 '+val+'% 0)'
      : 'inset('+val+'% 0 0 0)';

    el.querySelector('.t-green').style.clipPath=clip;

    if(p<1)
      requestAnimationFrame(frame);

  }

  requestAnimationFrame(frame);

}


// ── Elements ────────────────────────────────────────────

var tD=document.getElementById('t-designer');
var tP=document.getElementById('t-photographer');

tD.querySelector('.t-green').style.clipPath='inset(100% 0 0 0)';
tP.querySelector('.t-green').style.clipPath='inset(0 0 100% 0)';

tD.addEventListener('mouseenter',function(){ animClip(tD,100,0,false); });
tD.addEventListener('mouseleave',function(){ animClip(tD,0,100,false); });
tP.addEventListener('mouseenter',function(){ animClip(tP,100,0,true); });
tP.addEventListener('mouseleave',function(){ animClip(tP,0,100,true); });

// ── Title labels (i18n) ─────────────────────────────────

// Достаем язык из памяти сразу! (Ключ 'userLanguage' — тот же, что в main.html)
var SAVED_LANG = localStorage.getItem('userLanguage') || 'ru';
var _activeLang = SAVED_LANG;

var LABELS = {
  en: { designer: '[ designer ]',  photographer: '[ photographer ]' },
  ru: { designer: '[ дизайнер ]', photographer: '[ фотограф ]'     }
};

function setTitleLang(lang){

  var dBase  = tD.querySelector('.t-base');
  var dGreen = tD.querySelector('.t-green');
  var pBase  = tP.querySelector('.t-base');
  var pGreen = tP.querySelector('.t-green');

  dBase.textContent  = LABELS[lang].designer;
  dGreen.textContent = LABELS[lang].designer;
  pBase.textContent  = LABELS[lang].photographer;
  pGreen.textContent = LABELS[lang].photographer;

  layout();

}

// МГНОВЕННО применяем нужный текст ДО начала анимаций:
setTitleLang(SAVED_LANG);


// ── Lang switcher ───────────────────────────────────────

var _fillAnimId={left:null,right:null};

function animFill(fillEl, side, fromW, toW){

  var dur=300;
  var start=null;
  var current=fromW;

  if(_fillAnimId[side]) cancelAnimationFrame(_fillAnimId[side]);

  function frame(ts){

    if(!start) start=ts;

    var p=Math.min((ts-start)/dur,1);

    p=easeOutCubic(p);

    current=fromW+(toW-fromW)*p;

    fillEl.style.width=current+'%';

    if(p<1){
      _fillAnimId[side]=requestAnimationFrame(frame);
    } else {
      _fillAnimId[side]=null;
    }

  }

  _fillAnimId[side]=requestAnimationFrame(frame);

}

function getCurrentFillW(fillEl){

  return parseFloat(fillEl.style.width)||0;

}

function setActiveLang(lang){

  var langRu=document.getElementById('lang-ru');
  var langEn=document.getElementById('lang-en');
  var lineLeft=document.getElementById('line-left');
  var lineRight=document.getElementById('line-right');

  _activeLang=lang;

  if(lang==='ru'){

    langRu.classList.add('active');
    langEn.classList.remove('active');
    lineLeft.classList.add('is-active');
    lineRight.classList.remove('is-active');

  } else {

    langEn.classList.add('active');
    langRu.classList.remove('active');
    lineRight.classList.add('is-active');
    lineLeft.classList.remove('is-active');

  }

}

var _switching=false;

function switchLang(lang){

  if(_activeLang===lang||_switching) return;

  _switching=true;

  var trackL=document.querySelector('#line-left .line-track');
  var trackR=document.querySelector('#line-right .line-track');
  var lineLeft=document.getElementById('line-left');
  var lineRight=document.getElementById('line-right');
  var langRu=document.getElementById('lang-ru');
  var langEn=document.getElementById('lang-en');
  var fillLeft=document.getElementById('fill-left');
  var fillRight=document.getElementById('fill-right');

  var outTrack=lang==='en' ? trackL : trackR;
  var inTrack =lang==='en' ? trackR : trackL;

  // сбросить hover-fill
  animFill(fillLeft,'left',getCurrentFillW(fillLeft),0);
  animFill(fillRight,'right',getCurrentFillW(fillRight),0);

  // переключить кнопки сразу
  if(lang==='en'){
    langEn.classList.add('active');
    langRu.classList.remove('active');
  } else {
    langRu.classList.add('active');
    langEn.classList.remove('active');
  }

  // сменить текст кнопок и пересчитать layout
  setTitleLang(lang);

  // снять CSS-управление, зафиксировать текущие opacity инлайн
  lineLeft.classList.remove('is-active');
  lineRight.classList.remove('is-active');
  outTrack.style.opacity='1';
  inTrack.style.opacity='0.5';

  var DUR=350;
  var start=null;

  function frame(ts){

    if(!start) start=ts;

    var p=Math.min((ts-start)/DUR,1);

    p=easeOutCubic(p);

    outTrack.style.opacity=String(1-p*0.5);
    inTrack.style.opacity=String(0.5+p*0.5);

    if(p<1){

      requestAnimationFrame(frame);

    } else {

      outTrack.style.opacity='';
      inTrack.style.opacity='';

      if(lang==='en'){
        lineRight.classList.add('is-active');
      } else {
        lineLeft.classList.add('is-active');
      }

      _activeLang=lang;
      _switching=false;

    }

  }

  requestAnimationFrame(frame);

}

function setupLangSwitcher(){

  var langRu=document.getElementById('lang-ru');
  var langEn=document.getElementById('lang-en');
  var fillLeft=document.getElementById('fill-left');
  var fillRight=document.getElementById('fill-right');

  setActiveLang(_activeLang);

  langEn.addEventListener('mouseenter',function(){

    if(_activeLang!=='en'){
      animFill(fillRight,'right',getCurrentFillW(fillRight),50);
    }

  });

  langEn.addEventListener('mouseleave',function(){

    if(_activeLang!=='en'){
      animFill(fillRight,'right',getCurrentFillW(fillRight),0);
    }

  });

  langRu.addEventListener('mouseenter',function(){

    if(_activeLang!=='ru'){
      animFill(fillLeft,'left',getCurrentFillW(fillLeft),50);
    }

  });

  langRu.addEventListener('mouseleave',function(){

    if(_activeLang!=='ru'){
      animFill(fillLeft,'left',getCurrentFillW(fillLeft),0);
    }

  });

  langRu.addEventListener('click',function(){ switchLang('ru'); });
  langEn.addEventListener('click',function(){ switchLang('en'); });

}


// ── Layout ──────────────────────────────────────────────

var _layoutData=null;

function layout(){

  var EDGE_GAP=32;
  var LINE_GAP=32;

  var width=window.innerWidth;
  var height=window.innerHeight;

  tD.style.top='-9999px';
  tP.style.top='-9999px';

  var rD=tD.getBoundingClientRect();
  var rP=tP.getBoundingClientRect();

  var hD=rD.height; var wD=rD.width;
  var hP=rP.height; var wP=rP.width;

  var topD=EDGE_GAP; var leftD=(width-wD)/2;
  var topP=height-hP-EDGE_GAP; var leftP=(width-wP)/2;

  tD.style.top=topD+'px'; tD.style.left=leftD+'px';
  tP.style.top=topP+'px'; tP.style.left=leftP+'px';

  var vT=document.getElementById('v-top');

  var startY=topD+hD+LINE_GAP;
  var endY=topP-LINE_GAP;
  var fullHeight=endY-startY;
  var midY=startY+fullHeight/2;

  _layoutData={ startY:startY, endY:endY, fullHeight:fullHeight, midY:midY };

  if(!_introPlayed){

    vT.style.top=midY+'px';
    vT.style.height='0px';

  } else {

    vT.style.top=startY+'px';
    vT.style.height=fullHeight+'px';

  }

}


// ── Intro animation ─────────────────────────────────────

var _introPlayed=false;

function playIntro(){

  document.body.classList.add('intro-ready');
  setActiveLang(_activeLang);

  if(_introPlayed) return;

  _introPlayed=true;

  var vT=document.getElementById('v-top');
  var trackL=document.querySelector('#line-left .line-track');
  var trackR=document.querySelector('#line-right .line-track');
  var langRu=document.getElementById('lang-ru');
  var langEn=document.getElementById('lang-en');

  var VERT_DUR=700;
  var WORD_DELAY=300;
  var WORD_DUR=500;
  var HLINE_DELAY=450;
  var HLINE_DUR=500;
  var LANG_DELAY=600;
  var LANG_DUR=400;

  tD.style.opacity='0';
  tP.style.opacity='0';

  trackL.style.transformOrigin='right center';
  trackL.style.transform='scaleX(0)';

  trackR.style.transformOrigin='left center';
  trackR.style.transform='scaleX(0)';

  langRu.style.opacity='0';
  langEn.style.opacity='0';

  var lineStart=null;
  var data=_layoutData;

  function lineFrame(ts){

    if(!lineStart) lineStart=ts;

    var p=Math.min((ts-lineStart)/VERT_DUR,1);

    p=easeOutCubic(p);

    var half=data.fullHeight/2*p;

    vT.style.top=(data.midY-half)+'px';
    vT.style.height=(half*2)+'px';

    if(p<1) requestAnimationFrame(lineFrame);

  }

  requestAnimationFrame(lineFrame);

  setTimeout(function(){

    var hStart=null;

    function hFrame(ts){

      if(!hStart) hStart=ts;

      var p=Math.min((ts-hStart)/HLINE_DUR,1);

      p=easeOutCubic(p);

      trackL.style.transform='scaleX('+p+')';
      trackR.style.transform='scaleX('+p+')';

      if(p<1){

        requestAnimationFrame(hFrame);

      } else {

        trackL.style.transform='';
        trackR.style.transform='';
        trackL.style.transformOrigin='';
        trackR.style.transformOrigin='';

      }

    }

    requestAnimationFrame(hFrame);

  }, HLINE_DELAY);

  setTimeout(function(){

    var wordStart=null;

    function wordFrame(ts){

      if(!wordStart) wordStart=ts;

      var p=Math.min((ts-wordStart)/WORD_DUR,1);

      p=easeOutCubic(p);

      tD.style.opacity=String(p);
      tP.style.opacity=String(p);

      if(p<1) requestAnimationFrame(wordFrame);

    }

    requestAnimationFrame(wordFrame);

  }, WORD_DELAY);

  setTimeout(function(){

    var lStart=null;

    function lFrame(ts){

      if(!lStart) lStart=ts;

      var p=Math.min((ts-lStart)/LANG_DUR,1);

      p=easeOutCubic(p);

      langRu.style.opacity=String(p);
      langEn.style.opacity=String(p*0.5);

      if(p<1){

        requestAnimationFrame(lFrame);

      } else {

        langRu.style.opacity='';
        langEn.style.opacity='';

        setupLangSwitcher();

      }

    }

    requestAnimationFrame(lFrame);

  }, LANG_DELAY);

}


// ── Init ────────────────────────────────────────────────

function initLayout(){

  layout();
  playIntro();

}

if(document.fonts && document.fonts.ready){

  document.fonts.ready.then(initLayout);

}
else{

  window.addEventListener('load',initLayout);

}

window.addEventListener('resize',layout);

// ── Language persistence ─────────────────────────────────

(function(){

  // Используем тот же ключ, что и в language-swapper.js на главной
  var KEY = 'userLanguage'; 

  // Просто сохраняем выбор при каждом клике на кнопку языка
  var _origSwitch = switchLang;

  switchLang = function(lang){
    localStorage.setItem(KEY, lang);
    _origSwitch(lang);
  };

  // ВАЖНО: Мы удалили кусок кода с setTimeout, который вызывал "прыжок" текста!

})();
// --- из choice-responsive-patch.js ---
// ══════════════════════════════════════════════════════
// ИСПРАВЛЕННЫЙ PATCH v2 — вертикальная линия + lang-switcher
// ══════════════════════════════════════════════════════

function isVerticalLayout() {
  return window.matchMedia('(max-width: 1024px)').matches;
}

// ── Надёжный фикс обрыва intro и пропажи вертикальной линии ──

(function() {
  function forceIntroIfNeeded() {
    var vT = document.getElementById('v-top');
    if (!vT) return;

    var h = parseFloat(vT.style.height) || 0;
    var top = parseFloat(vT.style.top) || 0;

    // Если линия почти не видна или стоит в центре с нулевой высотой — перезапускаем
    if ((h < 30 || (top > 100 && h < 50)) && _layoutData) {
      console.log('Patch: перезапускаем intro (линия не выросла)');
      _introPlayed = false;
      layout();
      playIntro();
    }
  }

  // Проверяем через 800мс, 1500мс и 2500мс
  setTimeout(forceIntroIfNeeded, 800);
  setTimeout(forceIntroIfNeeded, 1500);
  setTimeout(forceIntroIfNeeded, 2500);

  // Дополнительно — после полной загрузки
  window.addEventListener('load', function() {
    setTimeout(forceIntroIfNeeded, 300);
  });
})();

// ── Адаптив animFill и getCurrentFillW ─────────────────────

var _origAnimFill = animFill;
var _origGetCurrentFillW = getCurrentFillW;

animFill = function(fillEl, side, fromW, toW) {
  var dur = 300;
  var start = null;
  var current = fromW;

  if (_fillAnimId[side]) cancelAnimationFrame(_fillAnimId[side]);

  function frame(ts) {
    if (!start) start = ts;
    var p = Math.min((ts - start) / dur, 1);
    p = easeOutCubic(p);
    current = fromW + (toW - fromW) * p;

    if (isVerticalLayout()) {
      fillEl.style.width = '';
      fillEl.style.height = current + '%';
    } else {
      fillEl.style.height = '';
      fillEl.style.width = current + '%';
    }

    if (p < 1) {
      _fillAnimId[side] = requestAnimationFrame(frame);
    } else {
      _fillAnimId[side] = null;
    }
  }

  _fillAnimId[side] = requestAnimationFrame(frame);
};

getCurrentFillW = function(fillEl) {
  if (isVerticalLayout()) {
    return parseFloat(fillEl.style.height) || 0;
  }
  return _origGetCurrentFillW(fillEl);
};

// ── Ресайз: пересчитываем layout и сбрасываем fill ─────

window.addEventListener('resize', function() {
  var fillLeft = document.getElementById('fill-left');
  var fillRight = document.getElementById('fill-right');

  if (isVerticalLayout()) {
    fillLeft.style.width = '';
    fillRight.style.width = '';
  } else {
    fillLeft.style.height = '';
    fillRight.style.height = '';
  }

  // Всегда пересчитываем позиции при смене размера
  if (_layoutData) {
    layout();
    
    // Если intro уже сыграно — сразу ставим линию на полную высоту
    if (_introPlayed) {
      var vT = document.getElementById('v-top');
      if (vT) {
        vT.style.top = _layoutData.startY + 'px';
        vT.style.height = _layoutData.fullHeight + 'px';
      }
    }
  }
});