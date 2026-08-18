import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import type { Product } from "@/types";
import { formatINR } from "@/lib/utils";
import { useCart } from "@/store/cart";

export default function ProductCard({ product }: { product: Product }) {
  const addItem = useCart((s) => s.addItem);
  const variant = product.variants?.[1] ?? product.variants?.[0];
  const priceLabel = product.variants
    ? `from ${formatINR(product.basePrice)}${product.unit ? `/${product.unit}` : ""}`
    : formatINR(product.basePrice);

  const add = () =>
    addItem({
      productId: product.id,
      name: product.name,
      image: product.image,
      variantLabel: variant?.label ?? "standard",
      unitPrice: variant?.price ?? product.basePrice,
    });

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl bg-cream-50 shadow-card transition duration-300 ease-smooth hover:-translate-y-1 hover:shadow-lift">
      <Link to={`/product/${product.slug}`} className="relative block aspect-[4/3] overflow-hidden bg-cream-200">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition duration-700 ease-smooth group-hover:scale-105"
        />
        {product.tags.includes("bestseller") && (
          <span className="absolute left-3 top-3 rounded-full bg-brand px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-cream-50">
            Bestseller
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full border border-veg" />
          <span className="text-[11px] font-semibold uppercase tracking-wide text-veg">Eggless</span>
        </div>
        <h3 className="mt-2 font-display text-xl">
          <Link to={`/product/${product.slug}`}>{product.name}</Link>
        </h3>
        <p className="mt-1 text-sm text-ink-faint">{priceLabel}</p>
        <div className="mt-auto pt-4">
          <button onClick={add} className="btn-primary w-full text-sm" aria-label={`Add ${product.name} to cart`}>
            <Plus size={16} /> Add to cart
          </button>
        </div>
      </div>
    </article>
  );
}
