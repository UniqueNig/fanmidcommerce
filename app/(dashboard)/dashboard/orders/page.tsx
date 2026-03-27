"use client";

import { useState } from "react";
import { Package, ChevronDown, ChevronUp } from "lucide-react";

const ALL_ORDERS = [
  { id: "#ORD-084", product: "Minimalist Leather Jacket", amount: 299.99, status: "Delivered", date: "Mar 20, 2025", qty: 1, image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=100&q=80" },
  { id: "#ORD-083", product: "Linen Blend Shirt", amount: 79.99, status: "Shipped", date: "Mar 18, 2025", qty: 2, image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=100&q=80" },
  { id: "#ORD-082", product: "Tailored Cargo Pants", amount: 129.99, status: "Pending", date: "Mar 15, 2025", qty: 1, image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=100&q=80" },
  { id: "#ORD-081", product: "Classic Oversized Tee", amount: 49.99, status: "Paid", date: "Mar 10, 2025", qty: 3, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100&q=80" },
  { id: "#ORD-080", product: "Wool Overcoat", amount: 349.99, status: "Failed", date: "Mar 5, 2025", qty: 1, image: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=100&q=80" },
  { id: "#ORD-079", product: "Canvas Tote Bag", amount: 59.99, status: "Delivered", date: "Feb 28, 2025", qty: 1, image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=100&q=80" },
];

const STATUS_STYLES: Record<string, { bg: string; color: string }> = {
  Delivered: { bg: "color-mix(in srgb, #22c55e 12%, transparent)", color: "#22c55e" },
  Shipped:   { bg: "color-mix(in srgb, #3b82f6 12%, transparent)", color: "#3b82f6" },
  Pending:   { bg: "color-mix(in srgb, #f59e0b 12%, transparent)", color: "#f59e0b" },
  Paid:      { bg: "color-mix(in srgb, #22c55e 12%, transparent)", color: "#22c55e" },
  Failed:    { bg: "color-mix(in srgb, #ef4444 12%, transparent)", color: "#ef4444" },
};

const STATUS_FILTERS = ["All", "Pending", "Paid", "Shipped", "Delivered", "Failed"];

export default function OrdersPage() {
  const [filter, setFilter] = useState("All");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered =
    filter === "All" ? ALL_ORDERS : ALL_ORDERS.filter((o) => o.status === filter);

  return (
    <div className="space-y-6 max-w-4xl">

      {/* Header */}
      <div>
        <h2
          className="text-2xl font-black font-['Playfair_Display']"
          style={{ color: "var(--text-primary)" }}
        >
          My Orders
        </h2>
        <p
          className="text-sm font-['DM_Sans'] mt-1"
          style={{ color: "var(--text-muted)" }}
        >
          {ALL_ORDERS.length} total orders
        </p>
      </div>

      {/* Status filter tabs */}
      <div className="flex flex-wrap gap-2">
        {STATUS_FILTERS.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className="px-4 py-1.5 text-xs font-bold tracking-widest uppercase font-['DM_Sans'] border transition-all duration-200"
            style={{
              backgroundColor:
                filter === s ? "var(--accent)" : "transparent",
              borderColor:
                filter === s ? "var(--accent)" : "var(--border)",
              color: filter === s ? "#000" : "var(--text-secondary)",
            }}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Orders list */}
      <div
        className="border overflow-hidden"
        style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border)" }}
      >
        {/* Desktop table header */}
        <div
          className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 px-6 py-3 border-b"
          style={{ borderColor: "var(--border)" }}
        >
          {["Product", "Order ID", "Date", "Amount", "Status"].map((h) => (
            <p
              key={h}
              className="text-[10px] tracking-[0.2em] uppercase font-bold font-['DM_Sans']"
              style={{ color: "var(--text-muted)" }}
            >
              {h}
            </p>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <Package size={32} style={{ color: "var(--text-muted)" }} />
            <p className="text-sm font-['DM_Sans']" style={{ color: "var(--text-muted)" }}>
              No {filter.toLowerCase()} orders found
            </p>
          </div>
        ) : (
          <ul className="divide-y" style={{ borderColor: "var(--border)" }}>
            {filtered.map((order) => {
              const expanded = expandedId === order.id;
              return (
                <li key={order.id}>
                  {/* Main row */}
                  <button
                    className="w-full text-left px-6 py-4 transition-colors hover:opacity-80"
                    onClick={() => setExpandedId(expanded ? null : order.id)}
                  >
                    {/* Mobile layout */}
                    <div className="md:hidden flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={order.image}
                          alt={order.product}
                          className="w-12 h-14 object-cover flex-shrink-0"
                        />
                        <div>
                          <p
                            className="text-sm font-bold font-['DM_Sans']"
                            style={{ color: "var(--text-primary)" }}
                          >
                            {order.product}
                          </p>
                          <p
                            className="text-[11px] font-['DM_Sans'] mt-0.5"
                            style={{ color: "var(--text-muted)" }}
                          >
                            {order.id} · {order.date}
                          </p>
                          <div className="flex items-center gap-3 mt-1.5">
                            <span
                              className="font-bold text-sm font-['DM_Sans']"
                              style={{ color: "var(--text-primary)" }}
                            >
                              ${order.amount}
                            </span>
                            <span
                              className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 font-['DM_Sans']"
                              style={STATUS_STYLES[order.status]}
                            >
                              {order.status}
                            </span>
                          </div>
                        </div>
                      </div>
                      {expanded ? (
                        <ChevronUp size={14} style={{ color: "var(--text-muted)" }} />
                      ) : (
                        <ChevronDown size={14} style={{ color: "var(--text-muted)" }} />
                      )}
                    </div>

                    {/* Desktop layout */}
                    <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 items-center">
                      <div className="flex items-center gap-3">
                        <img
                          src={order.image}
                          alt={order.product}
                          className="w-10 h-12 object-cover flex-shrink-0"
                        />
                        <div>
                          <p
                            className="text-sm font-medium font-['DM_Sans']"
                            style={{ color: "var(--text-primary)" }}
                          >
                            {order.product}
                          </p>
                          <p
                            className="text-[11px] font-['DM_Sans'] mt-0.5"
                            style={{ color: "var(--text-muted)" }}
                          >
                            Qty: {order.qty}
                          </p>
                        </div>
                      </div>
                      <p
                        className="text-xs font-bold font-['DM_Sans']"
                        style={{ color: "var(--accent)" }}
                      >
                        {order.id}
                      </p>
                      <p
                        className="text-xs font-['DM_Sans']"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {order.date}
                      </p>
                      <p
                        className="text-sm font-bold font-['DM_Sans']"
                        style={{ color: "var(--text-primary)" }}
                      >
                        ${order.amount}
                      </p>
                      <div className="flex items-center gap-3">
                        <span
                          className="text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 font-['DM_Sans']"
                          style={STATUS_STYLES[order.status]}
                        >
                          {order.status}
                        </span>
                        {expanded ? (
                          <ChevronUp size={13} style={{ color: "var(--text-muted)" }} />
                        ) : (
                          <ChevronDown size={13} style={{ color: "var(--text-muted)" }} />
                        )}
                      </div>
                    </div>
                  </button>

                  {/* Expanded details */}
                  {expanded && (
                    <div
                      className="px-6 pb-4 pt-2 border-t"
                      style={{ borderColor: "var(--border)", backgroundColor: "color-mix(in srgb, var(--accent) 3%, transparent)" }}
                    >
                      <div className="flex flex-wrap gap-6 text-sm font-['DM_Sans']">
                        <div>
                          <p className="text-[10px] tracking-widest uppercase font-bold mb-1" style={{ color: "var(--text-muted)" }}>Quantity</p>
                          <p style={{ color: "var(--text-primary)" }}>{order.qty}</p>
                        </div>
                        <div>
                          <p className="text-[10px] tracking-widest uppercase font-bold mb-1" style={{ color: "var(--text-muted)" }}>Unit Price</p>
                          <p style={{ color: "var(--text-primary)" }}>${(order.amount / order.qty).toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-[10px] tracking-widest uppercase font-bold mb-1" style={{ color: "var(--text-muted)" }}>Total</p>
                          <p style={{ color: "var(--accent)" }} className="font-bold">${order.amount}</p>
                        </div>
                        <div>
                          <p className="text-[10px] tracking-widest uppercase font-bold mb-1" style={{ color: "var(--text-muted)" }}>Status</p>
                          <span
                            className="text-[10px] font-bold tracking-widest uppercase px-2.5 py-1"
                            style={STATUS_STYLES[order.status]}
                          >
                            {order.status}
                          </span>
                        </div>
                      </div>
                      {order.status === "Failed" && (
                        <button
                          className="mt-4 px-5 py-2 text-xs font-bold tracking-widest uppercase font-['DM_Sans'] transition-opacity hover:opacity-80"
                          style={{ backgroundColor: "var(--accent)", color: "#000" }}
                        >
                          Retry Payment
                        </button>
                      )}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}