import type { Metadata } from "next";
import Navbar from "@/src/components/layout/Navbar";
import Footer from "@/src/components/layout/Footer";
import ContactForm from "./ContactForm";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { siteConfig } from "@/src/config/site";

export const metadata: Metadata = {
  title: "Contact Us",
  description: `Get in touch with ${siteConfig.legalName} — questions about orders, products, returns, or anything else. We're happy to help.`,
  alternates: { canonical: "/contact" },
};

const { email, phone, whatsapp, location } = siteConfig.contact;
const DETAILS = [
  { icon: Mail, label: "Email", value: email, href: `mailto:${email}` },
  { icon: Phone, label: "Phone / WhatsApp", value: phone, href: `https://wa.me/${whatsapp}` },
  { icon: MapPin, label: "Location", value: location, href: null },
  { icon: Clock, label: "Hours", value: "Mon – Sat, 9am – 6pm WAT", href: null },
];

export default function ContactPage() {
  return (
    <main style={{ backgroundColor: "var(--bg-primary)", minHeight: "100vh" }}>
      <Navbar />

      <section className="pt-40 pb-16 px-6 lg:px-10">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs tracking-[0.3em] uppercase font-['DM_Sans'] mb-4" style={{ color: "var(--accent)" }}>
            Get in touch
          </p>
          <h1 className="text-5xl md:text-6xl font-black font-['Playfair_Display'] leading-[1.05] max-w-2xl" style={{ color: "var(--text-primary)" }}>
            We'd love to<br /><span style={{ color: "var(--accent)" }}>hear from you.</span>
          </h1>
          <p className="text-lg font-['DM_Sans'] leading-relaxed max-w-xl mt-6" style={{ color: "var(--text-secondary)" }}>
            Questions about an order, a product, or a return? Send us a message and we'll get back within 24 hours.
          </p>
        </div>
      </section>

      <section className="pb-28 px-6 lg:px-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-12 lg:gap-20">
          {/* Contact details */}
          <div className="space-y-8">
            {DETAILS.map(({ icon: Icon, label, value, href }) => (
              <div key={label} className="flex items-start gap-4">
                <div className="w-11 h-11 flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: "color-mix(in srgb, var(--accent) 12%, transparent)", color: "var(--accent)" }}>
                  <Icon size={18} />
                </div>
                <div>
                  <p className="text-[10px] tracking-[0.2em] uppercase font-bold font-['DM_Sans'] mb-1" style={{ color: "var(--text-muted)" }}>
                    {label}
                  </p>
                  {href ? (
                    <a href={href} className="text-sm font-['DM_Sans'] hover:opacity-70 transition-opacity" style={{ color: "var(--text-primary)" }}>
                      {value}
                    </a>
                  ) : (
                    <p className="text-sm font-['DM_Sans']" style={{ color: "var(--text-primary)" }}>{value}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Form */}
          <div className="border p-6 lg:p-8" style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border)" }}>
            <h2 className="text-xs tracking-[0.2em] uppercase font-bold font-['DM_Sans'] mb-6" style={{ color: "var(--text-muted)" }}>
              Send a message
            </h2>
            <ContactForm />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
