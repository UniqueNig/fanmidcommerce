import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Provider from "@/src/components/ApolloProvider";
import { CartProvider } from "@/src/context/CartContext";
import { ToastProvider } from "@/src/context/ToastContext";
import { WishlistProvider } from "@/src/context/WishlistContext";
import { CouponProvider } from "@/src/context/CouponContext";
// import Provider from "@/src/components/ApolloProvider/apollo-clients";
// import Provider from "@/src/components/ApolloClient";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Public site URL — set NEXT_PUBLIC_SITE_URL in your env per client deployment
// (e.g. https://clienta.com). Falls back to localhost for local dev.
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  // Makes relative OpenGraph/canonical URLs resolve to absolute URLs.
  metadataBase: new URL(siteUrl),
  title: {
    default: "FanMidCommerce — Modern Online Store",
    // Page titles become "Product Name | FanMidCommerce"
    template: "%s | FanMidCommerce",
  },
  description:
    "Shop the latest fashion and lifestyle products at FanMidCommerce.",
  openGraph: {
    type: "website",
    siteName: "FanMidCommerce",
    url: "/",
    title: "FanMidCommerce — Modern Online Store",
    description:
      "Shop the latest fashion and lifestyle products at FanMidCommerce.",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Provider>
          <ToastProvider>
            <WishlistProvider>
              <CartProvider>
                <CouponProvider>{children}</CouponProvider>
              </CartProvider>
            </WishlistProvider>
          </ToastProvider>
        </Provider>
      </body>
    </html>
  );
}
