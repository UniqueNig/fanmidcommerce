"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import Navbar from "@/src/components/layout/Navbar";
import Footer from "@/src/components/layout/Footer";
import ProductImageGallery from "@/src/components/product/ProductImageGallery";
import ProductInfo from "@/src/components/product/ProductInfo";

// Placeholder — replace with useQuery(GET_PRODUCT, { variables: { id } }) later
const MOCK_PRODUCT = {
  id: "1",
  name: "Minimalist Leather Jacket",
  price: 299.99,
  originalPrice: 389.99,
  description:
    "Crafted from full-grain vegetable-tanned leather, this jacket ages beautifully with wear. The minimalist silhouette features clean seams, a matte gunmetal zipper, and an unlined interior that molds to your body over time. A timeless investment piece designed to last decades, not seasons.",
  category: "Outerwear",
  isNew: true,
  inStock: true,
  stockCount: 6,
  sizes: ["XS", "S", "M", "L", "XL"],
  images: [
    "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80",
    "https://images.unsplash.com/photo-1548883354-94bcfe321cbb?w=800&q=80",
    "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80",
    "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800&q=80",
  ],
  whatsappNumber: "2348012345678", // 👈 replace with your actual number
};

export default function ProductDetailPage() {
  const product = MOCK_PRODUCT; // swap with real data later

  return (
    <main style={{ backgroundColor: "var(--bg-primary)", minHeight: "100vh" }}>
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-32 pb-20">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 mb-10">
          {[
            { label: "Home", href: "/" },
            { label: "Shop", href: "/shop" },
            { label: product.category, href: `/categories/${product.category.toLowerCase()}` },
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

        {/* Main content — image left, info right */}
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
              name={product.name}
              price={product.price}
              originalPrice={product.originalPrice}
              description={product.description}
              category={product.category}
              isNew={product.isNew}
              inStock={product.inStock}
              stockCount={product.stockCount}
              sizes={product.sizes}
              whatsappNumber={product.whatsappNumber}
            />
          </div>
        </div>

        {/* Product details accordion */}
        <div
          className="mt-20 pt-10 border-t grid grid-cols-1 md:grid-cols-3 gap-10"
          style={{ borderColor: "var(--border)" }}
        >
          {[
            {
              title: "Materials",
              content:
                "Full-grain vegetable-tanned leather exterior. Cotton jersey lining. YKK gunmetal zipper hardware.",
            },
            {
              title: "Sizing & Fit",
              content:
                "True to size. Model is 6'1\" wearing size M. We recommend sizing up if between sizes for a relaxed fit.",
            },
            {
              title: "Care Instructions",
              content:
                "Spot clean only. Apply leather conditioner every 3–6 months. Store in a cool, dry place away from direct sunlight.",
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
      </div>

      <Footer />
    </main>
  );
}