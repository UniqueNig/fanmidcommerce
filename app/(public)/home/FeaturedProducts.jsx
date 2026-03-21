"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ProductCard from "@/src/components/ui/ProductCard";

// Placeholder data — replace with your GraphQL query later
const FEATURED_PRODUCTS = [
  {
    id: "1",
    name: "Classic Oversized Tee",
    price: 49.99,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80",
    category: "Tops",
    isNew: true,
  },
  {
    id: "2",
    name: "Tailored Cargo Pants",
    price: 129.99,
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=80",
    category: "Bottoms",
    isNew: false,
  },
  {
    id: "3",
    name: "Minimalist Leather Jacket",
    price: 299.99,
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80",
    category: "Outerwear",
    isNew: true,
  },
  {
    id: "4",
    name: "Linen Blend Shirt",
    price: 79.99,
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&q=80",
    category: "Tops",
    isNew: false,
  },
];

export default function FeaturedProducts() {
  return (
    <section
      className="py-24 px-6 lg:px-10"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      <div className="max-w-7xl mx-auto">

        {/* Section header */}
        <div className="flex items-end justify-between mb-14">
          <div>
            <p
              className="text-xs tracking-[0.3em] uppercase mb-3 font-['DM_Sans']"
              style={{ color: "var(--accent)" }}
            >
              Hand Picked
            </p>
            <h2
              className="text-4xl md:text-5xl font-black font-['Playfair_Display'] leading-tight"
              style={{ color: "var(--text-primary)" }}
            >
              Featured <br />
              Products
            </h2>
          </div>
          <Link
            href="/shop"
            className="featured-view-all hidden md:flex items-center gap-2 text-sm tracking-widest uppercase transition-colors font-['DM_Sans'] group"
            style={{ color: "var(--text-secondary)" }}
          >
            View All
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Products grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {FEATURED_PRODUCTS.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>

        {/* Mobile view all */}
        <div className="mt-10 text-center md:hidden">
          <Link
            href="/shop"
            className="featured-view-all inline-flex items-center gap-2 text-sm tracking-widest uppercase transition-colors font-['DM_Sans']"
            style={{ color: "var(--text-secondary)" }}
          >
            View All Products <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}