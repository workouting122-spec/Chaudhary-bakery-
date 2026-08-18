import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Plus, MessageCircle } from "lucide-react";
import { useCatalog } from "@/hooks/useCatalog";
import { findBySlug, relatedFrom } from "@/lib/catalog";
import ProductCard from "@/components/ui/ProductCard";
import { formatINR } from "@/lib/utils";
import { useCart } from "@/store/cart";
import { waLink } from "@/config/site";

export default function ProductDetail() {
  const { slug = "" } = useParams();
  const { products, loading } = useCatalog();
  const product = findBySlug(products, slug);
  const addItem = useCart((s) => s.addItem);

  const gallery = useMemo(
    () => product?.gallery ?? (product ? [product.image] : []),
    [product]
  );
  const [mainImg, setMainImg] = useState("");
  const [variantIdx, setVariantIdx] = useState(0);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!product) return;
    setMainImg(product.gallery?.[0] ?? product.image);
    setVariantIdx(product.variants ? 1 : 0);
    setMessage("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product?.id]);

  if (loading && !product) {
    return (
      <div className="container-x flex min-h-[60vh] items-center justify-center pt-[var(--nav-h)] text-ink-faint">
        Loading…
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container-x flex min-h-[60vh] flex-col items-center justify-center gap-4 pt-[var(--nav-h)]">
        <p className="font-display text-3xl">Product not found</p>
        <Link to="/shop" className="btn-primary">Back to shop</Link>
      </div>
    );
  }

  const variant = product.variants?.[variantIdx];
  const price = variant?.price ?? product.basePrice;

  const add = () =>
    addItem({
      productId: product.id,
      name: product.name,
      image: product.image,
      variantLabel: variant?.label ?? "standard",
      unitPrice: price,
      messageOnCake: message.trim() || undefined,
    });

  const related = relatedFrom(products, product.slug, product.category);

  return (
    <div className="container-x pb-24 pt-[calc(var(--nav-h)+2rem)]">
      <nav className="mb-8 text-sm text-ink-faint">
        <Link to="/shop" className="hover:text-brand">Shop</Link> / {product.name}
      </nav>

      <div className="grid gap-10 md:grid-cols-2">
        {/* Gallery */}
        <div>
          <div className="aspect-square overflow-hidden rounded-2xl bg-cream-200 shadow-card">
            <img src={mainImg || gallery[0]} alt={product.name} className="h-full w-full object-cover" />
          </div>
          {gallery.length > 1 && (
            <div className="mt-4 flex gap-3">
              {gallery.map((g) => (
                <button
                  key={g}
                  onClick={() => setMainImg(g)}
                  className={`h-20 w-20 overflow-hidden rounded-xl border-2 transition ${
                    mainImg === g ? "border-brand" : "border-transparent"
                  }`}
                  aria-label="View image"
                >
                  <img src={g} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full border border-veg" />
            <span className="text-xs font-semibold uppercase tracking-wide text-veg">
              Eggless · {product.category.replace("-", " & ")}
            </span>
          </div>
          <h1 className="mt-3 font-display text-4xl">{product.name}</h1>
          <p className="mt-3 text-2xl text-ink">{formatINR(price)}</p>
          <p className="mt-6 max-w-prose text-ink-soft">{product.description}</p>

          {product.variants && (
            <div className="mt-8">
              <label className="eyebrow mb-2 block">Weight</label>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v, i) => (
                  <button
                    key={v.label}
                    onClick={() => setVariantIdx(i)}
                    className={`rounded-full border px-4 py-2 text-sm transition ${
                      variantIdx === i ? "border-brand bg-brand text-cream-50" : "border-ink/15 hover:border-ink/40"
                    }`}
                  >
                    {v.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6">
            <label htmlFor="cake-msg" className="eyebrow mb-2 block">Message on cake (optional)</label>
            <input
              id="cake-msg"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={40}
              placeholder="e.g. Happy Birthday Aarav!"
              className="w-full rounded-xl border border-ink/15 bg-cream-50 px-4 py-3 text-sm focus:border-brand focus:outline-none"
            />
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button onClick={add} className="btn-primary flex-1">
              <Plus size={18} /> Add to cart
            </button>
            <a
              href={waLink(`Hi! I'd like to order the ${product.name} (${variant?.label ?? ""}).`)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost flex-1"
            >
              <MessageCircle size={18} /> Order on WhatsApp
            </a>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-24">
          <h2 className="font-display text-3xl">You might also like</h2>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
