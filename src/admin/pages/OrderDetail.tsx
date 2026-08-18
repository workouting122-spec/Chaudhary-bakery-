import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Phone, MessageCircle, Printer, XCircle } from "lucide-react";
import { requireSupabase } from "@/lib/supabase";
import type { DBOrder, OrderStatus } from "@/types/db";
import { ORDER_FLOW, STATUS_LABEL } from "@/types/db";
import { formatINR } from "@/lib/utils";
import StatusBadge from "../components/StatusBadge";

export default function OrderDetail() {
  const { id = "" } = useParams();
  const [order, setOrder] = useState<DBOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const sb = requireSupabase();
    const { data } = await sb.from("orders").select("*, order_items(*)").eq("id", id).maybeSingle();
    setOrder((data as DBOrder) ?? null);
    setLoading(false);
  };
  useEffect(() => { load().catch(() => setLoading(false)); }, [id]);

  const setStatus = async (status: OrderStatus, cancel_reason?: string) => {
    if (!order) return;
    setSaving(true);
    const sb = requireSupabase();
    await sb.from("orders").update({ status, ...(cancel_reason ? { cancel_reason } : {}) }).eq("id", order.id);
    setOrder({ ...order, status, cancel_reason: cancel_reason ?? order.cancel_reason });
    setSaving(false);
  };

  const cancel = () => {
    const reason = window.prompt("Reason for cancellation?") ?? "";
    if (reason) setStatus("cancelled", reason);
  };

  if (loading) return <p className="text-ink-faint">Loading order…</p>;
  if (!order) return (
    <div><Link to="/admin/orders" className="text-brand">← Orders</Link><p className="mt-4">Order not found.</p></div>
  );

  const phone = order.customer_phone.replace(/\D/g, "").slice(-10);
  const currentIdx = ORDER_FLOW.indexOf(order.status);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <Link to="/admin/orders" className="flex items-center gap-1 text-sm text-ink-faint hover:text-brand"><ArrowLeft size={16} /> Orders</Link>
        <h1 className="font-display text-2xl">{order.order_number}</h1>
        <StatusBadge status={order.status} />
        <div className="ml-auto flex gap-2">
          <a href={`tel:+91${phone}`} className="btn-ghost"><Phone size={16} /> Call</a>
          <a href={`https://wa.me/91${phone}`} target="_blank" rel="noopener noreferrer" className="btn-ghost"><MessageCircle size={16} /> WhatsApp</a>
          <button onClick={() => window.print()} className="btn-ghost"><Printer size={16} /> Invoice</button>
        </div>
      </div>

      {/* Status stepper */}
      {order.status !== "cancelled" && (
        <div className="rounded-2xl bg-cream-50 p-5 shadow-card">
          <div className="flex flex-wrap items-center gap-2">
            {ORDER_FLOW.map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <span className={`rounded-full px-3 py-1 text-xs ${i <= currentIdx ? "bg-brand text-cream-50" : "bg-ink/10 text-ink-faint"}`}>{STATUS_LABEL[s]}</span>
                {i < ORDER_FLOW.length - 1 && <span className="h-px w-6 bg-ink/15" />}
              </div>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {currentIdx < ORDER_FLOW.length - 1 && (
              <button disabled={saving} onClick={() => setStatus(ORDER_FLOW[currentIdx + 1])} className="btn-primary">
                Advance to “{STATUS_LABEL[ORDER_FLOW[currentIdx + 1]]}”
              </button>
            )}
            <button disabled={saving} onClick={cancel} className="btn-ghost text-brand"><XCircle size={16} /> Cancel order</button>
          </div>
        </div>
      )}
      {order.status === "cancelled" && order.cancel_reason && (
        <p className="rounded-xl bg-brand/10 p-4 text-sm text-brand">Cancelled — {order.cancel_reason}</p>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {order.cake_message && (
            <div className="rounded-2xl border-2 border-gold bg-gold/10 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-gold-dark">✏️ Message on cake</p>
              <p className="mt-1 font-display text-xl">“{order.cake_message}”</p>
            </div>
          )}

          <div className="rounded-2xl bg-cream-50 p-5 shadow-card">
            <h2 className="mb-3 font-medium">Items</h2>
            <ul className="divide-y divide-ink/5">
              {order.order_items?.map((it) => (
                <li key={it.id} className="flex justify-between gap-3 py-2 text-sm">
                  <span>{it.product_name} <span className="text-ink-faint">({it.variant_label}) × {it.quantity}</span>
                    {it.cake_message && <span className="block text-xs text-gold-dark">“{it.cake_message}”</span>}
                  </span>
                  <span>{formatINR(Number(it.unit_price) * it.quantity)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-3 space-y-1 border-t border-ink/10 pt-3 text-sm">
              <div className="flex justify-between text-ink-soft"><span>Subtotal</span><span>{formatINR(Number(order.subtotal))}</span></div>
              <div className="flex justify-between text-ink-soft"><span>Delivery</span><span>{Number(order.delivery_fee) === 0 ? "Free" : formatINR(Number(order.delivery_fee))}</span></div>
              <div className="flex justify-between font-semibold"><span>Total</span><span>{formatINR(Number(order.total))}</span></div>
            </div>
          </div>

          {order.special_instructions && (
            <div className="rounded-2xl bg-cream-50 p-5 shadow-card">
              <h2 className="mb-1 font-medium">Special instructions</h2>
              <p className="text-sm text-ink-soft">{order.special_instructions}</p>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl bg-cream-50 p-5 shadow-card">
            <h2 className="mb-3 font-medium">Customer</h2>
            <p className="text-sm">{order.customer_name}</p>
            <p className="text-sm text-ink-faint">{order.customer_phone}</p>
            <p className="mt-3 text-sm text-ink-soft">{order.address}</p>
            <p className="text-sm text-ink-soft">PIN {order.pincode}</p>
            {order.delivery_date && <p className="mt-3 text-sm">📅 {order.delivery_date} · {order.delivery_slot}</p>}
          </div>
          <div className="rounded-2xl bg-cream-50 p-5 shadow-card">
            <h2 className="mb-3 font-medium">Payment</h2>
            <p className="text-sm">{order.payment_method === "cod" ? "Cash on Delivery" : "Online (Razorpay)"}</p>
            <p className="text-sm text-ink-faint">Status: {order.payment_status}</p>
            {order.razorpay_payment_id && <p className="text-xs text-ink-faint">{order.razorpay_payment_id}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
