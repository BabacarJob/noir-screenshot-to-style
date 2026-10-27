import type { DeliveryStatus, PaymentStatus } from "@/types/shop";

export const PAYMENT_LABEL: Record<PaymentStatus, string> = {
  en_attente: "En attente",
  payee: "Payée",
  echouee: "Échouée",
  remboursee: "Remboursée",
};

export const DELIVERY_LABEL: Record<DeliveryStatus, string> = {
  en_preparation: "En préparation",
  expediee: "Expédiée",
  livree: "Livrée",
  annulee: "Annulée",
};
