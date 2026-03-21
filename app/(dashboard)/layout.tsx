import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "User Dashboard - FanMidCommerce",
  description:
    "A fan-made e-commerce website built with Next.js and TypeScript.",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white p-5">
        <h2 className="text-xl font-bold mb-6">Dashboard</h2>

        <nav className="flex flex-col gap-4">
          <Link href="/dashboard">Overview</Link>
          <Link href="/dashboard/orders">Orders</Link>
          <Link href="/dashboard/profile">Profile</Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 bg-gray-400">
        {children}
      </main>
    </div>
  );
}
