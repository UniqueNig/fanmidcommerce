import { Truck, ShieldCheck, RefreshCw, Headphones } from "lucide-react";

const PROPS = [
  { icon: Truck, title: "Nationwide Delivery", desc: "Fast, tracked shipping across Nigeria." },
  { icon: ShieldCheck, title: "Secure Payments", desc: "Protected checkout powered by Paystack." },
  { icon: RefreshCw, title: "Easy Returns", desc: "14-day hassle-free return policy." },
  { icon: Headphones, title: "Real Support", desc: "We're here to help, every step." },
];

export default function ValueProps() {
  return (
    <section
      className="py-12 px-6 lg:px-10 border-y"
      style={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--border)" }}
    >
      <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8">
        {PROPS.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="flex items-start gap-3">
            <div
              className="w-10 h-10 flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: "color-mix(in srgb, var(--accent) 12%, transparent)", color: "var(--accent)" }}
            >
              <Icon size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold font-['DM_Sans']" style={{ color: "var(--text-primary)" }}>
                {title}
              </h3>
              <p className="text-xs font-['DM_Sans'] mt-0.5 leading-relaxed" style={{ color: "var(--text-muted)" }}>
                {desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
