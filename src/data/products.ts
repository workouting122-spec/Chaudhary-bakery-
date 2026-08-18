import type { Product } from "@/types";

/**
 * Placeholder catalogue (PRD §4.2 Section 4 + §5.1).
 * Images reuse the poster frames for now — swap `image`/`gallery`
 * with real product photos in /public/assets/products/.
 */
const IMG = {
  final: "/assets/frame-04-final-decorated.png",
  berries: "/assets/frame-03-naked-3layer-berries.png",
  naked: "/assets/frame-02-naked-2layer.png",
  stand: "/assets/frame-01-empty-stand.png",
};

const kgVariants = (perKg: number) => [
  { label: "500g", price: Math.round(perKg / 2) },
  { label: "1kg", price: perKg },
  { label: "1.5kg", price: Math.round(perKg * 1.5) },
  { label: "2kg", price: perKg * 2 },
];

export const products: Product[] = [
  {
    id: "vanilla-truffle",
    slug: "classic-vanilla-truffle",
    name: "Classic Vanilla Truffle",
    category: "cakes",
    basePrice: 649,
    unit: "kg",
    image: IMG.final,
    gallery: [IMG.final, IMG.naked, IMG.berries],
    description:
      "Soft eggless vanilla sponge layered with silky truffle cream. Light, fragrant, and endlessly popular.",
    tags: ["eggless", "bestseller"],
    variants: kgVariants(649),
    featured: true,
  },
  {
    id: "belgian-chocolate",
    slug: "rich-belgian-chocolate",
    name: "Rich Belgian Chocolate",
    category: "cakes",
    basePrice: 749,
    unit: "kg",
    image: IMG.final,
    gallery: [IMG.final, IMG.berries],
    description:
      "Deep, glossy Belgian chocolate ganache over a moist eggless chocolate sponge. For serious chocolate lovers.",
    tags: ["eggless", "chocolate"],
    variants: kgVariants(749),
    featured: true,
  },
  {
    id: "red-velvet",
    slug: "red-velvet-dream",
    name: "Red Velvet Dream",
    category: "cakes",
    basePrice: 799,
    unit: "kg",
    image: IMG.final,
    description:
      "Velvety crimson sponge with a tangy cream-cheese frosting. A celebration classic, made eggless.",
    tags: ["eggless", "bestseller"],
    variants: kgVariants(799),
    featured: true,
  },
  {
    id: "fruit-gateau",
    slug: "fresh-fruit-gateau",
    name: "Fresh Fruit Gateau",
    category: "cakes",
    basePrice: 699,
    unit: "kg",
    image: IMG.berries,
    gallery: [IMG.berries, IMG.naked],
    description:
      "Light cream sponge crowned with seasonal fresh fruit. Because it should taste like the season.",
    tags: ["eggless", "seasonal"],
    variants: kgVariants(699),
    featured: true,
  },
  {
    id: "butterscotch-crunch",
    slug: "butterscotch-crunch",
    name: "Butterscotch Crunch",
    category: "cakes",
    basePrice: 649,
    unit: "kg",
    image: IMG.final,
    description:
      "Caramelised butterscotch cream with a praline crunch in every bite. Nostalgic and irresistible.",
    tags: ["eggless"],
    variants: kgVariants(649),
    featured: true,
  },
  {
    id: "black-forest",
    slug: "black-forest-classic",
    name: "Black Forest Classic",
    category: "cakes",
    basePrice: 699,
    unit: "kg",
    image: IMG.berries,
    description:
      "Chocolate sponge, whipped cream and cherries — the timeless favourite, done right and eggless.",
    tags: ["eggless", "bestseller"],
    variants: kgVariants(699),
    featured: true,
  },
  {
    id: "choco-chip-cookies",
    slug: "choco-chip-cookies",
    name: "Choco-Chip Cookies (Box of 6)",
    category: "cookies-cupcakes",
    basePrice: 199,
    image: IMG.naked,
    description: "Chewy centres, crisp edges, and pockets of melting chocolate. Baked fresh daily.",
    tags: ["eggless"],
  },
  {
    id: "vanilla-cupcakes",
    slug: "vanilla-cupcakes",
    name: "Vanilla Cupcakes (Box of 6)",
    category: "cookies-cupcakes",
    basePrice: 249,
    image: IMG.naked,
    description: "Fluffy eggless cupcakes with a swirl of vanilla buttercream.",
    tags: ["eggless"],
  },
  {
    id: "artisan-loaf",
    slug: "artisan-bread-loaf",
    name: "Artisan Bread Loaf",
    category: "breads",
    basePrice: 89,
    image: IMG.stand,
    description: "A crusty, soft-crumbed loaf baked in-house every morning.",
    tags: ["eggless", "daily"],
  },
  {
    id: "chocolate-pastry",
    slug: "chocolate-pastry",
    name: "Chocolate Pastry",
    category: "pastries",
    basePrice: 79,
    image: IMG.berries,
    description: "A single-serve slice of rich chocolate indulgence.",
    tags: ["eggless"],
  },
];

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
export const featuredProducts = products.filter((p) => p.featured);
export const relatedProducts = (slug: string, category: string) =>
  products.filter((p) => p.slug !== slug && p.category === category).slice(0, 4);
