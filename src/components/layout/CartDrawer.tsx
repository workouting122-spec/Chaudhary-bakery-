import { Link } from "react-router-dom";
import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCart, selectSubtotal, selectDeliveryFee } from "@/store/cart";
import { formatINR } from "@/lib/utils";
import { site } from "@/config/site";

export default function CartDrawer() {
  const { items, isOpen, closeCart, updateQty, removeItem } = useCart();
  const subtotal = useCart(selectSubtotal);
  const delivery = selectDeliveryFee(subtotal);

  return (
    <>
      {/* Scrim */}
      <div
        aria-hidden={!isOpen}
        onClick={closeCart}
        className={`fixed inset-0 z-[60] bg-ink/40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <aside
        role="dialog"
        aria-label="Shopping cart"
        aria-modal="true"
        className={`fixed right-0 top-0 z-[70] flex h-full w-full max-w-md flex-col bg-cream-50 shadow-lift transition-transform duration-300 ease-smooth ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-ink/10 px-6 py-5">
          <h2 className="font-display text-2xl">Your cart</h2>
          <button onClick={closeCart} aria-label="Close cart" className="rounded-full p-2 hover:bg-ink/5">
            <X size={20} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <ShoppingBag size={40} className="text-ink-faint" />
            <p className="text-ink-soft">Your cart is empty.</p>
            <Link to="/shop" onClick={closeCart} className="btn-primary text-sm">
              Browse the bakery
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-4 overflow-y-auto px-6 py-5">
              {items.map((i) => (
                <div key={i.key} className="flex gap-4">
                  <img src={i.image} alt="" className="h-20 w-20 rounded-xl object-cover" />
                  <div className="flex flex-1 flex-col">
                    <div className="flex justify-between gap-2">
                      <p className="font-medium leading-tight">{i.name}</p>
                      <button onClick={() => removeItem(i.key)} aria-label="Remove item" className="text-ink-faint hover:text-brand">
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <p className="text-xs text-ink-faint">{i.variantLabel}</p>
                    {i.messageOnCake && (
                      <p className="text-xs italic text-ink-faint">"{i.messageOnCake}"</p>
                    )}
                    <div className="mt-auto flex items-center justify-between pt-2">
                      <div className="flex items-center rounded-full border border-ink/15">
                        <button onClick={() => updateQty(i.key, i.quantity - 1)} aria-label="Decrease quantity" className="p-1.5">
                          <Minus size={14} />
                        </button>
                        <span className="w-8 text-center text-sm">{i.quantity}</span>
                        <button onClick={() => updateQty(i.key, i.quantity + 1)} aria-label="Increase quantity" className="p-1.5">
                          <Plus size={14} />
                        </button>
                      </div>
                      <span className="font-medium">{formatINR(i.unitPrice * i.quantity)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-ink/10 px-6 py-5">
              <div className="flex justify-between text-sm text-ink-soft">
                <span>Subtotal</span>
                <span>{formatINR(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-ink-soft">
                <span>Delivery</span>
                <span>{delivery === 0 ? "Free" : formatINR(delivery)}</span>
              </div>
              <div className="mt-3 flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>{formatINR(subtotal + delivery)}</span>
              </div>
              {subtotal < site.freeDeliveryOver && (
                <p className="mt-2 text-xs text-ink-faint">
                  Add {formatINR(site.freeDeliveryOver - subtotal)} more for free delivery.
                </p>
              )}
              <Link to="/checkout" onClick={closeCart} className="btn-primary mt-4 w-full">
                Checkout
              </Link>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
