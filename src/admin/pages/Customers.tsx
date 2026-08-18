import { useEffect, useMemo, useState } from "react";
import { Search, Phone, MessageCircle } from "lucide-react";
import { requireSupabase } from "@/lib/supabase";
import type { DBCustomer } from "@/types/db";

export default function Customers() {
  const [rows, setRows] = useState<DBCustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  useEffect(() => {
    (async () => {
      const sb = requireSupabase();
      const { data } = await sb.from("customers").select("*").order("created_at", { ascending: false });
      setRows((data as DBCustomer[]) ?? []); setLoading(false);
    })().catch(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => rows.filter((r) =>
    !q || r.name.toLowerCase().includes(q.toLowerCase()) || r.phone.includes(q) || (r.email ?? "").toLowerCase().includes(q.toLowerCase())
  ), [rows, q]);

  return (
    <div className="space-y-5">
      <h1 className="font-display text-3xl">Customers</h1>
      <div className="relative w-full max-w-xs">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, phone, email"
          className="w-full rounded-xl border border-ink/15 bg-cream-50 py-2 pl-9 pr-3 text-sm focus:border-brand focus:outline-none" />
      </div>

      <div className="overflow-hidden rounded-2xl bg-cream-50 shadow-card">
        <table className="w-full text-sm">
          <thead className="border-b border-ink/10 text-left text-ink-faint">
            <tr><th className="p-3 font-medium">Name</th><th className="p-3 font-medium">Phone</th><th className="p-3 font-medium">Email</th><th className="p-3 font-medium">Joined</th><th className="p-3" /></tr>
          </thead>
          <tbody className="divide-y divide-ink/5">
            {loading && <tr><td colSpan={5} className="p-6 text-center text-ink-faint">Loading…</td></tr>}
            {!loading && filtered.length === 0 && <tr><td colSpan={5} className="p-6 text-center text-ink-faint">No customers.</td></tr>}
            {filtered.map((c) => {
              const phone = c.phone.replace(/\D/g, "").slice(-10);
              return (
                <tr key={c.id} className="hover:bg-cream-100">
                  <td className="p-3 font-medium">{c.name}</td>
                  <td className="p-3 text-ink-soft">{c.phone}</td>
                  <td className="p-3 text-ink-soft">{c.email ?? "—"}</td>
                  <td className="p-3 text-ink-faint">{new Date(c.created_at).toLocaleDateString("en-IN", { dateStyle: "medium" })}</td>
                  <td className="p-3">
                    <div className="flex justify-end gap-2">
                      <a href={`tel:+91${phone}`} className="rounded-lg p-2 hover:bg-cream-200" aria-label="Call"><Phone size={15} /></a>
                      <a href={`https://wa.me/91${phone}`} target="_blank" rel="noopener noreferrer" className="rounded-lg p-2 hover:bg-cream-200" aria-label="WhatsApp"><MessageCircle size={15} /></a>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
