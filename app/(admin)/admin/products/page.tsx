"use client";

import { useState } from "react";
import Link from "next/link";
// import ConfirmModal from "@/src/components/admin/ConfirmModal";
import { Plus, Search, Edit2, Trash2 } from "lucide-react";
import ConfirmModal from "@/src/components/admindashboard/ConfirmModal";

const PRODUCTS = [
  { id: "1", name: "Minimalist Leather Jacket", category: "Outerwear", price: 299.99, stock: 6, image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=80&q=80", isNew: true },
  { id: "2", name: "Linen Blend Shirt", category: "Tops", price: 79.99, stock: 24, image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=80&q=80", isNew: false },
  { id: "3", name: "Tailored Cargo Pants", category: "Bottoms", price: 129.99, stock: 12, image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=80&q=80", isNew: false },
  { id: "4", name: "Wool Overcoat", category: "Outerwear", price: 349.99, stock: 3, image: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=80&q=80", isNew: true },
  { id: "5", name: "Canvas Tote Bag", category: "Accessories", price: 59.99, stock: 40, image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=80&q=80", isNew: false },
];

export default function AdminProductsPage() {
  const [products, setProducts] = useState(PRODUCTS);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = () => {
    setProducts((prev) => prev.filter((p) => p.id !== deleteId));
    setDeleteId(null);
  };

  return (
    <div className="space-y-6">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black font-['Playfair_Display']" style={{ color: "var(--text-primary)" }}>Products</h2>
          <p className="text-sm font-['DM_Sans'] mt-0.5" style={{ color: "var(--text-muted)" }}>{products.length} total products</p>
        </div>
        <Link href="/admin/products/new"
          className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold tracking-widest uppercase font-['DM_Sans'] hover:opacity-80 transition-opacity"
          style={{ backgroundColor: "var(--accent)", color: "#000" }}>
          <Plus size={13} /> Add Product
        </Link>
      </div>

      {/* Table card */}
      <div className="border" style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border)" }}>
        {/* Search */}
        <div className="px-6 py-4 border-b flex items-center gap-3" style={{ borderColor: "var(--border)" }}>
          <Search size={14} style={{ color: "var(--text-muted)" }} />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="flex-1 text-sm font-['DM_Sans'] outline-none bg-transparent"
            style={{ color: "var(--text-primary)" }} />
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                {["Product", "Category", "Price", "Stock", "Status", "Actions"].map((h) => (
                  <th key={h} className="px-6 py-3 text-left text-[10px] tracking-[0.2em] uppercase font-bold font-['DM_Sans']" style={{ color: "var(--text-muted)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((product, i) => (
                <tr key={product.id} style={{ borderBottom: i < filtered.length - 1 ? "1px solid var(--border)" : "none" }}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={product.image} alt={product.name} className="w-10 h-12 object-cover flex-shrink-0" />
                      <span className="text-sm font-medium font-['DM_Sans']" style={{ color: "var(--text-primary)" }}>{product.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-['DM_Sans']" style={{ color: "var(--text-secondary)" }}>{product.category}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-bold font-['DM_Sans'] text-sm" style={{ color: "var(--accent)" }}>${product.price}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-['DM_Sans']" style={{ color: product.stock < 5 ? "#ef4444" : "var(--text-primary)" }}>
                      {product.stock} {product.stock < 5 && <span className="text-[10px]">(Low)</span>}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 font-['DM_Sans']"
                      style={product.isNew
                        ? { backgroundColor: "color-mix(in srgb, var(--accent) 15%, transparent)", color: "var(--accent)" }
                        : { backgroundColor: "color-mix(in srgb, #22c55e 12%, transparent)", color: "#22c55e" }}>
                      {product.isNew ? "New" : "Active"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/products/${product.id}/edit`}
                        className="w-8 h-8 flex items-center justify-center border hover:opacity-70 transition-opacity"
                        style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}>
                        <Edit2 size={13} />
                      </Link>
                      <button onClick={() => setDeleteId(product.id)}
                        className="w-8 h-8 flex items-center justify-center border hover:opacity-70 transition-opacity"
                        style={{ borderColor: "rgba(239,68,68,0.3)", color: "#ef4444" }}>
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Product"
        message="This will permanently remove this product. This action cannot be undone."
      />
    </div>
  );
}