import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import ProductCard from "@/components/ui/ProductCard";
import { useCatalog } from "@/hooks/useCatalog";
import type { Category } from "@/types";
import { cn } from "@/lib/utils";

const cats: { id: Category | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "cakes", label: "Cakes" },
  { id: "pastries", label: "Pastries" },
  { id: "cookies-cupcakes", label: "Cookies & Cupcakes" },
  { id: "breads", label: "Breads" },
];

type Sort = "popular" | "price-asc" | "price-desc";

export default function Shop() {
  const [params, setParams] = useSearchParams();
  const activeCat = (params.get("category") as Category | null) ?? "all";
  const [query, setQuery] = useState("");
  const [maxPrice, setMaxPrice] = useState(2000);
  const [sort, setSort] = useState<Sort>("popular");
  const { products, loading } = useCatalog();

  const setCat = (id: string) => {
    if (id === "all") params.delete("category");
    else params.set("category", id);
    setParams(params, { replace: true });
  };

  const list = useMemo(() => {
    let out = products.filter((p) => {
      const okCat = activeCat === "all" || p.category === activeCat;
      const okQuery = p.name.toLowerCase().includes(query.toLowerCase());
      const okPrice = p.basePrice <= maxPrice;
      return okCat && okQuery && okPrice;
    });
    if (sort === "price-asc") out = [...out].sort((a, b) => a.basePrice - b.basePrice);
    if (sort === "price-desc") out = [...out].sort((a, b) => b.basePrice - a.basePrice);
    return out;
  }, [products, activeCat, query, maxPrice, sort]);

  return (
    <div className="container-x pb-24 pt-[calc(var(--nav-h)+3rem)]">
      <header className="mb-10">
        <p className="eyebrow mb-3">The bakery</p>
        <h1 className="font-display text-display-md">Shop everything</h1>
      </header>

      <div className="grid gap-10 lg:grid-cols-[240px_1fr]">
        {/* Filters */}
        <aside className="space-y-8">
          <div>
            <label className="relative block">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search cakes…"
                className="w-full rounded-full border border-ink/15 bg-cream-50 py-2.5 pl-9 pr-4 text-sm focus:border-brand focus:outline-none"
              />
            </label>
          </div>

          <div>
            <p className="eyebrow mb-3">Category</p>
            <ul className="space-y-1">
              {cats.map((c) => (
                <li key={c.id}>
                  <button
                    onClick={() => setCat(c.id)}
                    className={cn(
                      "w-full rounded-lg px-3 py-2 text-left text-sm transition",
                      activeCat === c.id ? "bg-brand text-cream-50" : "hover:bg-ink/5"
                    )}
                  >
                    {c.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="eyebrow mb-3">Max price: ₹{maxPrice}</p>
            <input
              type="range"
              min={79}
              max={2000}
              step={10}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-brand"
            />
          </div>
        </aside>

        {/* Grid */}
        <div>
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm text-ink-faint">{list.length} items</p>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
              className="rounded-full border border-ink/15 bg-cream-50 px-4 py-2 text-sm focus:border-brand focus:outline-none"
            >
              <option value="popular">Sort: Popular</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>

          {loading ? (
            <p className="py-20 text-center text-ink-faint">Loading the bakery…</p>
          ) : list.length === 0 ? (
            <p className="py-20 text-center text-ink-faint">No products match your filters.</p>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
              {list.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
