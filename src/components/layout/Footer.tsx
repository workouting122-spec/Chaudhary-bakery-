import { Link } from "react-router-dom";
import { Instagram, Facebook } from "lucide-react";
import { site, waLink, telLink } from "@/config/site";

const cols = [
  {
    title: "Shop",
    links: [
      { label: "All products", to: "/shop" },
      { label: "Cakes", to: "/shop?category=cakes" },
      { label: "Pastries", to: "/shop?category=pastries" },
      { label: "Breads", to: "/shop?category=breads" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Our story", to: "/about" },
      { label: "Gallery", to: "/gallery" },
      { label: "Contact", to: "/contact" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Order on WhatsApp", to: waLink(), external: true },
      { label: "Call us", to: telLink(), external: true },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-ink/10 bg-cream-200">
      <div className="container-x grid gap-10 py-16 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div>
          <p className="font-display text-2xl">Chaudhary Bake &amp; Cake</p>
          <p className="mt-2 max-w-xs text-sm text-ink-soft">
            {site.tagline} — baked fresh every morning.
          </p>
          <div className="mt-5 flex gap-3">
            <a href={site.social.instagram} aria-label="Instagram" target="_blank" rel="noopener noreferrer" className="rounded-full border border-ink/15 p-2.5 hover:border-brand hover:text-brand">
              <Instagram size={18} />
            </a>
            <a href={site.social.facebook} aria-label="Facebook" target="_blank" rel="noopener noreferrer" className="rounded-full border border-ink/15 p-2.5 hover:border-brand hover:text-brand">
              <Facebook size={18} />
            </a>
          </div>
        </div>

        {cols.map((col) => (
          <div key={col.title}>
            <p className="eyebrow mb-4">{col.title}</p>
            <ul className="space-y-2.5 text-sm text-ink-soft">
              {col.links.map((l) =>
                "external" in l && l.external ? (
                  <li key={l.label}>
                    <a href={l.to} target="_blank" rel="noopener noreferrer" className="hover:text-brand">
                      {l.label}
                    </a>
                  </li>
                ) : (
                  <li key={l.label}>
                    <Link to={l.to} className="hover:text-brand">
                      {l.label}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-ink/10">
        <div className="container-x flex flex-col items-center justify-between gap-2 py-6 text-xs text-ink-faint sm:flex-row">
          <p>© {new Date().getFullYear()} Chaudhary Bake &amp; Cake. All rights reserved.</p>
          <p>100% Vegetarian · 100% Eggless</p>
        </div>
      </div>
    </footer>
  );
}
