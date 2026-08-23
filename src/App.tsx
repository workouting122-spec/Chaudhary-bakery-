import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "@/components/layout/Layout";

// Code-split routes — the animation-heavy home never bloats /contact etc.
const Home = lazy(() => import("@/pages/Home"));
const Residences = lazy(() => import("@/pages/Residences"));
const Contact = lazy(() => import("@/pages/Contact"));
const NotFound = lazy(() => import("@/pages/NotFound"));

function PageFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center text-bone-muted">Loading…</div>
  );
}

export default function App() {
  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/residences" element={<Residences />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
