"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2, Check, X } from "lucide-react";
import ConfirmModal from "@/src/components/admindashboard/ConfirmModal";

type Category = { id: string; name: string; slug: string; productCount: number; description: string };

const INITIAL: Category[] = [
  { id: "1", name: "Tops", slug: "tops", productCount: 42, description: "T-shirts, shirts, blouses and more" },
  { id: "2", name: "Bottoms", slug: "bottoms", productCount: 31, description: "Trousers, jeans, shorts and skirts" },
  { id: "3", name: "Outerwear", slug: "outerwear", productCount: 18, description: "Jackets, coats and layering pieces" },
  { id: "4", name: "Accessories", slug: "accessories", productCount: 56, description: "Bags, belts, hats and jewelry" },
  { id: "5", name: "Footwear", slug: "footwear", productCount: 24, description: "Sneakers, boots and formal shoes" },
];

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>(INITIAL);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");

  const startEdit = (cat: Category) => { setEditId(cat.id); setEditName(cat.name); setEditDesc(cat.description); };
  const saveEdit = () => {
    setCategories((p) => p.map((c) => c.id === editId ? { ...c, name: editName, description: editDesc, slug: editName.toLowerCase().replace(/\s+/g, "-") } : c));
    setEditId(null);
  };

  const addCategory = () => {
    if (!newName.trim()) return;
    const id = Date.now().toString();
    setCategories((p) => [...p, { id, name: newName, slug: newName.toLowerCase().replace(/\s+/g, "-"), productCount: 0, description: newDesc }]);
    setNewName(""); setNewDesc(""); setAdding(false);
  };

  const inputClass = "px-3 py-2 text-sm font-['DM_Sans'] outline-none border transition-all";
  const inputStyle = { backgroundColor: "var(--bg-primary)", borderColor: "var(--border)", color: "var(--text-primary)" };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black font-['Playfair_Display']" style={{ color: "var(--text-primary)" }}>Categories</h2>
          <p className="text-sm font-['DM_Sans'] mt-0.5" style={{ color: "var(--text-muted)" }}>{categories.length} categories</p>
        </div>
        <button onClick={() => setAdding(true)}
          className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold tracking-widest uppercase font-['DM_Sans'] hover:opacity-80 transition-opacity"
          style={{ backgroundColor: "var(--accent)", color: "#000" }}>
          <Plus size={13} /> Add Category
        </button>
      </div>

      {/* Add form */}
      {adding && (
        <div className="border p-5 space-y-4" style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--accent)" }}>
          <h3 className="text-xs tracking-[0.2em] uppercase font-bold font-['DM_Sans']" style={{ color: "var(--accent)" }}>New Category</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] tracking-widest uppercase font-bold block mb-1 font-['DM_Sans']" style={{ color: "var(--text-muted)" }}>Name *</label>
              <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="e.g. Swimwear" className={`w-full ${inputClass}`} style={inputStyle} />
            </div>
            <div>
              <label className="text-[10px] tracking-widest uppercase font-bold block mb-1 font-['DM_Sans']" style={{ color: "var(--text-muted)" }}>Description</label>
              <input value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="Short description..." className={`w-full ${inputClass}`} style={inputStyle} />
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={addCategory} className="flex items-center gap-2 px-5 py-2 text-xs font-bold tracking-widest uppercase font-['DM_Sans'] hover:opacity-80"
              style={{ backgroundColor: "var(--accent)", color: "#000" }}><Check size={12} /> Save</button>
            <button onClick={() => { setAdding(false); setNewName(""); setNewDesc(""); }}
              className="flex items-center gap-2 px-5 py-2 text-xs font-bold tracking-widest uppercase font-['DM_Sans'] border hover:opacity-70"
              style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}><X size={12} /> Cancel</button>
          </div>
        </div>
      )}

      {/* Categories list */}
      <div className="border divide-y" style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border)" }}>
        {categories.map((cat) => (
          <div key={cat.id} className="px-6 py-4">
            {editId === cat.id ? (
              <div className="flex items-center gap-3">
                <input value={editName} onChange={(e) => setEditName(e.target.value)} className={`flex-1 ${inputClass}`} style={inputStyle} />
                <input value={editDesc} onChange={(e) => setEditDesc(e.target.value)} placeholder="Description..." className={`flex-1 ${inputClass}`} style={inputStyle} />
                <button onClick={saveEdit} className="w-8 h-8 flex items-center justify-center" style={{ backgroundColor: "var(--accent)", color: "#000" }}><Check size={13} /></button>
                <button onClick={() => setEditId(null)} className="w-8 h-8 flex items-center justify-center border" style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}><X size={13} /></button>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-0.5">
                    <h3 className="font-bold font-['DM_Sans']" style={{ color: "var(--text-primary)" }}>{cat.name}</h3>
                    <span className="text-[10px] font-['DM_Sans'] px-2 py-0.5 font-bold" style={{ backgroundColor: "color-mix(in srgb, var(--accent) 12%, transparent)", color: "var(--accent)" }}>
                      {cat.productCount} products
                    </span>
                  </div>
                  <p className="text-xs font-['DM_Sans']" style={{ color: "var(--text-muted)" }}>{cat.description}</p>
                  <p className="text-[10px] font-['DM_Sans'] mt-0.5" style={{ color: "var(--text-muted)" }}>slug: /{cat.slug}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => startEdit(cat)} className="w-8 h-8 flex items-center justify-center border hover:opacity-70 transition-opacity"
                    style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}><Edit2 size={13} /></button>
                  <button onClick={() => setDeleteId(cat.id)} className="w-8 h-8 flex items-center justify-center border hover:opacity-70 transition-opacity"
                    style={{ borderColor: "rgba(239,68,68,0.3)", color: "#ef4444" }}><Trash2 size={13} /></button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <ConfirmModal isOpen={!!deleteId} onClose={() => setDeleteId(null)}
        onConfirm={() => { setCategories((p) => p.filter((c) => c.id !== deleteId)); setDeleteId(null); }}
        title="Delete Category" message="All products in this category will become uncategorized. This cannot be undone." />
    </div>
  );
}