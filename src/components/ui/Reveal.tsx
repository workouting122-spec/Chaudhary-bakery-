import { useEffect, useRef, useState, type ReactNode, type ElementType } from "react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type Variant = "mask" | "scale" | "rise" | "clip-left";

interface Props {
  children: ReactNode;
  as?: ElementType;
  variant?: Variant;
  delay?: number;
  className?: string;
  once?: boolean;
}

/**
 * Entrance animation, triggered when the element enters the viewport.
 * Deliberately NOT a plain fade/slide — each variant is a distinct cinematic
 * move (image mask, zoom-settle, clip wipe). Honors prefers-reduced-motion by
 * rendering the final state immediately.
 *
 * Robustness: an IntersectionObserver drives normal scrolling, but we ALSO run
 * an immediate rect check (rAF + on scroll) so elements that are already in
 * view — or that the user jumps straight to via nav/timeline — never get stuck
 * hidden if the observer's first callback is delayed.
 */
export default function Reveal({
  children,
  as: Tag = "div",
  variant = "rise",
  delay = 0,
  className,
  once = true,
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) {
      setShown(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    let done = false;

    const reveal = () => {
      if (done) return;
      done = true;
      setShown(true);
      io.disconnect();
      window.removeEventListener("scroll", check, true);
    };

    // Fires as soon as any part crosses ~92% of the viewport height.
    const inView = () => {
      const r = el.getBoundingClientRect();
      return r.top < window.innerHeight * 0.92 && r.bottom > 0;
    };
    const check = () => {
      if (inView()) reveal();
    };

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) reveal();
      },
      { threshold: 0, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);

    // immediate + next-frame checks catch already-visible / jumped-to elements
    check();
    const raf = requestAnimationFrame(check);
    window.addEventListener("scroll", check, true);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("scroll", check, true);
    };
  }, [reduced, once]);

  const base = "will-change-transform transition-all duration-[1100ms] ease-smooth";
  const states: Record<Variant, { hidden: string; shown: string }> = {
    mask: {
      hidden: "opacity-0 [clip-path:inset(0_0_100%_0)] translate-y-4",
      shown: "opacity-100 [clip-path:inset(0_0_0%_0)] translate-y-0",
    },
    scale: { hidden: "opacity-0 scale-[1.08]", shown: "opacity-100 scale-100" },
    rise: { hidden: "opacity-0 translate-y-8", shown: "opacity-100 translate-y-0" },
    "clip-left": {
      hidden: "opacity-0 [clip-path:inset(0_100%_0_0)]",
      shown: "opacity-100 [clip-path:inset(0_0%_0_0)]",
    },
  };

  return (
    <Tag
      ref={ref as never}
      className={cn(base, shown ? states[variant].shown : states[variant].hidden, className)}
      style={{ transitionDelay: shown ? `${delay}ms` : "0ms" }}
    >
      {children}
    </Tag>
  );
}
