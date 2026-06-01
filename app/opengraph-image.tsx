import { ImageResponse } from "next/og";
import { siteConfig } from "@/src/config/site";

// Default social-share preview image (the picture that shows when a link to the
// site is shared on WhatsApp, X, Facebook, etc.). Generated dynamically from
// siteConfig so each client gets their own branded preview with no asset files.
//
// NOTE: for absolute share URLs to resolve correctly, NEXT_PUBLIC_SITE_URL must
// be set in the deploy environment (it feeds metadataBase in app/layout.tsx).
// If unset, OpenGraph/canonical URLs fall back to http://localhost:3000.

export const runtime = "edge";
export const alt = siteConfig.seo.titleDefault;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background:
            "linear-gradient(135deg, #0b1730 0%, #0a1a3a 55%, #060d1f 100%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 40, fontWeight: 700, letterSpacing: -1, display: "flex" }}>
          <span>{siteConfig.wordmark.start}</span>
          <span style={{ color: "#5aa9ff" }}>{siteConfig.wordmark.end}</span>
        </div>
        <div style={{ fontSize: 68, fontWeight: 800, lineHeight: 1.1, marginTop: 28, maxWidth: 900 }}>
          {siteConfig.seo.titleDefault}
        </div>
        <div style={{ fontSize: 30, color: "#aebdd6", marginTop: 24, maxWidth: 900 }}>
          {siteConfig.seo.description}
        </div>
      </div>
    ),
    { ...size },
  );
}
