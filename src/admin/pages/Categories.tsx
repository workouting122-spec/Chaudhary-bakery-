import { useEffect, useState } from "react";
import { Plus, Trash2, Save } from "lucide-react";
import { requireSupabase } from "@/lib/supabase";
import type { DBCategory } from "@/types/db";

const slugify = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export default function Categories() {
  const sb = requireSupabase();
  const [cats, setCats] = useState<DBCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState("");

  const load = async () => {
    const { data } = await sb.from("categories").select("*").order("sort_order");
    setCats((data as DBCategory[]) ?? []); setLoading(false);
  };
  useEffect(() => { load().catch(() => setLoading(false)); }, []);

  const add = async () => {
    if (!newName.trim()) return;
    await sb.from("categories").insert({ name: newName.trim(), slug: slugify(newName), sort_order: cats.length + 1 });
    setNewName(""); load();
  };
  const rename = async (c: DBCategory, name: string) => {
    await sb.from("categories").update({ name, slug: slugify(name) }).eq("id", c.id);
    setCats((cur) => cur.map((x) => (x.id === c.id ? { ...x, name, slug: slugify(name) } : x)));
  };
  const remove = async (c: DBCategory) => {
    if (!window.confirm(`Delete category “${c.name}”?`)) return;
    await sb.from("categories").delete().eq("id", c.id);
    setCats((cur) => cur.filter((x) => x.id !== c.id));
  };

  return (
    <div className="max-w-2xl space-y-5">
      <h1 className="font-display text-3xl">Categories</h1>

      <div className="flex gap-2">
        <input value={newName} onChange={(e) => setNewName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && add()}
          placeholder="New category name" className="flex-1 rounded-xl border border-ink/15 bg-cream-50 px-4 py-2.5 focus:border-brand focus:outline-none" />
        <button onClick={add} className="btn-primary"><Plus size={18} /> Add</button>
      </div>

      <div className="divide-y divide-ink/5 rounded-2xl bg-cream-50 shadow-card">
        {loading && <p className="p-4 text-sm text-ink-faint">Loading…</p>}
        {!loading && cats.length === 0 && <p className="p-4 text-sm text-ink-faint">No categories yet.</p>}
        {cats.map((c) => (
          <CategoryRow key={c.id} cat={c} onRename={rename} onRemove={remove} />
        ))}
      </div>
    </div>
  );
}

function CategoryRow({ cat, onRename, onRemove }: {
  cat: DBCategory; onRename: (c: DBCategory, name: string) => void | Promise<void>; onRemove: (c: DBCategory) => void | Promise<void>;
}) {
  const [name, setName] = useState(cat.name);
  const dirty = name !== cat.name;
  return (
    <div className="flex items-center gap-3 p-3">
      <input value={name} onChange={(e) => setName(e.target.value)} className="flex-1 rounded-lg border border-transparent bg-transparent px-2 py-1 focus:border-ink/15 focus:bg-cream-100 focus:outline-none" />
      <span className="text-xs text-ink-faint">/{cat.slug}</span>
      {dirty && <button onClick={() => onRename(cat, name)} className="rounded-lg p-2 text-brand hover:bg-brand/10" aria-label="Save"><Save size={16} /></button>}
      <button onClick={() => onRemove(cat)} className="rounded-lg p-2 text-brand hover:bg-brand/10" aria-label="Delete"><Trash2 size={16} /></button>
    </div>
  );
}
