"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

const CATEGORIES = [
  {
    name: "Tops",
    count: 42,
    image: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800&q=80",
    href: "/categories/tops",
    span: "col-span-2 row-span-2",
  },
  {
    name: "Outerwear",
    count: 18,
    image: "https://images.unsplash.com/photo-1548883354-94bcfe321cbb?w=800&q=80",
    href: "/categories/outerwear",
    span: "col-span-1 row-span-1",
  },
  {
    name: "Bottoms",
    count: 31,
    image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&q=80",
    href: "/categories/bottoms",
    span: "col-span-1 row-span-1",
  },
  {
    name: "Accessories",
    count: 56,
    image: "https://images.unsplash.com/photo-1523779917675-b6ed3a42a561?w=800&q=80",
    href: "/categories/accessories",
    span: "col-span-2 row-span-1",
  },
];

export default function CategoryPreview() {
  return (
    <section
      className="py-20 px-6 lg:px-10"
      style={{ backgroundColor: "var(--bg-secondary)" }}
    >
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-14">
          <p
            className="text-xs tracking-[0.3em] uppercase mb-3 font-['DM_Sans']"
            style={{ color: "var(--accent)" }}
          >
            Browse By
          </p>
          <h2
            className="text-4xl md:text-5xl font-black font-['Playfair_Display']"
            style={{ color: "var(--text-primary)" }}
          >
            Categories
          </h2>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 grid-rows-3 gap-3 md:gap-4 h-[500px] md:h-[600px]">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.name}
              href={cat.href}
              className={`group relative overflow-hidden ${cat.span}`}
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {/* Gradient overlay — same in both themes since images need contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              {/* Light mode: add a subtle top tint for better contrast */}
              <div className="absolute inset-0 bg-black/10 dark:bg-transparent" />

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <p className="text-white/60 text-[10px] tracking-widest uppercase mb-1 font-['DM_Sans']">
                  {cat.count} items
                </p>
                <div className="flex items-center justify-between">
                  <h3 className="text-white font-bold font-['Playfair_Display'] text-lg md:text-xl">
                    {cat.name}
                  </h3>
                  <ArrowRight
                    size={16}
                    className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300"
                    style={{ color: "var(--accent)" }}
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}