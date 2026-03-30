"use client";

import { Fragment, useState } from "react";
import React from "react";
import { Search, ChevronDown, ChevronUp } from "lucide-react";

const ORDERS = [
  { id: "#ORD-084", customer: "Ade Bello", email: "ade@gmail.com", product: "Leather Jacket", amount: 299.99, status: "Delivered", date: "Mar 20, 2025", qty: 1 },
  { id: "#ORD-083", customer: "Chioma Obi", email: "chioma@gmail.com", product: "Linen Shirt", amount: 79.99, status: "Processing", date: "Mar 21, 2025", qty: 2 },
  { id: "#ORD-082", customer: "Tunde Alabi", email: "tunde@gmail.com", product: "Cargo Pants", amount: 129.99, status: "Shipped", date: "Mar 22, 2025", qty: 1 },
  { id: "#ORD-081", customer: "Ngozi Eze", email: "ngozi@gmail.com", product: "Oversized Tee", amount: 49.99, status: "Pending", date: "Mar 23, 2025", qty: 3 },
  { id: "#ORD-080", customer: "Emeka Nwosu", email: "emeka@gmail.com", product: "Wool Overcoat", amount: 349.99, status: "Delivered", date: "Mar 24, 2025", qty: 1 },
  { id: "#ORD-079", customer: "Funmi Adeleke", email: "funmi@gmail.com", product: "Canvas Tote Bag", amount: 59.99, status: "Failed", date: "Mar 25, 2025", qty: 1 },
];

const STATUS_STYLES: Record<string, { bg: string; color: string }> = {
  Delivered:  { bg: "color-mix(in srgb, #22c55e 12%, transparent)", color: "#22c55e" },
  Shipped:    { bg: "color-mix(in srgb, #3b82f6 12%, transparent)", color: "#3b82f6" },
  Processing: { bg: "color-mix(in srgb, var(--accent) 12%, transparent)", color: "var(--accent)" },
  Pending:    { bg: "color-mix(in srgb, #f59e0b 12%, transparent)", color: "#f59e0b" },
  Failed:     { bg: "color-mix(in srgb, #ef4444 12%, transparent)", color: "#ef4444" },
};

const ALL_STATUSES = ["All", "Pending", "Processing", "Shipped", "Delivered", "Failed"];

export default function AdminOrdersPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [orders, setOrders] = useState(ORDERS);

  const filtered = orders.filter((o) => {
    const matchSearch = o.customer.toLowerCase().includes(search.toLowerCase()) || o.id.includes(search);
    const matchFilter = filter === "All" || o.status === filter;
    return matchSearch && matchFilter;
  });

  const updateStatus = (id: string, status: string) => {
    setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status } : o));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black font-['Playfair_Display']" style={{ color: "var(--text-primary)" }}>Orders</h2>
        <p className="text-sm font-['DM_Sans'] mt-0.5" style={{ color: "var(--text-muted)" }}>{orders.length} total orders</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {ALL_STATUSES.map((s) => (
          <button key={s} onClick={() => setFilter(s)}
            className="px-4 py-1.5 text-xs font-bold tracking-widest uppercase font-['DM_Sans'] border transition-all"
            style={{ backgroundColor: filter === s ? "var(--accent)" : "transparent", borderColor: filter === s ? "var(--accent)" : "var(--border)", color: filter === s ? "#000" : "var(--text-secondary)" }}>
            {s}
          </button>
        ))}
      </div>

      <div className="border" style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border)" }}>
        {/* Search */}
        <div className="px-6 py-4 border-b flex items-center gap-3" style={{ borderColor: "var(--border)" }}>
          <Search size={14} style={{ color: "var(--text-muted)" }} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by order ID or customer..."
            className="flex-1 text-sm font-['DM_Sans'] outline-none bg-transparent" style={{ color: "var(--text-primary)" }} />
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                {["Order ID", "Customer", "Product", "Amount", "Status", "Date", ""].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-[10px] tracking-[0.2em] uppercase font-bold font-['DM_Sans']" style={{ color: "var(--text-muted)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((order, i) => {
                const expanded = expandedId === order.id;
                return (
                  <Fragment key={order.id}>
                    <tr  style={{ borderBottom: "1px solid var(--border)" }}>
                      <td className="px-5 py-4"><span className="text-xs font-bold font-['DM_Sans']" style={{ color: "var(--accent)" }}>{order.id}</span></td>
                      <td className="px-5 py-4">
                        <p className="text-sm font-medium font-['DM_Sans']" style={{ color: "var(--text-primary)" }}>{order.customer}</p>
                        <p className="text-[11px] font-['DM_Sans']" style={{ color: "var(--text-muted)" }}>{order.email}</p>
                      </td>
                      <td className="px-5 py-4"><span className="text-sm font-['DM_Sans']" style={{ color: "var(--text-secondary)" }}>{order.product}</span></td>
                      <td className="px-5 py-4"><span className="font-bold font-['DM_Sans'] text-sm" style={{ color: "var(--text-primary)" }}>${order.amount}</span></td>
                      <td className="px-5 py-4">
                        <select value={order.status} onChange={(e) => updateStatus(order.id, e.target.value)}
                          className="text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 font-['DM_Sans'] border-0 outline-none cursor-pointer"
                          style={STATUS_STYLES[order.status]}>
                          {Object.keys(STATUS_STYLES).map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </td>
                      <td className="px-5 py-4"><span className="text-xs font-['DM_Sans']" style={{ color: "var(--text-muted)" }}>{order.date}</span></td>
                      <td className="px-5 py-4">
                        <button onClick={() => setExpandedId(expanded ? null : order.id)} style={{ color: "var(--text-muted)" }}>
                          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </button>
                      </td>
                    </tr>
                    {expanded && (
                      <tr key={`${order.id}-expanded`} style={{ borderBottom: "1px solid var(--border)" }}>
                        <td colSpan={7} className="px-5 py-4" style={{ backgroundColor: "color-mix(in srgb, var(--accent) 3%, transparent)" }}>
                          <div className="flex flex-wrap gap-8 text-sm font-['DM_Sans']">
                            <div><p className="text-[10px] tracking-widest uppercase font-bold mb-1" style={{ color: "var(--text-muted)" }}>Quantity</p><p style={{ color: "var(--text-primary)" }}>{order.qty}</p></div>
                            <div><p className="text-[10px] tracking-widest uppercase font-bold mb-1" style={{ color: "var(--text-muted)" }}>Unit Price</p><p style={{ color: "var(--text-primary)" }}>${(order.amount / order.qty).toFixed(2)}</p></div>
                            <div><p className="text-[10px] tracking-widest uppercase font-bold mb-1" style={{ color: "var(--text-muted)" }}>Total</p><p className="font-bold" style={{ color: "var(--accent)" }}>${order.amount}</p></div>
                            <div><p className="text-[10px] tracking-widest uppercase font-bold mb-1" style={{ color: "var(--text-muted)" }}>Email</p><p style={{ color: "var(--text-primary)" }}>{order.email}</p></div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}