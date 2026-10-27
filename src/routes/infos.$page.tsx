import { createFileRoute, notFound } from "@tanstack/react-router";
import { SiteLayout } from "@/components/shop/SiteLayout";

// Textes provisoires — à remplacer par les informations réelles de la boutique.
const PAGES: Record<string, { title: string; body: string[] }> = {
  contact: { title: "Contact", body: ["Écrivez-nous ou appelez-nous du lundi au samedi, 10h–19h.", "Téléphone et e-mail : à compléter."] },
  livraison: { title: "Livraison", body: ["Dakar : livraison sous 48h.", "Régions : 3 à 5 jours ouvrés.", "Les frais sont affichés avant le paiement."] },
  retours: { title: "Retours", body: ["Échange possible sous 7 jours si l'article n'a pas été porté et conserve ses étiquettes."] },
  conditions: { title: "Conditions générales de vente", body: ["Les prix sont indiqués en FCFA, toutes taxes comprises.", "La commande est confirmée après réception du paiement Wave."] },
  confidentialite: { title: "Confidentialité", body: ["Vos coordonnées servent uniquement au traitement et à la livraison de votre commande.", "Elles ne sont jamais revendues."] },
};

export const Route = createFileRoute("/infos/$page")({
  loader: ({ params }) => {
    const page = PAGES[params.page];
    if (!page) throw notFound();
    return page;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.title ?? "Infos"} — Maison Noire` },
      { name: "description", content: loaderData?.body[0] ?? "" },
      { property: "og:title", content: `${loaderData?.title ?? "Infos"} — Maison Noire` },
      { property: "og:description", content: loaderData?.body[0] ?? "" },
    ],
  }),
  component: InfoPage,
});

function InfoPage() {
  const page = Route.useLoaderData();
  return (
    <SiteLayout>
      <article className="mx-auto max-w-2xl px-5 pt-20">
        <h1 className="text-4xl font-extrabold">{page.title}</h1>
        <div className="mt-8 space-y-4 text-muted-foreground">{page.body.map((p) => <p key={p}>{p}</p>)}</div>
      </article>
    </SiteLayout>
  );
}
