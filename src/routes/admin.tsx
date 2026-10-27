import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getOrders, getProducts, formatFCFA } from "@/services/admin";
import { DELIVERY_LABEL, PAYMENT_LABEL } from "@/lib/status";

// Interface provisoire. La sécurité réelle (connexion, rôles) doit être
// assurée par l'API Laravel : masquer cette page côté navigateur ne protège rien.
export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Administration — Maison Noire" },
      { name: "description", content: "Espace d'administration de la boutique." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Administration — Maison Noire" },
      { property: "og:description", content: "Espace d'administration de la boutique." },
    ],
  }),
  component: Admin,
});

type Tab = "tableau" | "produits" | "commandes";

function Admin() {
  const [tab, setTab] = useState<Tab>("tableau");
  const products = useQuery({ queryKey: ["products"], queryFn: getProducts });
  const orders = useQuery({ queryKey: ["admin-orders"], queryFn: getOrders });
  const p = products.data ?? [];
  const o = orders.data ?? [];
  const stock = p.reduce((s, x) => s + x.variants.reduce((a, v) => a + v.stock, 0), 0);
  const revenue = o.filter((x) => x.paymentStatus === "payee").reduce((s, x) => s + x.total, 0);

  return (
    <div className="min-h-screen bg-background">
      <header className="flex items-center justify-between border-b px-6 py-4">
        <p className="font-display font-extrabold tracking-[0.2em]">ADMIN</p>
        <Link to="/" className="text-sm underline">Voir la boutique</Link>
      </header>
      <div className="border-b bg-secondary px-6 py-2 text-xs">Interface provisoire — non connectée et non sécurisée tant que l'API n'est pas branchée.</div>
      <nav className="flex gap-6 border-b px-6 text-sm">
        {(["tableau", "produits", "commandes"] as Tab[]).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`py-3 capitalize ${tab === t ? "border-b-2 border-foreground" : "text-muted-foreground"}`}>{t === "tableau" ? "Tableau de bord" : t}</button>
        ))}
      </nav>
      <main className="p-6">
        {tab === "tableau" && (
          <div className="grid gap-4 sm:grid-cols-4">
            {[["Produits", p.length], ["Pièces en stock", stock], ["Commandes", o.length], ["Encaissé", formatFCFA(revenue)]].map(([k, v]) => (
              <div key={k} className="border p-5"><p className="eyebrow">{k}</p><p className="mt-2 text-2xl font-bold">{v}</p></div>
            ))}
          </div>
        )}
        {tab === "produits" && (
          <table className="w-full text-left text-sm">
            <thead className="eyebrow"><tr><th className="py-2">Produit</th><th>Catégorie</th><th>Prix</th><th>Stock</th></tr></thead>
            <tbody className="divide-y">
              {p.map((x) => (
                <tr key={x.id}>
                  <td className="flex items-center gap-3 py-2"><img src={x.images[0]} alt="" className="h-10 w-8 object-cover" />{x.name}</td>
                  <td>{x.category}</td><td>{formatFCFA(x.price)}</td>
                  <td>{x.variants.reduce((a, v) => a + v.stock, 0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {tab === "commandes" && (o.length === 0 ? <p className="text-muted-foreground">Aucune commande.</p> : (
          <table className="w-full text-left text-sm">
            <thead className="eyebrow"><tr><th className="py-2">Référence</th><th>Client</th><th>Total</th><th>Paiement</th><th>Livraison</th></tr></thead>
            <tbody className="divide-y">
              {o.map((x) => (
                <tr key={x.id}><td className="py-2">{x.reference}</td><td>{x.customer.fullName}</td><td>{formatFCFA(x.total)}</td><td>{PAYMENT_LABEL[x.paymentStatus]}</td><td>{DELIVERY_LABEL[x.deliveryStatus]}</td></tr>
              ))}
            </tbody>
          </table>
        ))}
      </main>
    </div>
  );
}
