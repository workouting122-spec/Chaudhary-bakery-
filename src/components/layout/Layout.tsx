import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Layout() {
  const { pathname } = useLocation();

  // Reset scroll on route change (except in-page hash navigation).
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="relative min-h-screen bg-ink-900">
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Navbar />
      <main id="main">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
