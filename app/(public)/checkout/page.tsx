"use client";

import { useState } from "react";
import Navbar from "@/src/components/layout/Navbar";
import { Shield, Lock, ChevronRight, Check } from "lucide-react";

const CART_ITEMS = [
  { id: "1", name: "Minimalist Leather Jacket", price: 299.99, image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=200&q=80", size: "M", quantity: 1 },
  { id: "2", name: "Linen Blend Shirt", price: 79.99, image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=200&q=80", size: "L", quantity: 2 },
];

const STEPS = ["Details", "Shipping", "Payment"];

export default function CheckoutPage() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    address: "", city: "", state: "", zip: "",
  });

  const subtotal = CART_ITEMS.reduce((s, i) => s + i.price * i.quantity, 0);
  const shipping = 15;
  const total = subtotal + shipping;

  const update = (key: string, val: string) => setForm((f) => ({ ...f, [key]: val }));

  const handlePaystack = () => {
    setLoading(true);
    // TODO: Initialize Paystack with your public key
    // import PaystackPop from '@paystack/inline-js'
    // const paystack = new PaystackPop()
    // paystack.newTransaction({ key: 'pk_live_xxx', email: form.email, amount: total * 100, ... })
    setTimeout(() => setLoading(false), 2000);
  };

  const inputClass = "w-full px-4 py-3 text-sm font-['DM_Sans'] outline-none border transition-all duration-200";
  const inputStyle = { backgroundColor: "var(--bg-primary)", borderColor: "var(--border)", color: "var(--text-primary)" };
  const labelClass = "text-[10px] tracking-[0.2em] uppercase font-bold font-['DM_Sans'] block mb-1.5";

  return (
    <main style={{ backgroundColor: "var(--bg-primary)", minHeight: "100vh" }}>
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 lg:px-10 pt-32 pb-20">
        <h1 className="text-4xl font-black font-['Playfair_Display'] mb-10" style={{ color: "var(--text-primary)" }}>
          Checkout
        </h1>

        {/* Steps */}
        <div className="flex items-center gap-2 mb-10">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <button
                onClick={() => i < step && setStep(i)}
                className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase font-['DM_Sans']"
                style={{ color: i <= step ? "var(--accent)" : "var(--text-muted)" }}
              >
                <span className="w-6 h-6 flex items-center justify-center text-[10px] border"
                  style={{
                    borderColor: i <= step ? "var(--accent)" : "var(--border)",
                    backgroundColor: i < step ? "var(--accent)" : "transparent",
                    color: i < step ? "#000" : i === step ? "var(--accent)" : "var(--text-muted)",
                  }}>
                  {i < step ? <Check size={10} /> : i + 1}
                </span>
                {s}
              </button>
              {i < STEPS.length - 1 && (
                <ChevronRight size={12} style={{ color: "var(--border)" }} />
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10">

          {/* Left — form steps */}
          <div className="space-y-6">

            {/* Step 0: Details */}
            {step === 0 && (
              <div className="border p-6 space-y-5" style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border)" }}>
                <h2 className="text-xs tracking-[0.2em] uppercase font-bold font-['DM_Sans']" style={{ color: "var(--text-muted)" }}>Contact Information</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass} style={{ color: "var(--text-muted)" }}>First Name</label>
                    <input className={inputClass} style={inputStyle} value={form.firstName} onChange={(e) => update("firstName", e.target.value)} placeholder="John" />
                  </div>
                  <div>
                    <label className={labelClass} style={{ color: "var(--text-muted)" }}>Last Name</label>
                    <input className={inputClass} style={inputStyle} value={form.lastName} onChange={(e) => update("lastName", e.target.value)} placeholder="Doe" />
                  </div>
                </div>
                <div>
                  <label className={labelClass} style={{ color: "var(--text-muted)" }}>Email Address</label>
                  <input type="email" className={inputClass} style={inputStyle} value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="you@example.com" />
                </div>
                <div>
                  <label className={labelClass} style={{ color: "var(--text-muted)" }}>Phone Number</label>
                  <input type="tel" className={inputClass} style={inputStyle} value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="+234 800 000 0000" />
                </div>
                <button onClick={() => setStep(1)}
                  className="w-full py-4 text-sm font-bold tracking-widest uppercase font-['DM_Sans'] hover:opacity-80 transition-opacity"
                  style={{ backgroundColor: "var(--accent)", color: "#000" }}>
                  Continue to Shipping
                </button>
              </div>
            )}

            {/* Step 1: Shipping */}
            {step === 1 && (
              <div className="border p-6 space-y-5" style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border)" }}>
                <h2 className="text-xs tracking-[0.2em] uppercase font-bold font-['DM_Sans']" style={{ color: "var(--text-muted)" }}>Shipping Address</h2>
                <div>
                  <label className={labelClass} style={{ color: "var(--text-muted)" }}>Street Address</label>
                  <input className={inputClass} style={inputStyle} value={form.address} onChange={(e) => update("address", e.target.value)} placeholder="123 Main Street" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass} style={{ color: "var(--text-muted)" }}>City</label>
                    <input className={inputClass} style={inputStyle} value={form.city} onChange={(e) => update("city", e.target.value)} placeholder="Lagos" />
                  </div>
                  <div>
                    <label className={labelClass} style={{ color: "var(--text-muted)" }}>State</label>
                    <input className={inputClass} style={inputStyle} value={form.state} onChange={(e) => update("state", e.target.value)} placeholder="Lagos State" />
                  </div>
                </div>

                {/* Shipping options */}
                <div>
                  <label className={labelClass} style={{ color: "var(--text-muted)" }}>Shipping Method</label>
                  <div className="space-y-2">
                    {[
                      { label: "Standard Delivery", sub: "5–7 business days", price: "$15.00" },
                      { label: "Express Delivery", sub: "2–3 business days", price: "$35.00" },
                    ].map((opt, i) => (
                      <label key={opt.label} className="flex items-center justify-between p-4 border cursor-pointer transition-colors"
                        style={{ borderColor: i === 0 ? "var(--accent)" : "var(--border)", backgroundColor: i === 0 ? "color-mix(in srgb, var(--accent) 5%, transparent)" : "transparent" }}>
                        <div className="flex items-center gap-3">
                          <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center"
                            style={{ borderColor: "var(--accent)" }}>
                            {i === 0 && <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "var(--accent)" }} />}
                          </div>
                          <div>
                            <p className="text-sm font-bold font-['DM_Sans']" style={{ color: "var(--text-primary)" }}>{opt.label}</p>
                            <p className="text-xs font-['DM_Sans']" style={{ color: "var(--text-muted)" }}>{opt.sub}</p>
                          </div>
                        </div>
                        <span className="text-sm font-bold font-['DM_Sans']" style={{ color: "var(--text-primary)" }}>{opt.price}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setStep(0)} className="px-6 py-4 text-sm font-bold tracking-widest uppercase font-['DM_Sans'] border transition-opacity hover:opacity-70"
                    style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}>
                    Back
                  </button>
                  <button onClick={() => setStep(2)} className="flex-1 py-4 text-sm font-bold tracking-widest uppercase font-['DM_Sans'] hover:opacity-80 transition-opacity"
                    style={{ backgroundColor: "var(--accent)", color: "#000" }}>
                    Continue to Payment
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="border p-6 space-y-5" style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border)" }}>
                  <h2 className="text-xs tracking-[0.2em] uppercase font-bold font-['DM_Sans']" style={{ color: "var(--text-muted)" }}>Payment</h2>

                  {/* Review */}
                  <div className="p-4 space-y-2" style={{ backgroundColor: "var(--bg-secondary)" }}>
                    <p className="text-xs font-['DM_Sans']" style={{ color: "var(--text-muted)" }}>Paying as</p>
                    <p className="text-sm font-bold font-['DM_Sans']" style={{ color: "var(--text-primary)" }}>{form.firstName} {form.lastName}</p>
                    <p className="text-xs font-['DM_Sans']" style={{ color: "var(--text-secondary)" }}>{form.email}</p>
                    <p className="text-xs font-['DM_Sans']" style={{ color: "var(--text-secondary)" }}>{form.address}, {form.city}</p>
                  </div>

                  {/* Paystack button */}
                  <button
                    onClick={handlePaystack}
                    disabled={loading}
                    className="w-full flex flex-col items-center justify-center gap-1 py-5 font-bold tracking-widest uppercase transition-all hover:opacity-90 disabled:opacity-60"
                    style={{ backgroundColor: "#0BA4DB", color: "#fff" }}
                  >
                    <span className="flex items-center gap-2 text-sm font-['DM_Sans']">
                      <Lock size={14} />
                      {loading ? "Processing..." : `Pay $${total.toFixed(2)} with Paystack`}
                    </span>
                    <span className="text-[10px] font-normal tracking-widest font-['DM_Sans'] opacity-80">
                      Cards · Bank Transfer · USSD · Mobile Money
                    </span>
                  </button>

                  {/* Trust */}
                  <div className="flex items-center justify-center gap-2 pt-1">
                    <Shield size={12} style={{ color: "var(--text-muted)" }} />
                    <p className="text-[10px] font-['DM_Sans']" style={{ color: "var(--text-muted)" }}>
                      Secured by Paystack. Your payment info is never stored.
                    </p>
                  </div>

                  <button onClick={() => setStep(1)} className="w-full py-3 text-xs font-bold tracking-widest uppercase font-['DM_Sans'] border transition-opacity hover:opacity-70"
                    style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}>
                    Back to Shipping
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right — order summary */}
          <div className="space-y-4">
            <div className="border p-6 space-y-5 sticky top-28" style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border)" }}>
              <h2 className="text-xs tracking-[0.2em] uppercase font-bold font-['DM_Sans']" style={{ color: "var(--text-muted)" }}>Order Summary</h2>

              <div className="space-y-4">
                {CART_ITEMS.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="relative flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-14 h-16 object-cover" />
                      <span className="absolute -top-1.5 -right-1.5 w-5 h-5 flex items-center justify-center text-[10px] font-bold font-['DM_Sans'] rounded-full"
                        style={{ backgroundColor: "var(--accent)", color: "#000" }}>
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 flex justify-between">
                      <div>
                        <p className="text-xs font-bold font-['DM_Sans']" style={{ color: "var(--text-primary)" }}>{item.name}</p>
                        <p className="text-[11px] font-['DM_Sans']" style={{ color: "var(--text-muted)" }}>Size: {item.size}</p>
                      </div>
                      <p className="text-sm font-bold font-['DM_Sans']" style={{ color: "var(--text-primary)" }}>${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-3" style={{ borderColor: "var(--border)" }}>
                {[
                  { label: "Subtotal", value: `$${subtotal.toFixed(2)}` },
                  { label: "Shipping", value: `$${shipping.toFixed(2)}` },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between">
                    <span className="text-sm font-['DM_Sans']" style={{ color: "var(--text-secondary)" }}>{label}</span>
                    <span className="text-sm font-bold font-['DM_Sans']" style={{ color: "var(--text-primary)" }}>{value}</span>
                  </div>
                ))}
                <div className="flex justify-between border-t pt-3" style={{ borderColor: "var(--border)" }}>
                  <span className="font-bold font-['DM_Sans']" style={{ color: "var(--text-primary)" }}>Total</span>
                  <span className="text-xl font-black font-['Playfair_Display']" style={{ color: "var(--accent)" }}>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}