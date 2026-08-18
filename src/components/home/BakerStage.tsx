import { useEffect, useRef, useState, type MutableRefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import { useCart, selectCount } from "@/store/cart";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * ── Autonomous baker mascot (PRD §4.4) ────────────────────────────────
 * A friendly chef that lives on the home page. It's built procedurally so it
 * renders with no asset and never crashes. To use a real rigged model, set
 * BAKER_MODEL_URL to "/assets/baker.glb" and implement the clips in a
 * useGLTF/useAnimations version (see README → "The baker mascot").
 *
 * It's decorative and never blocks content: the overlay is pointer-events:none.
 */
const BAKER_MODEL_URL: string | null = null;

type Mood = "idle" | "cheer" | "wave" | "sleep";

// Where the baker sits per home section (% of viewport). Springy CSS transition
// between these makes it "travel" with the scroll without teleporting.
const ANCHORS: { left: number; top: number }[] = [
  { left: 88, top: 74 }, // 0 hero — bottom right
  { left: 84, top: 52 }, // 1 tagline — right, mid
  { left: 26, top: 70 }, // 2 assembly — near the cake, left
  { left: 12, top: 76 }, // 3 featured — bottom left
  { left: 50, top: 82 }, // 4 categories — bottom center
  { left: 86, top: 66 }, // 5 story — right
  { left: 14, top: 74 }, // 6 testimonials — bottom left
  { left: 88, top: 72 }, // 7 contact — bottom right, waving goodbye
];

function ProceduralBaker({ mood, pointer, reduced }: {
  mood: Mood; pointer: MutableRefObject<{ x: number; y: number }>; reduced: boolean;
}) {
  const root = useRef<THREE.Group>(null);
  const head = useRef<THREE.Group>(null);
  const torso = useRef<THREE.Group>(null);
  const eyes = useRef<THREE.Group>(null);
  const armL = useRef<THREE.Group>(null);
  const armR = useRef<THREE.Group>(null);
  const nextBlink = useRef(1.5);
  const blinkUntil = useRef(0);

  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const g = root.current, h = head.current, tr = torso.current;
    const eL = eyes.current, aL = armL.current, aR = armR.current;
    if (!g || !h || !tr || !eL || !aL || !aR) return;

    // Idle bob + breathing (skipped under reduced motion → calm single pose)
    if (!reduced && mood !== "sleep") {
      g.position.y = Math.sin(t * 1.6) * 0.03;
      tr.scale.y = 1 + Math.sin(t * 1.2) * 0.02;
    } else {
      g.position.y = lerp(g.position.y, 0, 0.1);
      tr.scale.y = lerp(tr.scale.y, 1, 0.1);
    }

    // Blink (randomised) — squash the eyes briefly
    if (!reduced) {
      if (t > nextBlink.current) { blinkUntil.current = t + 0.12; nextBlink.current = t + 3 + Math.random() * 4; }
      eL.scale.y = t < blinkUntil.current ? 0.1 : lerp(eL.scale.y, 1, 0.4);
    }

    // Look-at: head tracks the cursor/last tap (forward when reduced)
    const targetY = reduced ? 0 : THREE.MathUtils.clamp(pointer.current.x, -1, 1) * 0.6;
    const targetX = reduced ? 0 : THREE.MathUtils.clamp(-pointer.current.y, -1, 1) * 0.35;
    h.rotation.y = lerp(h.rotation.y, mood === "sleep" ? 0.5 : targetY, 0.08);
    h.rotation.x = lerp(h.rotation.x, mood === "sleep" ? 0.5 : targetX, 0.08);
    h.rotation.z = lerp(h.rotation.z, mood === "sleep" ? 0.35 : 0, 0.08);

    // Arm poses per mood
    let armLZ = 0.15, armRZ = -0.15;      // resting
    if (mood === "cheer") { armLZ = 2.4; armRZ = -2.4; g.position.y += Math.abs(Math.sin(t * 9)) * 0.12; }
    else if (mood === "wave") { armRZ = -2.2 + Math.sin(t * 12) * 0.35; }
    else if (mood === "sleep") { armLZ = 0.05; armRZ = -0.05; }
    aL.rotation.z = lerp(aL.rotation.z, armLZ, 0.12);
    aR.rotation.z = lerp(aR.rotation.z, armRZ, 0.12);
  });

  const coat = "#FFFDF9", hat = "#FFFFFF", skin = "#F1C39E", cheek = "#E39A93", dark = "#2A2320", apron = "#D4122A";
  return (
    <group ref={root} position={[0, 0, 0]}>
      {/* legs */}
      <mesh position={[-0.12, -0.62, 0]} castShadow><capsuleGeometry args={[0.09, 0.28, 4, 10]} /><meshStandardMaterial color="#3A342E" /></mesh>
      <mesh position={[0.12, -0.62, 0]} castShadow><capsuleGeometry args={[0.09, 0.28, 4, 10]} /><meshStandardMaterial color="#3A342E" /></mesh>

      {/* torso */}
      <group ref={torso} position={[0, -0.12, 0]}>
        <mesh castShadow><capsuleGeometry args={[0.28, 0.34, 6, 14]} /><meshStandardMaterial color={coat} /></mesh>
        {/* apron band */}
        <mesh position={[0, -0.02, 0.26]}><boxGeometry args={[0.42, 0.5, 0.03]} /><meshStandardMaterial color={apron} /></mesh>
      </group>

      {/* arms (pivot at shoulder) */}
      <group ref={armL} position={[-0.3, 0.02, 0]}>
        <mesh position={[0, -0.2, 0]} castShadow><capsuleGeometry args={[0.07, 0.3, 4, 10]} /><meshStandardMaterial color={coat} /></mesh>
      </group>
      <group ref={armR} position={[0.3, 0.02, 0]}>
        <mesh position={[0, -0.2, 0]} castShadow><capsuleGeometry args={[0.07, 0.3, 4, 10]} /><meshStandardMaterial color={coat} /></mesh>
      </group>

      {/* head */}
      <group ref={head} position={[0, 0.4, 0]}>
        <mesh castShadow><sphereGeometry args={[0.26, 24, 24]} /><meshStandardMaterial color={skin} /></mesh>
        {/* eyes */}
        <group ref={eyes} position={[0, 0.03, 0.23]}>
          <mesh position={[-0.09, 0, 0]}><sphereGeometry args={[0.035, 12, 12]} /><meshStandardMaterial color={dark} /></mesh>
          <mesh position={[0.09, 0, 0]}><sphereGeometry args={[0.035, 12, 12]} /><meshStandardMaterial color={dark} /></mesh>
        </group>
        {/* cheeks */}
        <mesh position={[-0.14, -0.05, 0.2]}><sphereGeometry args={[0.045, 12, 12]} /><meshStandardMaterial color={cheek} /></mesh>
        <mesh position={[0.14, -0.05, 0.2]}><sphereGeometry args={[0.045, 12, 12]} /><meshStandardMaterial color={cheek} /></mesh>
        {/* smile */}
        <mesh position={[0, -0.09, 0.22]} rotation={[0, 0, Math.PI]}><torusGeometry args={[0.06, 0.012, 8, 16, Math.PI]} /><meshStandardMaterial color={dark} /></mesh>
        {/* chef hat */}
        <mesh position={[0, 0.24, 0]}><cylinderGeometry args={[0.22, 0.24, 0.14, 20]} /><meshStandardMaterial color={hat} /></mesh>
        <mesh position={[0, 0.36, 0]} scale={[1, 0.8, 1]}><sphereGeometry args={[0.27, 20, 20]} /><meshStandardMaterial color={hat} /></mesh>
      </group>
    </group>
  );
}

