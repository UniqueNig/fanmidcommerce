import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ChevronRight } from "lucide-react";
import Navbar from "@/src/components/layout/Navbar";
import Footer from "@/src/components/layout/Footer";
import ProductImageGallery from "@/src/components/product/ProductImageGallery";
import ProductInfo from "@/src/components/product/ProductInfo";
import ProductReviews from "@/src/components/product/ProductReviews";
import ProductCard from "@/src/components/ui/ProductCard";
import { getProductBySlug, getRelatedProducts } from "@/src/lib/data/products";
import { getProductReviews, getReviewSummary } from "@/src/lib/data/reviews";
import { getStoreSettings } from "@/src/lib/data/settings";

// Build a short, clean meta description from the product description.
function metaDescription(text: string): string {
  const clean = text.replace(/\s+/g, " ").trim();
  return clean.length > 160 ? `${clean.slice(0, 157)}...` : clean;
}

// ── Per-page SEO metadata (runs on the server) ──────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return { title: "Product not found" };
  }

  const description = metaDescription(product.description);
  const canonical = `/product/${product.slug ?? product.id}`;

  return {
    title: product.name,
    description,
    alternates: { canonical },
    openGraph: {
      type: "website",
      title: product.name,
      description,
      url: canonical,
      images: product.image ? [{ url: product.image, alt: product.name }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description,
      images: product.image ? [product.image] : [],
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  // Proper 404 (renders app/not-found.tsx) instead of a client error state.
  if (!product) notFound();

  const [reviews, reviewSummary, related, store] = await Promise.all([
    getProductReviews(product.id),
    getReviewSummary(product.id),
    getRelatedProducts(product.category?.id ?? null, product.id),
    getStoreSettings(),
  ]);

  const inStock = product.stock > 0;

  // JSON-LD structured data → eligible for Google rich results (price, stock).
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: metaDescription(product.description),
    ...(product.image ? { image: [product.image] } : {}),
    ...(product.category ? { category: product.category.name } : {}),
    offers: {
      "@type": "Offer",
      priceCurrency: "NGN",
      price: product.price,
      availability: inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
    ...(reviewSummary.count > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: reviewSummary.average,
            reviewCount: reviewSummary.count,
          },
        }
      : {}),
  };

  return (
    <main style={{ backgroundColor: "var(--bg-primary)", minHeight: "100vh" }}>
      {/* Structured data for search engines */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Navbar />

      <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-32 pb-20">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 mb-10">
          {[
            { label: "Home", href: "/" },
            { label: "Shop", href: "/shop" },
            {
              label: product.category?.name ?? "Uncategorized",
              href: product.category
                ? `/shop?category=${product.category.slug}`
                : "/shop",
            },
            { label: product.name, href: null },
          ].map((crumb, i, arr) => (
            <span key={crumb.label} className="flex items-center gap-2">
              {crumb.href ? (
                <Link
                  href={crumb.href}
                  className="text-xs tracking-widest uppercase font-['DM_Sans'] transition-colors hover:opacity-70"
                  style={{ color: "var(--text-muted)" }}
                >
                  {crumb.label}
                </Link>
              ) : (
                <span
                  className="text-xs tracking-widest uppercase font-['DM_Sans']"
                  style={{ color: "var(--text-primary)" }}
                >
                  {crumb.label}
                </span>
              )}
              {i < arr.length - 1 && (
                <ChevronRight size={12} style={{ color: "var(--text-muted)" }} />
              )}
            </span>
          ))}
        </nav>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16">
          {/* Left — image gallery */}
          <div className="w-full">
            <ProductImageGallery
              images={product.images}
              productName={product.name}
            />
          </div>

          {/* Right — product info */}
          <div className="w-full lg:sticky lg:top-28 lg:self-start">
            <ProductInfo
              id={product.id}
              slug={product.slug ?? undefined}
              name={product.name}
              price={product.price}
              description={product.description}
              image={product.image ?? ""}
              category={product.category?.name ?? "Uncategorized"}
              isNew={product.isNew}
              inStock={inStock}
              stockCount={product.stock}
              sizes={product.sizes} // real sizes from the product (empty = no size selector)
              sizeStock={product.sizeStock} // per-size availability
              sizeGuide={(product.sizeGuide as "clothing" | "footwear" | "none") || "clothing"}
              whatsappNumber={store.whatsapp || "2348134879924"} // from store settings
            />
          </div>
        </div>

        {/* Product details */}
        <div
          className="mt-20 pt-10 border-t grid grid-cols-1 md:grid-cols-3 gap-10"
          style={{ borderColor: "var(--border)" }}
        >
          {[
            { title: "Materials", content: product.materials || product.description },
            {
              title: "Sizing & Fit",
              content: product.sizingFit || "True to size. Refer to size guide for best fit.",
            },
            {
              title: "Care Instructions",
              content: product.careInstructions || "Refer to garment label for care instructions.",
            },
          ].map((item) => (
            <div key={item.title}>
              <h4
                className="text-xs tracking-[0.25em] uppercase font-bold mb-3 font-['DM_Sans']"
                style={{ color: "var(--text-muted)" }}
              >
                {item.title}
              </h4>
              <p
                className="text-sm leading-relaxed font-['DM_Sans']"
                style={{ color: "var(--text-secondary)" }}
              >
                {item.content}
              </p>
            </div>
          ))}
        </div>

        {/* Customer reviews (verified buyers) */}
        <ProductReviews
          productId={product.id}
          reviews={reviews}
          summary={reviewSummary}
        />

        {/* You may also like */}
        {related.length > 0 && (
          <div className="mt-20 pt-10 border-t" style={{ borderColor: "var(--border)" }}>
            <h3
              className="text-2xl font-black font-['Playfair_Display'] mb-8"
              style={{ color: "var(--text-primary)" }}
            >
              You may also like
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-6">
              {related.map((p) => (
                <ProductCard
                  key={p.id}
                  id={p.id}
                  slug={p.slug ?? undefined}
                  name={p.name}
                  price={p.price}
                  image={p.image ?? ""}
                  category={product.category?.name ?? ""}
                  isNew={p.isNew}
                  stock={p.stock}
                  sizes={p.sizes}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
