import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import hero from "@/assets/hero.jpg";
import { SiteLayout } from "@/components/shop/SiteLayout";
import { ProductCard } from "@/components/shop/ProductCard";
import { getProducts } from "@/services/api";

export const productsQuery = queryOptions({ queryKey: ["products"], queryFn: getProducts });

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Maison Noire — Streetwear premium à Dakar" },
      { name: "description", content: "Hoodies, tees, cargos et vestes streetwear haut de gamme. Paiement Wave." },
      { property: "og:title", content: "Maison Noire — Streetwear premium à Dakar" },
      { property: "og:description", content: "Hoodies, tees, cargos et vestes streetwear haut de gamme." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(productsQuery),
  component: Home,
});

function Home() {
  const { data } = useSuspenseQuery(productsQuery);
  const fresh = data.filter((p) => p.isNew).slice(0, 4);
  return (
    <SiteLayout>
      <section className="relative h-[85vh] min-h-[520px] overflow-hidden bg-ink">
        <img src={hero} alt="Collection Maison Noire" width={1600} height={1008} className="absolute inset-0 h-full w-full object-cover opacity-90" />
        <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-end px-5 pb-16 text-ink-foreground">
          <p className="text-xs uppercase tracking-[0.3em] opacity-80">Collection 01 — Harmattan</p>
          <h1 className="mt-4 max-w-3xl text-5xl font-extrabold leading-[0.95] sm:text-7xl">Le poids du silence.</h1>
          <Link to="/boutique" className="mt-8 w-fit bg-background px-7 py-4 text-sm uppercase tracking-[0.2em] text-foreground hover:bg-sand">
            Découvrir la boutique
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pt-20">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="eyebrow">Nouveautés</p>
            <h2 className="mt-2 text-3xl font-bold sm:text-4xl">Les dernières pièces</h2>
          </div>
          <Link to="/boutique" className="text-sm underline underline-offset-4">Tout voir</Link>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">
          {fresh.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      <section className="mx-auto mt-24 grid max-w-7xl gap-px bg-border px-0 sm:grid-cols-3">
        {[
          ["Coton lourd", "Grammages de 300 à 450 g/m² pour une tenue impeccable."],
          ["Paiement Wave", "Réglez en toute simplicité depuis votre téléphone."],
          ["Livraison 48h", "Partout à Dakar, et expédition dans tout le Sénégal."],
        ].map(([t, d]) => (
          <div key={t} className="bg-background p-10">
            <h3 className="text-lg font-bold">{t}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{d}</p>
          </div>
        ))}
      </section>

      <section className="mx-auto max-w-7xl px-5 pt-24">
        <p className="eyebrow">Sélection</p>
        <h2 className="mb-8 mt-2 text-3xl font-bold sm:text-4xl">Essentiels</h2>
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">
          {data.filter((p) => !p.isNew).slice(0, 8).map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>
    </SiteLayout>
  );
}
