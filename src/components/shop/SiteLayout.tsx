import { Link } from "@tanstack/react-router";
import { ShoppingBag } from "lucide-react";
import type { ReactNode } from "react";
import { useCart } from "@/hooks/use-cart";

export const BRAND = "MAISON NOIRE";

export function SiteLayout({ children }: { children: ReactNode }) {
  const { count } = useCart();
  return (
    <div className="flex min-h-screen flex-col">
      <div className="bg-ink py-2 text-center text-[0.7rem] uppercase tracking-[0.25em] text-ink-foreground">
        Livraison à Dakar sous 48h · Paiement Wave
      </div>
      <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5">
          <nav className="flex gap-6 text-sm">
            <Link to="/boutique" className="hover:opacity-60">Boutique</Link>
            <Link to="/boutique" search={{ cat: "hoodies" }} className="hidden hover:opacity-60 sm:block">Hoodies</Link>
            <Link to="/boutique" search={{ cat: "vestes" }} className="hidden hover:opacity-60 sm:block">Vestes</Link>
          </nav>
          <Link to="/" className="font-display text-lg font-extrabold tracking-[0.2em]">{BRAND}</Link>
          <div className="flex items-center gap-5 text-sm">
            <Link to="/suivi" className="hidden hover:opacity-60 sm:block">Suivi</Link>
            <Link to="/panier" className="relative flex items-center gap-2 hover:opacity-60" aria-label="Panier">
              <ShoppingBag className="h-5 w-5" />
              <span>{count}</span>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="mt-24 bg-ink text-ink-foreground">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:grid-cols-3">
          <div>
            <p className="font-display text-2xl font-extrabold tracking-[0.2em]">{BRAND}</p>
            <p className="mt-3 max-w-xs text-sm opacity-60">Streetwear premium, pensé à Dakar.</p>
          </div>
          <div className="flex flex-col gap-2 text-sm opacity-80">
            <Link to="/infos/$page" params={{ page: "contact" }}>Contact</Link>
            <Link to="/infos/$page" params={{ page: "livraison" }}>Livraison</Link>
            <Link to="/infos/$page" params={{ page: "retours" }}>Retours</Link>
          </div>
          <div className="flex flex-col gap-2 text-sm opacity-80">
            <Link to="/infos/$page" params={{ page: "conditions" }}>Conditions générales</Link>
            <Link to="/infos/$page" params={{ page: "confidentialite" }}>Confidentialité</Link>
            <Link to="/admin">Administration</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
