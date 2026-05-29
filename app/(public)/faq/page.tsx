import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/src/components/layout/Navbar";
import Footer from "@/src/components/layout/Footer";
import FaqAccordion, { type FaqItem } from "./FaqAccordion";
import { siteConfig } from "@/src/config/site";

export const metadata: Metadata = {
  title: "FAQ",
  description: `Frequently asked questions about ordering, shipping, returns, payments, and sizing at ${siteConfig.legalName}.`,
  alternates: { canonical: "/faq" },
};

const FAQS: FaqItem[] = [
  {
    q: "How long does delivery take?",
    a: "Orders are processed within 1–2 business days. Standard delivery takes 5–7 business days nationwide, while express delivery arrives in 2–3 business days.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept cards, bank transfers, USSD, and mobile money — all securely processed through Paystack. Your payment details are never stored on our servers.",
  },
  {
    q: "Can I return or exchange an item?",
    a: "Yes. We offer a 14-day return policy on unworn items in their original condition. See our Shipping & Returns page for the full details and how to start a return.",
  },
  {
    q: "How do I know my size?",
    a: "Each product lists its available sizes. We recommend checking the product description for fit notes. If you're between sizes, reach out via our Contact page and we'll help.",
  },
  {
    q: "Do you offer discounts or coupons?",
    a: "Yes — keep an eye on our newsletter and homepage for promo codes. You can apply a valid coupon code in your cart before checkout.",
  },
  {
    q: "Is my personal information safe?",
    a: "Absolutely. We only collect what we need to fulfil your order, and payments are handled by Paystack. Read our Privacy Policy for more.",
  },
  {
    q: "I placed an order but didn't get a confirmation. What do I do?",
    a: "Check your spam folder first. If you still can't find it, contact us with your payment reference and we'll confirm your order status.",
  },
];

export default function FaqPage() {
  return (
    <main style={{ backgroundColor: "var(--bg-primary)", minHeight: "100vh" }}>
      <Navbar />

      <section className="pt-40 pb-12 px-6 lg:px-10">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs tracking-[0.3em] uppercase font-['DM_Sans'] mb-4" style={{ color: "var(--accent)" }}>
            Help Center
          </p>
          <h1 className="text-5xl md:text-6xl font-black font-['Playfair_Display']" style={{ color: "var(--text-primary)" }}>
            Frequently Asked<br />Questions
          </h1>
        </div>
      </section>

      <section className="pb-20 px-6 lg:px-10">
        <div className="max-w-3xl mx-auto">
          <FaqAccordion items={FAQS} />

          <div className="text-center mt-12">
            <p className="text-sm font-['DM_Sans'] mb-4" style={{ color: "var(--text-muted)" }}>
              Still have a question?
            </p>
            <Link href="/contact"
              className="inline-flex items-center gap-2 px-8 py-3.5 text-xs font-bold tracking-widest uppercase font-['DM_Sans'] hover:opacity-80 transition-opacity"
              style={{ backgroundColor: "var(--accent)", color: "#000" }}>
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
