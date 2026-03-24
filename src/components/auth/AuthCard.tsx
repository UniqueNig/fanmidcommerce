import Link from "next/link";

type AuthCardProps = {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  footerText: string;
  footerLinkText: string;
  footerLinkHref: string;
};

export default function AuthCard({
  children,
  title,
  subtitle,
  footerText,
  footerLinkText,
  footerLinkHref,
}: AuthCardProps) {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-16"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      {/* Background decoration */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(var(--text-primary) 1px, transparent 1px), linear-gradient(90deg, var(--text-primary) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div
        className="fixed top-0 right-0 w-[500px] h-[500px] rounded-full blur-[150px] pointer-events-none opacity-20"
        style={{ backgroundColor: "var(--accent)" }}
      />

      <div className="relative w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-10">
          <Link href="/">
            <span
              className="text-3xl font-black tracking-tighter font-['Playfair_Display']"
              style={{ color: "var(--text-primary)" }}
            >
              FAN<span style={{ color: "var(--accent)" }}>MID</span>
            </span>
          </Link>
        </div>

        {/* Card */}
        <div
          className="border p-8 md:p-10"
          style={{
            backgroundColor: "var(--card-bg)",
            borderColor: "var(--border)",
          }}
        >
          {/* Header */}
          <div className="mb-8">
            <h1
              className="text-2xl font-black font-['Playfair_Display'] mb-2"
              style={{ color: "var(--text-primary)" }}
            >
              {title}
            </h1>
            <p
              className="text-sm font-['DM_Sans']"
              style={{ color: "var(--text-muted)" }}
            >
              {subtitle}
            </p>
          </div>

          {/* Form content */}
          {children}
        </div>

        {/* Footer link */}
        <p
          className="text-center text-sm font-['DM_Sans'] mt-6"
          style={{ color: "var(--text-muted)" }}
        >
          {footerText}{" "}
          <Link
            href={footerLinkHref}
            className="font-bold transition-colors hover:opacity-70"
            style={{ color: "var(--accent)" }}
          >
            {footerLinkText}
          </Link>
        </p>
      </div>
    </div>
  );
}