// Données fictives — à remplacer par l'API Laravel (voir src/services/api.ts).
import hoodie from "@/assets/p-hoodie.jpg";
import tee from "@/assets/p-tee.jpg";
import cargo from "@/assets/p-cargo.jpg";
import hero from "@/assets/hero.jpg";
import type { Category, Product, Size } from "@/types/shop";

const imgByCat: Record<Category, string[]> = {
  hoodies: [hoodie, hero],
  "t-shirts": [tee, hero],
  pantalons: [cargo, hero],
  vestes: [hero, hoodie],
  accessoires: [hoodie, tee],
};

const seed: Array<[string, Category, number, string[], boolean?]> = [
  ["Hoodie Heavyweight Noir", "hoodies", 45000, ["Noir", "Charbon"], true],
  ["Hoodie Dune Washed", "hoodies", 48000, ["Sable", "Charbon"]],
  ["Hoodie Zip Monolith", "hoodies", 52000, ["Noir"]],
  ["Hoodie Médina", "hoodies", 47000, ["Écru", "Noir"], true],
  ["Tee Boxy Écru", "t-shirts", 18000, ["Écru", "Noir"], true],
  ["Tee Oversize Charbon", "t-shirts", 17000, ["Charbon"]],
  ["Tee Graphic Teranga", "t-shirts", 20000, ["Écru", "Sable"]],
  ["Tee Long Sleeve Corniche", "t-shirts", 22000, ["Noir", "Écru"]],
  ["Tee Mock Neck", "t-shirts", 19000, ["Sable"]],
  ["Cargo Wide Sable", "pantalons", 38000, ["Sable", "Noir"], true],
  ["Cargo Parachute Noir", "pantalons", 40000, ["Noir"]],
  ["Jogger Heavyweight", "pantalons", 32000, ["Charbon", "Écru"]],
  ["Denim Baggy Brut", "pantalons", 42000, ["Charbon"]],
  ["Veste Work Canvas", "vestes", 65000, ["Sable", "Noir"], true],
  ["Bomber Satin Nuit", "vestes", 72000, ["Noir"]],
  ["Coach Jacket Harmattan", "vestes", 58000, ["Sable"]],
  ["Overshirt Lin Lourd", "vestes", 49000, ["Écru"]],
  ["Casquette 6 Pans", "accessoires", 12000, ["Noir", "Sable"]],
  ["Bonnet Côtelé", "accessoires", 10000, ["Charbon", "Écru"]],
  ["Tote Bag Canvas", "accessoires", 15000, ["Écru"]],
];

const slugify = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export const mockProducts: Product[] = seed.map(([name, category, price, colors, isNew], i) => {
  const sizes: Size[] = category === "accessoires" ? ["TU"] : ["S", "M", "L", "XL"];
  return {
    id: `p${i + 1}`,
    slug: slugify(name),
    name,
    category,
    price,
    colors,
    isNew,
    images: imgByCat[category],
    description:
      "Pièce en coton épais, coupe ample et finitions soignées. Conçue pour durer et pensée pour la ville.",
    variants: colors.flatMap((color) =>
      sizes.map((size, j) => ({ id: `p${i + 1}-${color}-${size}`, size, color, stock: (i + j) % 5 === 0 ? 0 : 3 + j })),
    ),
  };
});
