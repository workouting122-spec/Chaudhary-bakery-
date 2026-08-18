import type { Product, Category } from "@/types";
import type { DBProduct } from "@/types/db";
import { supabase, isSupabaseReady } from "@/lib/supabase";
import { products as staticProducts } from "@/data/products";

const CATS: Category[] = ["cakes", "pastries", "cookies-cupcakes", "breads"];
const FALLBACK_IMG = "/assets/frame-04-final-decorated.png";

// Product descriptions are authored as rich text (HTML) in the admin.
// The storefront renders plain text, so flatten it here.
const stripHtml = (html: string) =>
  html.replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();

/** Convert a Supabase product row (with joins) into the storefront Product shape. */
export function mapDBProduct(db: DBProduct): Product {
  const variants = (db.product_variants ?? [])
    .slice()
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((v) => ({ label: v.weight_label, price: Number(v.price) }));

  const images = (db.product_images ?? []).slice().sort((a, b) => a.sort_order - b.sort_order);
  const main = images.find((i) => i.is_main) ?? images[0];
  const gallery = [main, ...images.filter((i) => i !== main)].filter(Boolean).map((i) => i!.url);

  const perKg =
    variants.find((v) => /1\s*kg/i.test(v.label))?.price ??
    (variants.length ? Math.max(...variants.map((v) => v.price)) : 0);

  const catSlug = db.categories?.slug as Category | undefined;

  const tags = [...(db.tags ?? [])];
  if (db.is_eggless && !tags.includes("eggless")) tags.unshift("eggless");
  if (db.is_bestseller && !tags.includes("bestseller")) tags.push("bestseller");
  if (db.is_new && !tags.includes("new")) tags.push("new");

  return {
    id: db.id,
    slug: db.slug,
    name: db.name,
    category: catSlug && CATS.includes(catSlug) ? catSlug : "cakes",
    basePrice: perKg,
    unit: "kg",
    image: main?.url ?? FALLBACK_IMG,
    gallery: gallery.length ? gallery : [FALLBACK_IMG],
    description: stripHtml(db.description ?? ""),
    tags,
    variants: variants.length ? variants : undefined,
    featured: db.is_bestseller || (db.tags ?? []).includes("bestseller"),
  };
}

/**
 * Live catalogue when Supabase is configured; the static placeholder catalogue
 * otherwise. When live, an empty result is respected (the owner may have hidden
 * everything) — we only fall back to static on missing config or a hard error.
 */
export async function fetchCatalog(): Promise<Product[]> {
  if (!isSupabaseReady || !supabase) return staticProducts;
  const { data, error } = await supabase
    .from("products")
    .select("*, product_variants(*), product_images(*), categories(*)")
    .eq("in_stock", true)
    .order("created_at", { ascending: false });
  if (error || !data) return staticProducts;
  return (data as DBProduct[]).map(mapDBProduct);
}

export const pickFeatured = (list: Product[]) => list.filter((p) => p.featured);
export const findBySlug = (list: Product[], slug: string) => list.find((p) => p.slug === slug);
export const relatedFrom = (list: Product[], slug: string, category: string) =>
  list.filter((p) => p.slug !== slug && p.category === category).slice(0, 4);
