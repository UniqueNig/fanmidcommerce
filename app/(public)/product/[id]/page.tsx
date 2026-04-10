"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import Navbar from "@/src/components/layout/Navbar";
import Footer from "@/src/components/layout/Footer";
import ProductImageGallery from "@/src/components/product/ProductImageGallery";
import ProductInfo from "@/src/components/product/ProductInfo";
import { useQuery } from "@apollo/client/react";
import gql from "graphql-tag";
import { use } from "react";
import { Loader2, AlertCircle } from "lucide-react";

const GET_PRODUCT = gql`
  query GetProduct($id: ID!) {
    product(id: $id) {
      id
      name
      description
      price
      image
      stock
      category {
        id
        name
        slug
      }
      isNew
    }
  }
`;

interface ProductData {
  product: {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    stock: number;
    category: { id: string; name: string; slug: string } | null;
    isNew: boolean | null;
  };
}

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const { data, loading, error } = useQuery<ProductData>(GET_PRODUCT, {
    variables: { id },
    skip: !id,
  });

  if (loading) {
    return (
      <main style={{ backgroundColor: "var(--bg-primary)", minHeight: "100vh" }}>
        <Navbar />
        <div className="flex items-center justify-center py-40 gap-3">
          <Loader2 size={20} className="animate-spin" style={{ color: "var(--accent)" }} />
          <span className="text-sm font-['DM_Sans']" style={{ color: "var(--text-muted)" }}>
            Loading product...
          </span>
        </div>
        <Footer />
      </main>
    );
  }

  if (error || !data?.product) {
    return (
      <main style={{ backgroundColor: "var(--bg-primary)", minHeight: "100vh" }}>
        <Navbar />
        <div className="flex flex-col items-center justify-center py-40 gap-4">
          <AlertCircle size={32} style={{ color: "#ef4444" }} />
          <p className="text-sm font-['DM_Sans']" style={{ color: "#ef4444" }}>
            {error ? error.message : "Product not found."}
          </p>
          <Link
            href="/shop"
            className="text-xs tracking-widest uppercase font-['DM_Sans'] border px-5 py-2.5 hover:opacity-70"
            style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}
          >
            Back to Shop
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  const product = data.product;

  return (
    <main style={{ backgroundColor: "var(--bg-primary)", minHeight: "100vh" }}>
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-32 pb-20">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 mb-10">
          {[
            { label: "Home", href: "/" },
            { label: "Shop", href: "/shop" },
            {
              label: product.category?.name ?? "Uncategorized",
              href: product.category ? `/shop?category=${product.category.slug}` : "/shop",
            },
            { label: product.name, href: null },
          ].map((crumb, i, arr) => (
            <span key={crumb.label} className="flex items-center gap-2">
              {crumb.href ? (
                <Link
                  href={crumb.href}
                  className="text-xs tracking-widest uppercase font-['DM_Sans'] transition-colors hover:opacity-70"
                  style={{ color: "var(--text-muted)" }}
                >
                  {crumb.label}
                </Link>
              ) : (
                <span
                  className="text-xs tracking-widest uppercase font-['DM_Sans']"
                  style={{ color: "var(--text-primary)" }}
                >
                  {crumb.label}
                </span>
              )}
              {i < arr.length - 1 && (
                <ChevronRight size={12} style={{ color: "var(--text-muted)" }} />
              )}
            </span>
          ))}
        </nav>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16">
          {/* Left — image gallery */}
          <div className="w-full">
            <ProductImageGallery
              images={product.image ? [product.image] : []}
              productName={product.name}
            />
          </div>

          {/* Right — product info */}
          <div className="w-full lg:sticky lg:top-28 lg:self-start">
            <ProductInfo
              id={product.id}
              name={product.name}
              price={product.price}
              description={product.description}
              category={product.category?.name ?? "Uncategorized"}
              isNew={product.isNew ?? false}
              inStock={product.stock > 0}
              stockCount={product.stock}
              sizes={["XS", "S", "M", "L", "XL"]}  // replace with real sizes when you add that field
              whatsappNumber="2348134879924"          // replace with your real number
            />
          </div>
        </div>

        {/* Product details */}
        <div
          className="mt-20 pt-10 border-t grid grid-cols-1 md:grid-cols-3 gap-10"
          style={{ borderColor: "var(--border)" }}
        >
          {[
            { title: "Materials", content: product.description },
            { title: "Sizing & Fit", content: "True to size. Refer to size guide for best fit." },
            { title: "Care Instructions", content: "Refer to garment label for care instructions." },
          ].map((item) => (
            <div key={item.title}>
              <h4
                className="text-xs tracking-[0.25em] uppercase font-bold mb-3 font-['DM_Sans']"
                style={{ color: "var(--text-muted)" }}
              >
                {item.title}
              </h4>
              <p
                className="text-sm leading-relaxed font-['DM_Sans']"
                style={{ color: "var(--text-secondary)" }}
              >
                {item.content}
              </p>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </main>
  );
}