import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { site } from "@/config/site";
import { cn } from "@/lib/utils";

const NAV = [
  { id: "tour", label: "The Residence" },
  { id: "amenities", label: "Amenities" },
  { id: "collection", label: "Collection" },
  { id: "location", label: "Location" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const goToSection = (id: string) => {
    setOpen(false);
    if (location.pathname !== "/") {
      navigate("/");
      // wait for home to mount, then scroll
      setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 80);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-smooth",
          scrolled ? "bg-ink-950/70 py-3 backdrop-blur-md" : "py-5"
        )}
      >
        <div className="container-x flex items-center justify-between">
          <button
            onClick={() => goToSection("top")}
            className="flex items-baseline gap-2"
            aria-label={`${site.name} — home`}
          >
            <span className="font-display text-2xl tracking-tight text-bone">{site.name}</span>
            <span className="hidden text-[10px] uppercase tracking-widest2 text-brass sm:inline">
              {site.established}
            </span>
          </button>

          <nav className="hidden items-center gap-9 md:flex" aria-label="Primary">
            {NAV.map((n) => (
              <button
                key={n.id}
                onClick={() => goToSection(n.id)}
                className="text-sm font-medium text-bone-muted transition hover:text-bone"
              >
                {n.label}
              </button>
            ))}
            <button onClick={() => navigate("/contact")} className="btn-primary">
              Book a Viewing
            </button>
          </nav>

          <button
            className="md:hidden text-bone"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            aria-expanded={open}
          >
            <Menu size={26} />
          </button>
        </div>
      </header>

      {/* mobile drawer */}
      <div
        className={cn(
          "fixed inset-0 z-[60] md:hidden transition",
          open ? "pointer-events-auto" : "pointer-events-none"
        )}
        aria-hidden={!open}
      >
        <div
          className={cn(
            "absolute inset-0 bg-ink-950/80 backdrop-blur-sm transition-opacity duration-300",
            open ? "opacity-100" : "opacity-0"
          )}
          onClick={() => setOpen(false)}
        />
        <div
          className={cn(
            "absolute right-0 top-0 flex h-full w-4/5 max-w-sm flex-col bg-ink-900 px-7 py-6 shadow-lift transition-transform duration-500 ease-smooth",
            open ? "translate-x-0" : "translate-x-full"
          )}
        >
          <div className="mb-10 flex items-center justify-between">
            <span className="font-display text-2xl text-bone">{site.name}</span>
            <button onClick={() => setOpen(false)} aria-label="Close menu" className="text-bone">
              <X size={26} />
            </button>
          </div>
          <nav className="flex flex-col gap-1" aria-label="Mobile">
            {NAV.map((n) => (
              <button
                key={n.id}
                onClick={() => goToSection(n.id)}
                className="border-b border-bone/10 py-4 text-left font-display text-2xl text-bone"
              >
                {n.label}
              </button>
            ))}
          </nav>
          <button
            onClick={() => {
              setOpen(false);
              navigate("/contact");
            }}
            className="btn-primary mt-8 w-full"
          >
            Book a Private Viewing
          </button>
        </div>
      </div>
    </>
  );
}
