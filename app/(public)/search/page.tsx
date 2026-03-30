"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/src/components/layout/Navbar";
import Footer from "@/src/components/layout/Footer";
import ProductCard from "@/src/components/ui/ProductCard";
import { Search, X } from "lucide-react";

const ALL_PRODUCTS = [
  { id: "1", name: "Classic Oversized Tee", price: 49.99, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80", category: "Tops", isNew: true },
  { id: "2", name: "Tailored Cargo Pants", price: 129.99, image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=80", category: "Bottoms", isNew: false },
  { id: "3", name: "Minimalist Leather Jacket", price: 299.99, image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80", category: "Outerwear", isNew: true },
  { id: "4", name: "Linen Blend Shirt", price: 79.99, image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&q=80", category: "Tops", isNew: false },
  { id: "5", name: "Wool Overcoat", price: 349.99, image: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=600&q=80", category: "Outerwear", isNew: false },
  { id: "6", name: "Canvas Tote Bag", price: 59.99, image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&q=80", category: "Accessories", isNew: true },
];

export default function SearchPage() {
  const searchParams = useSearchParams();
  const initialQ = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(initialQ);
  const [submitted, setSubmitted] = useState(!!initialQ);

  const results = useMemo(() => {
    if (!submitted || !query.trim()) return [];
    return ALL_PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase())
    );
  }, [query, submitted]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main style={{ backgroundColor: "var(--bg-primary)", minHeight: "100vh" }}>
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-36 pb-20">

        {/* Search bar */}
        <div className="max-w-2xl mx-auto mb-16">
          <h1 className="text-4xl font-black font-['Playfair_Display'] text-center mb-8" style={{ color: "var(--text-primary)" }}>
            Search
          </h1>
          <form onSubmit={handleSearch} className="relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
            <input
              value={query}
              onChange={(e) => { setQuery(e.target.value); setSubmitted(false); }}
              placeholder="Search for products, categories..."
              className="w-full pl-12 pr-12 py-4 text-sm font-['DM_Sans'] outline-none border transition-all"
              style={{ backgroundColor: "var(--bg-primary)", borderColor: "var(--border)", color: "var(--text-primary)" }}
            />
            {query && (
              <button type="button" onClick={() => { setQuery(""); setSubmitted(false); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 transition-opacity hover:opacity-60"
                style={{ color: "var(--text-muted)" }}>
                <X size={16} />
              </button>
            )}
          </form>
        </div>

        {/* Results */}
        {submitted && query && (
          <div>
            <p className="text-sm font-['DM_Sans'] mb-8" style={{ color: "var(--text-muted)" }}>
              {results.length > 0
                ? <><span className="font-bold" style={{ color: "var(--text-primary)" }}>{results.length}</span> results for "<span style={{ color: "var(--accent)" }}>{query}</span>"</>
                : <>No results for "<span style={{ color: "var(--accent)" }}>{query}</span>"</>
              }
            </p>

            {results.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {results.map((p) => <ProductCard key={p.id} {...p} />)}
              </div>
            ) : (
              <div className="text-center py-16 space-y-4">
                <p className="text-5xl">🔍</p>
                <p className="font-['DM_Sans'] text-sm" style={{ color: "var(--text-muted)" }}>
                  Try searching with different keywords or browse our categories.
                </p>
                <a href="/shop" className="inline-block mt-4 px-8 py-3 text-xs font-bold tracking-widest uppercase font-['DM_Sans'] hover:opacity-80 transition-opacity"
                  style={{ backgroundColor: "var(--accent)", color: "#000" }}>
                  Browse All Products
                </a>
              </div>
            )}
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}