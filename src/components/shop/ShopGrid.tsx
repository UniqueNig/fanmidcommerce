"use client";

import Link from "next/link";
import { ShoppingBag, Heart, ArrowLeft, ArrowRight, Check } from "lucide-react";
// At the top of ShopGrid.tsx
import { useCart } from "@/src/context/CartContext";
import { useState } from "react";

type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  category: {
    name: string;
    slug: string;
  };
  isNew?: boolean;
};

type ShopGridProps = {
  products: Product[];
  view: "grid" | "list";
  currentPage: number;
  totalPages: number;
  onPageChange: (p: number) => void;
};

// Add this hook above GridCard
function useAddFeedback() {
  const [added, setAdded] = useState(false);

  const trigger = (callback: () => void) => {
    callback();
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return { added, trigger };
}

function GridCard({ product, onAddToCart }: { product: Product; onAddToCart: () => void }) {
  const { added, trigger } = useAddFeedback();

  return (
    <div className="group relative">
      <div className="relative overflow-hidden aspect-[5/7] mb-4" style={{ backgroundColor: "var(--card-bg)" }}>
        <img src={product.image || undefined} alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />

        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-5 gap-2">
          <button
            onClick={() => trigger(onAddToCart)}
            className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold tracking-widest uppercase font-['DM_Sans'] transition-all duration-300"
            style={{
              backgroundColor: added ? "#22c55e" : "var(--accent)",
              color: "#000",
            }}
          >
            {added ? <Check size={12} /> : <ShoppingBag size={12} />}
            {added ? "Added!" : "Add to Cart"}
          </button>
          <button className="w-9 h-9 border border-white/40 hover:border-white text-white flex items-center justify-center transition-colors">
            <Heart size={13} />
          </button>
        </div>

        {product.isNew && (
          <div className="absolute top-3 left-3 text-black text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 font-['DM_Sans']"
            style={{ backgroundColor: "var(--accent)" }}>
            New
          </div>
        )}
      </div>
      {/* Info unchanged */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] tracking-widest uppercase mb-1 font-['DM_Sans']" style={{ color: "var(--text-muted)" }}>
            {product.category?.name}
          </p>
          <Link href={`/product/${product.id}`}>
            <h3 className="text-sm font-medium font-['DM_Sans'] transition-colors hover:opacity-70" style={{ color: "var(--text-primary)" }}>
              {product.name}
            </h3>
          </Link>
        </div>
        <span className="font-bold font-['Playfair_Display'] text-sm" style={{ color: "var(--accent)" }}>
          ₦{product.price.toFixed(2)}
        </span>
      </div>
    </div>
  );
}

function ListCard({ product, onAddToCart }: { product: Product; onAddToCart: () => void }) {
  const { added, trigger } = useAddFeedback();

  return (
    <div className="flex gap-5 py-5 border-b" style={{ borderColor: "var(--border)" }}>
      <div className="relative overflow-hidden w-24 h-32 flex-shrink-0" style={{ backgroundColor: "var(--card-bg)" }}>
        {product.image ? (
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full" />
        )}
        {product.isNew && (
          <div className="absolute top-2 left-2 text-black text-[9px] font-bold tracking-widest uppercase px-1.5 py-0.5 font-['DM_Sans']"
            style={{ backgroundColor: "var(--accent)" }}>
            New
          </div>
        )}
      </div>
      <div className="flex flex-1 items-center justify-between">
        <div>
          <p className="text-[10px] tracking-widest uppercase mb-1 font-['DM_Sans']" style={{ color: "var(--text-muted)" }}>
            {product.category?.name}
          </p>
          <Link href={`/product/${product.id}`}>
            <h3 className="text-base font-medium font-['DM_Sans'] mb-1 hover:opacity-70 transition-opacity" style={{ color: "var(--text-primary)" }}>
              {product.name}
            </h3>
          </Link>
          <span className="font-bold font-['Playfair_Display']" style={{ color: "var(--accent)" }}>
            ₦{product.price.toFixed(2)}
          </span>
        </div>
        <button
          onClick={() => trigger(onAddToCart)}
          className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold tracking-widest uppercase font-['DM_Sans'] transition-all duration-300 hover:opacity-80"
          style={{
            backgroundColor: added ? "#22c55e" : "var(--accent)",
            color: "#000",
          }}
        >
          {added ? <Check size={12} /> : <ShoppingBag size={12} />}
          {added ? "Added!" : "Add"}
        </button>
      </div>
    </div>
  );
}

export default function ShopGrid({
  products,
  view,
  currentPage,
  totalPages,
  onPageChange,
}: ShopGridProps) {
  const { addItem } = useCart();

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <p
          className="text-4xl mb-4 font-['Playfair_Display'] font-black"
          style={{ color: "var(--text-muted)" }}
        >
          No products found
        </p>
        <p
          className="text-sm font-['DM_Sans']"
          style={{ color: "var(--text-muted)" }}
        >
          Try adjusting your filters
        </p>
      </div>
    );
  }

  const handleAdd = (product: Product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image ?? null, // ← guards against empty string
      category: product.category?.name ?? "",
      quantity: 1,
         size: "",   // ← add this; no size selector on the grid
    });
  };

  return (
    <div className="flex-1 min-w-0">
      {/* Grid or List */}
      {view === "grid" ? (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6">
          {products.map((product) => (
            <GridCard
              key={product.id}
              product={product}
              onAddToCart={() => handleAdd(product)}
            />
          ))}
        </div>
      ) : (
        <div>
          {products.map((product) => (
            <ListCard
              key={product.id}
              product={product}
              onAddToCart={() => handleAdd(product)}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-center gap-2 mt-16">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="w-9 h-9 flex items-center justify-center border transition-all duration-200 disabled:opacity-30"
          style={{
            borderColor: "var(--border)",
            color: "var(--text-secondary)",
          }}
        >
          <ArrowLeft size={14} />
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className="w-9 h-9 flex items-center justify-center border text-xs font-bold font-['DM_Sans'] transition-all duration-200"
            style={{
              backgroundColor:
                currentPage === page ? "var(--accent)" : "transparent",
              borderColor:
                currentPage === page ? "var(--accent)" : "var(--border)",
              color: currentPage === page ? "#000" : "var(--text-secondary)",
            }}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="w-9 h-9 flex items-center justify-center border transition-all duration-200 disabled:opacity-30"
          style={{
            borderColor: "var(--border)",
            color: "var(--text-secondary)",
          }}
        >
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}
