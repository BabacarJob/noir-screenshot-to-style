import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { SiteLayout } from "@/components/shop/SiteLayout";
import { formatFCFA, getOrder } from "@/services/api";
import { DELIVERY_LABEL, PAYMENT_LABEL } from "@/lib/status";

export const Route = createFileRoute("/suivi")({
  validateSearch: (s: Record<string, unknown>): { ref?: string } => (typeof s.ref === "string" ? { ref: s.ref.slice(0, 40) } : {}),
  head: () => ({
    meta: [
      { title: "Suivi de commande — Maison Noire" },
      { name: "description", content: "Suivez l'état de votre commande." },
      { property: "og:title", content: "Suivi de commande — Maison Noire" },
      { property: "og:description", content: "Suivez l'état de votre commande." },
    ],
  }),
  component: Tracking,
});

function Tracking() {
  const { ref } = Route.useSearch();
  const navigate = useNavigate();
  const [input, setInput] = useState(ref ?? "");
  const { data: order, isFetching } = useQuery({ queryKey: ["order", ref], queryFn: () => getOrder(ref!), enabled: !!ref });

  return (
    <SiteLayout>
      <div className="mx-auto max-w-lg px-5 pt-20">
        <h1 className="text-4xl font-extrabold">Suivi de commande</h1>
        <form onSubmit={(e) => { e.preventDefault(); navigate({ to: "/suivi", search: { ref: input.trim() } }); }} className="mt-8 flex gap-2">
          <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="CMD-XXXX" className="flex-1 border bg-background px-4 py-3 text-sm" />
          <button className="bg-primary px-5 text-sm text-primary-foreground">Rechercher</button>
        </form>
        {ref && !isFetching && !order && <p className="mt-8 text-sm text-muted-foreground">Aucune commande trouvée.</p>}
        {order && (
          <div className="mt-8 space-y-2 bg-card p-6 text-sm">
            <p className="font-semibold">{order.reference}</p>
            <p>Paiement : {PAYMENT_LABEL[order.paymentStatus]}</p>
            <p>Livraison : {DELIVERY_LABEL[order.deliveryStatus]}</p>
            <p>Total : {formatFCFA(order.total)}</p>
          </div>
        )}
      </div>
    </SiteLayout>
  );
}
