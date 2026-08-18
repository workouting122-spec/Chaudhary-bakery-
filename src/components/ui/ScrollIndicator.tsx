export default function ScrollIndicator() {
  return (
    <div className="pointer-events-none flex flex-col items-center gap-3 text-ink-faint">
      <div className="h-12 w-px origin-top animate-scroll-line bg-ink-faint/60" />
      <span className="eyebrow text-[10px]">scroll to explore</span>
    </div>
  );
}
