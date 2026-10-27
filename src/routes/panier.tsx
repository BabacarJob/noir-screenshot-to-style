import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, X } from "lucide-react";
import { SiteLayout } from "@/components/shop/SiteLayout";
import { useCart } from "@/hooks/use-cart";
import { formatFCFA, SHIPPING_FEE } from "@/services/api";

export const Route = createFileRoute("/panier")({
  head: () => ({
    meta: [
      { title: "Panier — Maison Noire" },
      { name: "description", content: "Votre panier Maison Noire." },
      { property: "og:title", content: "Panier — Maison Noire" },
      { property: "og:description", content: "Votre panier Maison Noire." },
    ],
  }),
  component: Cart,
});

function Cart() {
  const { items, setQty, remove, subtotal } = useCart();
  return (
    <SiteLayout>
      <div className="mx-auto max-w-5xl px-5 pt-14">
        <h1 className="text-4xl font-extrabold">Panier</h1>
        {items.length === 0 ? (
          <div className="py-24 text-center">
            <p className="text-muted-foreground">Votre panier est vide.</p>
            <Link to="/boutique" className="mt-6 inline-block bg-primary px-6 py-3 text-sm text-primary-foreground">Voir la boutique</Link>
          </div>
        ) : (
          <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_320px]">
            <ul className="divide-y border-y">
              {items.map((i) => (
                <li key={i.variantId} className="flex gap-4 py-5">
                  <img src={i.image} alt={i.name} className="h-28 w-22 bg-card object-cover" />
                  <div className="flex flex-1 flex-col justify-between">
                    <div className="flex justify-between gap-2">
                      <div>
                        <p className="font-medium">{i.name}</p>
                        <p className="text-sm text-muted-foreground">{i.color} · {i.size}</p>
                      </div>
                      <button onClick={() => remove(i.variantId)} aria-label="Retirer"><X className="h-4 w-4" /></button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center border">
                        <button className="p-2" onClick={() => setQty(i.variantId, i.quantity - 1)} aria-label="Moins"><Minus className="h-3 w-3" /></button>
                        <span className="w-8 text-center text-sm">{i.quantity}</span>
                        <button className="p-2" onClick={() => setQty(i.variantId, i.quantity + 1)} aria-label="Plus"><Plus className="h-3 w-3" /></button>
                      </div>
                      <p className="text-sm">{formatFCFA(i.price * i.quantity)}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <aside className="h-fit bg-card p-6 text-sm">
              <div className="flex justify-between"><span>Sous-total</span><span>{formatFCFA(subtotal)}</span></div>
              <div className="mt-2 flex justify-between"><span>Livraison</span><span>{formatFCFA(SHIPPING_FEE)}</span></div>
              <div className="mt-4 flex justify-between border-t pt-4 font-semibold"><span>Total</span><span>{formatFCFA(subtotal + SHIPPING_FEE)}</span></div>
              <Link to="/commande" className="mt-6 block bg-primary py-4 text-center uppercase tracking-[0.2em] text-primary-foreground">Commander</Link>
            </aside>
          </div>
        )}
      </div>
    </SiteLayout>
  );
}
