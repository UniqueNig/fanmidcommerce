import Link from "next/link";

export default function Footer() {
  return (
    <footer
      className="border-t py-16 px-6 lg:px-10"
      style={{
        backgroundColor: "var(--bg-secondary)",
        borderColor: "var(--border)",
      }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-14">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <span
              className="text-2xl font-black tracking-tighter font-['Playfair_Display']"
              style={{ color: "var(--text-primary)" }}
            >
              FAN<span style={{ color: "var(--accent)" }}>MID</span>
            </span>
            <p
              className="text-sm mt-4 leading-relaxed font-['DM_Sans'] max-w-xs"
              style={{ color: "var(--text-muted)" }}
            >
              Premium fashion curated for those who define their own aesthetic.
            </p>
          </div>

          {/* Links */}
          {[
            {
              title: "Shop",
              links: [
                { label: "All Products", href: "/shop" },
                { label: "Categories", href: "/categories" },
                { label: "Search", href: "/search" },
                { label: "Cart", href: "/cart" },
              ],
            },
            {
              title: "Company",
              links: [
                { label: "About", href: "/about" },
                { label: "Contact", href: "/contact" },
                { label: "FAQ", href: "/faq" },
              ],
            },
            {
              title: "Support",
              links: [
                { label: "Shipping & Returns", href: "/shipping-returns" },
                { label: "FAQ", href: "/faq" },
                { label: "Contact", href: "/contact" },
                { label: "My Orders", href: "/dashboard/orders" },
              ],
            },
          ].map((col) => (
            <div key={col.title}>
              <h4
                className="text-xs tracking-widest uppercase mb-5 font-['DM_Sans'] font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                {col.title}
              </h4>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="footer-link text-sm transition-colors duration-200 font-['DM_Sans']"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          className="border-t pt-8 flex flex-col md:flex-row items-center justify-between gap-4"
          style={{ borderColor: "var(--border)" }}
        >
          <p
            className="text-xs font-['DM_Sans'] tracking-wide"
            style={{ color: "var(--text-secondary)" }}
          >
            © {new Date().getFullYear()} FanMidCommerce. All rights reserved.
          </p>

          <div className="flex gap-6">
            {[
              { label: "Privacy", href: "/privacy" },
              { label: "Terms", href: "/terms" },
              { label: "Shipping & Returns", href: "/shipping-returns" },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="footer-link text-xs transition-colors duration-200 font-['DM_Sans'] tracking-wide"
                style={{ color: "var(--text-muted)" }}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}