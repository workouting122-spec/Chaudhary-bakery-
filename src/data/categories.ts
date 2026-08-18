import type { Category } from "@/types";

export interface CategoryTile {
  id: Category;
  label: string;
  blurb: string;
  image: string;
}

/** Image paths are placeholders — drop real category photos into /public/assets/. */
export const categories: CategoryTile[] = [
  { id: "cakes", label: "Cakes", blurb: "Celebration centrepieces, made to order.", image: "/assets/frame-04-final-decorated.png" },
  { id: "pastries", label: "Pastries", blurb: "Single-serve indulgence, fresh daily.", image: "/assets/frame-03-naked-3layer-berries.png" },
  { id: "cookies-cupcakes", label: "Cookies & Cupcakes", blurb: "Little treats for every craving.", image: "/assets/frame-02-naked-2layer.png" },
  { id: "breads", label: "Breads", blurb: "Baked in-house every morning.", image: "/assets/frame-01-empty-stand.png" },
];
