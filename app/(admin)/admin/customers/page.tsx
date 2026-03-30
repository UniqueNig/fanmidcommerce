"use client";

import { useState } from "react";
import { Search, Trash2, Eye } from "lucide-react";
import ConfirmModal from "@/src/components/admindashboard/ConfirmModal";

const CUSTOMERS = [
  { id: "1", name: "Ade Bello", email: "ade@gmail.com", orders: 5, spent: 849.95, joined: "Jan 12, 2025", status: "Active" },
  { id: "2", name: "Chioma Obi", email: "chioma@gmail.com", orders: 2, spent: 209.98, joined: "Feb 3, 2025", status: "Active" },
  { id: "3", name: "Tunde Alabi", email: "tunde@gmail.com", orders: 8, spent: 1249.92, joined: "Dec 15, 2024", status: "Active" },
  { id: "4", name: "Ngozi Eze", email: "ngozi@gmail.com", orders: 1, spent: 49.99, joined: "Mar 20, 2025", status: "Active" },
  { id: "5", name: "Emeka Nwosu", email: "emeka@gmail.com", orders: 3, spent: 729.97, joined: "Nov 8, 2024", status: "Inactive" },
  { id: "6", name: "Funmi Adeleke", email: "funmi@gmail.com", orders: 4, spent: 319.96, joined: "Feb 14, 2025", status: "Active" },
];

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState(CUSTOMERS);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = customers.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black font-['Playfair_Display']" style={{ color: "var(--text-primary)" }}>Customers</h2>
        <p className="text-sm font-['DM_Sans'] mt-0.5" style={{ color: "var(--text-muted)" }}>{customers.length} registered customers</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Customers", value: customers.length },
          { label: "Active", value: customers.filter(c => c.status === "Active").length },
          { label: "Total Revenue", value: `$${customers.reduce((s, c) => s + c.spent, 0).toFixed(0)}` },
        ].map(({ label, value }) => (
          <div key={label} className="border p-5" style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border)" }}>
            <p className="text-[10px] tracking-[0.2em] uppercase font-bold font-['DM_Sans'] mb-2" style={{ color: "var(--text-muted)" }}>{label}</p>
            <p className="text-2xl font-black font-['Playfair_Display']" style={{ color: "var(--text-primary)" }}>{value}</p>
          </div>
        ))}
      </div>

      <div className="border" style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border)" }}>
        <div className="px-6 py-4 border-b flex items-center gap-3" style={{ borderColor: "var(--border)" }}>
          <Search size={14} style={{ color: "var(--text-muted)" }} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search customers..."
            className="flex-1 text-sm font-['DM_Sans'] outline-none bg-transparent" style={{ color: "var(--text-primary)" }} />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                {["Customer", "Orders", "Total Spent", "Joined", "Status", "Actions"].map((h) => (
                  <th key={h} className="px-6 py-3 text-left text-[10px] tracking-[0.2em] uppercase font-bold font-['DM_Sans']" style={{ color: "var(--text-muted)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((customer, i) => (
                <tr key={customer.id} style={{ borderBottom: i < filtered.length - 1 ? "1px solid var(--border)" : "none" }}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 flex items-center justify-center text-xs font-black font-['Playfair_Display'] flex-shrink-0"
                        style={{ backgroundColor: "color-mix(in srgb, var(--accent) 15%, transparent)", color: "var(--accent)" }}>
                        {customer.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium font-['DM_Sans']" style={{ color: "var(--text-primary)" }}>{customer.name}</p>
                        <p className="text-[11px] font-['DM_Sans']" style={{ color: "var(--text-muted)" }}>{customer.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4"><span className="text-sm font-['DM_Sans']" style={{ color: "var(--text-secondary)" }}>{customer.orders}</span></td>
                  <td className="px-6 py-4"><span className="font-bold font-['DM_Sans'] text-sm" style={{ color: "var(--accent)" }}>${customer.spent.toFixed(2)}</span></td>
                  <td className="px-6 py-4"><span className="text-xs font-['DM_Sans']" style={{ color: "var(--text-muted)" }}>{customer.joined}</span></td>
                  <td className="px-6 py-4">
                    <span className="text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 font-['DM_Sans']"
                      style={customer.status === "Active"
                        ? { backgroundColor: "color-mix(in srgb, #22c55e 12%, transparent)", color: "#22c55e" }
                        : { backgroundColor: "color-mix(in srgb, #6b7280 12%, transparent)", color: "#6b7280" }}>
                      {customer.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="w-8 h-8 flex items-center justify-center border hover:opacity-70 transition-opacity"
                        style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}>
                        <Eye size={13} />
                      </button>
                      <button onClick={() => setDeleteId(customer.id)}
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

      <ConfirmModal isOpen={!!deleteId} onClose={() => setDeleteId(null)}
        onConfirm={() => { setCustomers((p) => p.filter((c) => c.id !== deleteId)); setDeleteId(null); }}
        title="Remove Customer" message="This will permanently remove this customer and all their data." />
    </div>
  );
}