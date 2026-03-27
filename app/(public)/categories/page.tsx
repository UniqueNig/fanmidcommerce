import Link from "next/link";
import Navbar from "@/src/components/layout/Navbar";
import Footer from "@/src/components/layout/Footer";
import { ArrowRight } from "lucide-react";

const CATEGORIES = [
  { name: "Tops", slug: "tops", count: 42, desc: "T-shirts, shirts, blouses and more", image: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800&q=80" },
  { name: "Bottoms", slug: "bottoms", count: 31, desc: "Trousers, jeans, shorts and skirts", image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&q=80" },
  { name: "Outerwear", slug: "outerwear", count: 18, desc: "Jackets, coats and layering pieces", image: "https://images.unsplash.com/photo-1548883354-94bcfe321cbb?w=800&q=80" },
  { name: "Accessories", slug: "accessories", count: 56, desc: "Bags, belts, hats and jewelry", image: "https://images.unsplash.com/photo-1523779917675-b6ed3a42a561?w=800&q=80" },
  { name: "Footwear", slug: "footwear", count: 24, desc: "Sneakers, boots and formal shoes", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80" },
  { name: "Activewear", slug: "activewear", count: 19, desc: "Performance and athleisure pieces", image: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&q=80" },
];

export default function CategoriesPage() {
  return (
    <main style={{ backgroundColor: "var(--bg-primary)", minHeight: "100vh" }}>
      <Navbar />

      {/* Hero */}
      <div className="pt-36 pb-12 px-6 lg:px-10 border-b" style={{ borderColor: "var(--border)" }}>
        <div className="max-w-7xl mx-auto">
          <p className="text-xs tracking-[0.3em] uppercase font-['DM_Sans'] mb-3" style={{ color: "var(--accent)" }}>Browse By</p>
          <h1 className="text-5xl md:text-6xl font-black font-['Playfair_Display']" style={{ color: "var(--text-primary)" }}>Categories</h1>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORIES.map((cat) => (
            <Link key={cat.slug} href={`/categories/${cat.slug}`} className="group relative overflow-hidden aspect-[4/3] block">
              <img src={cat.image} alt={cat.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <p className="text-white/60 text-[10px] tracking-widest uppercase font-['DM_Sans'] mb-1">{cat.count} products</p>
                <div className="flex items-end justify-between">
                  <div>
                    <h2 className="text-white text-2xl font-black font-['Playfair_Display']">{cat.name}</h2>
                    <p className="text-white/60 text-xs font-['DM_Sans'] mt-1">{cat.desc}</p>
                  </div>
                  <ArrowRight size={18} className="text-white opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300 flex-shrink-0 mb-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <Footer />
    </main>
  );
}