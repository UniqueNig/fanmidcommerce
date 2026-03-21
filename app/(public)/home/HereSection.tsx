"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function HeroSection() {
  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      {/* Background grid — adapts opacity per theme */}
      <div
        className="absolute inset-0 dark:opacity-[0.03] opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(var(--text-primary) 1px, transparent 1px), linear-gradient(90deg, var(--text-primary) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[120px] pointer-events-none"
        style={{ backgroundColor: "color-mix(in srgb, var(--accent) 10%, transparent)" }}
      />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10 pt-32 pb-20">
        <div className="max-w-4xl">

          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-2 mb-8 border"
            style={{
              borderColor: "color-mix(in srgb, var(--accent) 30%, transparent)",
              backgroundColor: "color-mix(in srgb, var(--accent) 5%, transparent)",
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ backgroundColor: "var(--accent)" }}
            />
            <span
              className="text-xs tracking-[0.2em] uppercase font-['DM_Sans']"
              style={{ color: "var(--accent)" }}
            >
              New Collection 2025
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-['Playfair_Display'] leading-[1.05] mb-6">
            <span
              className="block text-6xl md:text-8xl lg:text-9xl font-black"
              style={{ color: "var(--text-primary)" }}
            >
              Elevate
            </span>
            <span
              className="block text-6xl md:text-8xl lg:text-9xl font-black text-transparent bg-clip-text"
              style={{
                backgroundImage:
                  "linear-gradient(to right, var(--accent), var(--accent-hover))",
              }}
            >
              Your Style
            </span>
          </h1>

          <p
            className="text-lg md:text-xl max-w-xl mb-12 font-['DM_Sans'] leading-relaxed"
            style={{ color: "var(--text-secondary)" }}
          >
            Curated fashion for those who define their own aesthetic. Premium
            quality, timeless design, delivered to your door.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/shop"
              className="group inline-flex items-center gap-3 px-8 py-4 text-sm font-bold tracking-widest uppercase transition-all duration-300 font-['DM_Sans'] hover:opacity-90"
              style={{
                backgroundColor: "var(--accent)",
                color: "#000",
              }}
            >
              Shop Now
              <ArrowRight
                size={16}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
            <Link
              href="/categories"
              className="inline-flex items-center gap-3 px-8 py-4 text-sm tracking-widest uppercase transition-all duration-300 font-['DM_Sans'] border hover:opacity-80"
              style={{
                borderColor: "var(--border)",
                color: "var(--text-primary)",
              }}
            >
              Browse Categories
            </Link>
          </div>

          {/* Stats */}
          <div
            className="flex gap-12 mt-20 pt-12 border-t"
            style={{ borderColor: "var(--border)" }}
          >
            {[
              { value: "2K+", label: "Products" },
              { value: "98%", label: "Satisfaction" },
              { value: "50+", label: "Brands" },
            ].map((stat) => (
              <div key={stat.label}>
                <div
                  className="text-3xl font-black font-['Playfair_Display']"
                  style={{ color: "var(--text-primary)" }}
                >
                  {stat.value}
                </div>
                <div
                  className="text-xs tracking-widest uppercase mt-1 font-['DM_Sans']"
                  style={{ color: "var(--text-muted)" }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Decorative vertical text */}
      <div
        className="hidden lg:block absolute right-10 top-1/2 -translate-y-1/2 -rotate-90 text-xs tracking-[0.5em] uppercase font-['DM_Sans']"
        style={{ color: "var(--text-muted)" }}
      >
        FanMidCommerce — Premium Fashion
      </div>
    </section>
  );
}