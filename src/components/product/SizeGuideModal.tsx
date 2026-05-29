"use client";

import { X } from "lucide-react";

// Generic apparel size chart (cm). Adjust per your products if needed.
const ROWS = [
  { size: "XS", chest: "81–86", waist: "66–71", hips: "86–91" },
  { size: "S", chest: "86–91", waist: "71–76", hips: "91–96" },
  { size: "M", chest: "96–101", waist: "81–86", hips: "101–106" },
  { size: "L", chest: "106–111", waist: "91–96", hips: "111–116" },
  { size: "XL", chest: "116–121", waist: "101–106", hips: "121–126" },
  { size: "XXL", chest: "126–131", waist: "111–116", hips: "131–136" },
];

export default function SizeGuideModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative w-full max-w-lg border p-6"
        style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border)" }}
      >
        <div className="flex items-center justify-between mb-5">
          <h3
            className="text-lg font-black font-['Playfair_Display']"
            style={{ color: "var(--text-primary)" }}
          >
            Size Guide
          </h3>
          <button
            onClick={onClose}
            className="hover:opacity-60 transition-opacity"
            style={{ color: "var(--text-muted)" }}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <p className="text-xs font-['DM_Sans'] mb-4" style={{ color: "var(--text-muted)" }}>
          Measurements in centimetres (cm). If you're between sizes, we recommend sizing up.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-sm font-['DM_Sans']">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                {["Size", "Chest", "Waist", "Hips"].map((h) => (
                  <th
                    key={h}
                    className="text-left py-2 text-[10px] tracking-widest uppercase font-bold"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((r) => (
                <tr key={r.size} style={{ borderBottom: "1px solid var(--border)" }}>
                  <td className="py-2.5 font-bold" style={{ color: "var(--accent)" }}>{r.size}</td>
                  <td className="py-2.5" style={{ color: "var(--text-secondary)" }}>{r.chest}</td>
                  <td className="py-2.5" style={{ color: "var(--text-secondary)" }}>{r.waist}</td>
                  <td className="py-2.5" style={{ color: "var(--text-secondary)" }}>{r.hips}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
