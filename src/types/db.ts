export type OrderStatus =
  | "placed" | "confirmed" | "baking" | "out_for_delivery" | "delivered" | "cancelled";
export type PaymentMethod = "cod" | "online";
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export interface DBCategory {
  id: string; name: string; slug: string; image_url: string | null; sort_order: number;
}
export interface DBVariant {
  id: string; product_id: string; weight_label: string; price: number; stock_qty: number; sort_order: number;
}
export interface DBImage {
  id: string; product_id: string; url: string; sort_order: number; is_main: boolean;
}
export interface DBProduct {
  id: string; name: string; slug: string; description: string;
  category_id: string | null; is_eggless: boolean; tags: string[];
  in_stock: boolean; is_bestseller: boolean; is_new: boolean;
  created_at: string; updated_at: string;
  product_variants?: DBVariant[];
  product_images?: DBImage[];
  categories?: DBCategory | null;
}
export interface DBOrderItem {
  id: string; order_id: string; product_id: string | null;
  product_name: string; variant_label: string; unit_price: number; quantity: number; cake_message: string | null;
}
export interface DBOrder {
  id: string; order_number: string;
  customer_id: string | null; customer_name: string; customer_phone: string;
  address: string; pincode: string; delivery_date: string | null; delivery_slot: string | null;
  status: OrderStatus; payment_method: PaymentMethod; payment_status: PaymentStatus;
  razorpay_payment_id: string | null;
  subtotal: number; delivery_fee: number; total: number;
  cake_message: string | null; special_instructions: string | null; cancel_reason: string | null;
  created_at: string;
  order_items?: DBOrderItem[];
}
export interface DBCustomer {
  id: string; name: string; phone: string; email: string | null; created_at: string;
}

export const ORDER_FLOW: OrderStatus[] = [
  "placed", "confirmed", "baking", "out_for_delivery", "delivered",
];
export const STATUS_LABEL: Record<OrderStatus, string> = {
  placed: "Placed", confirmed: "Confirmed", baking: "Baking",
  out_for_delivery: "Out for delivery", delivered: "Delivered", cancelled: "Cancelled",
};
