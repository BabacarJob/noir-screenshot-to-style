import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { CartItem } from "@/types/shop";

interface CartCtx {
  items: CartItem[];
  add: (item: CartItem) => void;
  setQty: (variantId: string, qty: number) => void;
  remove: (variantId: string) => void;
  clear: () => void;
  count: number;
  subtotal: number;
}

const Ctx = createContext<CartCtx | null>(null);
const KEY = "cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try { setItems(JSON.parse(localStorage.getItem(KEY) ?? "[]")); } catch { /* ignore */ }
    setReady(true);
  }, []);
  useEffect(() => { if (ready) localStorage.setItem(KEY, JSON.stringify(items)); }, [items, ready]);

  const add = (item: CartItem) =>
    setItems((prev) => {
      const ex = prev.find((i) => i.variantId === item.variantId);
      if (ex) return prev.map((i) => (i.variantId === item.variantId ? { ...i, quantity: i.quantity + item.quantity } : i));
      return [...prev, item];
    });
  const setQty = (variantId: string, qty: number) =>
    setItems((prev) => prev.map((i) => (i.variantId === variantId ? { ...i, quantity: Math.max(1, qty) } : i)));
  const remove = (variantId: string) => setItems((prev) => prev.filter((i) => i.variantId !== variantId));
  const clear = () => setItems([]);

  return (
    <Ctx.Provider
      value={{
        items, add, setQty, remove, clear,
        count: items.reduce((s, i) => s + i.quantity, 0),
        subtotal: items.reduce((s, i) => s + i.price * i.quantity, 0),
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart doit être utilisé dans CartProvider");
  return c;
}
