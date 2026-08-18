import { cn } from "@/lib/utils";

interface Props {
  eyebrow?: string;
  title: string;
  align?: "left" | "center";
  className?: string;
}

export default function SectionHeading({ eyebrow, title, align = "left", className }: Props) {
  return (
    <div className={cn(align === "center" && "text-center", className)}>
      {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
      <h2 className="font-display text-display-md font-normal">{title}</h2>
      <div className={cn("mt-6 h-px w-24 bg-gold/50", align === "center" && "mx-auto")} />
    </div>
  );
}
