"use client";

import Footer from "@/src/components/layout/Footer";
import Navbar from "@/src/components/layout/Navbar";
import ShopGrid from "@/src/components/shop/ShopGrid";
import ShopHeader from "@/src/components/shop/ShopHeader";
import ShopSidebar from "@/src/components/shop/ShopSidebar";
import { useState, useMemo } from "react";
// import Navbar from "@/src/components/layout/Navbar";
// import Footer from "@/src/components/layout/Footer";
// import ShopSidebar from "@/src/components/shop/ShopSidebar";
// import ShopGrid from "@/src/components/shop/ShopGrid";
// import ShopHeader from "@/src/components/shop/ShopHeader";

// Placeholder data — replace with useQuery(GET_PRODUCTS) later
const ALL_PRODUCTS = [
  { id: "1", name: "Classic Oversized Tee", price: 49.99, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80", category: "tops", isNew: true },
  { id: "2", name: "Tailored Cargo Pants", price: 129.99, image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=80", category: "bottoms", isNew: false },
  { id: "3", name: "Minimalist Leather Jacket", price: 299.99, image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80", category: "outerwear", isNew: true },
  { id: "4", name: "Linen Blend Shirt", price: 79.99, image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&q=80", category: "tops", isNew: false },
  { id: "5", name: "Wool Overcoat", price: 349.99, image: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=600&q=80", category: "outerwear", isNew: false },
  { id: "6", name: "Slim Fit Chinos", price: 89.99, image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&q=80", category: "bottoms", isNew: true },
  { id: "7", name: "Leather Belt", price: 39.99, image: "https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=600&q=80", category: "accessories", isNew: false },
  { id: "8", name: "Canvas Tote Bag", price: 59.99, image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&q=80", category: "accessories", isNew: true },
  { id: "9", name: "Striped Long Sleeve", price: 64.99, image: "https://images.unsplash.com/photo-1603251578711-3290595bc3a7?w=600&q=80", category: "tops", isNew: false },
  { id: "10", name: "Relaxed Joggers", price: 74.99, image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&q=80", category: "bottoms", isNew: false },
  { id: "11", name: "Puffer Vest", price: 119.99, image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&q=80", category: "outerwear", isNew: true },
  { id: "12", name: "Woven Sunhat", price: 44.99, image: "https://images.unsplash.com/photo-1521369909029-2afed882baee?w=600&q=80", category: "accessories", isNew: false },
];

const PRODUCTS_PER_PAGE = 8;

export default function ShopPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
    setCurrentPage(1);
  };

  // Filter
  const filtered = useMemo(() => {
    let result = ALL_PRODUCTS.filter((p) => {
      const catMatch = selectedCategory === "all" || p.category === selectedCategory;
      const priceMatch = p.price >= priceRange[0] && p.price <= priceRange[1];
      return catMatch && priceMatch;
    });

    // Sort
    switch (sortBy) {
      case "price-asc": result = [...result].sort((a, b) => a.price - b.price); break;
      case "price-desc": result = [...result].sort((a, b) => b.price - a.price); break;
      case "newest": result = [...result].sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0)); break;
      default: break;
    }

    return result;
  }, [selectedCategory, priceRange, sortBy]);

  // Paginate
  const totalPages = Math.max(1, Math.ceil(filtered.length / PRODUCTS_PER_PAGE));
  const paginated = filtered.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
  };

  const handlePriceChange = (range: [number, number]) => {
    setPriceRange(range);
    setCurrentPage(1);
  };

  return (
    <main style={{ backgroundColor: "var(--bg-primary)", minHeight: "100vh" }}>
      <Navbar />

      {/* Page hero */}
      <div
        className="pt-32 pb-10 px-6 lg:px-10 border-b"
        style={{ borderColor: "var(--border)" }}
      >
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <p
            className="text-xs tracking-widest uppercase mb-3 font-['DM_Sans']"
            style={{ color: "var(--text-muted)" }}
          >
            Home / Shop
          </p>
          <h1
            className="text-5xl md:text-6xl font-black font-['Playfair_Display']"
            style={{ color: "var(--text-primary)" }}
          >
            All Products
          </h1>
        </div>
      </div>

      {/* Main layout */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10">
        <div className="flex gap-10">

          {/* Sidebar */}
          <ShopSidebar
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            selectedCategory={selectedCategory}
            setSelectedCategory={handleCategoryChange}
            priceRange={priceRange}
            setPriceRange={handlePriceChange}
            selectedSizes={selectedSizes}
            toggleSize={toggleSize}
          />

          {/* Content */}
          <div className="flex-1 min-w-0">
            <ShopHeader
              totalProducts={filtered.length}
              view={view}
              setView={setView}
              sortBy={sortBy}
              setSortBy={setSortBy}
              sidebarOpen={sidebarOpen}
              setSidebarOpen={setSidebarOpen}
            />
            <ShopGrid
              products={paginated}
              view={view}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}