import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Plus, Trash2, Star, Upload, ArrowLeft } from "lucide-react";
import { requireSupabase } from "@/lib/supabase";
import type { DBCategory, DBProduct } from "@/types/db";
import RichText from "../components/RichText";

const ALL_TAGS = ["bestseller", "new", "seasonal", "gluten-free"];
const slugify = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const uid = () => (crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random()));

interface Variant { id?: string; weight_label: string; price: string; stock_qty: string; }
interface Img { id?: string; url: string; is_main: boolean; path?: string; }

export default function ProductForm() {
  const { id } = useParams();
  const editing = Boolean(id);
  const nav = useNavigate();
  const sb = requireSupabase();

  const [productId] = useState<string>(id ?? uid());
  const [categories, setCategories] = useState<DBCategory[]>([]);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [categoryId, setCategoryId] = useState<string>("");
  const [description, setDescription] = useState("");
  const [isEggless, setIsEggless] = useState(true);
  const [inStock, setInStock] = useState(true);
  const [tags, setTags] = useState<string[]>([]);
  const [variants, setVariants] = useState<Variant[]>([{ weight_label: "500g", price: "", stock_qty: "20" }]);
  const [images, setImages] = useState<Img[]>([]);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: cats } = await sb.from("categories").select("*").order("sort_order");
      setCategories((cats as DBCategory[]) ?? []);
      if (editing) {
        const { data } = await sb.from("products").select("*, product_variants(*), product_images(*)").eq("id", id).maybeSingle();
        const p = data as DBProduct | null;
        if (p) {
          setName(p.name); setSlug(p.slug); setSlugTouched(true);
          setCategoryId(p.category_id ?? ""); setDescription(p.description ?? "");
          setIsEggless(p.is_eggless); setInStock(p.in_stock); setTags(p.tags ?? []);
          setVariants((p.product_variants ?? []).sort((a,b)=>a.sort_order-b.sort_order).map((v) => ({ id: v.id, weight_label: v.weight_label, price: String(v.price), stock_qty: String(v.stock_qty) })) || []);
          setImages((p.product_images ?? []).map((im) => ({ id: im.id, url: im.url, is_main: im.is_main })));
        }
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => { if (!slugTouched) setSlug(slugify(name)); }, [name, slugTouched]);

  const addVariant = () => setVariants((v) => [...v, { weight_label: "", price: "", stock_qty: "0" }]);
  const setVariant = (i: number, patch: Partial<Variant>) => setVariants((v) => v.map((x, j) => (j === i ? { ...x, ...patch } : x)));
  const removeVariant = (i: number) => setVariants((v) => v.filter((_, j) => j !== i));
  const toggleTag = (t: string) => setTags((cur) => (cur.includes(t) ? cur.filter((x) => x !== t) : [...cur, t]));

  const onUpload = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploading(true);
    const added: Img[] = [];
    for (const file of Array.from(files)) {
      const path = `${productId}/${uid()}-${file.name.replace(/\s+/g, "_")}`;
      const { error } = await sb.storage.from("product-images").upload(path, file, { upsert: true });
      if (!error) {
        const url = sb.storage.from("product-images").getPublicUrl(path).data.publicUrl;
        added.push({ url, is_main: images.length === 0 && added.length === 0, path });
      }
    }
    setImages((cur) => [...cur, ...added]);
    setUploading(false);
  };
  const makeMain = (idx: number) => setImages((cur) => cur.map((im, i) => ({ ...im, is_main: i === idx })));
  const removeImage = async (idx: number) => {
    const im = images[idx];
    if (im.path) await sb.storage.from("product-images").remove([im.path]);
    setImages((cur) => cur.filter((_, i) => i !== idx));
  };

  const canSave = useMemo(() =>
    name.trim() && slug.trim() && variants.length > 0 && variants.every((v) => v.weight_label && v.price),
    [name, slug, variants]);

  const save = async () => {
    if (!canSave) return;
    setBusy(true);
    const payload = {
      id: productId, name: name.trim(), slug: slug.trim(), description,
      category_id: categoryId || null, is_eggless: isEggless, in_stock: inStock,
      tags, is_bestseller: tags.includes("bestseller"), is_new: tags.includes("new"),
      updated_at: new Date().toISOString(),
    };
    const { error } = await sb.from("products").upsert(payload);
    if (error) { setBusy(false); alert(error.message); return; }

    // Sync variants (replace all).
    await sb.from("product_variants").delete().eq("product_id", productId);
    await sb.from("product_variants").insert(
      variants.map((v, i) => ({ product_id: productId, weight_label: v.weight_label, price: Number(v.price), stock_qty: Number(v.stock_qty || 0), sort_order: i }))
    );

    // Sync images (replace all).
    await sb.from("product_images").delete().eq("product_id", productId);
    if (images.length) {
      await sb.from("product_images").insert(
        images.map((im, i) => ({ product_id: productId, url: im.url, is_main: im.is_main, sort_order: i }))
      );
    }
    setBusy(false);
    nav("/admin/products");
  };

  const field = "w-full rounded-xl border border-ink/15 bg-cream-50 px-4 py-2.5 focus:border-brand focus:outline-none";

  return (
    <div className="max-w-3xl space-y-6">
      <button onClick={() => nav("/admin/products")} className="flex items-center gap-1 text-sm text-ink-faint hover:text-brand"><ArrowLeft size={16} /> Products</button>
      <h1 className="font-display text-3xl">{editing ? "Edit product" : "Add product"}</h1>

      <div className="space-y-4 rounded-2xl bg-cream-50 p-6 shadow-card">
        <div className="grid gap-4 sm:grid-cols-2">
          <div><label className="eyebrow mb-1 block">Name</label><input value={name} onChange={(e) => setName(e.target.value)} className={field} /></div>
          <div><label className="eyebrow mb-1 block">Slug</label><input value={slug} onChange={(e) => { setSlug(e.target.value); setSlugTouched(true); }} className={field} /></div>
        </div>
        <div>
          <label className="eyebrow mb-1 block">Category</label>
          <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className={field}>
            <option value="">— none —</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className="eyebrow mb-1 block">Description</label>
          <RichText value={description} onChange={setDescription} />
        </div>
        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={isEggless} onChange={(e) => setIsEggless(e.target.checked)} className="accent-brand" /> Eggless</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={inStock} onChange={(e) => setInStock(e.target.checked)} className="accent-brand" /> In stock</label>
        </div>
        <div>
          <label className="eyebrow mb-2 block">Tags</label>
          <div className="flex flex-wrap gap-2">
            {ALL_TAGS.map((t) => (
              <button key={t} type="button" onClick={() => toggleTag(t)}
                className={`rounded-full border px-3 py-1 text-sm ${tags.includes(t) ? "border-brand bg-brand text-cream-50" : "border-ink/15"}`}>{t}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Variants */}
      <div className="space-y-3 rounded-2xl bg-cream-50 p-6 shadow-card">
        <div className="flex items-center justify-between"><h2 className="font-medium">Weight variants</h2>
          <button onClick={addVariant} className="btn-ghost text-sm"><Plus size={16} /> Add</button></div>
        {variants.map((v, i) => (
          <div key={i} className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2">
            <input placeholder="500g" value={v.weight_label} onChange={(e) => setVariant(i, { weight_label: e.target.value })} className={field} />
            <input placeholder="Price ₹" inputMode="numeric" value={v.price} onChange={(e) => setVariant(i, { price: e.target.value })} className={field} />
            <input placeholder="Stock" inputMode="numeric" value={v.stock_qty} onChange={(e) => setVariant(i, { stock_qty: e.target.value })} className={field} />
            <button onClick={() => removeVariant(i)} disabled={variants.length === 1} className="rounded-lg p-2 text-brand hover:bg-brand/10 disabled:opacity-30" aria-label="Remove variant"><Trash2 size={16} /></button>
          </div>
        ))}
      </div>

      {/* Images */}
      <div className="space-y-3 rounded-2xl bg-cream-50 p-6 shadow-card">
        <h2 className="font-medium">Images</h2>
        <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-ink/20 py-6 text-sm text-ink-faint hover:border-brand hover:text-brand">
          <Upload size={18} /> {uploading ? "Uploading…" : "Tap to upload (multiple)"}
          <input type="file" accept="image/*" multiple hidden onChange={(e) => onUpload(e.target.files)} />
        </label>
        {images.length > 0 && (
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
            {images.map((im, i) => (
              <div key={i} className={`relative overflow-hidden rounded-xl border-2 ${im.is_main ? "border-brand" : "border-transparent"}`}>
                <img src={im.url} alt="" className="aspect-square w-full object-cover" />
                <button onClick={() => makeMain(i)} className={`absolute left-1 top-1 rounded-full p-1 ${im.is_main ? "bg-brand text-cream-50" : "bg-black/40 text-white"}`} aria-label="Set as main"><Star size={13} /></button>
                <button onClick={() => removeImage(i)} className="absolute right-1 top-1 rounded-full bg-black/50 p-1 text-white" aria-label="Remove"><Trash2 size={13} /></button>
              </div>
            ))}
          </div>
        )}
        <p className="text-xs text-ink-faint">The ★ image is the main product photo.</p>
      </div>

      <div className="flex gap-3">
        <button onClick={save} disabled={!canSave || busy} className="btn-primary disabled:opacity-50">{busy ? "Saving…" : "Save product"}</button>
        <button onClick={() => nav("/admin/products")} className="btn-ghost">Cancel</button>
      </div>
    </div>
  );
}
