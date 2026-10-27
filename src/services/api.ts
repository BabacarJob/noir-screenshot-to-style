// Client HTTP vers l'API Laravel. Tant que VITE_API_BASE_URL n'est pas défini,
// les données fictives sont utilisées. Ne jamais mettre de secret dans VITE_*.
import { mockProducts } from "@/data/mock-products";
import type { CustomerInfo, CartItem, Order, Product } from "@/types/shop";

const BASE_URL = import.meta.env["VITE_API_BASE_URL"] as string | undefined;

async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: { Accept: "application/json", "Content-Type": "application/json", ...init?.headers },
  });
  if (!res.ok) throw new Error(`Erreur API ${res.status}`);
  return res.json() as Promise<T>;
}

export const SHIPPING_FEE = 2000;

export async function getProducts(): Promise<Product[]> {
  if (BASE_URL) return http<Product[]>("/products");
  return mockProducts;
}

export async function getProduct(slug: string): Promise<Product | null> {
  if (BASE_URL) return http<Product>(`/products/${slug}`);
  return mockProducts.find((p) => p.slug === slug) ?? null;
}

const LOCAL_ORDERS = "orders-preview";

export async function createOrder(customer: CustomerInfo, items: CartItem[]): Promise<Order> {
  if (BASE_URL) return http<Order>("/orders", { method: "POST", body: JSON.stringify({ customer, items }) });
  // Aperçu uniquement : le vrai calcul des prix et du stock se fera côté serveur.
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const order: Order = {
    id: crypto.randomUUID(),
    reference: `CMD-${Date.now().toString(36).toUpperCase()}`,
    createdAt: new Date().toISOString(),
    customer,
    items,
    subtotal,
    shipping: SHIPPING_FEE,
    total: subtotal + SHIPPING_FEE,
    paymentStatus: "en_attente",
    deliveryStatus: "en_preparation",
  };
  const all = JSON.parse(localStorage.getItem(LOCAL_ORDERS) ?? "[]") as Order[];
  localStorage.setItem(LOCAL_ORDERS, JSON.stringify([order, ...all]));
  return order;
}

export async function getOrder(reference: string): Promise<Order | null> {
  if (BASE_URL) return http<Order>(`/orders/${reference}`);
  const all = JSON.parse(localStorage.getItem(LOCAL_ORDERS) ?? "[]") as Order[];
  return all.find((o) => o.reference === reference) ?? null;
}

export async function listOrders(): Promise<Order[]> {
  if (BASE_URL) return http<Order[]>("/admin/orders");
  return JSON.parse(localStorage.getItem(LOCAL_ORDERS) ?? "[]") as Order[];
}

/** Le backend créera la session Wave Checkout et renverra l'URL de redirection. */
export async function startWavePayment(reference: string): Promise<{ checkoutUrl: string | null }> {
  if (BASE_URL) return http(`/orders/${reference}/wave-checkout`, { method: "POST" });
  return { checkoutUrl: null };
}

export const formatFCFA = (n: number) => `${new Intl.NumberFormat("fr-FR").format(n)} FCFA`;
