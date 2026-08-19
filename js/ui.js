// ============================================================
// DOM/UI layer: preloader, scroll-synced overlay fades,
// nav auto-hide, scroll progress rail, and titanium finish
// swatches that smoothly retint the 3D model.
// ============================================================

import * as THREE from "three";
import { FINISHES } from "./config.js";

// ---- Preloader ----
export function createPreloader() {
  const el = document.getElementById("preloader");
  const fill = document.getElementById("preloaderFill");
  const pct = document.getElementById("preloaderPct");
  let done = false;
  return {
    set(v) {
      const clamped = Math.round(THREE.MathUtils.clamp(v, 0, 1) * 100);
      fill.style.width = clamped + "%";
      pct.textContent = clamped + "%";
    },
    finish() {
      if (done) return; done = true;
      this.set(1);
      setTimeout(() => el.classList.add("is-done"), 350);
    },
  };
}

// ---- Overlay fades synced to scroll position (per section) ----
export function initOverlayFades() {
  gsap.utils.toArray("[data-fade]").forEach((node) => {
    gsap.set(node, { opacity: 0, y: 40, filter: "blur(6px)" });
    gsap.to(node, {
      opacity: 1, y: 0, filter: "blur(0px)", duration: 1, ease: "power2.out",
      scrollTrigger: {
        trigger: node.closest(".section"),
        start: "top 62%",
        end: "bottom 40%",
        toggleActions: "play reverse play reverse",
      },
    });
  });
}

// ---- Nav auto-hide on scroll down, show on up ----
export function initNav(lenis) {
  const nav = document.getElementById("nav");
  let last = 0;
  lenis.on("scroll", ({ scroll }) => {
    if (scroll > last && scroll > 240) nav.classList.add("is-hidden");
    else nav.classList.remove("is-hidden");
    last = scroll;
  });

  // route anchor links through Lenis for smooth in-page nav
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (id.length > 1) {
        e.preventDefault();
        lenis.scrollTo(id, { offset: 0, duration: 1.4 });
      }
    });
  });
}

// ---- Scroll progress rail ----
export function initScrollRail() {
  const fill = document.getElementById("scrollRailFill");
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.create({
    trigger: "#content", start: "top top", end: "bottom bottom", scrub: true,
    onUpdate: (self) => { fill.style.width = (self.progress * 100).toFixed(2) + "%"; },
  });
}

// ---- Titanium finish swatches ----
export function initSwatches(phone) {
  const swatches = document.querySelectorAll(".swatch");
  const nameEl = document.getElementById("swatchName");
  const { frameMat, backMat, plateMat } = phone.userData.materials;

  const keyByColor = {};
  Object.entries(FINISHES).forEach(([k, v]) => { keyByColor[v.frame] = k; });

  swatches.forEach((sw) => {
    sw.addEventListener("click", () => {
      swatches.forEach((s) => s.classList.remove("is-active"));
      sw.classList.add("is-active");
      const hexFrame = parseInt(sw.dataset.color.replace("#", "0x"));
      const key = keyByColor[hexFrame] || "black";
      const finish = FINISHES[key];
      nameEl.textContent = sw.dataset.name;

      const frameTo = new THREE.Color(finish.frame);
      const glassTo = new THREE.Color(finish.glass);
      // smooth colour tween
      [frameMat, plateMat].forEach((m) => {
        gsap.to(m.color, { r: frameTo.r, g: frameTo.g, b: frameTo.b, duration: 0.8, ease: "power2.out" });
      });
      gsap.to(backMat.color, { r: glassTo.r, g: glassTo.g, b: glassTo.b, duration: 0.8, ease: "power2.out" });
    });
  });
}
