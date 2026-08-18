import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { ShoppingBag, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart, selectCount } from "@/store/cart";
import { ADMIN_LONGPRESS_MS } from "@/admin/adminConfig";

const links = [
  { to: "/shop", label: "Shop" },
  { to: "/gallery", label: "Gallery" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const count = useCart(selectCount);
  const openCart = useCart((s) => s.openCart);
  const navigate = useNavigate();

  // Hidden admin entry: press & hold the brand logo for 5s (no visible button).
  const holdTimer = useRef<number | null>(null);
  const heldRef = useRef(false);
  const startHold = () => {
    heldRef.current = false;
    holdTimer.current = window.setTimeout(() => { heldRef.current = true; navigate("/admin/login"); }, ADMIN_LONGPRESS_MS);
  };
  const cancelHold = () => { if (holdTimer.current) { window.clearTimeout(holdTimer.current); holdTimer.current = null; } };

  // On the home page the nav starts transparent over the hero; elsewhere it's solid.
  const overHero = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [pathname]);

  const solid = scrolled || !overHero || menuOpen;
  // At the very top of the home film the bar is transparent over dark video —
  // flip the text/icons to light so they stay legible.
  const light = overHero && !solid;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-500 ease-smooth",
        solid ? "bg-cream-100/90 shadow-sm backdrop-blur" : "bg-transparent"
      )}
    >
      <nav className="container-x flex h-[var(--nav-h)] items-center justify-between">
        <Link
          to="/"
          onPointerDown={startHold}
          onPointerUp={cancelHold}
          onPointerLeave={cancelHold}
          onPointerCancel={cancelHold}
          onContextMenu={(e) => e.preventDefault()}
          onClick={(e) => { if (heldRef.current) { e.preventDefault(); heldRef.current = false; } }}
          className="flex select-none items-baseline gap-2 leading-none [-webkit-touch-callout:none]"
          aria-label="Chaudhary Bake & Cake, home"
        >
          <span className={cn("font-display text-2xl transition-colors", light ? "text-cream-50" : "text-ink")}>Chaudhary</span>
          <span className={cn("hidden font-display text-sm italic sm:inline", light ? "text-gold-soft" : "text-brand")}>Bake &amp; Cake</span>
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <li key={l.to}>
              <NavLink
                to={l.to}
                className={({ isActive }) =>
                  cn(
                    "text-sm font-medium transition",
                    light ? "text-cream-50/90 hover:text-gold-soft" : "text-ink hover:text-brand",
                    isActive && (light ? "text-gold-soft" : "text-brand")
                  )
                }
              >
                {l.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <button
            onClick={openCart}
            className={cn("relative rounded-full p-2.5 transition", light ? "text-cream-50 hover:bg-cream-50/10" : "text-ink hover:bg-ink/5")}
            aria-label={`Open cart, ${count} items`}
          >
            <ShoppingBag size={20} />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand px-1 text-[11px] font-semibold text-cream-50">
                {count}
              </span>
            )}
          </button>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className={cn("rounded-full p-2.5 transition md:hidden", light ? "text-cream-50 hover:bg-cream-50/10" : "text-ink hover:bg-ink/5")}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="border-t border-ink/10 bg-cream-100 md:hidden">
          <ul className="container-x flex flex-col py-4">
            {links.map((l) => (
              <li key={l.to}>
                <NavLink to={l.to} className="block py-3 text-base font-medium text-ink">
                  {l.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
