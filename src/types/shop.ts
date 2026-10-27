export type Category = "hoodies" | "t-shirts" | "pantalons" | "vestes" | "accessoires";
export type Size = "XS" | "S" | "M" | "L" | "XL" | "XXL" | "TU";

export interface ProductVariant {
  id: string;
  size: Size;
  color: string;
  stock: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: Category;
  price: number; // FCFA
  images: string[];
  colors: string[];
  variants: ProductVariant[];
  isNew?: boolean;
}

export interface CartItem {
  productId: string;
  variantId: string;
  name: string;
  size: Size;
  color: string;
  price: number;
  image: string;
  quantity: number;
}

export type PaymentStatus = "en_attente" | "payee" | "echouee" | "remboursee";
export type DeliveryStatus = "en_preparation" | "expediee" | "livree" | "annulee";

export interface CustomerInfo {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  notes?: string;
}

export interface Order {
  id: string;
  reference: string;
  createdAt: string;
  customer: CustomerInfo;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  paymentStatus: PaymentStatus;
  deliveryStatus: DeliveryStatus;
}
