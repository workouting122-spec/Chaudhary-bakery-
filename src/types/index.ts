export type Category = "cakes" | "pastries" | "cookies-cupcakes" | "breads";

export interface WeightVariant {
  label: string; // e.g. "500g", "1kg"
  price: number; // in INR
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: Category;
  basePrice: number;
  unit?: string; // e.g. "kg"
  image: string;
  gallery?: string[];
  description: string;
  tags: string[];
  variants?: WeightVariant[];
  featured?: boolean;
}

export interface CartItem {
  key: string;
  productId: string;
  name: string;
  image: string;
  variantLabel: string;
  unitPrice: number;
  quantity: number;
  messageOnCake?: string;
}

export interface Testimonial {
  quote: string;
  author: string;
}
