import { Link } from "@tanstack/react-router";
import type { Product } from "@/types/shop";
import { formatFCFA } from "@/services/api";

export function ProductCard({ product }: { product: Product }) {
  const soldOut = product.variants.every((v) => v.stock === 0);
  return (
    <Link to="/produit/$slug" params={{ slug: product.slug }} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden bg-card">
        <img
          src={product.images[0]}
          alt={product.name}
          loading="lazy"
          width={800}
          height={1000}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {product.isNew && (
          <span className="absolute left-3 top-3 bg-background px-2 py-1 text-[0.65rem] uppercase tracking-[0.2em]">Nouveau</span>
        )}
        {soldOut && (
          <span className="absolute right-3 top-3 bg-ink px-2 py-1 text-[0.65rem] uppercase tracking-[0.2em] text-ink-foreground">Épuisé</span>
        )}
      </div>
      <div className="mt-3 flex items-start justify-between gap-3 text-sm">
        <div>
          <p className="font-medium">{product.name}</p>
          <p className="text-muted-foreground">{product.colors.join(" · ")}</p>
        </div>
        <p className="whitespace-nowrap">{formatFCFA(product.price)}</p>
      </div>
    </Link>
  );
}
