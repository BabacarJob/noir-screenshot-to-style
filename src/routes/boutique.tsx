import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { SiteLayout } from "@/components/shop/SiteLayout";
import { ProductCard } from "@/components/shop/ProductCard";
import { productsQuery } from "./index";
import type { Category, Size } from "@/types/shop";

const CATS: { id: Category; label: string }[] = [
  { id: "hoodies", label: "Hoodies" },
  { id: "t-shirts", label: "T-shirts" },
  { id: "pantalons", label: "Pantalons" },
  { id: "vestes", label: "Vestes" },
  { id: "accessoires", label: "Accessoires" },
];
const SIZES: Size[] = ["S", "M", "L", "XL", "TU"];

export const Route = createFileRoute("/boutique")({
  validateSearch: (s: Record<string, unknown>): { cat?: Category } =>
    CATS.some((c) => c.id === s.cat) ? { cat: s.cat as Category } : {},
  head: () => ({
    meta: [
      { title: "Boutique — Maison Noire" },
      { name: "description", content: "Tout le catalogue streetwear premium Maison Noire." },
      { property: "og:title", content: "Boutique — Maison Noire" },
      { property: "og:description", content: "Tout le catalogue streetwear premium Maison Noire." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(productsQuery),
  component: Shop,
});

function Shop() {
  const { data } = useSuspenseQuery(productsQuery);
  const { cat } = Route.useSearch();
  const [size, setSize] = useState<Size | null>(null);
  const [color, setColor] = useState<string | null>(null);
  const [max, setMax] = useState(80000);
  const colors = useMemo(() => [...new Set(data.flatMap((p) => p.colors))], [data]);

  const list = data.filter(
    (p) =>
      (!cat || p.category === cat) &&
      (!color || p.colors.includes(color)) &&
      (!size || p.variants.some((v) => v.size === size)) &&
      p.price <= max,
  );

  const chip = (active: boolean) =>
    `border px-3 py-1.5 text-xs uppercase tracking-wider ${active ? "border-foreground bg-primary text-primary-foreground" : "hover:border-foreground"}`;

  return (
    <SiteLayout>
      <div className="mx-auto max-w-7xl px-5 pt-14">
        <p className="eyebrow">Catalogue</p>
        <h1 className="mt-2 text-4xl font-extrabold sm:text-6xl">{CATS.find((c) => c.id === cat)?.label ?? "Tout"}</h1>

        <div className="mt-8 flex flex-wrap gap-2">
          <Link to="/boutique" className={chip(!cat)}>Tout</Link>
          {CATS.map((c) => (
            <Link key={c.id} to="/boutique" search={{ cat: c.id }} className={chip(cat === c.id)}>{c.label}</Link>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-6 border-y py-4 text-sm">
          <div className="flex flex-wrap items-center gap-2">
            <span className="eyebrow">Taille</span>
            {SIZES.map((s) => (
              <button key={s} onClick={() => setSize(size === s ? null : s)} className={chip(size === s)}>{s}</button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="eyebrow">Couleur</span>
            {colors.map((c) => (
              <button key={c} onClick={() => setColor(color === c ? null : c)} className={chip(color === c)}>{c}</button>
            ))}
          </div>
          <label className="flex items-center gap-3">
            <span className="eyebrow">Prix max</span>
            <input type="range" min={10000} max={80000} step={5000} value={max} onChange={(e) => setMax(+e.target.value)} className="accent-foreground" />
            <span>{max.toLocaleString("fr-FR")} F</span>
          </label>
        </div>

        <p className="mt-6 text-sm text-muted-foreground">{list.length} article(s)</p>
        {list.length === 0 ? (
          <p className="py-24 text-center text-muted-foreground">Aucun article ne correspond à ces filtres.</p>
        ) : (
          <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">
            {list.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </SiteLayout>
  );
}
