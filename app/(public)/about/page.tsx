import Navbar from "@/src/components/layout/Navbar";
import Footer from "@/src/components/layout/Footer";
import { Heart, Award, Globe, Users } from "lucide-react";

const VALUES = [
  { icon: Heart, title: "Made with Intention", desc: "Every piece we carry is chosen for quality, craftsmanship, and longevity. We believe in buying less and wearing more." },
  { icon: Award, title: "Uncompromising Quality", desc: "We partner only with manufacturers who share our commitment to ethical production and premium materials." },
  { icon: Globe, title: "Sustainably Minded", desc: "We are reducing our carbon footprint through responsible sourcing, minimal packaging, and long-lasting design." },
  { icon: Users, title: "Community First", desc: "FanMid was born in Lagos. We are proud to support local creatives and give back to the communities we serve." },
];

const STATS = [
  { value: "2K+", label: "Products" },
  { value: "15K+", label: "Happy Customers" },
  { value: "50+", label: "Brand Partners" },
  { value: "4.9★", label: "Average Rating" },
];

const TEAM = [
  { name: "Emmanuel Faniyi", role: "Founder & CEO", image: "https://res.cloudinary.com/deeqdbuup/image/upload/v1775650657/z6bqcdd5muomxuj0x9wd.jpg" },
  { name: "Chioma Obi", role: "Creative Director", image: "https://res.cloudinary.com/deeqdbuup/image/upload/v1775650657/z6bqcdd5muomxuj0x9wd.jpg" },
  { name: "Tunde Alabi", role: "Head of Operations", image: "https://res.cloudinary.com/deeqdbuup/image/upload/v1775650657/z6bqcdd5muomxuj0x9wd.jpg" },
];

export default function AboutPage() {
  return (
    <main style={{ backgroundColor: "var(--bg-primary)", minHeight: "100vh" }}>
      <Navbar />

      {/* Hero */}
      <section className="relative pt-40 pb-24 px-6 lg:px-10 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: "linear-gradient(var(--text-primary) 1px, transparent 1px), linear-gradient(90deg, var(--text-primary) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        <div className="absolute top-20 right-0 w-96 h-96 rounded-full blur-[120px] opacity-10 pointer-events-none"
          style={{ backgroundColor: "var(--accent)" }} />
        <div className="max-w-7xl mx-auto">
          <p className="text-xs tracking-[0.3em] uppercase font-['DM_Sans'] mb-4" style={{ color: "var(--accent)" }}>Our Story</p>
          <h1 className="text-5xl md:text-7xl font-black font-['Playfair_Display'] leading-[1.05] max-w-3xl" style={{ color: "var(--text-primary)" }}>
            Fashion built on<br />
            <span style={{ color: "var(--accent)" }}>substance.</span>
          </h1>
          <p className="text-lg font-['DM_Sans'] leading-relaxed max-w-xl mt-8" style={{ color: "var(--text-secondary)" }}>
            FanMid was founded in Lagos with one belief: that premium fashion should be accessible, ethical, and built to last. We curate with intention — not trends.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-6 lg:px-10 border-y" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-secondary)" }}>
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="text-4xl font-black font-['Playfair_Display']" style={{ color: "var(--accent)" }}>{value}</p>
              <p className="text-xs tracking-widest uppercase font-['DM_Sans'] mt-1" style={{ color: "var(--text-muted)" }}>{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Story */}
      <section className="py-24 px-6 lg:px-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-xs tracking-[0.3em] uppercase font-['DM_Sans'] mb-4" style={{ color: "var(--accent)" }}>How it started</p>
            <h2 className="text-4xl font-black font-['Playfair_Display'] mb-6" style={{ color: "var(--text-primary)" }}>
              Started from Lagos,<br />built for the world.
            </h2>
            <div className="space-y-4 font-['DM_Sans'] text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              <p>FanMid began as a small curation project — Emmanuel Faniyi, frustrated by fast fashion and inspired by the timeless dressing of his grandfather, started sourcing premium pieces that told a story.</p>
              <p>What started as a passion project quickly grew into a full e-commerce brand, serving thousands of customers across Nigeria and beyond. Our philosophy has never changed: invest in fewer, better things.</p>
              <p>Today, FanMid partners with 50+ ethical brands worldwide, offering a carefully edited selection of clothing and accessories that are built to last decades, not seasons.</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 h-[450px]">
            <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&q=80" alt="Store" className="w-full h-full object-cover" style={{ gridRow: "1 / 3" }} />
            <img src="https://images.unsplash.com/photo-1558171813-f9f8c13b6f5f?w=400&q=80" alt="Fashion" className="w-full object-cover" style={{ height: "210px" }} />
            <img src="https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=400&q=80" alt="Products" className="w-full object-cover" style={{ height: "210px" }} />
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 px-6 lg:px-10" style={{ backgroundColor: "var(--bg-secondary)" }}>
        <div className="max-w-7xl mx-auto">
          <div className="mb-14">
            <p className="text-xs tracking-[0.3em] uppercase font-['DM_Sans'] mb-3" style={{ color: "var(--accent)" }}>What we stand for</p>
            <h2 className="text-4xl font-black font-['Playfair_Display']" style={{ color: "var(--text-primary)" }}>Our Values</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="p-6 border space-y-4" style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border)" }}>
                <div className="w-10 h-10 flex items-center justify-center" style={{ backgroundColor: "color-mix(in srgb, var(--accent) 12%, transparent)", color: "var(--accent)" }}>
                  <Icon size={18} />
                </div>
                <h3 className="font-bold font-['DM_Sans']" style={{ color: "var(--text-primary)" }}>{title}</h3>
                <p className="text-sm font-['DM_Sans'] leading-relaxed" style={{ color: "var(--text-secondary)" }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 px-6 lg:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="mb-14">
            <p className="text-xs tracking-[0.3em] uppercase font-['DM_Sans'] mb-3" style={{ color: "var(--accent)" }}>The people</p>
            <h2 className="text-4xl font-black font-['Playfair_Display']" style={{ color: "var(--text-primary)" }}>Meet the Team</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl">
            {TEAM.map(({ name, role, image }) => (
              <div key={name} className="group">
                <div className="overflow-hidden aspect-[3/4] mb-4" style={{ backgroundColor: "var(--card-bg)" }}>
                  <img src={image} alt={name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <h3 className="font-bold font-['DM_Sans']" style={{ color: "var(--text-primary)" }}>{name}</h3>
                <p className="text-xs tracking-widest uppercase font-['DM_Sans'] mt-0.5" style={{ color: "var(--accent)" }}>{role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 lg:px-10 border-t text-center" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-secondary)" }}>
        <div className="max-w-xl mx-auto">
          <h2 className="text-4xl font-black font-['Playfair_Display'] mb-4" style={{ color: "var(--text-primary)" }}>
            Ready to elevate your style?
          </h2>
          <p className="text-sm font-['DM_Sans'] mb-8" style={{ color: "var(--text-muted)" }}>
            Browse our curated collection and find pieces that truly last.
          </p>
          <a href="/shop" className="inline-flex items-center gap-2 px-10 py-4 text-sm font-bold tracking-widest uppercase font-['DM_Sans'] hover:opacity-80 transition-opacity"
            style={{ backgroundColor: "var(--accent)", color: "#000" }}>
            Shop the Collection
          </a>
        </div>
      </section>

      <Footer />
    </main>
  );
}