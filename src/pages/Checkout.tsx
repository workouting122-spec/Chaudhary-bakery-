import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { Check } from "lucide-react";
import { useCart, selectSubtotal, selectDeliveryFee } from "@/store/cart";
import { formatINR, cn } from "@/lib/utils";
import { payWithRazorpay } from "@/lib/razorpay";
import { site } from "@/config/site";
import { persistOrder } from "@/lib/orders";

const schema = z.object({
  name: z.string().min(2, "Enter your name"),
  phone: z.string().regex(/^[0-9]{10}$/, "Enter a 10-digit phone number"),
  address: z.string().min(8, "Enter your full delivery address"),
  pincode: z.string().regex(/^[0-9]{6}$/, "Enter a valid 6-digit pincode"),
  date: z.string().min(1, "Choose a delivery date"),
  slot: z.string().min(1, "Choose a time slot"),
  payment: z.enum(["cod", "online"]),
});
type FormData = z.infer<typeof schema>;

const steps = ["Delivery", "Payment", "Review"];
const slots = ["10 AM – 12 PM", "12 – 3 PM", "3 – 6 PM", "6 – 9 PM"];

export default function Checkout() {
  const nav = useNavigate();
  const { items, clear } = useCart();
  const subtotal = useCart(selectSubtotal);
  const delivery = selectDeliveryFee(subtotal);
  const total = subtotal + delivery;

  const [step, setStep] = useState(0);
  const { register, handleSubmit, trigger, getValues, watch, formState: { errors } } =
    useForm<FormData>({ resolver: zodResolver(schema), defaultValues: { payment: "cod" } });

  const payment = watch("payment");

  const next = async () => {
    const fields: (keyof FormData)[][] = [
      ["name", "phone", "address", "pincode", "date", "slot"],
      ["payment"],
      [],
    ];
    const valid = await trigger(fields[step]);
    if (valid) setStep((s) => Math.min(s + 1, steps.length - 1));
  };

  const placeOrder = () => {
    const values = getValues();
    const finish = async (paymentStatus: "pending" | "paid") => {
      const orderId = await persistOrder({
        name: values.name, phone: values.phone, address: values.address, pincode: values.pincode,
        date: values.date, slot: values.slot, payment: values.payment,
        items, subtotal, delivery, total, paymentStatus,
      });
      clear();
      nav("/order-confirmation", { state: { orderId, total } });
    };
    if (values.payment === "online") {
      payWithRazorpay({
        amountPaise: total * 100,
        name: values.name,
        contact: values.phone,
        onSuccess: () => { void finish("paid"); },
      });
    } else {
      void finish("pending");
    }
  };

  if (items.length === 0) {
    return (
      <div className="container-x flex min-h-[60vh] flex-col items-center justify-center gap-4 pt-[var(--nav-h)]">
        <p className="font-display text-3xl">Your cart is empty</p>
        <button onClick={() => nav("/shop")} className="btn-primary">Browse the bakery</button>
      </div>
    );
  }

  const input = "w-full rounded-xl border border-ink/15 bg-cream-50 px-4 py-3 focus:border-brand focus:outline-none";
  const err = (m?: string) => m && <p className="mt-1 text-sm text-brand">{m}</p>;

  return (
    <div className="container-x grid gap-12 pb-24 pt-[calc(var(--nav-h)+2rem)] lg:grid-cols-[1fr_360px]">
      <div>
        {/* Progress */}
        <ol className="mb-10 flex items-center gap-2">
          {steps.map((s, i) => (
            <li key={s} className="flex flex-1 items-center gap-2">
              <span className={cn("flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold", i <= step ? "bg-brand text-cream-50" : "bg-ink/10 text-ink-faint")}>
                {i < step ? <Check size={16} /> : i + 1}
              </span>
              <span className={cn("text-sm", i <= step ? "text-ink" : "text-ink-faint")}>{s}</span>
              {i < steps.length - 1 && <span className="h-px flex-1 bg-ink/10" />}
            </li>
          ))}
        </ol>

        <form onSubmit={handleSubmit(placeOrder)} noValidate>
          {step === 0 && (
            <div className="space-y-4">
              <h2 className="font-display text-2xl">Delivery details</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div><input {...register("name")} placeholder="Full name" className={input} />{err(errors.name?.message)}</div>
                <div><input {...register("phone")} inputMode="numeric" placeholder="10-digit phone" className={input} />{err(errors.phone?.message)}</div>
              </div>
              <div><textarea {...register("address")} rows={3} placeholder="Delivery address" className={input} />{err(errors.address?.message)}</div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div><input {...register("pincode")} inputMode="numeric" placeholder="Pincode" className={input} />{err(errors.pincode?.message)}</div>
                <div><input type="date" {...register("date")} className={input} />{err(errors.date?.message)}</div>
                <div>
                  <select {...register("slot")} className={input} defaultValue="">
                    <option value="" disabled>Time slot</option>
                    {slots.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  {err(errors.slot?.message)}
                </div>
              </div>
              {site.deliveryPincodes.length > 0 && (
                <p className="text-xs text-ink-faint">We currently deliver to: {site.deliveryPincodes.join(", ")}.</p>
              )}
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <h2 className="font-display text-2xl">Payment</h2>
              {[
                { id: "cod", label: "Cash on Delivery", desc: "Pay when your order arrives." },
                { id: "online", label: "Pay Online (Razorpay)", desc: "UPI, cards, netbanking — test mode." },
              ].map((opt) => (
                <label key={opt.id} className={cn("flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition", payment === opt.id ? "border-brand bg-brand/5" : "border-ink/15")}>
                  <input type="radio" value={opt.id} {...register("payment")} className="mt-1 accent-brand" />
                  <span>
                    <span className="block font-medium">{opt.label}</span>
                    <span className="block text-sm text-ink-faint">{opt.desc}</span>
                  </span>
                </label>
              ))}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="font-display text-2xl">Review &amp; confirm</h2>
              <div className="rounded-xl border border-ink/10 bg-cream-50 p-5 text-sm">
                <p><strong>{getValues("name")}</strong> · {getValues("phone")}</p>
                <p className="text-ink-soft">{getValues("address")} — {getValues("pincode")}</p>
                <p className="mt-2 text-ink-soft">{getValues("date")} · {getValues("slot")}</p>
                <p className="mt-2">Payment: <strong>{getValues("payment") === "cod" ? "Cash on Delivery" : "Online (Razorpay)"}</strong></p>
              </div>
            </div>
          )}

          <div className="mt-8 flex justify-between">
            {step > 0 ? (
              <button type="button" onClick={() => setStep((s) => s - 1)} className="btn-ghost">Back</button>
            ) : <span />}
            {step < steps.length - 1 ? (
              <button type="button" onClick={next} className="btn-primary">Continue</button>
            ) : (
              <button type="submit" className="btn-primary">
                {payment === "online" ? `Pay ${formatINR(total)}` : "Place order"}
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Order summary */}
      <aside className="h-fit rounded-2xl bg-cream-200 p-6 shadow-card">
        <h2 className="font-display text-xl">Order summary</h2>
        <ul className="mt-4 space-y-3">
          {items.map((i) => (
            <li key={i.key} className="flex justify-between gap-3 text-sm">
              <span className="text-ink-soft">{i.name} × {i.quantity} <span className="text-ink-faint">({i.variantLabel})</span></span>
              <span>{formatINR(i.unitPrice * i.quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 space-y-1 border-t border-ink/10 pt-4 text-sm">
          <div className="flex justify-between text-ink-soft"><span>Subtotal</span><span>{formatINR(subtotal)}</span></div>
          <div className="flex justify-between text-ink-soft"><span>Delivery</span><span>{delivery === 0 ? "Free" : formatINR(delivery)}</span></div>
          <div className="mt-2 flex justify-between text-lg font-semibold"><span>Total</span><span>{formatINR(total)}</span></div>
        </div>
      </aside>
    </div>
  );
}
