import { useRef } from "react";
import { Link } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import SectionHeading from "@/components/ui/SectionHeading";
import ProductCard from "@/components/ui/ProductCard";
import { useCatalog } from "@/hooks/useCatalog";
import { pickFeatured } from "@/lib/catalog";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export default function FeaturedProducts() {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { products } = useCatalog();
  const featured = (pickFeatured(products).length ? pickFeatured(products) : products).slice(0, 6);

  useGSAP(
    () => {
      if (reduced) return;
      ScrollTrigger.batch(".feat-card", {
        start: "top 88%",
        onEnter: (batch) =>
          gsap.from(batch, {
            y: 40,
            autoAlpha: 0,
            stagger: 0.08,
            duration: 0.7,
            ease: "power3.out",
            overwrite: true,
          }),
      });
    },
    { scope: root, dependencies: [reduced, featured.length] }
  );

  return (
    <section ref={root} className="bg-cream-200 py-20 md:py-28">
      <div className="container-x">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading eyebrow="Fresh this week" title="This week's favourites" />
          <Link to="/shop" className="text-sm font-medium text-brand hover:underline">
            View all →
          </Link>
        </div>
        <div className="mt-12 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
          {featured.map((p) => (
            <div key={p.id} className="feat-card">
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
