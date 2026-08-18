import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Procedural 2-tier cake — a stand-in for the client's real GLB.
 * To use a real model instead:
 *   import { useGLTF } from "@react-three/drei";
 *   const { scene } = useGLTF("/assets/finished-cake.glb");
 *   return <primitive object={scene} />;
 */
export default function FinishedCake({ autoRotate = true }: { autoRotate?: boolean }) {
  const group = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (autoRotate && group.current) group.current.rotation.y += delta * 0.25;
  });

  const cream = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#F3ECDE", roughness: 0.85, metalness: 0.02 }),
    []
  );
  const gold = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#C6A15B", roughness: 0.35, metalness: 0.9 }),
    []
  );
  const marble = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#E7DECE", roughness: 0.7 }),
    []
  );
  const petal = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#FDFCFA", roughness: 0.6 }),
    []
  );

  // Scattered gold-leaf flecks on the lower tier
  const flecks = useMemo(() => {
    const arr: { pos: [number, number, number]; s: number }[] = [];
    for (let i = 0; i < 26; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = 1.02;
      arr.push({
        pos: [Math.cos(a) * r, -0.15 + Math.random() * 0.7, Math.sin(a) * r],
        s: 0.03 + Math.random() * 0.05,
      });
    }
    return arr;
  }, []);

  return (
    <group ref={group} position={[0, -0.3, 0]}>
      {/* Marble stand */}
      <mesh material={marble} position={[0, -1.35, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.4, 1.4, 0.14, 64]} />
      </mesh>
      <mesh material={marble} position={[0, -1.75, 0]}>
        <cylinderGeometry args={[0.35, 0.5, 0.7, 48]} />
      </mesh>

      {/* Lower tier */}
      <mesh material={cream} position={[0, -0.55, 0]} castShadow>
        <cylinderGeometry args={[1.05, 1.05, 1.1, 64]} />
      </mesh>
      {/* Upper tier */}
      <mesh material={cream} position={[0, 0.45, 0]} castShadow>
        <cylinderGeometry args={[0.72, 0.72, 0.95, 64]} />
      </mesh>

      {/* Gold flecks */}
      {flecks.map((f, i) => (
        <mesh key={i} material={gold} position={f.pos}>
          <boxGeometry args={[f.s, f.s * 1.4, 0.006]} />
        </mesh>
      ))}

      {/* Simple orchid on top (cluster of petals) */}
      <group position={[0.28, 1.02, 0.12]} rotation={[0.3, 0.4, 0]}>
        {[0, 1, 2, 3, 4].map((i) => (
          <mesh
            key={i}
            material={petal}
            position={[Math.cos((i / 5) * Math.PI * 2) * 0.14, 0, Math.sin((i / 5) * Math.PI * 2) * 0.14]}
            scale={[0.13, 0.04, 0.19]}
          >
            <sphereGeometry args={[1, 20, 20]} />
          </mesh>
        ))}
        <mesh material={gold} scale={[0.06, 0.04, 0.06]}>
          <sphereGeometry args={[1, 16, 16]} />
        </mesh>
      </group>
    </group>
  );
}
