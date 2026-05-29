"use client";

import Footer from "@/src/components/layout/Footer";
import Navbar from "@/src/components/layout/Navbar";
import ShopGrid from "@/src/components/shop/ShopGrid";
import ShopHeader from "@/src/components/shop/ShopHeader";
import ShopSidebar from "@/src/components/shop/ShopSidebar";
import { useQuery } from "@apollo/client/react"; // ✅ FIXED
import gql from "graphql-tag";
import { useState, useMemo } from "react";
import { AlertCircle } from "lucide-react";
import { ProductGridSkeleton } from "@/src/components/ui/Skeleton";

const GET_DATA = gql`
  query {
    products {
      id
      slug
      name
      price
      image
      isNew
      stock
      sizes
      category {
        id
        name
        slug
      }
    }
    categories {
      id
      name
      slug
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
  slug: string;
  name: string;
  price: number;
  image: string;
  category: Category;
  isNew: boolean;
  stock: number;
  sizes: string[];
}

interface Data {
  products: Product[];
  categories: Category[];
}

const PRODUCTS_PER_PAGE = 8;

export default function ShopPage() {
  const { data, loading, error } = useQuery<Data>(GET_DATA, {
    fetchPolicy: "cache-and-network", // show fresh stock on each visit
  });

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  // const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]);

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size],
    );
    setCurrentPage(1);
  };

  // ✅ FIXED
  const categories = data?.categories || [];

  const filtered = useMemo(() => {
    const products = data?.products || [];

    let result = products.filter((p) => {
      const catMatch =
        selectedCategory === "all" || p.category?.slug === selectedCategory;

      const priceMatch = p.price >= priceRange[0] && p.price <= priceRange[1];

      // Size filter: when sizes are selected, keep products that offer one.
      const sizeMatch =
        selectedSizes.length === 0 ||
        (p.sizes ?? []).some((s) => selectedSizes.includes(s));

      return catMatch && priceMatch && sizeMatch;
    });

    switch (sortBy) {
      case "price-asc":
        result = [...result].sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result = [...result].sort((a, b) => b.price - a.price);
        break;
      case "newest":
        result = [...result].sort(
          (a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0),
        );
        break;
    }

    return result;
  }, [data, selectedCategory, priceRange, sortBy, selectedSizes]);

  const totalPages = Math.max(
    1,
    Math.ceil(filtered.length / PRODUCTS_PER_PAGE),
  );

  const paginated = filtered.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE,
  );

  if (loading) {
    return (
      <main style={{ backgroundColor: "var(--bg-primary)", minHeight: "100vh" }}>
        <Navbar />
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10 pt-28">
          <ProductGridSkeleton count={8} />
        </div>
        <Footer />
      </main>
    );
  }

  if (error) {
    return (
      <main style={{ backgroundColor: "var(--bg-primary)", minHeight: "100vh" }}>
        <Navbar />
        <div className="flex flex-col items-center justify-center py-40 gap-4">
          <AlertCircle size={32} style={{ color: "#ef4444" }} />
          <p className="text-sm font-['DM_Sans']" style={{ color: "#ef4444" }}>
            Failed to load products. Please try again.
          </p>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main style={{ backgroundColor: "var(--bg-primary)", minHeight: "100vh" }}>
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10 pt-20">
        <div className="flex gap-10">
          <ShopSidebar
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            categories={categories} // ✅ FIXED
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            selectedSizes={selectedSizes}
            toggleSize={toggleSize}
          />

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
