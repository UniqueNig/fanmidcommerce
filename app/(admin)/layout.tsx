import Link from "next/link";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard - FanMidCommerce",
  description:
    "A fan-made e-commerce website built with Next.js and TypeScript.",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-black text-white p-5">
        <h2 className="text-xl font-bold mb-6">Admin Panel</h2>

        <nav className="flex flex-col gap-4">
          <Link href="/admin/dashboard">Dashboard</Link>
          <Link href="/admin/products">Products</Link>
          <Link href="/admin/categories">Categories</Link>
          <Link href="/admin/orders">Orders</Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 bg-gray-500">{children}</main>
    </div>
  );
}
