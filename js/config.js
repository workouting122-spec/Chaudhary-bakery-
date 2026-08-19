// ============================================================
// Central configuration — no hardcoded magic numbers scattered
// across modules. Tune the whole experience from here.
// ============================================================

export const PHONE = {
  width: 2.05,
  height: 4.35,
  depth: 0.62,
  radius: 0.36, // corner radius of the rounded chassis
};

// Titanium finishes (frame + back glass tint)
export const FINISHES = {
  black:   { name: "Titanium Black",   frame: 0x2b2b2f, glass: 0x161618 },
  desert:  { name: "Desert Titanium",  frame: 0xc9a880, glass: 0x8f7659 },
  natural: { name: "Natural Titanium", frame: 0xb9b6ad, glass: 0x7c7a72 },
  white:   { name: "White Titanium",   frame: 0xe4e5e0, glass: 0xbfc0bb },
  blue:    { name: "Blue Titanium",    frame: 0x4a5a72, glass: 0x2f3a4c },
};

// Ordered layers of the teardown. `home` = assembled Z offset,
// `explode` = target offset applied (multiplied) during teardown.
// Everything is relative to phone center; +Z faces the viewer.
export const LAYERS = [
  { key: "display",  z:  0.30, ex: [ 0.0,  0.9,  2.7] },
  { key: "frame",    z:  0.00, ex: [ 0.0,  0.3,  1.2] },
  { key: "vapor",    z: -0.02, ex: [-1.2,  0.0,  0.4] },
  { key: "board",    z: -0.06, ex: [ 0.0, -0.2, -0.6] },
  { key: "battery",  z: -0.12, ex: [ 1.2, -0.9, -1.4] },
  { key: "camera",   z: -0.34, ex: [-0.9,  1.1, -2.4] },
  { key: "backglass",z: -0.32, ex: [ 0.0, -0.6, -3.2] },
];

// Camera keyframes per narrative section. Position + lookAt target.
// Interpolated smoothly by the scroll controller.
export const CAM_KEYS = [
  // 0 — Hero: straight-on, slight elevation
  { pos: [0.0, 0.2, 8.6],  look: [0, 0, 0],     fov: 38 },
  // 1 — Teardown: top-right isometric, pulled back to see spread
  { pos: [5.6, 4.2, 8.4],  look: [0, 0.1, 0],   fov: 42 },
  // 2 — Camera deep-dive: close on the periscope (upper-left of phone back)
  { pos: [-2.6, 2.0, 4.2], look: [-0.7, 1.0, -0.6], fov: 34 },
  // 3 — Chip: rotate to the motherboard, zoom into A19
  { pos: [2.4, -0.6, 3.4], look: [0, -0.2, -0.2], fov: 32 },
  // 4 — Reassembly / colors: hero-ish, gentle orbit to show finish
  { pos: [-1.4, 0.4, 7.6], look: [0, 0, 0],     fov: 38 },
  // 5 — Buy: phone parked to the right, content on the left
  { pos: [3.4, 0.0, 7.2],  look: [1.7, 0, 0],   fov: 40 },
];

// How strongly the exploded targets apply at each section (0..1 per layer).
// index maps to CAM_KEYS / section index.
export const EXPLODE_BY_SECTION = [0.0, 1.0, 1.0, 1.0, 0.0, 0.0];

// Phone overall placement/rotation target per section (group transform).
export const PHONE_BY_SECTION = [
  { pos: [0, 0, 0],    rotY: 0.0,   rotX: 0.0 },
  { pos: [0, 0, 0],    rotY: -0.5,  rotX: 0.25 },
  { pos: [0.4, -0.2, 0], rotY: -0.9,  rotX: 0.1 },
  { pos: [0, 0.1, 0],  rotY: 0.6,   rotX: -0.15 },
  { pos: [0, 0, 0],    rotY: 6.283, rotX: 0.0 }, // full turn during reassembly
  { pos: [1.7, 0, 0],  rotY: 6.65,  rotX: 0.08 },
];
