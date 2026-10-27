import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { SiteLayout } from "@/components/shop/SiteLayout";
import { formatFCFA, getOrder, startWavePayment } from "@/services/api";

export const Route = createFileRoute("/paiement/$reference")({
  head: () => ({
    meta: [
      { title: "Paiement Wave — Maison Noire" },
      { name: "description", content: "Réglez votre commande avec Wave." },
      { property: "og:title", content: "Paiement Wave — Maison Noire" },
      { property: "og:description", content: "Réglez votre commande avec Wave." },
    ],
  }),
  component: Payment,
});

function Payment() {
  const { reference } = Route.useParams();
  const { data: order, isPending } = useQuery({ queryKey: ["order", reference], queryFn: () => getOrder(reference) });
  const [msg, setMsg] = useState<string | null>(null);

  const pay = async () => {
    const { checkoutUrl } = await startWavePayment(reference);
    if (checkoutUrl) window.location.assign(checkoutUrl);
    else setMsg("Le paiement Wave sera activé lorsque le serveur sera connecté. Votre commande reste en attente.");
  };

  return (
    <SiteLayout>
      <div className="mx-auto max-w-lg px-5 pt-20 text-center">
        <p className="eyebrow">Commande {reference}</p>
        <h1 className="mt-3 text-4xl font-extrabold">Paiement</h1>
        {isPending ? (
          <p className="mt-10 text-muted-foreground">Chargement…</p>
        ) : !order ? (
          <p className="mt-10 text-muted-foreground">Commande introuvable.</p>
        ) : (
          <>
            <p className="mt-6 text-3xl">{formatFCFA(order.total)}</p>
            <button onClick={pay} className="mt-10 w-full bg-primary py-4 text-sm uppercase tracking-[0.2em] text-primary-foreground">
              Payer avec Wave
            </button>
            <p className="mt-4 text-xs text-muted-foreground">Vous serez redirigé vers la page sécurisée de Wave.</p>
            {msg && <p className="mt-6 border p-4 text-sm">{msg}</p>}
            <Link to="/suivi" search={{ ref: reference }} className="mt-8 inline-block text-sm underline">Suivre ma commande</Link>
          </>
        )}
      </div>
    </SiteLayout>
  );
}
