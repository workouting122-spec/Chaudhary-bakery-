import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell, BarChart, Bar,
} from "recharts";
import { requireSupabase } from "@/lib/supabase";
import type { DBOrder } from "@/types/db";
import { STATUS_LABEL } from "@/types/db";
import { formatINR } from "@/lib/utils";
import StatusBadge from "../components/StatusBadge";

const BRAND = "#D4122A";
const PIE = ["#D4122A", "#C9A24B", "#3E7C4F", "#8A7E6D", "#1A1613", "#E9B949"];

function isToday(iso: string) {
  const d = new Date(iso), n = new Date();
  return d.toDateString() === n.toDateString();
}
function isYesterday(iso: string) {
  const d = new Date(iso), y = new Date(); y.setDate(y.getDate() - 1);
  return d.toDateString() === y.toDateString();
}

export default function Dashboard() {
  const [orders, setOrders] = useState<DBOrder[]>([]);
  const [customerCount, setCustomerCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const sb = requireSupabase();
      const since = new Date(); since.setDate(since.getDate() - 30);
      const [{ data: ord }, { count }] = await Promise.all([
        sb.from("orders").select("*, order_items(*)").gte("created_at", since.toISOString()).order("created_at", { ascending: false }),
        sb.from("customers").select("*", { count: "exact", head: true }),
      ]);
      setOrders((ord as DBOrder[]) ?? []);
      setCustomerCount(count ?? 0);
      setLoading(false);
    })().catch(() => setLoading(false));
  }, []);

  const kpis = useMemo(() => {
    const today = orders.filter((o) => isToday(o.created_at));
    const yest = orders.filter((o) => isYesterday(o.created_at));
    const rev = (list: DBOrder[]) => list.filter((o) => o.status !== "cancelled").reduce((s, o) => s + Number(o.total), 0);
    const pending = orders.filter((o) => ["placed", "confirmed", "baking"].includes(o.status)).length;
    return {
      todayOrders: today.length, ordersDelta: today.length - yest.length,
      todayRevenue: rev(today), pending, customers: customerCount,
    };
  }, [orders, customerCount]);

  const revenueTrend = useMemo(() => {
    const days: { date: string; revenue: number }[] = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const key = d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
      const revenue = orders
        .filter((o) => o.status !== "cancelled" && new Date(o.created_at).toDateString() === d.toDateString())
        .reduce((s, o) => s + Number(o.total), 0);
      days.push({ date: key, revenue });
    }
    return days;
  }, [orders]);

  const byStatus = useMemo(() => {
    const counts: Record<string, number> = {};
    orders.forEach((o) => { counts[o.status] = (counts[o.status] ?? 0) + 1; });
    return Object.entries(counts).map(([k, v]) => ({ name: STATUS_LABEL[k as keyof typeof STATUS_LABEL] ?? k, value: v }));
  }, [orders]);

  const topProducts = useMemo(() => {
    const map: Record<string, number> = {};
    orders.forEach((o) => o.order_items?.forEach((it) => { map[it.product_name] = (map[it.product_name] ?? 0) + it.quantity; }));
    return Object.entries(map).map(([name, qty]) => ({ name, qty })).sort((a, b) => b.qty - a.qty).slice(0, 5);
  }, [orders]);

  const recent = orders.slice(0, 10);

  if (loading) return <p className="text-ink-faint">Loading dashboard…</p>;

  const Card = ({ label, value, sub }: { label: string; value: string; sub?: string }) => (
    <div className="rounded-2xl bg-cream-50 p-5 shadow-card">
      <p className="text-sm text-ink-faint">{label}</p>
      <p className="mt-1 font-display text-3xl">{value}</p>
      {sub && <p className="mt-1 text-xs text-ink-faint">{sub}</p>}
    </div>
  );

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl">Dashboard</h1>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card label="Today's orders" value={String(kpis.todayOrders)} sub={`${kpis.ordersDelta >= 0 ? "+" : ""}${kpis.ordersDelta} vs yesterday`} />
        <Card label="Today's revenue" value={formatINR(kpis.todayRevenue)} />
        <Card label="Pending orders" value={String(kpis.pending)} sub="need attention" />
        <Card label="Total customers" value={String(kpis.customers)} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl bg-cream-50 p-5 shadow-card lg:col-span-2">
          <h2 className="mb-4 font-medium">Revenue — last 30 days</h2>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={revenueTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#00000010" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} interval={4} />
              <YAxis tick={{ fontSize: 11 }} width={40} />
              <Tooltip formatter={(value) => formatINR(Number(value))} />
              <Line type="monotone" dataKey="revenue" stroke={BRAND} strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="rounded-2xl bg-cream-50 p-5 shadow-card">
          <h2 className="mb-4 font-medium">Orders by status</h2>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={byStatus} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90} paddingAngle={2}>
                {byStatus.map((_, i) => <Cell key={i} fill={PIE[i % PIE.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl bg-cream-50 p-5 shadow-card">
          <h2 className="mb-4 font-medium">Top 5 products this month</h2>
          {topProducts.length === 0 ? <p className="text-sm text-ink-faint">No sales yet.</p> : (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={topProducts} layout="vertical" margin={{ left: 20 }}>
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={120} />
                <Tooltip />
                <Bar dataKey="qty" fill={BRAND} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="rounded-2xl bg-cream-50 p-5 shadow-card">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-medium">Recent orders</h2>
            <Link to="/admin/orders" className="text-sm text-brand hover:underline">View all</Link>
          </div>
          <ul className="divide-y divide-ink/5">
            {recent.length === 0 && <p className="text-sm text-ink-faint">No orders yet.</p>}
            {recent.map((o) => (
              <li key={o.id} className="flex items-center gap-3 py-2.5 text-sm">
                <Link to={`/admin/orders/${o.id}`} className="font-medium hover:text-brand">{o.order_number}</Link>
                <span className="text-ink-faint">{o.customer_name}</span>
                <span className="ml-auto">{formatINR(Number(o.total))}</span>
                <StatusBadge status={o.status} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