export default function BakerStage() {
  const reduced = useReducedMotion();
  const count = useCart(selectCount);
  const pointer = useRef({ x: 0, y: 0 });

  const [section, setSection] = useState(0);
  const [mood, setMood] = useState<Mood>("idle");
  const [hidden, setHidden] = useState(false);
  const lastActivity = useRef(Date.now());
  const prevCount = useRef(count);
  const moodTimer = useRef<number | null>(null);

  // Hide on very small screens (too cramped — PRD §4.4)
  useEffect(() => {
    const check = () => setHidden(window.innerWidth < 400);
    check(); window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Global pointer / tap tracking for look-at + wake
  useEffect(() => {
    const move = (x: number, y: number) => {
      pointer.current = { x: (x / window.innerWidth) * 2 - 1, y: (y / window.innerHeight) * 2 - 1 };
      const wasSleeping = Date.now() - lastActivity.current > 30000;
      lastActivity.current = Date.now();
      if (wasSleeping) flash("wave");
    };
    const onMove = (e: PointerEvent) => move(e.clientX, e.clientY);
    const onTouch = (e: TouchEvent) => { const t = e.touches[0]; if (t) move(t.clientX, t.clientY); };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("touchstart", onTouch, { passive: true });
    return () => { window.removeEventListener("pointermove", onMove); window.removeEventListener("touchstart", onTouch); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Section detection from scroll fraction → drives position anchor
  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const frac = max > 0 ? window.scrollY / max : 0;
      setSection(Math.min(ANCHORS.length - 1, Math.floor(frac * ANCHORS.length)));
      lastActivity.current = Date.now();
    };
    onScroll(); window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Cart-add → cheer
  useEffect(() => {
    if (count > prevCount.current) flash("cheer");
    prevCount.current = count;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count]);

  // Idle → sleep after 30s (only if not reduced)
  useEffect(() => {
    if (reduced) return;
    const id = window.setInterval(() => {
      if (Date.now() - lastActivity.current > 30000) setMood((m) => (m === "cheer" || m === "wave" ? m : "sleep"));
    }, 2000);
    return () => window.clearInterval(id);
  }, [reduced]);

  const flash = (m: Mood) => {
    setMood(m);
    if (moodTimer.current) window.clearTimeout(moodTimer.current);
    moodTimer.current = window.setTimeout(() => setMood("idle"), m === "cheer" ? 1500 : 1300);
  };

  if (hidden) return null;

  const a = ANCHORS[section];
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed z-30 h-[30vh] w-[30vh] max-h-[240px] max-w-[240px] -translate-x-1/2 -translate-y-1/2"
      style={{
        left: `${a.left}%`, top: `${a.top}%`,
        transition: "left 1.1s cubic-bezier(.34,1.56,.64,1), top 1.1s cubic-bezier(.34,1.56,.64,1)",
      }}
    >
      {mood === "sleep" && (
        <div className="absolute right-2 top-0 animate-pulse text-2xl">💤</div>
      )}
      <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0.2, 3.2], fov: 42 }} gl={{ alpha: true, antialias: true }}>
        <ambientLight intensity={0.75} />
        <directionalLight position={[3, 5, 4]} intensity={1.1} castShadow />
        <directionalLight position={[-3, 2, -2]} intensity={0.3} />
        {BAKER_MODEL_URL ? null /* swap in a useGLTF model here */ : (
          <ProceduralBaker mood={mood} pointer={pointer} reduced={reduced} />
        )}
        <ContactShadows position={[0, -0.95, 0]} opacity={0.28} scale={3} blur={2.4} far={2} />
      </Canvas>
    </div>
  );
}
