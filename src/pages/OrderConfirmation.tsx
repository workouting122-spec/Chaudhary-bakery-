import { Link, useLocation } from "react-router-dom";
import { CheckCircle2, MessageCircle } from "lucide-react";
import { waLink } from "@/config/site";

export default function OrderConfirmation() {
  const { state } = useLocation() as { state?: { orderId?: string; total?: number } };
  const orderId = state?.orderId ?? "CBC-XXXX";

  return (
    <div className="container-x flex min-h-[80vh] flex-col items-center justify-center gap-6 py-24 text-center">
      <CheckCircle2 size={64} className="text-veg" />
      <h1 className="font-display text-display-md">Order confirmed!</h1>
      <p className="text-ink-soft">
        Thank you. Your order <strong className="text-ink">{orderId}</strong> is being prepared with care.
      </p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <a
          href={waLink(`Hi! I just placed order ${orderId}. Sharing the details here.`)}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary"
        >
          <MessageCircle size={18} /> Share order on WhatsApp
        </a>
        <Link to="/shop" className="btn-ghost">Continue shopping</Link>
      </div>
    </div>
  );
}
