import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import { requireSupabase } from "@/lib/supabase";
import type { DBProduct, DBCategory } from "@/types/db";
import { formatINR } from "@/lib/utils";

export default function Products() {
  const [products, setProducts] = useState<DBProduct[]>([]);
  const [categories, setCategories] = useState<DBCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [cat, setCat] = useState("all");
  const [q, setQ] = useState("");
  const [stockOnly, setStockOnly] = useState(false);

  const load = async () => {
    const sb = requireSupabase();
    const [{ data: p }, { data: c }] = await Promise.all([
      sb.from("products").select("*, product_variants(*), product_images(*), categories(*)").order("created_at", { ascending: false }),
      sb.from("categories").select("*").order("sort_order"),
    ]);
    setProducts((p as DBProduct[]) ?? []);
    setCategories((c as DBCategory[]) ?? []);
    setLoading(false);
  };
  useEffect(() => { load().catch(() => setLoading(false)); }, []);

  const toggleStock = async (p: DBProduct) => {
    const sb = requireSupabase();
    await sb.from("products").update({ in_stock: !p.in_stock }).eq("id", p.id);
    setProducts((list) => list.map((x) => (x.id === p.id ? { ...x, in_stock: !x.in_stock } : x)));
  };
  const remove = async (p: DBProduct) => {
    if (!window.confirm(`Delete “${p.name}”? This cannot be undone.`)) return;
    const sb = requireSupabase();
    await sb.from("products").delete().eq("id", p.id);
    setProducts((list) => list.filter((x) => x.id !== p.id));
  };

  const filtered = useMemo(() => products.filter((p) => {
    if (cat !== "all" && p.category_id !== cat) return false;
    if (stockOnly && !p.in_stock) return false;
    if (q && !p.name.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  }), [products, cat, stockOnly, q]);

  const priceRange = (p: DBProduct) => {
    const prices = (p.product_variants ?? []).map((v) => Number(v.price));
    if (!prices.length) return "—";
    const lo = Math.min(...prices), hi = Math.max(...prices);
    return lo === hi ? formatINR(lo) : `${formatINR(lo)}–${formatINR(hi)}`;
  };
  const mainImg = (p: DBProduct) => (p.product_images ?? []).find((i) => i.is_main)?.url ?? p.product_images?.[0]?.url;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl">Products</h1>
        <Link to="/admin/products/new" className="btn-primary"><Plus size={18} /> Add product</Link>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products"
            className="rounded-xl border border-ink/15 bg-cream-50 py-2 pl-9 pr-3 text-sm focus:border-brand focus:outline-none" />
        </div>
        <select value={cat} onChange={(e) => setCat(e.target.value)} className="rounded-xl border border-ink/15 bg-cream-50 px-3 py-2 text-sm">
          <option value="all">All categories</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <label className="flex items-center gap-2 text-sm text-ink-soft">
          <input type="checkbox" checked={stockOnly} onChange={(e) => setStockOnly(e.target.checked)} className="accent-brand" /> In-stock only
        </label>
      </div>

      <div className="overflow-hidden rounded-2xl bg-cream-50 shadow-card">
        <table className="w-full text-sm">
          <thead className="border-b border-ink/10 text-left text-ink-faint">
            <tr><th className="p-3 font-medium">Product</th><th className="p-3 font-medium">Category</th><th className="p-3 font-medium">Price</th><th className="p-3 font-medium">In stock</th><th className="p-3" /></tr>
          </thead>
          <tbody className="divide-y divide-ink/5">
            {loading && <tr><td colSpan={5} className="p-6 text-center text-ink-faint">Loading…</td></tr>}
            {!loading && filtered.length === 0 && <tr><td colSpan={5} className="p-6 text-center text-ink-faint">No products.</td></tr>}
            {filtered.map((p) => (
              <tr key={p.id} className="hover:bg-cream-100">
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 overflow-hidden rounded-lg bg-cream-200">
                      {mainImg(p) && <img src={mainImg(p)} alt="" className="h-full w-full object-cover" />}
                    </div>
                    <span className="font-medium">{p.name}</span>
                  </div>
                </td>
                <td className="p-3 text-ink-soft">{p.categories?.name ?? "—"}</td>
                <td className="p-3">{priceRange(p)}</td>
                <td className="p-3">
                  <button onClick={() => toggleStock(p)} className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${p.in_stock ? "bg-green-100 text-green-800" : "bg-red-100 text-red-700"}`}>
                    {p.in_stock ? "In stock" : "Out"}
                  </button>
                </td>
                <td className="p-3">
                  <div className="flex justify-end gap-2">
                    <Link to={`/admin/products/${p.id}/edit`} className="rounded-lg p-2 hover:bg-cream-200" aria-label="Edit"><Pencil size={16} /></Link>
                    <button onClick={() => remove(p)} className="rounded-lg p-2 text-brand hover:bg-brand/10" aria-label="Delete"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
