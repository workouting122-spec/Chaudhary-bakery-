// ============================================================
// Scroll intention -> smooth internal motion.
// Lenis inertia + GSAP ScrollTrigger feed a normalized progress
// that is damped every frame, then mapped across narrative
// sections into camera, phone and per-layer transforms.
// ============================================================

import * as THREE from "three";
import {
  CAM_KEYS, PHONE_BY_SECTION, LAYERS, EXPLODE_BY_SECTION,
} from "./config.js";

const SECTIONS = CAM_KEYS.length; // 6
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// smootherstep easing for section-to-section blends
const ease = (t) => t * t * t * (t * (t * 6 - 15) + 10);
const lerp = (a, b, t) => a + (b - a) * t;

export function createScrollController({ camera, phone, parts, chipLight, particles }) {
  const state = {
    target: 0,   // 0..1 from scroll
    current: 0,  // damped
    mouseX: 0,
    mouseY: 0,
    section: 0,
  };

  // ---- Lenis smooth scroll ----
  const lenis = new Lenis({
    duration: 1.15,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: !reduceMotion,
    smoothTouch: false,
    touchMultiplier: 1.4,
  });

  gsap.registerPlugin(ScrollTrigger);
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  // Master trigger across the whole content stack.
  ScrollTrigger.create({
    trigger: "#content",
    start: "top top",
    end: "bottom bottom",
    scrub: true,
    onUpdate: (self) => { state.target = self.progress; },
  });

  // ---- Mouse parallax ----
  window.addEventListener("pointermove", (e) => {
    state.mouseX = (e.clientX / window.innerWidth - 0.5);
    state.mouseY = (e.clientY / window.innerHeight - 0.5);
  }, { passive: true });

  // reusable temp vectors (avoid per-frame allocation)
  const camPos = new THREE.Vector3();
  const lookTarget = new THREE.Vector3();
  const tmpLook = new THREE.Vector3();

  function segment(p) {
    const f = p * (SECTIONS - 1);
    const i = Math.min(SECTIONS - 2, Math.floor(f));
    const frac = ease(THREE.MathUtils.clamp(f - i, 0, 1));
    return { i, j: i + 1, frac };
  }

  // ---- Per-frame update ----
  function update(elapsed) {
    // damping toward scroll target -> inertia feel beyond Lenis
    state.current += (state.target - state.current) * 0.09;
    const p = state.current;
    const { i, j, frac } = segment(p);
    state.section = Math.round(p * (SECTIONS - 1));

    // ---------- CAMERA ----------
    const a = CAM_KEYS[i], b = CAM_KEYS[j];
    camPos.set(
      lerp(a.pos[0], b.pos[0], frac),
      lerp(a.pos[1], b.pos[1], frac),
      lerp(a.pos[2], b.pos[2], frac)
    );
    // gentle mouse parallax
    camPos.x += state.mouseX * 0.6;
    camPos.y += -state.mouseY * 0.4;
    camera.position.lerp(camPos, 0.12);

    lookTarget.set(
      lerp(a.look[0], b.look[0], frac),
      lerp(a.look[1], b.look[1], frac),
      lerp(a.look[2], b.look[2], frac)
    );
    tmpLook.lerp(lookTarget, 0.12);
    camera.lookAt(tmpLook);

    const fov = lerp(a.fov, b.fov, frac);
    if (Math.abs(camera.fov - fov) > 0.01) {
      camera.fov = lerp(camera.fov, fov, 0.12);
      camera.updateProjectionMatrix();
    }

    // ---------- PHONE GROUP ----------
    const pa = PHONE_BY_SECTION[i], pb = PHONE_BY_SECTION[j];
    const idleFloat = Math.sin(elapsed * 0.8) * 0.06;
    // subtle continuous spin only in hero for "alive" feel
    const heroSpin = (1 - THREE.MathUtils.clamp(p * (SECTIONS - 1), 0, 1)) * Math.sin(elapsed * 0.4) * 0.12;
    phone.position.x = lerp(pa.pos[0], pb.pos[0], frac);
    phone.position.y = lerp(pa.pos[1], pb.pos[1], frac) + idleFloat;
    phone.position.z = lerp(pa.pos[2], pb.pos[2], frac);
    phone.rotation.y = lerp(pa.rotY, pb.rotY, frac) + heroSpin + state.mouseX * 0.15;
    phone.rotation.x = lerp(pa.rotX, pb.rotX, frac) + state.mouseY * 0.08;

    // ---------- EXPLODED LAYERS ----------
    const exA = EXPLODE_BY_SECTION[i], exB = EXPLODE_BY_SECTION[j];
    const amt = lerp(exA, exB, frac);
    for (const layer of LAYERS) {
      const part = parts[layer.key];
      if (!part) continue;
      part.position.x = layer.ex[0] * amt;
      part.position.y = layer.ex[1] * amt;
      part.position.z = layer.z + layer.ex[2] * amt;
    }

    // ---------- CHIP GLOW + PARTICLES (peak at chip section, idx 3) ----------
    const chipProx = Math.max(0, 1 - Math.abs(p * (SECTIONS - 1) - 3) / 1.1);
    chipLight.intensity = lerp(chipLight.intensity, chipProx * 3.2, 0.1);
    if (parts.chip) {
      const pulse = 0.9 + Math.sin(elapsed * 3) * 0.35 * chipProx;
      parts.chip.material.emissiveIntensity = pulse + chipProx * 1.4;
    }
    // particles visible during internal sections (teardown..chip)
    const internalProx = Math.max(0, 1 - Math.abs(p * (SECTIONS - 1) - 2.5) / 2.2);
    particles.mat.opacity = lerp(particles.mat.opacity, internalProx * 0.6, 0.08);
  }

  function getSection() { return state.section; }
  function scrollTo(target) { lenis.scrollTo(target); }

  return { update, lenis, getSection, scrollTo };
}
