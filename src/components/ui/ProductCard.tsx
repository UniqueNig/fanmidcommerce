"use client";

import Link from "next/link";
import { ShoppingBag, Heart } from "lucide-react";

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
  return (
    <div className="group relative">
      {/* Image container */}
      <div className="relative overflow-hidden bg-[#111] aspect-[3/4] mb-4">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Overlay actions */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6 gap-3">
          <button className="flex items-center gap-2 bg-[#c8a96e] hover:bg-[#e8c98e] text-black px-5 py-2.5 text-xs font-bold tracking-widest uppercase transition-colors font-['DM_Sans']">
            <ShoppingBag size={13} />
            Add to Cart
          </button>
          <button className="w-10 h-10 border border-white/40 hover:border-white var(--text-primary) flex items-center justify-center transition-colors">
            <Heart size={14} />
          </button>
        </div>

        {/* Badge */}
        {isNew && (
          <div className="absolute top-3 left-3 bg-[#c8a96e] text-black text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 font-['DM_Sans']">
            New
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex items-start justify-between">
        <div>
          <p className="var(--text-primary)/40 text-[10px] tracking-widest uppercase mb-1 font-['DM_Sans']">
            {category}
          </p>
          <Link href={`/product/${id}`}>
            <h3 className="var(--text-primary) font-medium hover:text-[#c8a96e] transition-colors font-['DM_Sans'] text-sm">
              {name}
            </h3>
          </Link>
        </div>
        <span className="text-[#c8a96e] font-bold font-['Playfair_Display'] text-sm">
          ${price.toFixed(2)}
        </span>
      </div>
    </div>
  );
}