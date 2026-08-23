interface Props {
  label?: string;
}

export default function ScrollIndicator({ label = "scroll to enter" }: Props) {
  return (
    <div className="pointer-events-none flex flex-col items-center gap-3 text-bone-muted">
      <span className="eyebrow text-[10px] text-bone-muted">{label}</span>
      <div className="h-14 w-px origin-top animate-scroll-line bg-brass/70" />
    </div>
  );
}
