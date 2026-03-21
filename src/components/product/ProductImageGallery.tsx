"use client";

import { useState } from "react";
import { ZoomIn } from "lucide-react";

type ProductImageGalleryProps = {
  images: string[];
  productName: string;
};

export default function ProductImageGallery({
  images,
  productName,
}: ProductImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4 w-full">
      {/* Thumbnails — vertical on desktop, horizontal on mobile */}
      <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto md:max-h-[600px] flex-shrink-0">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className="relative flex-shrink-0 w-16 h-20 md:w-20 md:h-24 overflow-hidden border-2 transition-all duration-200"
            style={{
              borderColor:
                activeIndex === i ? "var(--accent)" : "var(--border)",
              opacity: activeIndex === i ? 1 : 0.6,
            }}
          >
            <img
              src={img}
              alt={`${productName} view ${i + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>

      {/* Main image */}
      <div
        className="relative flex-1 overflow-hidden cursor-zoom-in"
        style={{
          backgroundColor: "var(--card-bg)",
          aspectRatio: "3/4",
          maxHeight: "600px",
        }}
        onMouseEnter={() => setZoomed(true)}
        onMouseLeave={() => setZoomed(false)}
        onMouseMove={handleMouseMove}
      >
        <img
          src={images[activeIndex]}
          alt={productName}
          className="w-full h-full object-cover transition-transform duration-200"
          style={{
            transform: zoomed ? "scale(1.6)" : "scale(1)",
            transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
          }}
        />

        {/* Zoom hint */}
        {!zoomed && (
          <div
            className="absolute bottom-4 right-4 flex items-center gap-1.5 px-3 py-1.5 text-[10px] tracking-widest uppercase font-['DM_Sans']"
            style={{
              backgroundColor: "color-mix(in srgb, var(--bg-primary) 80%, transparent)",
              color: "var(--text-muted)",
            }}
          >
            <ZoomIn size={11} />
            Hover to zoom
          </div>
        )}

        {/* Image counter */}
        <div
          className="absolute top-4 right-4 text-[10px] tracking-widest font-['DM_Sans'] px-2 py-1"
          style={{
            backgroundColor: "color-mix(in srgb, var(--bg-primary) 80%, transparent)",
            color: "var(--text-muted)",
          }}
        >
          {activeIndex + 1} / {images.length}
        </div>
      </div>
    </div>
  );
}