import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { getAllCategories } from "@/src/lib/data/categories";

// Bento layout pattern applied to the first few real categories.
const SPANS = [
  "col-span-2 row-span-2",
  "col-span-1 row-span-1",
  "col-span-1 row-span-1",
  "col-span-2 row-span-1",
];

export default async function CategoryPreview() {
  const all = await getAllCategories();
  const categories = all.slice(0, 4);

  // Nothing to show yet — skip the section entirely.
  if (categories.length === 0) return null;

  return (
    <section
      className="py-20 px-6 lg:px-10"
      style={{ backgroundColor: "var(--bg-secondary)" }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-14 flex items-end justify-between">
          <div>
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
          <Link
            href="/categories"
            className="hidden md:flex items-center gap-2 text-sm tracking-widest uppercase font-['DM_Sans'] group"
            style={{ color: "var(--text-secondary)" }}
          >
            View All
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 grid-rows-3 gap-3 md:gap-4 h-[500px] md:h-[600px]">
          {categories.map((cat, i) => (
            <Link
              key={cat.slug}
              href={`/categories/${cat.slug}`}
              className={`group relative overflow-hidden ${SPANS[i] ?? "col-span-1 row-span-1"}`}
              style={{ backgroundColor: "var(--card-bg)" }}
            >
              {cat.image ? (
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="absolute inset-0" style={{ backgroundColor: "var(--bg-secondary)" }} />
              )}

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute inset-0 bg-black/10 dark:bg-transparent" />

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <p className="text-white/60 text-[10px] tracking-widest uppercase mb-1 font-['DM_Sans']">
                  {cat.productCount} {cat.productCount === 1 ? "item" : "items"}
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
