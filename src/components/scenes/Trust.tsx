import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import { stats, testimonials } from "@/data/site-content";

/**
 * SCENE — Trust. Statistics are intentionally blank placeholders ("—") so no
 * fabricated numbers ship; replace them in data/site-content.ts with real,
 * verifiable figures. Testimonials are clearly marked as placeholders too.
 */
export default function Trust() {
  return (
    <section id="trust" className="border-t border-bone/5 bg-ink-950 py-[16vh]">
      <div className="container-x">
        <SectionHeading
          eyebrow="Why Meridian"
          title="Quietly, for a long time, with the same hands."
          align="center"
          className="mx-auto"
        />

        <div className="mx-auto mt-16 grid max-w-4xl grid-cols-1 gap-px overflow-hidden rounded-lg border border-bone/10 bg-bone/10 sm:grid-cols-3">
          {stats.map((s, i) => (
            <Reveal key={s.label} variant="scale" delay={i * 100} className="bg-ink-950 p-10 text-center">
              <p className="font-display text-5xl text-brass">{s.value}</p>
              <p className="mt-3 text-sm text-bone-muted">{s.label}</p>
            </Reveal>
          ))}
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2">
          {testimonials.map((t, i) => (
            <Reveal key={i} variant="rise" delay={i * 120} className="plate p-8">
              <p className="font-display text-xl leading-relaxed text-bone">“{t.quote}”</p>
              <p className="mt-6 text-sm text-brass">{t.author}</p>
              <p className="text-xs text-bone-faint">{t.role}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
