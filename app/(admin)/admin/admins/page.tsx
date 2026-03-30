"use client";

import { useState } from "react";
import { Plus, Trash2, Shield, User, X, Check, Loader2 } from "lucide-react";
import ConfirmModal from "@/src/components/admindashboard/ConfirmModal";

type Admin = { id: string; name: string; email: string; role: "superadmin" | "admin"; joined: string; status: "Active" | "Inactive" };

const INITIAL_ADMINS: Admin[] = [
  { id: "1", name: "Emmanuel Faniyi", email: "emmanuel@fanmid.com", role: "superadmin", joined: "Jan 1, 2025", status: "Active" },
  { id: "2", name: "Chioma Obi", email: "chioma@fanmid.com", role: "admin", joined: "Feb 10, 2025", status: "Active" },
];

export default function AdminAdminsPage() {
  const [admins, setAdmins] = useState<Admin[]>(INITIAL_ADMINS);
  const [showForm, setShowForm] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [newAdmin, setNewAdmin] = useState({ name: "", email: "", password: "", role: "admin" as "admin" | "superadmin" });

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    // TODO: wire up createAdmin mutation
    setTimeout(() => {
      setAdmins((p) => [...p, { id: Date.now().toString(), name: newAdmin.name, email: newAdmin.email, role: newAdmin.role, joined: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }), status: "Active" }]);
      setNewAdmin({ name: "", email: "", password: "", role: "admin" });
      setShowForm(false);
      setSaving(false);
    }, 1000);
  };

  const inputClass = "w-full px-4 py-3 text-sm font-['DM_Sans'] outline-none border transition-all";
  const inputStyle = { backgroundColor: "var(--bg-primary)", borderColor: "var(--border)", color: "var(--text-primary)" };
  const labelClass = "text-[10px] tracking-[0.2em] uppercase font-bold font-['DM_Sans'] block mb-1.5";

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black font-['Playfair_Display']" style={{ color: "var(--text-primary)" }}>Admin Users</h2>
          <p className="text-sm font-['DM_Sans'] mt-0.5" style={{ color: "var(--text-muted)" }}>{admins.length} administrators</p>
        </div>
        <button onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold tracking-widest uppercase font-['DM_Sans'] hover:opacity-80 transition-opacity"
          style={{ backgroundColor: "var(--accent)", color: "#000" }}>
          <Plus size={13} /> Add Admin
        </button>
      </div>

      {/* Add admin form */}
      {showForm && (
        <div className="border p-6 space-y-5" style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--accent)" }}>
          <div className="flex items-center justify-between">
            <h3 className="text-xs tracking-[0.2em] uppercase font-bold font-['DM_Sans']" style={{ color: "var(--accent)" }}>Add New Administrator</h3>
            <button onClick={() => setShowForm(false)} style={{ color: "var(--text-muted)" }}><X size={16} /></button>
          </div>
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass} style={{ color: "var(--text-muted)" }}>Full Name *</label>
                <input required value={newAdmin.name} onChange={(e) => setNewAdmin((p) => ({ ...p, name: e.target.value }))} className={inputClass} style={inputStyle} placeholder="John Doe" />
              </div>
              <div>
                <label className={labelClass} style={{ color: "var(--text-muted)" }}>Email *</label>
                <input required type="email" value={newAdmin.email} onChange={(e) => setNewAdmin((p) => ({ ...p, email: e.target.value }))} className={inputClass} style={inputStyle} placeholder="admin@fanmid.com" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass} style={{ color: "var(--text-muted)" }}>Password *</label>
                <input required type="password" value={newAdmin.password} onChange={(e) => setNewAdmin((p) => ({ ...p, password: e.target.value }))} className={inputClass} style={inputStyle} placeholder="Min. 8 characters" />
              </div>
              <div>
                <label className={labelClass} style={{ color: "var(--text-muted)" }}>Role</label>
                <select value={newAdmin.role} onChange={(e) => setNewAdmin((p) => ({ ...p, role: e.target.value as any }))} className={inputClass} style={inputStyle}>
                  <option value="admin">Admin</option>
                  <option value="superadmin">Super Admin</option>
                </select>
              </div>
            </div>

            {/* Permission info */}
            <div className="p-4 text-xs font-['DM_Sans'] space-y-1" style={{ backgroundColor: "color-mix(in srgb, var(--accent) 6%, transparent)", color: "var(--text-secondary)" }}>
              <p className="font-bold" style={{ color: "var(--accent)" }}>Permission levels:</p>
              <p>• <strong>Admin</strong> — Manage products, orders, customers and categories</p>
              <p>• <strong>Super Admin</strong> — Full access including managing other admins and settings</p>
            </div>

            <div className="flex gap-3">
              <button type="button" onClick={() => setShowForm(false)} className="px-6 py-3 text-xs font-bold tracking-widest uppercase font-['DM_Sans'] border hover:opacity-70"
                style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}>Cancel</button>
              <button type="submit" disabled={saving} className="flex items-center gap-2 px-6 py-3 text-xs font-bold tracking-widest uppercase font-['DM_Sans'] hover:opacity-80 disabled:opacity-50"
                style={{ backgroundColor: "var(--accent)", color: "#000" }}>
                {saving ? <><Loader2 size={12} className="animate-spin" /> Creating...</> : <><Check size={12} /> Create Admin</>}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Admins list */}
      <div className="border divide-y" style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border)" }}>
        {admins.map((admin) => (
          <div key={admin.id} className="px-6 py-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 flex items-center justify-center text-sm font-black font-['Playfair_Display'] flex-shrink-0"
                style={{ backgroundColor: admin.role === "superadmin" ? "var(--accent)" : "color-mix(in srgb, var(--accent) 15%, transparent)", color: admin.role === "superadmin" ? "#000" : "var(--accent)" }}>
                {admin.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold font-['DM_Sans']" style={{ color: "var(--text-primary)" }}>{admin.name}</p>
                  <span className="flex items-center gap-1 text-[9px] tracking-widest uppercase px-1.5 py-0.5 font-bold font-['DM_Sans']"
                    style={admin.role === "superadmin"
                      ? { backgroundColor: "color-mix(in srgb, var(--accent) 15%, transparent)", color: "var(--accent)" }
                      : { backgroundColor: "color-mix(in srgb, #3b82f6 12%, transparent)", color: "#3b82f6" }}>
                    {admin.role === "superadmin" ? <><Shield size={8} /> Super Admin</> : <><User size={8} /> Admin</>}
                  </span>
                </div>
                <p className="text-xs font-['DM_Sans']" style={{ color: "var(--text-muted)" }}>{admin.email}</p>
                <p className="text-[10px] font-['DM_Sans'] mt-0.5" style={{ color: "var(--text-muted)" }}>Joined {admin.joined}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 font-['DM_Sans']"
                style={{ backgroundColor: "color-mix(in srgb, #22c55e 12%, transparent)", color: "#22c55e" }}>
                {admin.status}
              </span>
              {admin.role !== "superadmin" && (
                <button onClick={() => setDeleteId(admin.id)} className="w-8 h-8 flex items-center justify-center border hover:opacity-70 transition-opacity"
                  style={{ borderColor: "rgba(239,68,68,0.3)", color: "#ef4444" }}><Trash2 size={13} /></button>
              )}
            </div>
          </div>
        ))}
      </div>

      <ConfirmModal isOpen={!!deleteId} onClose={() => setDeleteId(null)}
        onConfirm={() => { setAdmins((p) => p.filter((a) => a.id !== deleteId)); setDeleteId(null); }}
        title="Remove Admin" message="This administrator will lose all access to the admin panel immediately." />
    </div>
  );
}