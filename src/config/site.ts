/**
 * ─────────────────────────────────────────────────────────────────────────
 *  SITE CONFIG — the single place to rebrand the store for a new client.
 * ─────────────────────────────────────────────────────────────────────────
 *
 * WHY this file exists:
 *   Before, brand details ("FanMid", the tagline, the support email, the logo
 *   wordmark, SEO text, the "FANMID-" payment prefix…) were copied as literal
 *   text across ~20 files. To launch a new client you'd have to hunt them all
 *   down. That's slow and easy to get wrong.
 *
 * WHAT it solves:
 *   One source of truth. Duplicate the repo, edit THIS file, and the whole
 *   storefront rebrands — footer, SEO, emails, auth screens, contact page.
 *
 * HOW it helps reuse:
 *   It's the first half of the "one engine, many themes" idea — the engine
 *   (auth, products, checkout…) never changes; this config + the theme/section
 *   layers (later phases) are what make each client look and feel unique.
 *
 * IMPORTANT — two layers of branding:
 *   1. BUILD-TIME (this file): set once per client deployment. Static identity.
 *   2. RUNTIME (the DB `Settings` model — storeName, whatsapp, contactEmail):
 *      the admin can change these live from /admin/settings. Where both exist,
 *      the runtime value wins and this file provides the sensible DEFAULT.
 *
 * No secrets here — this module is safe to import in both server and client
 * code. Secrets stay in environment variables (.env.local / Vercel).
 */

export const siteConfig = {
  // Short brand name (buttons, sentences: "Sign in to your FanMid account").
  name: "FanMid",
  // Fuller name used in SEO titles, footer copyright, and legal/policy pages.
  legalName: "FanMidCommerce",

  // The logo wordmark renders as two halves with the second in the accent
  // colour, e.g. FAN + MID. Change these to rebrand the logo text.
  wordmark: { start: "FAN", end: "MID" },

  // One-line brand promise shown in the footer.
  tagline: "Premium fashion curated for those who define their own aesthetic.",

  // Defaults for search-engine metadata (app/layout.tsx). Per-page titles still
  // override these via their own `metadata` / generateMetadata.
  seo: {
    titleDefault: "FanMidCommerce — Modern Online Store",
    titleTemplate: "%s | FanMidCommerce",
    description: "Shop the latest fashion and lifestyle products at FanMidCommerce.",
  },

  // Contact / support details (shown on the contact page, etc.).
  // NOTE: `whatsapp` here is only a fallback — the admin's Settings value (if
  // set) takes precedence wherever WhatsApp is used for orders.
  contact: {
    email: "support@fanmid.com",
    phone: "+234 813 487 9924",
    whatsapp: "2348134879924",
    location: "Lagos, Nigeria",
  },

  // Social links. Leave a value as "" to hide that icon/link.
  social: {
    instagram: "",
    twitter: "",
    facebook: "",
    tiktok: "",
  },

  // Prefix for Paystack payment references, e.g. "FANMID-1716998400000".
  paymentRefPrefix: "FANMID",

  // ── Placeholders wired now, used by later phases ──────────────────────────
  // Phase 3 (themes): which theme preset this client uses.
  theme: "minimal",
  // Phase 2 (dynamic homepage): the ordered list of sections to render on "/".
  homepageSections: [
    "hero",
    "value-props",
    "featured",
    "categories",
    "testimonials",
    "newsletter",
  ],
} as const;

export type SiteConfig = typeof siteConfig;
