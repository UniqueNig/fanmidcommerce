"use client";

import { useCart } from "@/src/context/CartContext";
import Link from "next/link";
import Navbar from "@/src/components/layout/Navbar";
import Footer from "@/src/components/layout/Footer";
import {
  Minus,
  Plus,
  Trash2,
  ArrowRight,
  ShoppingBag,
  ArrowLeft,
} from "lucide-react";
import { useState } from "react";

export default function CartPage() {
  const { items, removeItem, updateQty, subtotal } = useCart();
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);

  const discount = couponApplied ? subtotal * 0.1 : 0;
  const shipping = subtotal > 50000 ? 0 : 3000;
  const total = subtotal - discount + shipping;

  const applyCoupon = () => {
    if (coupon.toUpperCase() === "FANMID10") setCouponApplied(true);
  };

  if (items.length === 0) {
    return (
      <main
        style={{ backgroundColor: "var(--bg-primary)", minHeight: "100vh" }}
      >
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-screen gap-6 px-6">
          <ShoppingBag size={64} style={{ color: "var(--text-muted)" }} />
          <h2
            className="text-3xl font-black font-['Playfair_Display']"
            style={{ color: "var(--text-primary)" }}
          >
            Your cart is empty
          </h2>
          <p
            className="text-sm font-['DM_Sans']"
            style={{ color: "var(--text-muted)" }}
          >
            Looks like you haven't added anything yet.
          </p>
          <Link
            href="/shop"
            className="flex items-center gap-2 px-8 py-4 text-sm font-bold tracking-widest uppercase font-['DM_Sans'] hover:opacity-80 transition-opacity"
            style={{ backgroundColor: "var(--accent)", color: "#000" }}
          >
            Start Shopping <ArrowRight size={14} />
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main style={{ backgroundColor: "var(--bg-primary)", minHeight: "100vh" }}>
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-32 pb-20">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1
              className="text-4xl md:text-5xl font-black font-['Playfair_Display']"
              style={{ color: "var(--text-primary)" }}
            >
              Your Cart
            </h1>
            <p
              className="text-sm font-['DM_Sans'] mt-1"
              style={{ color: "var(--text-muted)" }}
            >
              {items.length} {items.length === 1 ? "item" : "items"}
            </p>
          </div>
          <Link
            href="/shop"
            className="hidden md:flex items-center gap-2 text-xs tracking-widest uppercase font-['DM_Sans'] transition-opacity hover:opacity-60"
            style={{ color: "var(--text-secondary)" }}
          >
            <ArrowLeft size={13} /> Continue Shopping
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10">
          {/* Items */}
          <div className="border-t" style={{ borderColor: "var(--border)" }}>
            {items.map((item) => (
              <div
                key={item.id}
                className="flex gap-5 py-6 border-b"
                style={{ borderColor: "var(--border)" }}
              >
                <div
                  className="w-24 h-28 md:w-28 md:h-36 flex-shrink-0 overflow-hidden"
                  style={{ backgroundColor: "var(--card-bg)" }}
                >
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div
                      className="w-full h-full"
                      style={{ backgroundColor: "var(--card-bg)" }}
                    />
                  )}
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      {item.category && (
                        <p
                          className="text-[10px] tracking-widest uppercase font-['DM_Sans']"
                          style={{ color: "var(--text-muted)" }}
                        >
                          {item.category}
                        </p>
                      )}
                      <h3
                        className="text-base font-bold font-['DM_Sans'] mt-0.5"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {item.name}
                      </h3>
                      {item.size && (
                        <p
                          className="text-xs font-['DM_Sans'] mt-1"
                          style={{ color: "var(--text-muted)" }}
                        >
                          Size: {item.size}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => removeItem(item.id, item.size)}
                      className="transition-opacity hover:opacity-60 flex-shrink-0"
                      style={{ color: "var(--text-muted)" }}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <div
                      className="inline-flex items-center border"
                      style={{ borderColor: "var(--border)" }}
                    >
                      <button
                        onClick={() => updateQty(item.id, item.size, -1)}
                        className="w-8 h-8 flex items-center justify-center hover:opacity-60 transition-opacity"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        <Minus size={12} />
                      </button>
                      <span
                        className="w-8 text-center text-sm font-bold font-['DM_Sans'] border-x"
                        style={{
                          borderColor: "var(--border)",
                          color: "var(--text-primary)",
                        }}
                      >
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQty(item.id, item.size, 1)}
                        className="w-8 h-8 flex items-center justify-center hover:opacity-60 transition-opacity"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                    <span
                      className="font-black font-['Playfair_Display'] text-lg"
                      style={{ color: "var(--accent)" }}
                    >
                      ₦{(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div
            className="border p-6 space-y-5 sticky top-28 self-start"
            style={{
              backgroundColor: "var(--card-bg)",
              borderColor: "var(--border)",
            }}
          >
            <h2
              className="text-sm font-bold tracking-widest uppercase font-['DM_Sans']"
              style={{ color: "var(--text-primary)" }}
            >
              Order Summary
            </h2>
            <div className="space-y-3">
              {[
                { label: "Subtotal", value: `₦${subtotal.toLocaleString()}` },
                {
                  label: "Shipping",
                  value:
                    shipping === 0 ? "Free" : `₦${shipping.toLocaleString()}`,
                },
                ...(couponApplied
                  ? [
                      {
                        label: "Discount (10%)",
                        value: `-₦${discount.toLocaleString()}`,
                      },
                    ]
                  : []),
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between">
                  <span
                    className="text-sm font-['DM_Sans']"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {label}
                  </span>
                  <span
                    className="text-sm font-bold font-['DM_Sans']"
                    style={{
                      color:
                        label === "Discount (10%)"
                          ? "#22c55e"
                          : "var(--text-primary)",
                    }}
                  >
                    {value}
                  </span>
                </div>
              ))}
            </div>
            <div
              className="border-t pt-4"
              style={{ borderColor: "var(--border)" }}
            >
              <div className="flex justify-between">
                <span
                  className="font-bold font-['DM_Sans']"
                  style={{ color: "var(--text-primary)" }}
                >
                  Total
                </span>
                <span
                  className="text-xl font-black font-['Playfair_Display']"
                  style={{ color: "var(--accent)" }}
                >
                  ₦{total.toLocaleString()}
                </span>
              </div>
              {shipping === 0 && (
                <p
                  className="text-[10px] font-['DM_Sans'] mt-1"
                  style={{ color: "#22c55e" }}
                >
                  ✓ You qualify for free shipping
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <input
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                placeholder="Coupon code"
                disabled={couponApplied}
                className="flex-1 px-3 py-2.5 text-xs font-['DM_Sans'] outline-none border"
                style={{
                  backgroundColor: "var(--bg-primary)",
                  borderColor: "var(--border)",
                  color: "var(--text-primary)",
                }}
              />
              <button
                onClick={applyCoupon}
                disabled={couponApplied}
                className="px-4 py-2.5 text-xs font-bold tracking-widest uppercase font-['DM_Sans'] transition-opacity hover:opacity-80 disabled:opacity-40"
                style={{ backgroundColor: "var(--accent)", color: "#000" }}
              >
                {couponApplied ? "✓" : "Apply"}
              </button>
            </div>
            {couponApplied && (
              <p
                className="text-xs font-['DM_Sans']"
                style={{ color: "#22c55e" }}
              >
                Coupon applied! 10% off
              </p>
            )}
            <Link
              href="/checkout"
              className="w-full flex items-center justify-center gap-2 py-4 text-sm font-bold tracking-widest uppercase font-['DM_Sans'] transition-opacity hover:opacity-80"
              style={{ backgroundColor: "var(--accent)", color: "#000" }}
            >
              Proceed to Checkout <ArrowRight size={14} />
            </Link>
            <div className="flex items-center justify-center gap-4 pt-2">
              {["🔒 Secure", "✓ Authentic", "↩ Easy Returns"].map((t) => (
                <span
                  key={t}
                  className="text-[10px] font-['DM_Sans']"
                  style={{ color: "var(--text-muted)" }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
