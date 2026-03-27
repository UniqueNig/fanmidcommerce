"use client";

import { use } from "react";
import Link from "next/link";
import Navbar from "@/src/components/layout/Navbar";
import Footer from "@/src/components/layout/Footer";
import ProductCard from "@/src/components/ui/ProductCard";
import { ArrowLeft } from "lucide-react";

const CATEGORY_META: Record<string, { name: string; desc: string; image: string }> = {
  tops:       { name: "Tops", desc: "T-shirts, shirts, blouses and more", image: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=1200&q=80" },
  bottoms:    { name: "Bottoms", desc: "Trousers, jeans and shorts", image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=1200&q=80" },
  outerwear:  { name: "Outerwear", desc: "Jackets, coats and layering pieces", image: "https://images.unsplash.com/photo-1548883354-94bcfe321cbb?w=1200&q=80" },
  accessories:{ name: "Accessories", desc: "Bags, belts, hats and jewelry", image: "https://images.unsplash.com/photo-1523779917675-b6ed3a42a561?w=1200&q=80" },
  footwear:   { name: "Footwear", desc: "Sneakers, boots and formal shoes", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&q=80" },
  activewear: { name: "Activewear", desc: "Performance and athleisure pieces", image: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=1200&q=80" },
};

const SAMPLE_PRODUCTS = [
  { id: "1", name: "Classic Oversized Tee", price: 49.99, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80", category: "Tops", isNew: true },
  { id: "4", name: "Linen Blend Shirt", price: 79.99, image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&q=80", category: "Tops", isNew: false },
  { id: "9", name: "Striped Long Sleeve", price: 64.99, image: "https://images.unsplash.com/photo-1603251578711-3290595bc3a7?w=600&q=80", category: "Tops", isNew: false },
  { id: "10", name: "Relaxed Henley", price: 54.99, image: "https://images.unsplash.com/photo-1581803118522-7b72a50f7e9f?w=600&q=80", category: "Tops", isNew: true },
  { id: "11", name: "Graphic Tee", price: 39.99, image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80", category: "Tops", isNew: false },
  { id: "12", name: "Polo Shirt", price: 69.99, image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=600&q=80", category: "Tops", isNew: false },
];

export default function CategorySlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const meta = CATEGORY_META[slug] ?? { name: slug, desc: "", image: "" };

  return (
    <main style={{ backgroundColor: "var(--bg-primary)", minHeight: "100vh" }}>
      <Navbar />

      {/* Hero banner */}
      <div className="relative h-64 md:h-80 overflow-hidden mt-16">
        {meta.image && (
          <img src={meta.image} alt={meta.name} className="absolute inset-0 w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative h-full flex flex-col justify-end px-6 lg:px-10 pb-10 max-w-7xl mx-auto">
          <Link href="/categories" className="flex items-center gap-2 text-white/60 text-xs tracking-widest uppercase font-['DM_Sans'] mb-4 hover:text-white transition-colors">
            <ArrowLeft size={12} /> All Categories
          </Link>
          <h1 className="text-5xl font-black font-['Playfair_Display'] text-white">{meta.name}</h1>
          <p className="text-white/60 text-sm font-['DM_Sans'] mt-1">{meta.desc}</p>
        </div>
      </div>

      {/* Products */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
        <div className="flex items-center justify-between mb-8">
          <p className="text-xs font-['DM_Sans']" style={{ color: "var(--text-muted)" }}>
            <span className="font-bold" style={{ color: "var(--text-primary)" }}>{SAMPLE_PRODUCTS.length}</span> products
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6">
          {SAMPLE_PRODUCTS.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </div>

      <Footer />
    </main>
  );
}