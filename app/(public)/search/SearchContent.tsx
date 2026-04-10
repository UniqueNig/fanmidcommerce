"use client";

import { useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/src/components/layout/Navbar";
import Footer from "@/src/components/layout/Footer";
import { Search, X, Loader2 } from "lucide-react";
import { useQuery } from "@apollo/client/react";
import gql from "graphql-tag";
import Link from "next/link";

const SEARCH_PRODUCTS = gql`
  query {
    products {
      id
      name
      price
      image
      isNew
      category {
        id
        name
        slug
      }
    }
  }
`;

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  isNew: boolean;
  category: Category | null;
}

interface Data {
  products: Product[];
}

export default function SearchContent() {
  const searchParams = useSearchParams();
  const initialQ = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(initialQ);
  const [submitted, setSubmitted] = useState(!!initialQ);
  const router = useRouter();

  const { data, loading, error } = useQuery<Data>(SEARCH_PRODUCTS);

  const results = useMemo(() => {
    if (!submitted || !query.trim()) return [];
    const products = data?.products ?? [];
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.category?.name.toLowerCase().includes(query.toLowerCase()),
    );
  }, [query, submitted, data]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <main style={{ backgroundColor: "var(--bg-primary)", minHeight: "100vh" }}>
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-36 pb-20">
        {/* Search bar */}
        <div className="max-w-2xl mx-auto mb-16">
          <h1
            className="text-4xl font-black font-['Playfair_Display'] text-center mb-8"
            style={{ color: "var(--text-primary)" }}
          >
            Search
          </h1>
          <form onSubmit={handleSearch} className="relative">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2"
              style={{ color: "var(--text-muted)" }}
            />
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSubmitted(false);
              }}
              placeholder="Search for products, categories..."
              className="w-full pl-12 pr-12 py-4 text-sm font-['DM_Sans'] outline-none border transition-all"
              style={{
                backgroundColor: "var(--bg-primary)",
                borderColor: "var(--border)",
                color: "var(--text-primary)",
              }}
            />
            {query && (
              <button
                type="button"
                onClick={() => { setQuery(""); setSubmitted(false); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 transition-opacity hover:opacity-60"
                style={{ color: "var(--text-muted)" }}
              >
                <X size={16} />
              </button>
            )}
          </form>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20 gap-3">
            <Loader2 size={20} className="animate-spin" style={{ color: "var(--accent)" }} />
            <span className="text-sm font-['DM_Sans']" style={{ color: "var(--text-muted)" }}>
              Loading...
            </span>
          </div>
        )}

        {/* Error */}
        {error && (
          <p className="text-center text-sm font-['DM_Sans']" style={{ color: "#ef4444" }}>
            Failed to load products: {error.message}
          </p>
        )}

        {/* Results */}
        {!loading && !error && submitted && query && (
          <div>
            <p className="text-sm font-['DM_Sans'] mb-8" style={{ color: "var(--text-muted)" }}>
              {results.length > 0 ? (
                <>
                  <span className="font-bold" style={{ color: "var(--text-primary)" }}>
                    {results.length}
                  </span>{" "}
                  results for "<span style={{ color: "var(--accent)" }}>{query}</span>"
                </>
              ) : (
                <>No results for "<span style={{ color: "var(--accent)" }}>{query}</span>"</>
              )}
            </p>

            {results.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {results.map((product) => (
                  <Link key={product.id} href={`/product/${product.id}`} className="group block">
                    {/* Image */}
                    <div
                      className="relative overflow-hidden aspect-[2/3] mb-3"
                      style={{ backgroundColor: "var(--card-bg)" }}
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      {product.isNew && (
                        <div
                          className="absolute top-3 left-3 text-black text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 font-['DM_Sans']"
                          style={{ backgroundColor: "var(--accent)" }}
                        >
                          New
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex items-start justify-between">
                      <div>
                        <p
                          className="text-[10px] tracking-widest uppercase mb-1 font-['DM_Sans']"
                          style={{ color: "var(--text-muted)" }}
                        >
                          {product.category?.name}
                        </p>
                        <h3
                          className="text-sm font-medium font-['DM_Sans'] hover:opacity-70 transition-opacity"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {product.name}
                        </h3>
                      </div>
                      <span
                        className="font-bold font-['Playfair_Display'] text-sm"
                        style={{ color: "var(--accent)" }}
                      >
                        ₦{product.price.toFixed(2)}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 space-y-4">
                <p className="text-5xl">🔍</p>
                <p className="font-['DM_Sans'] text-sm" style={{ color: "var(--text-muted)" }}>
                  Try searching with different keywords or browse our categories.
                </p>
                <Link
                  href="/shop"
                  className="inline-block mt-4 px-8 py-3 text-xs font-bold tracking-widest uppercase font-['DM_Sans'] hover:opacity-80 transition-opacity"
                  style={{ backgroundColor: "var(--accent)", color: "#000" }}
                >
                  Browse All Products
                </Link>
              </div>
            )}
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}