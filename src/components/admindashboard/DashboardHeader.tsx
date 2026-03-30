"use client";

import { usePathname, useRouter } from "next/navigation";
import { Menu, Bell, Search, LogOut } from "lucide-react";
import ThemeToggle from "@/src/components/ui/ThemeToggle";

type DashboardHeaderProps = {
  onMenuOpen: () => void;
  userName?: string;
};

const PAGE_TITLES: Record<string, string> = {
  "/admin/dashboard": "Dashboard",
  "/admin/orders": "Orders",
  "/admin/products": "Products",
  "/admin/customers": "Customers",
  "/admin/categories": "Categories",
  "/admin/admins": "Admins User Management",
  "/admin/profile": "Profile",
  "/admin/settings": "Settings",
};

export default function DashboardHeader({
  onMenuOpen,
  userName = "Emmanuel",
}: DashboardHeaderProps) {
  const pathname = usePathname();
  const title = PAGE_TITLES[pathname] ?? "Dashboard";

  const router = useRouter();

  const handleLogout = () => {
    document.cookie = "token=; path=/; max-age=0";

    // Redirect
    // window.location.href = "/login";
    router.push("/admin/login");
  };

  return (
    <header
      className="h-16 flex items-center justify-between px-6 border-b flex-shrink-0 sticky top-0 z-30"
      style={{
        backgroundColor: "var(--bg-primary)",
        borderColor: "var(--border)",
      }}
    >
      {/* Left — mobile menu + page title */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuOpen}
          className="lg:hidden transition-opacity hover:opacity-60"
          style={{ color: "var(--text-secondary)" }}
        >
          <Menu size={20} />
        </button>
        <div>
          <h1
            className="text-lg font-black font-['Playfair_Display'] leading-none"
            style={{ color: "var(--text-primary)" }}
          >
            {title}
          </h1>
        </div>
      </div>

      {/* Right — search, notifications, theme, avatar */}
      <div className="flex items-center gap-3">
        {/* Search — desktop only */}
        <div
          className="hidden md:flex items-center gap-2 px-3 py-2 border text-sm font-['DM_Sans']"
          style={{
            backgroundColor: "var(--bg-secondary)",
            borderColor: "var(--border)",
            color: "var(--text-muted)",
          }}
        >
          <Search size={13} />
          <span className="text-xs">Search...</span>
        </div>

        {/* Notifications */}
        <button
          className="relative w-9 h-9 flex items-center justify-center border transition-opacity hover:opacity-60"
          style={{
            borderColor: "var(--border)",
            color: "var(--text-secondary)",
          }}
        >
          <Bell size={15} />
          {/* Unread dot */}
          <span
            className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: "var(--accent)" }}
          />
        </button>

        <ThemeToggle />

        {/* Avatar */}
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 flex items-center justify-center text-xs font-black font-['Playfair_Display']"
            style={{ backgroundColor: "var(--accent)", color: "#000" }}
          >
            {userName.charAt(0).toUpperCase()}
          </div>
          <span
            className="hidden md:block text-sm font-medium font-['DM_Sans']"
            style={{ color: "var(--text-primary)" }}
          >
            {userName}
          </span>
        </div>
        <button
          onClick={handleLogout}
          // className="w-full flex items-center gap-2 px-4 py-2 text-sm font-['DM_Sans'] transition-all duration-200 hover:opacity-70"
          style={{ color: "#ef4444" }}
        >
          <LogOut size={15} />
          {/* <span>Logout</span> */}
        </button>
      </div>
    </header>
  );
}
