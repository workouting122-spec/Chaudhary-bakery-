/**
 * Razorpay (TEST MODE) helper.
 *
 * IMPORTANT — production note:
 * A real deployment must create the order on a server and verify the payment
 * signature server-side. This browser-only flow is fine for TEST MODE and demos.
 * See README → "Razorpay" for the server steps.
 */
let scriptPromise: Promise<boolean> | null = null;

export function loadRazorpay(): Promise<boolean> {
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
  return scriptPromise;
}

interface PayArgs {
  amountPaise: number;
  name: string;
  contact: string;
  onSuccess: (paymentId: string) => void;
  onDismiss?: () => void;
}

export async function payWithRazorpay({ amountPaise, name, contact, onSuccess, onDismiss }: PayArgs) {
  const key = import.meta.env.VITE_RAZORPAY_KEY_ID;
  if (!key) {
    alert(
      "Razorpay test key not set. Add VITE_RAZORPAY_KEY_ID to your .env to enable online payment. You can still order with Cash on Delivery."
    );
    return;
  }
  const ok = await loadRazorpay();
  if (!ok) {
    alert("Couldn't load the payment gateway. Please try Cash on Delivery.");
    return;
  }
  const rzp = new window.Razorpay!({
    key,
    amount: amountPaise,
    currency: "INR",
    name: "Chaudhary Bake & Cake",
    description: "Bakery order",
    prefill: { name, contact },
    theme: { color: "#D4122A" },
    handler: (res: Record<string, string>) => onSuccess(res.razorpay_payment_id ?? "test_payment"),
    modal: { ondismiss: () => onDismiss?.() },
  });
  rzp.open();
}
