import type { ThemePalette } from "./types";

/**
 * "luxury" — warmer and richer than fashion: ivory/cream light mode, deep warm
 * black dark mode, with a champagne-bronze accent. For high-end / premium
 * brands.
 */
const luxury: ThemePalette = {
  light: {
    "bg-primary": "#faf8f5",
    "bg-secondary": "#f1ede6",
    "text-primary": "#1a1a1a",
    "text-secondary": "#4a4540",
    "text-muted": "#9c9489",
    "accent": "#8a6d3b",
    "accent-hover": "#6f5630",
    "border": "rgba(0, 0, 0, 0.1)",
    "card-bg": "#ffffff",
    "nav-bg": "rgba(250, 248, 245, 0.95)",
  },
  dark: {
    "bg-primary": "#0c0a08",
    "bg-secondary": "#14110d",
    "text-primary": "#f5f0e6",
    "text-secondary": "#b8ad9c",
    "text-muted": "#6b6256",
    "accent": "#c9a86a",
    "accent-hover": "#e3c98c",
    "border": "rgba(255, 255, 255, 0.1)",
    "card-bg": "#16130f",
    "nav-bg": "rgba(12, 10, 8, 0.95)",
  },
};

export default luxury;
