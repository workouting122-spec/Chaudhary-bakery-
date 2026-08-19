// ============================================================
// Entry point — boots the WebGL scene, builds the phone,
// wires the scroll controller and UI, then runs the render loop.
// Fails gracefully if WebGL or the CDN libraries are unavailable.
// ============================================================

import * as THREE from "three";
import { createScene, updateParticles } from "./scene.js";
import { buildPhone } from "./phone.js";
import { createScrollController } from "./scroll.js";
import {
  createPreloader, initOverlayFades, initNav, initScrollRail, initSwatches,
} from "./ui.js";

const preloader = createPreloader();

function fatal(msg) {
  console.error("[iPhone17]", msg);
  const el = document.getElementById("preloader");
  if (el) {
    el.querySelector(".preloader__label").textContent = msg;
    el.querySelector(".preloader__inner").style.opacity = "0.7";
  }
}

// Ensure GSAP/Lenis (deferred UMD scripts) are ready before boot.
function whenLibsReady(cb, tries = 0) {
  if (window.gsap && window.ScrollTrigger && window.Lenis) return cb();
  if (tries > 120) return fatal("Failed to load animation libraries");
  requestAnimationFrame(() => whenLibsReady(cb, tries + 1));
}

function boot() {
  const mount = document.getElementById("webgl");

  // WebGL capability check
  try {
    const test = document.createElement("canvas");
    if (!(test.getContext("webgl2") || test.getContext("webgl"))) {
      throw new Error("no-webgl");
    }
  } catch (e) {
    fatal("WebGL is not available on this device");
    return;
  }

  preloader.set(0.15);

  let ctx;
  try {
    ctx = createScene(mount);
  } catch (e) {
    fatal("Could not initialise 3D scene");
    return;
  }
  const { scene, camera, renderer, chipLight, particles } = ctx;
  preloader.set(0.45);

  // Build phone model
  const phone = buildPhone("black");
  scene.add(phone.root);
  preloader.set(0.75);

  // Scroll + UI
  const scroll = createScrollController({
    camera, phone: phone.root, parts: phone.parts, chipLight, particles,
  });
  initScrollRail();
  initOverlayFades();
  initNav(scroll.lenis);
  initSwatches(phone.root);

  preloader.set(0.95);

  // Warm one frame then reveal
  const clock = new THREE.Clock();
  let running = true;

  function tick() {
    if (!running) return;
    const elapsed = clock.getElapsedTime();
    scroll.update(elapsed);
    updateParticles(particles, elapsed);
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  // Pause rendering when tab hidden (battery/perf)
  document.addEventListener("visibilitychange", () => {
    running = !document.hidden;
    if (running) { clock.getDelta(); requestAnimationFrame(tick); }
  });

  // small delay so first paint is smooth, then hide preloader
  setTimeout(() => preloader.finish(), 500);

  // refresh triggers after fonts/layout settle
  window.addEventListener("load", () => window.ScrollTrigger.refresh());
}

whenLibsReady(boot);
