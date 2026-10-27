import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { SiteLayout } from "@/components/shop/SiteLayout";
import { useCart } from "@/hooks/use-cart";
import { createOrder, formatFCFA, SHIPPING_FEE } from "@/services/api";
import type { CustomerInfo } from "@/types/shop";

export const Route = createFileRoute("/commande")({
  head: () => ({
    meta: [
      { title: "Commande — Maison Noire" },
      { name: "description", content: "Finalisez votre commande Maison Noire." },
      { property: "og:title", content: "Commande — Maison Noire" },
      { property: "og:description", content: "Finalisez votre commande Maison Noire." },
    ],
  }),
  component: Checkout,
});

const PHONE_RE = /^(\+221)?\s?7[05678]\s?\d{3}\s?\d{2}\s?\d{2}$/;

function Checkout() {
  const { items, subtotal, clear } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState<CustomerInfo>({ fullName: "", phone: "", address: "", city: "Dakar", notes: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (form.fullName.trim().length < 2) return setError("Indiquez votre nom complet.");
    if (!PHONE_RE.test(form.phone.trim())) return setError("Numéro sénégalais invalide (ex. 77 123 45 67).");
    if (form.address.trim().length < 5) return setError("Indiquez une adresse de livraison.");
    setError(null);
    setLoading(true);
    try {
      const order = await createOrder(form, items);
      clear();
      navigate({ to: "/paiement/$reference", params: { reference: order.reference } });
    } catch {
      setError("La commande n'a pas pu être enregistrée. Réessayez.");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0)
    return (
      <SiteLayout>
        <div className="py-32 text-center">
          <p className="text-muted-foreground">Votre panier est vide.</p>
          <Link to="/boutique" className="mt-6 inline-block underline">Voir la boutique</Link>
        </div>
      </SiteLayout>
    );

  const field = "mt-1 w-full border bg-background px-4 py-3 text-sm outline-none focus:border-foreground";
  const set = (k: keyof CustomerInfo) => (e: { target: { value: string } }) => setForm({ ...form, [k]: e.target.value });

  return (
    <SiteLayout>
      <div className="mx-auto grid max-w-5xl gap-10 px-5 pt-14 lg:grid-cols-[1fr_320px]">
        <form onSubmit={onSubmit} className="space-y-5" noValidate>
          <h1 className="text-4xl font-extrabold">Vos coordonnées</h1>
          <p className="text-sm text-muted-foreground">Commande sans compte. Nous vous contactons pour la livraison.</p>
          <label className="block text-sm">Nom complet<input className={field} value={form.fullName} onChange={set("fullName")} maxLength={80} autoComplete="name" /></label>
          <label className="block text-sm">Téléphone<input className={field} value={form.phone} onChange={set("phone")} maxLength={20} inputMode="tel" placeholder="77 123 45 67" autoComplete="tel" /></label>
          <label className="block text-sm">Adresse<input className={field} value={form.address} onChange={set("address")} maxLength={160} autoComplete="street-address" /></label>
          <label className="block text-sm">Ville
            <select className={field} value={form.city} onChange={set("city")}>
              {["Dakar", "Pikine", "Rufisque", "Thiès", "Saint-Louis", "Mbour", "Touba", "Ziguinchor"].map((c) => <option key={c}>{c}</option>)}
            </select>
          </label>
          <label className="block text-sm">Instructions (facultatif)<textarea className={field} rows={3} value={form.notes} onChange={set("notes")} maxLength={300} /></label>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <button disabled={loading} className="w-full bg-primary py-4 text-sm uppercase tracking-[0.2em] text-primary-foreground disabled:opacity-50">
            {loading ? "Enregistrement…" : "Continuer vers le paiement"}
          </button>
        </form>
        <aside className="h-fit bg-card p-6 text-sm">
          <p className="eyebrow mb-4">Récapitulatif</p>
          {items.map((i) => (
            <div key={i.variantId} className="flex justify-between py-1"><span>{i.quantity} × {i.name} ({i.size})</span><span>{formatFCFA(i.price * i.quantity)}</span></div>
          ))}
          <div className="mt-4 flex justify-between border-t pt-4"><span>Livraison</span><span>{formatFCFA(SHIPPING_FEE)}</span></div>
          <div className="mt-2 flex justify-between font-semibold"><span>Total</span><span>{formatFCFA(subtotal + SHIPPING_FEE)}</span></div>
        </aside>
      </div>
    </SiteLayout>
  );
}
