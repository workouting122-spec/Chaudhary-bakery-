/* ============================================================
   NOVA — site engine (vanilla JS)
   ============================================================ */
(function(){
"use strict";
var reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;

/* ---------- helpers ---------- */
var clamp=function(v,a,b){return v<a?a:v>b?b:v;};
var smoothstep=function(p,e0,e1){var t=clamp((p-e0)/(e1-e0),0,1);return t*t*(3-2*t);};
function rng(seed){var s=seed>>>0;return function(){return (s=(s*1664525+1013904223)>>>0)/4294967296;};}

/* ---------- nav + scrollbar ---------- */
var nav=document.getElementById('nav'), scrollbar=document.getElementById('scrollbar');
function onGlobalScroll(){
  var y=window.scrollY;
  nav.classList.toggle('solid', y>40);
  var docH=document.documentElement.scrollHeight-innerHeight;
  scrollbar.style.width=(docH>0?(y/docH)*100:0)+'%';
}
addEventListener('scroll',onGlobalScroll,{passive:true});

/* ============================================================
   HERO SCRUB
   ============================================================ */
var heroEl=document.querySelector('.hero'),
    stage=document.getElementById('stage'),
    video=document.getElementById('hero'),
    poster=document.getElementById('poster'),
    ring=document.getElementById('ring'),
    bandsWrap=document.getElementById('bands'),
    bandEls=[].slice.call(document.querySelectorAll('.band')),
    scrollCue=document.getElementById('scrollCue');

var VIDEO_URL='/assets/videos/hero-scrub.mp4';
var VIDEO_BYTES=9318141;
var POSTER_URL='/assets/hero-poster.jpg';

/* split each headline once */
bandEls.forEach(function(band){
  var ent=band.getAttribute('data-entrance');
  band.classList.add('ent-'+ent);
  var a=band.getAttribute('data-range').split(',');
  band._a=parseFloat(a[0]); band._b=parseFloat(a[1]);
  band._op=-1; band._k=-1;
  var h=band.querySelector('.split');
  if(h) splitText(h, ent, band);
});

function splitText(el, mode, band){
  var text=el.getAttribute('data-text')||el.textContent;
  var r=rng(text.length*97+mode.length*13+3);
  var sr=document.createElement('span'); sr.className='sr-only'; sr.textContent=text;
  var vis=document.createElement('span'); vis.setAttribute('aria-hidden','true');
  var words=text.split(/(\s+)/); // keep spaces
  var charScatter=(mode==='scatter');
  var wordIndex=0, wordCount=text.split(/\s+/).filter(Boolean).length;
  words.forEach(function(tok){
    if(/^\s+$/.test(tok)){ vis.appendChild(document.createTextNode(tok)); return; }
    var w=document.createElement('span'); w.className='w';
    if(!charScatter){
      // ordered word threshold
      w.style.setProperty('--th', (wordIndex/Math.max(1,wordCount)*0.5 + r()*0.05).toFixed(3));
      if(mode==='punch' && wordIndex===wordCount-1) w.classList.add('em');
      w.textContent=tok;
    }else{
      for(var i=0;i<tok.length;i++){
        var c=document.createElement('span'); c.className='c'; c.textContent=tok[i];
        c.style.setProperty('--th',(r()*0.5).toFixed(3));
        c.style.setProperty('--jx',((r()*2-1)*60).toFixed(1)+'px');
        c.style.setProperty('--jy',((r()*2-1)*50+20).toFixed(1)+'px');
        c.style.setProperty('--jr',((r()*2-1)*40).toFixed(1)+'deg');
        w.appendChild(c);
      }
    }
    vis.appendChild(w); wordIndex++;
  });
  el.textContent=''; el.appendChild(sr); el.appendChild(vis);
}

function heroProgress(){
  var travel=heroEl.offsetHeight-innerHeight;
  if(travel<=0) return 0;
  return clamp(-heroEl.getBoundingClientRect().top/travel,0,1);
}

/* band-one one-time load ramp: assemble the opening headline on load,
   then hand over to scroll (k = max(scrollK, loadK)) */
var heroLoadK=0, loadStart=0;
function loadRamp(now){
  if(!loadStart)loadStart=now;
  heroLoadK=clamp((now-loadStart)/900,0,1);
  updateCaptions(scrubOn?heroProgress():0);
  if(heroLoadK<1) requestAnimationFrame(loadRamp);
}

/* caption update, delta-gated */
function updateCaptions(p){
  for(var i=0;i<bandEls.length;i++){
    var b=bandEls[i], a=b._a, bb=b._b;
    var f=Math.min(0.02,(bb-a)/3);
    var op;
    if(i===0) op=1-smoothstep(p,bb-f,bb);           // first band settled at start
    else op=smoothstep(p, a, a+f)*(1-smoothstep(p, bb-f, bb));
    var ramp=Math.min(0.06,(bb-a)*0.4);
    var k=clamp((p-a)/(ramp||0.05),0,1);
    if(i===0) k=Math.max(k,heroLoadK);              // hand load ramp -> scroll
    if(Math.abs(op-b._op)>0.004){ b.style.opacity=op.toFixed(3); b._op=op; }
    if(Math.abs(k-b._k)>0.008){ b.style.setProperty('--k',k.toFixed(3)); b._k=k; }
  }
  if(scrollCue){ var hide=p>0.03; if(hide!==scrollCue._h){scrollCue.classList.toggle('hide',hide);scrollCue._h=hide;} }
}

/* lerp + gated seeks */
var target=0, shown=0, rafId=null, lastTick=0, heroOnScreen=true;
var seekBusy=false, pendingTime=null;
function requestSeek(t){ if(!video.duration)return; if(seekBusy){pendingTime=t;return;} seekBusy=true; try{video.currentTime=t;}catch(e){seekBusy=false;} }
video.addEventListener('seeked',function(){ seekBusy=false; if(pendingTime!==null){var t=pendingTime;pendingTime=null;requestSeek(t);} });
video.addEventListener('error',function(){ seekBusy=false; pendingTime=null; });

function tick(now){
  var dt=Math.min(100, now-(lastTick||now)); lastTick=now;
  var k=0.16;
  shown += (target-shown)*(1-Math.pow(1-k, dt/16.667));
  if(Math.abs(target-shown)<0.0005){ shown=target; rafId=null; lastTick=0; }
  else rafId=requestAnimationFrame(tick);
  if(video.duration) requestSeek(shown*video.duration);
  updateCaptions(shown);
}
function onScroll(){
  target=heroProgress();
  if(rafId===null && heroOnScreen) rafId=requestAnimationFrame(tick);
}
var hio=new IntersectionObserver(function(e){heroOnScreen=e[0].isIntersecting;},{threshold:0});
hio.observe(heroEl);

/* blob load */
function initHeroOnce(){
  if(initHeroOnce._done) return; initHeroOnce._done=true;
  poster.style.backgroundImage="url('"+POSTER_URL+"')";
  var started=false;
  function startBlob(){ if(started)return; started=true; loadHeroBlob().catch(failVideo); }
  var pi=new Image(); pi.onload=startBlob; pi.onerror=startBlob; pi.src=POSTER_URL;
  setTimeout(startBlob,4000);
}
function loadHeroBlob(){
  var ctrl=new AbortController();
  var watchdog=setTimeout(function(){ctrl.abort();},20000);
  return fetch(VIDEO_URL,{signal:ctrl.signal}).then(function(res){
    var total=Number(res.headers.get('Content-Length'))||VIDEO_BYTES;
    var reader=res.body.getReader(), chunks=[], got=0, lastRing=0;
    function pump(){
      return reader.read().then(function(r){
        if(r.done) return;
        clearTimeout(watchdog); watchdog=setTimeout(function(){ctrl.abort();},20000);
        chunks.push(r.value); got+=r.value.length;
        var frac=Math.min(1,got/total), now=performance.now();
        if(now-lastRing>100||frac===1){ lastRing=now; ring.style.setProperty('--ld',Math.round(126*(1-frac))); }
        return pump();
      });
    }
    return pump().then(function(){
      clearTimeout(watchdog); ring.style.setProperty('--ld',0);
      video.src=URL.createObjectURL(new Blob(chunks)); video.load();
      video.addEventListener('canplay',function(){
        requestSeek(heroProgress()*video.duration);
        stage.classList.add('video-ready');
        onScroll();
      },{once:true});
    });
  });
}
function failVideo(){ if(ring)ring.style.opacity='0'; stage.classList.add('video-failed'); }
video.addEventListener('error',failVideo);

/* ---------- five static-hero gates, live ---------- */
var GATES=[
  '(max-width: 720px)',
  '(orientation: portrait) and (max-width: 1024px)',
  '(orientation: portrait) and (pointer: coarse)',
  '(orientation: landscape) and (pointer: coarse) and (max-height: 560px)',
  '(prefers-reduced-motion: reduce)'
];
var scrubOn=false;
function enableScrub(){
  if(scrubOn)return; scrubOn=true;
  initHeroOnce();
  addEventListener('scroll',onScroll,{passive:true});
  bandEls.forEach(function(b){b._op=-1;b._k=-1;});
  if(!reduce && heroLoadK<1){ loadStart=0; requestAnimationFrame(loadRamp); }
  else { heroLoadK=1; }
  updateCaptions(heroProgress());
  onScroll();
}
function disableScrub(){
  if(!scrubOn)return; scrubOn=false;
  removeEventListener('scroll',onScroll);
  if(rafId!==null){cancelAnimationFrame(rafId);rafId=null;}
}
function applyHeroMode(){ if(GATES.some(function(q){return matchMedia(q).matches;})) disableScrub(); else enableScrub(); }
var MQLS=GATES.map(function(q){return matchMedia(q);});
MQLS.forEach(function(m){m.addEventListener('change',applyHeroMode);});
applyHeroMode();
onGlobalScroll();

/* ============================================================
   SECTION REVEALS + lazy loop videos + counters
   ============================================================ */
document.querySelectorAll('.reveal').forEach(function(sec){
  [].slice.call(sec.children).forEach(function(){});
  // mark direct content wrappers as reveal elements
  sec.querySelectorAll(':scope > .wrap > *').forEach(function(el){el.classList.add('r-el');});
});

var revObs=new IntersectionObserver(function(entries){
  entries.forEach(function(e){
    if(e.isIntersecting){ e.target.classList.add('in'); startCounters(e.target); }
  });
},{threshold:0.16});
document.querySelectorAll('.reveal').forEach(function(s){revObs.observe(s);});

/* lazy-load + play loop videos only while visible */
var loopVids=[].slice.call(document.querySelectorAll('.loopv'));
var vidObs=new IntersectionObserver(function(entries){
  entries.forEach(function(e){
    var v=e.target;
    if(e.isIntersecting){
      if(!v.src && v.dataset.src){ v.src=v.dataset.src; }
      if(!reduce){ var p=v.play(); if(p&&p.catch)p.catch(function(){}); }
    }else{ v.pause(); }
  });
},{threshold:0.25});
loopVids.forEach(function(v){vidObs.observe(v);});

/* count-up stats */
function startCounters(scope){
  scope.querySelectorAll('b[data-count]').forEach(function(el){
    if(el._done)return; el._done=true;
    var to=parseFloat(el.getAttribute('data-count'));
    var scale=parseFloat(el.getAttribute('data-scale')||'1');
    var dec=parseInt(el.getAttribute('data-decimals')||'0',10);
    var pre=el.getAttribute('data-prefix')||'', suf=el.getAttribute('data-suffix')||'';
    var stat=el.getAttribute('data-static');
    if(stat!==null){ el.textContent=stat; return; }
    if(reduce){ el.textContent=pre+(to*scale).toFixed(dec)+suf; return; }
    var t0=null, dur=1100;
    function step(ts){ if(!t0)t0=ts; var p=clamp((ts-t0)/dur,0,1); var e=1-Math.pow(1-p,3);
      el.textContent=pre+(to*scale*e).toFixed(dec)+suf; if(p<1)requestAnimationFrame(step); }
    requestAnimationFrame(step);
  });
}

/* build spec ticker (living element) */
var ticker=document.getElementById('ticker');
if(ticker){
  [['6.7','inch OLED'],['120','Hz'],['5,400','mAh'],['199','g'],['IP68','rated']].forEach(function(p){
    var s=document.createElement('span'); s.innerHTML='<b>'+p[0]+'</b> '+p[1]; ticker.appendChild(s);
  });
}

/* set arch line lengths for draw-on */
document.querySelectorAll('.arch-lines .draw').forEach(function(path){
  var len=path.getTotalLength(); path.style.setProperty('--len',Math.ceil(len));
});

/* ============================================================
   INTERACTIVE: press-and-hold to charge
   ============================================================ */
(function(){
  var btn=document.getElementById('holdBtn');
  if(!btn)return;
  var sec=document.getElementById('charge');
  var pctEl=document.getElementById('chargePct');
  var charge=0, holding=false, raf=null, last=0, done=false;
  function render(){ sec.style.setProperty('--charge',charge.toFixed(3)); pctEl.textContent=Math.round(charge*100); }
  function loop(ts){
    var dt=Math.min(64, ts-(last||ts)); last=ts;
    var dir=holding?1:-1, rate=holding?0.6:0.9;
    charge=clamp(charge+dir*rate*(dt/1000),0,1);
    render();
    if(charge>=1 && !done){ done=true; btn.classList.add('done'); btn.querySelector('.hold-label').textContent='Fully charged'; }
    if(charge<1 && done){ done=false; btn.classList.remove('done'); btn.querySelector('.hold-label').textContent='Hold to charge'; }
    if((holding&&charge<1)||(!holding&&charge>0)){ raf=requestAnimationFrame(loop); } else { raf=null; last=0; }
  }
  function start(e){ e.preventDefault(); if(reduce){charge=1;done=true;render();btn.classList.add('done');btn.querySelector('.hold-label').textContent='Fully charged';return;} holding=true; if(raf===null){last=0;raf=requestAnimationFrame(loop);} }
  function end(){ holding=false; if(raf===null&&charge>0){last=0;raf=requestAnimationFrame(loop);} }
  btn.addEventListener('pointerdown',start);
  addEventListener('pointerup',end);
  btn.addEventListener('pointercancel',end);
  btn.addEventListener('keydown',function(e){ if(e.key===' '||e.key==='Enter'){e.preventDefault();start(e);} });
  btn.addEventListener('keyup',function(e){ if(e.key===' '||e.key==='Enter'){end();} });
  render();
})();

/* ============================================================
   RESERVE FORM (static: JS success state)
   ============================================================ */
(function(){
  var form=document.getElementById('reserveForm');
  if(!form)return;
  var note=document.getElementById('formNote');
  var ok=document.createElement('p'); ok.className='form-success';
  ok.innerHTML='<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg> You\'re on the list. Check your inbox.';
  form.insertBefore(ok, note);
  form.addEventListener('submit',function(e){
    e.preventDefault();
    var name=form.name.value.trim(), email=form.email.value.trim();
    if(!name||!/.+@.+\..+/.test(email)){ note.textContent='Please add your name and a valid email.'; note.style.color='var(--accent-2)'; return; }
    form.classList.add('sent');
    note.textContent='Reservation saved for '+form.size.value+'.';
  });
})();

/* ============================================================
   pause everything on hidden tab
   ============================================================ */
document.addEventListener('visibilitychange',function(){
  var hidden=document.hidden;
  document.body.classList.toggle('paused',hidden);
  loopVids.forEach(function(v){ if(hidden)v.pause(); });
});

/* reduced-motion live: pin arch lines / stop hero */
matchMedia('(prefers-reduced-motion:reduce)').addEventListener('change',function(e){
  reduce=e.matches;
  applyHeroMode();
});
})();
