import { useEffect, useRef, useState } from "react";
import type { Product } from "@/types";
import { supabase, isSupabaseReady } from "@/lib/supabase";
import { fetchCatalog } from "@/lib/catalog";
import { products as staticProducts } from "@/data/products";

/**
 * The storefront's single source of products.
 * - No Supabase → returns the static catalogue synchronously (zero-backend mode).
 * - Supabase configured → fetches the live, admin-managed catalogue AND subscribes
 *   to Realtime changes, so add/edit/delete/stock changes in the admin appear on
 *   the storefront within a moment, no manual refresh.
 */
export function useCatalog() {
  const [products, setProducts] = useState<Product[]>(isSupabaseReady ? [] : staticProducts);
  const [loading, setLoading] = useState(isSupabaseReady);
  const debounce = useRef<number | null>(null);

  useEffect(() => {
    if (!isSupabaseReady || !supabase) return;
    let active = true;

    const refetch = () =>
      fetchCatalog()
        .then((p) => { if (active) { setProducts(p); setLoading(false); } })
        .catch(() => { if (active) setLoading(false); });

    refetch();

    const schedule = () => {
      if (debounce.current) window.clearTimeout(debounce.current);
      debounce.current = window.setTimeout(refetch, 250);
    };

    const ch = supabase
      .channel("storefront-catalog")
      .on("postgres_changes", { event: "*", schema: "public", table: "products" }, schedule)
      .on("postgres_changes", { event: "*", schema: "public", table: "product_variants" }, schedule)
      .on("postgres_changes", { event: "*", schema: "public", table: "product_images" }, schedule)
      .subscribe();

    return () => {
      active = false;
      if (debounce.current) window.clearTimeout(debounce.current);
      supabase!.removeChannel(ch);
    };
  }, []);

  return { products, loading, live: isSupabaseReady };
}
