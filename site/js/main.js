/* ============================================================
   Scroll-driven product film engine.
   Reads window.CLIPS (js/clips.js), builds one pinned chapter
   per clip, and scrubs each video's timeline to scroll position.
   ============================================================ */
(function () {
  "use strict";

  var CLIPS = window.CLIPS || [];
  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var chaptersRoot = document.getElementById("chapters");
  var navRoot = document.getElementById("chapterNav");
  var loader = document.getElementById("loader");
  var loaderPct = document.getElementById("loaderPct");
  var progressBar = document.getElementById("scrollProgress");

  var chapters = []; // { el, sticky, video, caption, stageFill, duration, scrub, length, index, target, current, loaded }

  /* ---------- Build DOM from config ---------- */
  CLIPS.forEach(function (clip, i) {
    var length = clip.length || 2.6;

    var section = document.createElement("section");
    section.className = "chapter";
    section.style.height = (length * 100) + "vh";
    section.id = "chapter-" + (i + 1);

    var sticky = document.createElement("div");
    sticky.className = "chapter-sticky";

    var stage = document.createElement("div");
    stage.className = "stage";

    var video = document.createElement("video");
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");
    video.preload = "auto";
    video.loop = !clip.scrub;       // non-scrub clips just loop while on screen
    video.dataset.src = clip.src;   // real src assigned lazily

    var track = document.createElement("div");
    track.className = "stage-track";
    var fill = document.createElement("span");
    track.appendChild(fill);

    stage.appendChild(video);
    if (clip.scrub) stage.appendChild(track);

    var caption = document.createElement("div");
    caption.className = "caption";
    caption.innerHTML =
      '<span class="tag">' + (i + 1 < 10 ? "0" : "") + (i + 1) + " · " + esc(clip.label || "") + "</span>" +
      "<h2>" + esc(clip.title || "") + "</h2>" +
      (clip.copy ? "<p>" + esc(clip.copy) + "</p>" : "");

    sticky.appendChild(stage);
    sticky.appendChild(caption);
    section.appendChild(sticky);
    chaptersRoot.appendChild(section);

    var record = {
      el: section, sticky: sticky, video: video, stageFill: fill,
      duration: 8, scrub: clip.scrub !== false, length: length, index: i,
      target: 0, current: 0, loaded: false, playing: false
    };

    video.addEventListener("loadedmetadata", function () {
      if (isFinite(video.duration) && video.duration > 0) record.duration = video.duration;
    });

    chapters.push(record);

    // side nav entry
    var btn = document.createElement("button");
    btn.textContent = (i + 1 < 10 ? "0" : "") + (i + 1);
    btn.title = clip.label || ("Chapter " + (i + 1));
    btn.addEventListener("click", function () {
      var top = section.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: top + window.innerHeight * (length - 1) * 0.5, behavior: "smooth" });
    });
    navRoot.appendChild(btn);
    record.navBtn = btn;
  });

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  /* ---------- Lazy load management ---------- */
  function ensureLoaded(rec) {
    if (rec.loaded) return;
    rec.loaded = true;
    rec.video.src = rec.video.dataset.src;
    rec.video.load();
  }
  function unload(rec) {
    // free memory for far-away clips (helps when many clips are added)
    if (!rec.loaded) return;
    rec.loaded = false;
    rec.video.removeAttribute("src");
    rec.video.load();
  }

  /* ---------- Loader: wait for first clip ---------- */
  function startLoader() {
    if (!chapters.length) { hideLoader(); return; }
    var first = chapters[0];
    ensureLoaded(first);
    if (chapters[1]) ensureLoaded(chapters[1]);

    var done = false;
    function finish() {
      if (done) return;
      done = true;
      // seed the first frame
      try { first.video.currentTime = 0.001; } catch (e) {}
      hideLoader();
    }
    first.video.addEventListener("canplaythrough", finish, { once: true });
    first.video.addEventListener("loadeddata", function () {
      // loadeddata is enough to show the first frame; give a short grace for buffering
      setTimeout(finish, 400);
    }, { once: true });

    // progress readout
    var iv = setInterval(function () {
      var pct = 0;
      try {
        if (first.video.duration && first.video.buffered.length) {
          pct = Math.min(100, Math.round((first.video.buffered.end(0) / first.video.duration) * 100));
        }
      } catch (e) {}
      loaderPct.textContent = pct + "%";
      if (done) { loaderPct.textContent = "100%"; clearInterval(iv); }
    }, 120);

    // hard fallback so the page never gets stuck
    setTimeout(finish, 6000);
  }
  function hideLoader() {
    loader.classList.add("hidden");
    onScroll(); // paint initial state
  }

  /* ---------- Scroll → scrub ---------- */
  var vh = window.innerHeight;
  var latestScroll = window.scrollY;
  var activeIndex = -1;

  function computeProgress(rec) {
    // rect.top: 0 when the sticky pins, -(H - vh) when it releases
    var rect = rec.el.getBoundingClientRect();
    var travel = rec.el.offsetHeight - vh;
    if (travel <= 0) return rect.top <= 0 ? 1 : 0;
    return clamp(-rect.top / travel, 0, 1);
  }
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }

  function onScroll() {
    latestScroll = window.scrollY;
    // overall progress bar
    var docH = document.documentElement.scrollHeight - vh;
    progressBar.style.width = (docH > 0 ? (latestScroll / docH) * 100 : 0) + "%";

    var best = -1, bestVis = 0;
    for (var i = 0; i < chapters.length; i++) {
      var rec = chapters[i];
      var rect = rec.sticky.getBoundingClientRect();
      var vis = Math.min(rect.bottom, vh) - Math.max(rect.top, 0);
      var onScreen = vis > vh * 0.25;

      rec.el.classList.toggle("in-view", onScreen);

      if (onScreen && vis > bestVis) { bestVis = vis; best = i; }

      var p = computeProgress(rec);
      if (rec.scrub) {
        rec.target = p * (rec.duration || 8);
        if (rec.stageFill) rec.stageFill.style.width = (p * 100) + "%";
      }
    }

    if (best !== activeIndex) {
      activeIndex = best;
      updateActive();
    }
  }

  function updateActive() {
    for (var i = 0; i < chapters.length; i++) {
      var rec = chapters[i];
      if (rec.navBtn) rec.navBtn.classList.toggle("active", i === activeIndex);
      // keep active +/- 1 loaded, unload the rest (matters once many clips exist)
      if (Math.abs(i - activeIndex) <= 1) ensureLoaded(rec);
      else if (Math.abs(i - activeIndex) > 2) unload(rec);

      // non-scrub clips: play only when active
      if (!rec.scrub && rec.loaded) {
        if (i === activeIndex) { rec.video.play().catch(function () {}); }
        else { rec.video.pause(); }
      }
    }
  }

  /* ---------- rAF: smooth seek toward target ---------- */
  function tick() {
    for (var i = 0; i < chapters.length; i++) {
      var rec = chapters[i];
      if (!rec.scrub || !rec.loaded) continue;
      if (Math.abs(i - activeIndex) > 1) continue;

      // ease current toward target for buttery scrubbing
      var d = rec.target - rec.current;
      rec.current += d * (prefersReduced ? 1 : 0.18);
      if (Math.abs(d) < 0.004) rec.current = rec.target;

      if (rec.video.readyState >= 2) {
        var t = clamp(rec.current, 0, (rec.duration || 8) - 0.02);
        // only seek when it actually moved, to avoid thrashing the decoder
        if (Math.abs(rec.video.currentTime - t) > 0.015) {
          try { rec.video.currentTime = t; } catch (e) {}
        }
      }
    }
    requestAnimationFrame(tick);
  }

  /* ---------- Wire up ---------- */
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", function () {
    vh = window.innerHeight;
    onScroll();
  }, { passive: true });

  startLoader();
  onScroll();
  requestAnimationFrame(tick);
})();
