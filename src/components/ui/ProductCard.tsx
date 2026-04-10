"use client";

import Link from "next/link";
import { ShoppingBag, Heart, Check } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/src/context/CartContext";

type ProductCardProps = {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  isNew?: boolean;
};

export default function ProductCard({
  id,
  name,
  price,
  image,
  category,
  isNew,
}: ProductCardProps) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    // Products on grid don't have size selection — default to "One Size"
    // For sized items, clicking the card goes to product page where size is chosen
    addItem({ id, name, price, image, category, size: "One Size" });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div className="group relative">
      {/* Image container */}
      <div
        className="relative overflow-hidden aspect-[3/4] mb-4"
        style={{ backgroundColor: "var(--card-bg)" }}
      >
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Overlay actions */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6 gap-3">
          <button
            onClick={handleAddToCart}
            className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold tracking-widest uppercase transition-colors font-['DM_Sans']"
            style={{
              backgroundColor: added ? "#22c55e" : "var(--accent)",
              color: "#000",
            }}
          >
            {added ? <Check size={13} /> : <ShoppingBag size={13} />}
            {added ? "Added!" : "Add to Cart"}
          </button>
          <button
            className="w-10 h-10 border border-white/40 hover:border-white text-white flex items-center justify-center transition-colors"
          >
            <Heart size={14} />
          </button>
        </div>

        {/* Badge */}
        {isNew && (
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
            {category}
          </p>
          <Link href={`/product/${id}`}>
            <h3
              className="text-sm font-medium font-['DM_Sans'] transition-colors hover:opacity-70"
              style={{ color: "var(--text-primary)" }}
            >
              {name}
            </h3>
          </Link>
        </div>
        <span
          className="font-bold font-['Playfair_Display'] text-sm"
          style={{ color: "var(--accent)" }}
        >
          ₦{price.toLocaleString()}
        </span>
      </div>
    </div>
  );
}