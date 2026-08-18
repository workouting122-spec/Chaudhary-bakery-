import { supabase, isSupabaseReady } from "@/lib/supabase";
import type { CartItem } from "@/types";

const uid = () => (typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random()));
const genNumber = () => "CBC-" + Math.random().toString(36).slice(2, 7).toUpperCase();

export interface PlaceOrderInput {
  name: string; phone: string; address: string; pincode: string;
  date: string; slot: string; payment: "cod" | "online";
  items: CartItem[]; subtotal: number; delivery: number; total: number;
  paymentStatus: "pending" | "paid";
}

/**
 * Writes the order to Supabase so it appears in the admin instantly (Realtime).
 * IDs are generated client-side so we never need to read rows back (public RLS
 * allows insert but not select on orders/customers). Always resolves with an
 * order number — even if Supabase is absent or a write fails — so the customer
 * always reaches the confirmation page.
 */
export async function persistOrder(input: PlaceOrderInput): Promise<string> {
  const orderNumber = genNumber();
  if (!isSupabaseReady || !supabase) return orderNumber;
  try {
    const orderId = uid();
    const customerId = uid();
    // New customer → tracked; duplicate phone → just skip the link.
    const { error: custErr } = await supabase.from("customers").insert({ id: customerId, name: input.name, phone: input.phone });
    const linkedCustomer = custErr ? null : customerId;

    const cakeMessage = input.items.find((i) => i.messageOnCake)?.messageOnCake ?? null;
    const { error: orderErr } = await supabase.from("orders").insert({
      id: orderId, order_number: orderNumber, customer_id: linkedCustomer,
      customer_name: input.name, customer_phone: input.phone,
      address: input.address, pincode: input.pincode,
      delivery_date: input.date || null, delivery_slot: input.slot || null,
      status: "placed", payment_method: input.payment, payment_status: input.paymentStatus,
      subtotal: input.subtotal, delivery_fee: input.delivery, total: input.total,
      cake_message: cakeMessage,
    });
    if (orderErr) return orderNumber;

    await supabase.from("order_items").insert(
      input.items.map((it) => ({
        order_id: orderId, product_id: null, product_name: it.name,
        variant_label: it.variantLabel, unit_price: it.unitPrice,
        quantity: it.quantity, cake_message: it.messageOnCake ?? null,
      }))
    );
    return orderNumber;
  } catch {
    return orderNumber;
  }
}
