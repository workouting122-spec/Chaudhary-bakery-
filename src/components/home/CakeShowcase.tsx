import { Link } from "react-router-dom";
import { Suspense, lazy } from "react";

// Lazy-load the 3D bundle so it never blocks first paint.
const CakeScene = lazy(() => import("@/components/three/CakeScene"));

export default function CakeShowcase() {
  return (
    <section className="bg-gradient-to-b from-cream-100 to-cream-200 py-20 md:py-28">
      <div className="container-x text-center">
        <p className="eyebrow mb-3">The finished piece</p>
        <h2 className="mx-auto max-w-2xl font-display text-display-md">
          Turn it, tilt it, admire it — this is what arrives.
        </h2>
      </div>
      <Suspense
        fallback={
          <div className="flex h-[70vh] items-center justify-center text-ink-faint">
            Loading 3D preview…
          </div>
        }
      >
        <CakeScene />
      </Suspense>
      <div className="container-x mt-6 text-center">
        <Link to="/shop" className="btn-primary">
          Order a cake like this
        </Link>
        <p className="mt-3 text-xs text-ink-faint">Drag to rotate. (Placeholder 3D model — swap in your GLB.)</p>
      </div>
    </section>
  );
}
