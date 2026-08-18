import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "@/types";
import { site } from "@/config/site";

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: Omit<CartItem, "key" | "quantity">, qty?: number) => void;
  removeItem: (key: string) => void;
  updateQty: (key: string, qty: number) => void;
  clear: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}

const makeKey = (i: Omit<CartItem, "key" | "quantity">) =>
  `${i.productId}__${i.variantLabel}__${i.messageOnCake ?? ""}`;

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,
      addItem: (item, qty = 1) =>
        set((state) => {
          const key = makeKey(item);
          const existing = state.items.find((i) => i.key === key);
          const items = existing
            ? state.items.map((i) =>
                i.key === key ? { ...i, quantity: i.quantity + qty } : i
              )
            : [...state.items, { ...item, key, quantity: qty }];
          return { items, isOpen: true };
        }),
      removeItem: (key) =>
        set((state) => ({ items: state.items.filter((i) => i.key !== key) })),
      updateQty: (key, qty) =>
        set((state) => ({
          items: state.items
            .map((i) => (i.key === key ? { ...i, quantity: Math.max(1, qty) } : i))
            .filter((i) => i.quantity > 0),
        })),
      clear: () => set({ items: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((s) => ({ isOpen: !s.isOpen })),
    }),
    { name: "cbc-cart", partialize: (s) => ({ items: s.items }) }
  )
);

// Derived selectors (call with the store hook)
export const selectCount = (s: CartState) =>
  s.items.reduce((n, i) => n + i.quantity, 0);
export const selectSubtotal = (s: CartState) =>
  s.items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
export const selectDeliveryFee = (subtotal: number) =>
  subtotal >= site.freeDeliveryOver || subtotal === 0 ? 0 : site.deliveryFee;
