"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

/**
 * Floating "back to top" button. Appears after the user scrolls down a bit and
 * smooth-scrolls to the top when clicked. Mounted once in the root layout so
 * it's available site-wide. Purely presentational — safe on every page.
 */
export default function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!show) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
      className="fixed bottom-6 right-6 z-50 w-11 h-11 flex items-center justify-center rounded-full shadow-lg transition-transform duration-200 hover:scale-110"
      style={{ backgroundColor: "var(--accent)", color: "#000" }}
    >
      <ArrowUp size={18} />
    </button>
  );
}
