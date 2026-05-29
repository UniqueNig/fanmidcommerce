"use client";

import { useState } from "react";
import {
  ShoppingBag, Minus, Plus, Share2, Heart,
  Check, Truck, RefreshCw, Shield,
} from "lucide-react";
import { useCart } from "@/src/context/CartContext";
import { useWishlist } from "@/src/context/WishlistContext";
import { useToast } from "@/src/context/ToastContext";
import SizeGuideModal from "@/src/components/product/SizeGuideModal";

type ProductInfoProps = {
  id: string;
  slug?: string;
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  category: string;
  image: string;
  isNew?: boolean;
  inStock: boolean;
  stockCount?: number;
  sizes: string[];
  sizeGuide?: "clothing" | "footwear" | "none";
  whatsappNumber: string;
};

const GUARANTEES = [
  { icon: Truck,      label: "Free delivery", sub: "On orders over ₦50,000" },
  { icon: RefreshCw,  label: "Easy returns",  sub: "Within 14 days" },
  { icon: Shield,     label: "Authentic",     sub: "100% genuine products" },
];

export default function ProductInfo({
  id, slug, name, price, originalPrice, description, category, image,
  isNew, inStock, stockCount, sizes, sizeGuide = "clothing", whatsappNumber,
}: ProductInfoProps) {
  const { addItem } = useCart();
  const { has, toggle } = useWishlist();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [addedToCart, setAddedToCart] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const wishlisted = has(id);

  const discount = originalPrice
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : null;

  const handleAddToCart = () => {
    if (!inStock) return;
    const size = selectedSize ?? (sizes.length === 0 ? "One Size" : null);
    if (!size) return; // sizes exist but none selected

    addItem({ id, name, price, image: image || null, category, size, quantity, maxStock: stockCount });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent(
      `Hi! I'm interested in *${name}* (${selectedSize ? `Size: ${selectedSize}, ` : ""}Qty: ${quantity}) — ₦${price.toLocaleString()}. Can you help me with this order?`,
    );
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, "_blank");
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: name, url });
      } else {
        await navigator.clipboard.writeText(url);
        toast("Link copied to clipboard", "success");
      }
    } catch {
      // user cancelled the share sheet, or clipboard blocked — try clipboard
      try {
        await navigator.clipboard.writeText(url);
        toast("Link copied to clipboard", "success");
      } catch {
        /* ignore */
      }
    }
  };

  return (
    <div className="flex flex-col gap-6">

      {/* Top meta */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-[10px] tracking-[0.25em] uppercase font-['DM_Sans']" style={{ color: "var(--text-muted)" }}>
            {category}
          </span>
          {isNew && (
            <span className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 font-['DM_Sans']"
              style={{ backgroundColor: "var(--accent)", color: "#000" }}>
              New
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => toggle({ id, slug, name, price, image: image || null, category })}
            aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
            className="w-8 h-8 flex items-center justify-center border transition-all duration-200"
            style={{ borderColor: wishlisted ? "var(--accent)" : "var(--border)", color: wishlisted ? "var(--accent)" : "var(--text-muted)" }}>
            <Heart size={14} fill={wishlisted ? "currentColor" : "none"} />
          </button>
          <button onClick={handleShare}
            className="w-8 h-8 flex items-center justify-center border transition-all duration-200 hover:opacity-70"
            style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}>
            <Share2 size={14} />
          </button>
        </div>
      </div>

      {/* Name */}
      <h1 className="text-3xl md:text-4xl font-black font-['Playfair_Display'] leading-tight"
        style={{ color: "var(--text-primary)" }}>
        {name}
      </h1>

      {/* Price */}
      <div className="flex items-center gap-4">
        <span className="text-3xl font-black font-['Playfair_Display']" style={{ color: "var(--accent)" }}>
          ₦{price.toLocaleString()}
        </span>
        {originalPrice && (
          <span className="text-lg line-through font-['DM_Sans']" style={{ color: "var(--text-muted)" }}>
            ₦{originalPrice.toLocaleString()}
          </span>
        )}
        {discount && (
          <span className="text-xs font-bold px-2 py-1 font-['DM_Sans']"
            style={{ backgroundColor: "color-mix(in srgb, var(--accent) 15%, transparent)", color: "var(--accent)" }}>
            -{discount}%
          </span>
        )}
      </div>

      {/* Stock */}
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: inStock ? "#22c55e" : "#ef4444" }} />
        <span className="text-xs font-['DM_Sans'] tracking-wide" style={{ color: "var(--text-secondary)" }}>
          {inStock
            ? stockCount && stockCount < 10 ? `Only ${stockCount} left in stock` : "In Stock"
            : "Out of Stock"}
        </span>
      </div>

      <div style={{ borderTop: "1px solid var(--border)" }} />

      {/* Description */}
      <p className="text-sm leading-relaxed font-['DM_Sans']" style={{ color: "var(--text-secondary)" }}>
        {description}
      </p>

      {/* Size selector */}
      {sizes.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[10px] tracking-[0.25em] uppercase font-bold font-['DM_Sans']"
              style={{ color: "var(--text-muted)" }}>
              Size
              {!selectedSize && (
                <span className="ml-2 text-red-400 normal-case tracking-normal">— please select</span>
              )}
            </h3>
            {sizeGuide !== "none" && (
              <button type="button" onClick={() => setShowGuide(true)}
                className="text-[10px] tracking-widest uppercase font-['DM_Sans'] underline underline-offset-2 hover:opacity-70 transition-opacity"
                style={{ color: "var(--text-muted)" }}>
                Size Guide
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => (
              <button key={size} onClick={() => setSelectedSize(size)}
                className="w-11 h-11 text-xs font-bold font-['DM_Sans'] border transition-all duration-200"
                style={{
                  backgroundColor: selectedSize === size ? "var(--accent)" : "transparent",
                  borderColor: selectedSize === size ? "var(--accent)" : "var(--border)",
                  color: selectedSize === size ? "#000" : "var(--text-secondary)",
                }}>
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity */}
      <div>
        <h3 className="text-[10px] tracking-[0.25em] uppercase font-bold mb-3 font-['DM_Sans']"
          style={{ color: "var(--text-muted)" }}>
          Quantity
        </h3>
        <div className="inline-flex items-center border" style={{ borderColor: "var(--border)" }}>
          <button onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="w-11 h-11 flex items-center justify-center transition-colors hover:opacity-60"
            style={{ color: "var(--text-secondary)" }}>
            <Minus size={14} />
          </button>
          <span className="w-12 text-center text-sm font-bold font-['DM_Sans'] border-x"
            style={{ borderColor: "var(--border)", color: "var(--text-primary)" }}>
            {quantity}
          </span>
          <button
            onClick={() =>
              setQuantity((q) =>
                stockCount ? Math.min(q + 1, stockCount) : q + 1,
              )
            }
            disabled={!!stockCount && quantity >= stockCount}
            className="w-11 h-11 flex items-center justify-center transition-colors hover:opacity-60 disabled:opacity-30 disabled:cursor-not-allowed"
            style={{ color: "var(--text-secondary)" }}>
            <Plus size={14} />
          </button>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={handleAddToCart}
          disabled={!inStock || (sizes.length > 0 && !selectedSize)}
          className="flex-1 flex items-center justify-center gap-2 py-4 text-sm font-bold tracking-widest uppercase font-['DM_Sans'] transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ backgroundColor: addedToCart ? "#22c55e" : "var(--accent)", color: "#000" }}
        >
          {addedToCart ? <><Check size={15} /> Added to Cart</> : <><ShoppingBag size={15} /> Add to Cart</>}
        </button>

        <button onClick={handleWhatsApp}
          className="flex-1 flex items-center justify-center gap-2 py-4 text-sm font-bold tracking-widest uppercase font-['DM_Sans'] transition-all duration-300 hover:opacity-90"
          style={{ backgroundColor: "#25D366", color: "#fff" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          Inquire on WhatsApp
        </button>
      </div>

      {/* Guarantees */}
      <div className="grid grid-cols-3 gap-4 pt-6 border-t" style={{ borderColor: "var(--border)" }}>
        {GUARANTEES.map(({ icon: Icon, label, sub }) => (
          <div key={label} className="flex flex-col items-center text-center gap-2">
            <Icon size={18} style={{ color: "var(--accent)" }} />
            <div>
              <p className="text-xs font-bold font-['DM_Sans']" style={{ color: "var(--text-primary)" }}>{label}</p>
              <p className="text-[10px] font-['DM_Sans']" style={{ color: "var(--text-muted)" }}>{sub}</p>
            </div>
          </div>
        ))}
      </div>

      <SizeGuideModal open={showGuide} onClose={() => setShowGuide(false)} type={sizeGuide} />
    </div>
  );
}