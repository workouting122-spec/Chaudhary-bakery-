// ============================================================
// Renderer, camera, cinematic studio lighting, environment
// reflections and a GPU-friendly particle/circuit field.
// ============================================================

import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { CAM_KEYS } from "./config.js";

export function createScene(mount) {
  const scene = new THREE.Scene();
  scene.background = null; // CSS OLED backdrop shows through

  // ---- Renderer ----
  const dpr = Math.min(window.devicePixelRatio, 2);
  const renderer = new THREE.WebGLRenderer({
    antialias: dpr < 2, alpha: true, powerPreference: "high-performance",
  });
  renderer.setPixelRatio(dpr);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  mount.appendChild(renderer.domElement);

  // ---- Camera ----
  const camera = new THREE.PerspectiveCamera(
    CAM_KEYS[0].fov, window.innerWidth / window.innerHeight, 0.1, 100
  );
  camera.position.set(...CAM_KEYS[0].pos);
  camera.lookAt(0, 0, 0);

  // ---- Environment (studio reflections for titanium) ----
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = envTex;

  // ---- Cinematic lighting ----
  const key = new THREE.DirectionalLight(0xffffff, 2.6);
  key.position.set(4, 6, 6);
  scene.add(key);

  const rim = new THREE.DirectionalLight(0x8ab4ff, 2.0);
  rim.position.set(-6, 2, -4);
  scene.add(rim);

  const fill = new THREE.DirectionalLight(0xb98cff, 1.1);
  fill.position.set(-2, -4, 5);
  scene.add(fill);

  scene.add(new THREE.AmbientLight(0x404050, 0.6));

  // soft accent point light near chip to sell the glow
  const chipLight = new THREE.PointLight(0x2ea8ff, 0, 6);
  chipLight.position.set(0, 0, 1.4);
  scene.add(chipLight);

  // ---- Particle / circuit field (background depth) ----
  const particles = buildParticles();
  scene.add(particles.points);

  // ---- Resize ----
  function onResize() {
    const w = window.innerWidth, h = window.innerHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }
  window.addEventListener("resize", onResize);

  return { scene, camera, renderer, chipLight, particles, envTex, pmrem };
}

function buildParticles() {
  const COUNT = 900;
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(COUNT * 3);
  const seed = new Float32Array(COUNT);
  for (let i = 0; i < COUNT; i++) {
    pos[i * 3] = (Math.random() - 0.5) * 26;
    pos[i * 3 + 1] = (Math.random() - 0.5) * 18;
    pos[i * 3 + 2] = (Math.random() - 0.5) * 20 - 4;
    seed[i] = Math.random() * Math.PI * 2;
  }
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  const mat = new THREE.PointsMaterial({
    size: 0.03, color: 0x7fd7ff, transparent: true, opacity: 0.0,
    depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true,
  });
  const points = new THREE.Points(geo, mat);
  points.renderOrder = -1;
  return { points, geo, mat, seed, base: pos.slice(0) };
}

// Called each frame to animate particles subtly (drift + twinkle).
export function updateParticles(particles, t) {
  const { geo, base, seed } = particles;
  const arr = geo.attributes.position.array;
  for (let i = 0; i < seed.length; i++) {
    arr[i * 3 + 1] = base[i * 3 + 1] + Math.sin(t * 0.4 + seed[i]) * 0.25;
  }
  geo.attributes.position.needsUpdate = true;
  particles.points.rotation.y = t * 0.02;
}
