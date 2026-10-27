import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { SiteLayout } from "@/components/shop/SiteLayout";
import { getProduct, formatFCFA } from "@/services/api";
import { useCart } from "@/hooks/use-cart";

const productQuery = (slug: string) =>
  queryOptions({ queryKey: ["product", slug], queryFn: () => getProduct(slug) });

export const Route = createFileRoute("/produit/$slug")({
  loader: async ({ context, params }) => {
    const p = await context.queryClient.ensureQueryData(productQuery(params.slug));
    if (!p) throw notFound();
    return p;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.name ?? "Produit"} — Maison Noire` },
      { name: "description", content: loaderData?.description ?? "" },
      { property: "og:title", content: `${loaderData?.name ?? "Produit"} — Maison Noire` },
      { property: "og:description", content: loaderData?.description ?? "" },
    ],
  }),
  component: ProductPage,
});

function ProductPage() {
  const { slug } = Route.useParams();
  const { data: p } = useSuspenseQuery(productQuery(slug));
  const { add } = useCart();
  const [img, setImg] = useState(0);
  const [color, setColor] = useState<string>(p?.colors[0] ?? "");
  const [size, setSize] = useState<string | null>(null);
  const [added, setAdded] = useState(false);
  if (!p) return null;

  const variants = p.variants.filter((v) => v.color === color);
  const variant = variants.find((v) => v.size === size);

  const onAdd = () => {
    if (!variant || variant.stock === 0) return;
    add({ productId: p.id, variantId: variant.id, name: p.name, size: variant.size, color, price: p.price, image: p.images[0] ?? "", quantity: 1 });
    setAdded(true);
  };

  return (
    <SiteLayout>
      <div className="mx-auto grid max-w-7xl gap-10 px-5 pt-10 lg:grid-cols-[1.3fr_1fr]">
        <div className="flex flex-col-reverse gap-3 sm:flex-row">
          <div className="flex gap-3 sm:flex-col">
            {p.images.map((src, i) => (
              <button key={i} onClick={() => setImg(i)} className={`h-24 w-20 overflow-hidden border ${img === i ? "border-foreground" : "border-transparent"}`}>
                <img src={src} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
          <div className="aspect-[4/5] flex-1 overflow-hidden bg-card">
            <img src={p.images[img]} alt={p.name} width={800} height={1000} className="h-full w-full object-cover" />
          </div>
        </div>

        <div className="lg:pt-10">
          <Link to="/boutique" search={{ cat: p.category }} className="eyebrow hover:text-foreground">{p.category}</Link>
          <h1 className="mt-3 text-4xl font-extrabold">{p.name}</h1>
          <p className="mt-3 text-xl">{formatFCFA(p.price)}</p>
          <p className="mt-6 text-sm leading-relaxed text-muted-foreground">{p.description}</p>

          <p className="eyebrow mt-8">Couleur — {color}</p>
          <div className="mt-3 flex gap-2">
            {p.colors.map((c) => (
              <button key={c} onClick={() => { setColor(c); setSize(null); setAdded(false); }} className={`border px-4 py-2 text-sm ${c === color ? "border-foreground" : ""}`}>{c}</button>
            ))}
          </div>

          <p className="eyebrow mt-6">Taille</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {variants.map((v) => (
              <button
                key={v.id}
                disabled={v.stock === 0}
                onClick={() => { setSize(v.size); setAdded(false); }}
                className={`h-11 min-w-12 border px-3 text-sm disabled:cursor-not-allowed disabled:text-muted-foreground disabled:line-through ${size === v.size ? "border-foreground bg-primary text-primary-foreground" : ""}`}
              >
                {v.size}
              </button>
            ))}
          </div>
          {variant && <p className="mt-3 text-xs text-muted-foreground">{variant.stock <= 3 ? `Plus que ${variant.stock} en stock` : "En stock"}</p>}

          <button onClick={onAdd} disabled={!variant} className="mt-8 w-full bg-primary py-4 text-sm uppercase tracking-[0.2em] text-primary-foreground disabled:opacity-40">
            {variant ? "Ajouter au panier" : "Choisissez une taille"}
          </button>
          {added && (
            <p className="mt-4 text-sm">Ajouté au panier. <Link to="/panier" className="underline">Voir le panier</Link></p>
          )}
        </div>
      </div>
    </SiteLayout>
  );
}
