// ============================================================
// Procedural iPhone 17 Pro Max model.
// No external GLB required — the exploded internals are built
// from primitives so every layer can be addressed and animated.
// ============================================================

import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { PHONE, FINISHES } from "./config.js";

const { width: W, height: H, depth: D, radius: R } = PHONE;

// Small helper for a flat rounded panel (used for boards/plates)
function roundedPanel(w, h, thick, rad, mat) {
  const geo = new RoundedBoxGeometry(w, h, thick, 3, rad);
  return new THREE.Mesh(geo, mat);
}

export function buildPhone(finishKey = "black") {
  const finish = FINISHES[finishKey];
  const root = new THREE.Group();
  root.name = "phone";

  // Registry so the scroll controller can move each layer by key.
  const parts = {};

  // ---------- FRAME (titanium chassis rails) ----------
  const frameMat = new THREE.MeshStandardMaterial({
    color: finish.frame, metalness: 1.0, roughness: 0.32,
    envMapIntensity: 1.4,
  });
  frameMat.userData.isFrame = true;
  const frame = new THREE.Group();
  frame.name = "frame";
  // Outer titanium band — a rounded box shell.
  const band = new RoundedBoxGeometry(W, H, D, 6, R);
  const bandMesh = new THREE.Mesh(band, frameMat);
  frame.add(bandMesh);
  // Subtle raised camera plateau reference on the frame back handled by camera group.
  parts.frame = frame;
  root.add(frame);

  // ---------- DISPLAY (OLED) ----------
  const displayGroup = new THREE.Group();
  displayGroup.name = "display";
  const bezelMat = new THREE.MeshStandardMaterial({ color: 0x050506, metalness: 0.6, roughness: 0.4 });
  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0x0a0a0f, metalness: 0.0, roughness: 0.06,
    transmission: 0.0, clearcoat: 1.0, clearcoatRoughness: 0.04,
    emissive: 0x0a1420, emissiveIntensity: 0.6,
  });
  const bezel = roundedPanel(W * 0.985, H * 0.985, 0.05, R * 0.9, bezelMat);
  const screen = roundedPanel(W * 0.9, H * 0.93, 0.055, R * 0.75, glassMat);
  screen.position.z = 0.01;
  // Dynamic Island
  const island = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.08, 0.34, 4, 12).rotateZ(Math.PI / 2),
    new THREE.MeshStandardMaterial({ color: 0x000000, roughness: 0.4 })
  );
  island.position.set(0, H * 0.38, 0.05);
  displayGroup.add(bezel, screen, island);
  parts.display = displayGroup;
  root.add(displayGroup);

  // ---------- VAPOR CHAMBER (cooling plate) ----------
  const vaporMat = new THREE.MeshStandardMaterial({
    color: 0x9aa7b4, metalness: 1.0, roughness: 0.18, envMapIntensity: 1.6,
  });
  const vapor = roundedPanel(W * 0.7, H * 0.55, 0.04, 0.12, vaporMat);
  vapor.name = "vapor";
  // copper heat-pipe lines
  const pipeMat = new THREE.MeshStandardMaterial({ color: 0xc07a3a, metalness: 1.0, roughness: 0.3 });
  for (let i = -1; i <= 1; i++) {
    const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, H * 0.5, 10), pipeMat);
    pipe.position.set(i * 0.3, 0, 0.03);
    vapor.add(pipe);
  }
  parts.vapor = vapor;
  root.add(vapor);

  // ---------- MOTHERBOARD (multilayer PCB) + A19 chip ----------
  const board = new THREE.Group();
  board.name = "board";
  const pcbMat = new THREE.MeshStandardMaterial({ color: 0x0c3b2a, metalness: 0.4, roughness: 0.6 });
  const pcb = roundedPanel(W * 0.62, H * 0.5, 0.05, 0.1, pcbMat);
  board.add(pcb);
  // gold traces (thin emissive lines)
  const traceMat = new THREE.MeshStandardMaterial({ color: 0xd9b24a, metalness: 1.0, roughness: 0.35,
    emissive: 0x3a2c00, emissiveIntensity: 0.4 });
  for (let i = 0; i < 7; i++) {
    const t = new THREE.Mesh(new THREE.BoxGeometry(W * 0.5, 0.012, 0.008), traceMat);
    t.position.set(0, (i - 3) * (H * 0.5 / 8), 0.03);
    board.add(t);
  }
  // A19 Pro chip — glowing centerpiece
  const chipMat = new THREE.MeshStandardMaterial({
    color: 0x11151c, metalness: 0.8, roughness: 0.3,
    emissive: 0x2ea8ff, emissiveIntensity: 0.9,
  });
  chipMat.userData.isChip = true;
  const chip = roundedPanel(0.62, 0.62, 0.1, 0.05, chipMat);
  chip.name = "chip";
  chip.position.set(0, 0.15, 0.06);
  // chip lid engraving ring
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(0.22, 0.012, 8, 40),
    new THREE.MeshStandardMaterial({ color: 0x7fd7ff, emissive: 0x2ea8ff, emissiveIntensity: 1.4, metalness: 0.5, roughness: 0.3 })
  );
  ring.position.z = 0.06;
  chip.add(ring);
  board.add(chip);
  parts.board = board;
  parts.chip = chip; // exposed for pulsing glow
  root.add(board);

  // ---------- BATTERY ----------
  const battMat = new THREE.MeshStandardMaterial({ color: 0xd8d8dc, metalness: 0.7, roughness: 0.35 });
  const battery = roundedPanel(W * 0.66, H * 0.44, 0.16, 0.08, battMat);
  battery.name = "battery";
  const battLabel = new THREE.Mesh(
    new THREE.PlaneGeometry(W * 0.4, 0.3),
    new THREE.MeshStandardMaterial({ color: 0x111214, roughness: 0.8 })
  );
  battLabel.position.set(0, 0, 0.09);
  battery.add(battLabel);
  parts.battery = battery;
  root.add(battery);

  // ---------- CAMERA MODULE (periscope triple lens) ----------
  const camera = new THREE.Group();
  camera.name = "camera";
  const plateMat = new THREE.MeshStandardMaterial({ color: finish.frame, metalness: 1.0, roughness: 0.3 });
  plateMat.userData.isFrame = true;
  const plate = roundedPanel(W * 0.66, W * 0.66, 0.14, 0.22, plateMat);
  camera.add(plate);
  const lensPositions = [
    [-0.34, 0.34], [0.34, 0.34], [0, -0.36],
  ];
  const glassLensMat = new THREE.MeshPhysicalMaterial({
    color: 0x05070c, metalness: 0.2, roughness: 0.05, clearcoat: 1.0,
    emissive: 0x0a2b3f, emissiveIntensity: 0.5,
  });
  const ringMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1e, metalness: 1.0, roughness: 0.25 });
  lensPositions.forEach(([x, y], i) => {
    const housing = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.28, 0.16, 32), ringMat);
    housing.rotation.x = Math.PI / 2;
    housing.position.set(x, y, 0.1);
    const lens = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.19, 0.12, 32), glassLensMat);
    lens.rotation.x = Math.PI / 2;
    lens.position.set(x, y, 0.16);
    // periscope tetraprism hint on the telephoto (3rd lens)
    if (i === 2) {
      const prism = new THREE.Mesh(
        new THREE.BoxGeometry(0.16, 0.16, 0.16),
        new THREE.MeshStandardMaterial({ color: 0x7fd7ff, emissive: 0x2ea8ff, emissiveIntensity: 0.8, metalness: 0.6, roughness: 0.2 })
      );
      prism.rotation.set(0.6, 0.4, 0);
      prism.position.set(x, y, 0.24);
      camera.add(prism);
    }
    camera.add(housing, lens);
  });
  // flash + lidar
  const flash = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.14, 20),
    new THREE.MeshStandardMaterial({ color: 0xffe9c2, emissive: 0xffcf87, emissiveIntensity: 0.6 }));
  flash.rotation.x = Math.PI / 2; flash.position.set(0.32, -0.3, 0.12);
  camera.add(flash);
  parts.camera = camera;
  root.add(camera);

  // ---------- BACK GLASS ----------
  const backMat = new THREE.MeshPhysicalMaterial({
    color: finish.glass, metalness: 0.3, roughness: 0.28,
    clearcoat: 1.0, clearcoatRoughness: 0.12, envMapIntensity: 1.2,
  });
  backMat.userData.isBackGlass = true;
  const backglass = roundedPanel(W * 0.985, H * 0.985, 0.06, R * 0.9, backMat);
  backglass.name = "backglass";
  parts.backglass = backglass;
  root.add(backglass);

  // store material refs for finish swapping
  root.userData.materials = { frameMat, backMat, plateMat };
  root.userData.parts = parts;

  return { root, parts, materials: { frameMat, backMat, plateMat } };
}

// Swap titanium finish with a smooth interpolation (called by UI/GSAP).
export function applyFinish(phone, finishKey) {
  const finish = FINISHES[finishKey];
  if (!finish) return;
  const { frameMat, backMat, plateMat } = phone.userData.materials;
  const target = { frame: new THREE.Color(finish.frame), glass: new THREE.Color(finish.glass) };
  return target; // colours applied via GSAP tween in ui.js for smoothness
}
