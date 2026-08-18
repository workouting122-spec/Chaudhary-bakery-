import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows, OrbitControls, PerspectiveCamera } from "@react-three/drei";
import FinishedCake from "./FinishedCake";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/** Interactive 3D showcase of the finished cake (PRD: visible below the scroll section). */
export default function CakeScene() {
  const reduced = useReducedMotion();

  return (
    <div className="h-[70vh] w-full">
      <Canvas dpr={[1, 2]} shadows gl={{ antialias: true, alpha: true }}>
        <PerspectiveCamera makeDefault position={[0, 0.4, 5.2]} fov={40} />
        <ambientLight intensity={0.7} />
        <directionalLight position={[4, 6, 4]} intensity={1.1} castShadow shadow-mapSize={[1024, 1024]} />
        <directionalLight position={[-5, 3, -2]} intensity={0.4} color="#f7e9c9" />

        <Suspense fallback={null}>
          <FinishedCake autoRotate={!reduced} />
          <ContactShadows position={[0, -2.15, 0]} opacity={0.35} scale={7} blur={2.6} far={4} />
        </Suspense>

        <OrbitControls
          enablePan={false}
          enableZoom={false}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.9}
          autoRotate={false}
        />
      </Canvas>
    </div>
  );
}
