import { Quote } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import { testimonials } from "@/data/testimonials";

export default function Testimonials() {
  return (
    <section className="bg-cream-100 py-20 md:py-28">
      <div className="container-x">
        <SectionHeading eyebrow="Kind words" title="Loved by our customers" align="center" />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <figure key={t.author} className="flex flex-col rounded-2xl bg-cream-50 p-8 shadow-card">
              <Quote size={28} className="text-gold" />
              <blockquote className="mt-4 flex-1 text-ink-soft">{t.quote}</blockquote>
              <figcaption className="mt-6 font-display text-lg">— {t.author}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
