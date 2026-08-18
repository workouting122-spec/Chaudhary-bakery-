import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import CartDrawer from "./CartDrawer";
import WhatsAppButton from "./WhatsAppButton";

export default function Layout() {
  const { pathname } = useLocation();

  // Scroll to top on route change (except in-page anchors)
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);

  return (
    <>
      <a href="#main" className="skip-link">Skip to content</a>
      <Navbar />
      <CartDrawer />
      <WhatsAppButton />
      <main id="main">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
