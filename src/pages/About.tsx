import { Link } from "react-router-dom";
import { Leaf, Sunrise, HandHeart } from "lucide-react";
import { site } from "@/config/site";

const values = [
  { icon: Leaf, title: "100% Eggless", body: "Every single item is baked eggless — no exceptions, ever." },
  { icon: Sunrise, title: "Fresh Daily", body: "Baked in-house each morning, never frozen, never from a box." },
  { icon: HandHeart, title: "Handcrafted", body: "Decorated by hand, one cake at a time, for your moment." },
];

export default function About() {
  return (
    <div className="pb-24 pt-[var(--nav-h)]">
      {/* Hero */}
      <section className="relative flex h-[60vh] items-end overflow-hidden">
        <img src="/assets/storefront.jpg" alt="Chaudhary Bake & Cake storefront" className="absolute inset-0 h-full w-full object-cover" onError={(e) => ((e.target as HTMLImageElement).src = "/assets/frame-04-final-decorated.png")} />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent" />
        <div className="container-x relative pb-12 text-cream-50">
          <p className="eyebrow text-cream-200">Since {site.sinceYear}</p>
          <h1 className="mt-2 font-display text-display-lg text-cream-50">Our story</h1>
        </div>
      </section>

      <section className="container-x max-w-3xl py-16">
        <p className="text-lg leading-relaxed text-ink-soft">
          Chaudhary Bake &amp; Cake began with a simple belief: that an eggless cake should never
          feel like a compromise. Over the years, we've become {site.neighborhood}'s go-to bakery for
          birthdays, anniversaries, festivals, and the small, ordinary days worth making sweeter.
        </p>
        <p className="mt-6 text-lg leading-relaxed text-ink-soft">
          Everything is baked in our own kitchen, by hand, using premium ingredients — and always
          100% vegetarian and eggless. From the first sponge to the final flourish of gold leaf,
          we bake for the moments that matter.
        </p>
      </section>

      <section className="bg-cream-200 py-16">
        <div className="container-x grid gap-8 md:grid-cols-3">
          {values.map((v) => (
            <div key={v.title} className="rounded-2xl bg-cream-50 p-8 shadow-card">
              <v.icon className="text-brand" size={28} />
              <h3 className="mt-4 font-display text-2xl">{v.title}</h3>
              <p className="mt-2 text-ink-soft">{v.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-x py-16 text-center">
        <h2 className="font-display text-display-md">Ready to taste the difference?</h2>
        <Link to="/shop" className="btn-primary mt-8">Browse the bakery</Link>
      </section>
    </div>
  );
}
