import { useState } from "react";
import { X } from "lucide-react";

// Placeholder gallery — replace with real past-order photos in /public/assets/gallery/.
const photos = [
  "/assets/frame-04-final-decorated.png",
  "/assets/frame-03-naked-3layer-berries.png",
  "/assets/frame-02-naked-2layer.png",
  "/assets/frame-01-empty-stand.png",
  "/assets/frame-04-final-decorated.png",
  "/assets/frame-03-naked-3layer-berries.png",
  "/assets/frame-02-naked-2layer.png",
  "/assets/frame-01-empty-stand.png",
];

export default function Gallery() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <div className="container-x pb-24 pt-[calc(var(--nav-h)+2rem)]">
      <header className="mb-10">
        <p className="eyebrow mb-3">Our work</p>
        <h1 className="font-display text-display-md">Gallery</h1>
      </header>

      <div className="columns-2 gap-4 md:columns-3 lg:columns-4 [&>*]:mb-4">
        {photos.map((src, i) => (
          <button
            key={i}
            onClick={() => setActive(src)}
            className="block w-full overflow-hidden rounded-xl shadow-card transition hover:opacity-90"
          >
            <img src={src} alt={`Past order ${i + 1}`} loading="lazy" className="w-full" />
          </button>
        ))}
      </div>

      {active && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-ink/80 p-6"
          onClick={() => setActive(null)}
        >
          <button className="absolute right-6 top-6 text-cream-50" aria-label="Close">
            <X size={28} />
          </button>
          <img src={active} alt="" className="max-h-[85vh] max-w-full rounded-xl" />
        </div>
      )}
    </div>
  );
}
