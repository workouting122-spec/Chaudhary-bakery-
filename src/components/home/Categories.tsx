import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import { categories } from "@/data/categories";

export default function Categories() {
  return (
    <section className="bg-cream-100 py-20 md:py-28">
      <div className="container-x">
        <SectionHeading eyebrow="Browse" title="Something for every occasion" />
        <div className="mt-12 grid gap-4 sm:gap-6 md:grid-cols-2">
          {categories.map((c) => (
            <Link
              key={c.id}
              to={`/shop?category=${c.id}`}
              className="group relative flex h-56 items-end overflow-hidden rounded-2xl shadow-card md:h-64"
            >
              <img
                src={c.image}
                alt=""
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition duration-700 ease-smooth group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/20 to-transparent" />
              <div className="relative p-6 text-cream-50">
                <h3 className="font-display text-3xl text-cream-50">{c.label}</h3>
                <p className="mt-1 text-sm text-cream-200">{c.blurb}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium opacity-0 transition group-hover:opacity-100">
                  Browse <ArrowRight size={16} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
