import { cn } from "@/lib/utils";
import Reveal from "./Reveal";

interface Props {
  eyebrow?: string;
  title: string;
  intro?: string;
  align?: "left" | "center";
  className?: string;
}

export default function SectionHeading({ eyebrow, title, intro, align = "left", className }: Props) {
  return (
    <div className={cn(align === "center" && "mx-auto text-center", "max-w-2xl", className)}>
      {eyebrow && (
        <Reveal variant="rise">
          <p className="eyebrow mb-4">{eyebrow}</p>
        </Reveal>
      )}
      <Reveal variant="mask">
        <h2 className="text-display-md">{title}</h2>
      </Reveal>
      {intro && (
        <Reveal variant="rise" delay={120}>
          <p className="mt-6 text-base leading-relaxed text-bone-muted">{intro}</p>
        </Reveal>
      )}
      <div className={cn("mt-8 h-px w-20 bg-brass/60", align === "center" && "mx-auto")} />
    </div>
  );
}
