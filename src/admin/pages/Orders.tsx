import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { requireSupabase } from "@/lib/supabase";
import type { DBOrder, OrderStatus } from "@/types/db";
import { STATUS_LABEL } from "@/types/db";
import { formatINR } from "@/lib/utils";
import StatusBadge from "../components/StatusBadge";

const PAGE = 20;
const STATUSES: (OrderStatus | "all")[] = ["all", "placed", "confirmed", "baking", "out_for_delivery", "delivered", "cancelled"];

export default function Orders() {
  const [orders, setOrders] = useState<DBOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<OrderStatus | "all">("all");
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    (async () => {
      const sb = requireSupabase();
      const { data } = await sb.from("orders").select("*, order_items(id)").order("created_at", { ascending: false });
      setOrders((data as DBOrder[]) ?? []);
      setLoading(false);
    })().catch(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      if (status !== "all" && o.status !== status) return false;
      if (q) {
        const t = q.toLowerCase();
        return o.order_number.toLowerCase().includes(t) || o.customer_phone.includes(t) || o.customer_name.toLowerCase().includes(t);
      }
      return true;
    });
  }, [orders, status, q]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE));
  const slice = filtered.slice((page - 1) * PAGE, page * PAGE);

  return (
    <div className="space-y-5">
      <h1 className="font-display text-3xl">Orders</h1>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" />
          <input value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} placeholder="Order #, name or phone"
            className="rounded-xl border border-ink/15 bg-cream-50 py-2 pl-9 pr-3 text-sm focus:border-brand focus:outline-none" />
        </div>
        <select value={status} onChange={(e) => { setStatus(e.target.value as OrderStatus | "all"); setPage(1); }}
          className="rounded-xl border border-ink/15 bg-cream-50 px-3 py-2 text-sm focus:border-brand focus:outline-none">
          {STATUSES.map((s) => <option key={s} value={s}>{s === "all" ? "All statuses" : STATUS_LABEL[s as OrderStatus]}</option>)}
        </select>
        <span className="text-sm text-ink-faint">{filtered.length} orders</span>
      </div>

      <div className="overflow-hidden rounded-2xl bg-cream-50 shadow-card">
        <table className="w-full text-sm">
          <thead className="border-b border-ink/10 text-left text-ink-faint">
            <tr>
              <th className="p-3 font-medium">Order #</th>
              <th className="p-3 font-medium">Customer</th>
              <th className="p-3 font-medium">Items</th>
              <th className="p-3 font-medium">Total</th>
              <th className="p-3 font-medium">Status</th>
              <th className="p-3 font-medium">Placed</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/5">
            {loading && <tr><td colSpan={6} className="p-6 text-center text-ink-faint">Loading…</td></tr>}
            {!loading && slice.length === 0 && <tr><td colSpan={6} className="p-6 text-center text-ink-faint">No orders found.</td></tr>}
            {slice.map((o) => (
              <tr key={o.id} className="hover:bg-cream-100">
                <td className="p-3"><Link to={`/admin/orders/${o.id}`} className="font-medium text-ink hover:text-brand">{o.order_number}</Link></td>
                <td className="p-3">{o.customer_name}<br /><span className="text-ink-faint">{o.customer_phone}</span></td>
                <td className="p-3">{o.order_items?.length ?? 0}</td>
                <td className="p-3">{formatINR(Number(o.total))}</td>
                <td className="p-3"><StatusBadge status={o.status} /></td>
                <td className="p-3 text-ink-faint">{new Date(o.created_at).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button disabled={page === 1} onClick={() => setPage((p) => p - 1)} className="btn-ghost disabled:opacity-40">Prev</button>
          <span className="text-sm text-ink-faint">Page {page} / {pages}</span>
          <button disabled={page === pages} onClick={() => setPage((p) => p + 1)} className="btn-ghost disabled:opacity-40">Next</button>
        </div>
      )}
    </div>
  );
}
