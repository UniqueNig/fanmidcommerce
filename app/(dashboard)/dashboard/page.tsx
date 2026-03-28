"use client";

import Link from "next/link";
import { ShoppingBag, Heart, MapPin, ArrowRight, Package } from "lucide-react";
import gql from "graphql-tag";
import { useQuery } from "@apollo/client/react";

const QUICK_LINKS = [
  { label: "My Orders", sub: "Track & manage your orders", href: "/dashboard/orders", icon: ShoppingBag, count: "4 orders" },
  { label: "Wishlist", sub: "Items you've saved", href: "/dashboard/wishlist", icon: Heart, count: "7 items" },
  { label: "Addresses", sub: "Manage delivery addresses", href: "/dashboard/addresses", icon: MapPin, count: "2 saved" },
];

const RECENT_ORDERS = [
  { id: "#ORD-084", product: "Leather Jacket", amount: 299.99, status: "Delivered", date: "Mar 20, 2025" },
  { id: "#ORD-083", product: "Linen Shirt", amount: 79.99, status: "Shipped", date: "Mar 18, 2025" },
  { id: "#ORD-082", product: "Cargo Pants", amount: 129.99, status: "Pending", date: "Mar 15, 2025" },
];

const STATUS_STYLES: Record<string, { bg: string; color: string }> = {
  Delivered: { bg: "color-mix(in srgb, #22c55e 12%, transparent)", color: "#22c55e" },
  Shipped:   { bg: "color-mix(in srgb, #3b82f6 12%, transparent)", color: "#3b82f6" },
  Pending:   { bg: "color-mix(in srgb, #f59e0b 12%, transparent)", color: "#f59e0b" },
  Failed:    { bg: "color-mix(in srgb, #ef4444 12%, transparent)", color: "#ef4444" },
  Paid:      { bg: "color-mix(in srgb, #22c55e 12%, transparent)", color: "#22c55e" },
};

const ME_QUERY = gql`
  query Me {
    me {
      id
      name
      email
      phone
      address
      createdAt
    }
  }
`;

export default function AccountPage() {
   const { data, loading: userLoading } = useQuery<{
      me: {
        id: string;
        name: string;
        email: string;
        phone: string;
        address: string;
        createdAt: string;
      };
    }>(ME_QUERY);
  return (
    <div className="space-y-8 max-w-4xl">

      {/* Welcome */}
      <div>
        <h2
          className="text-2xl font-black font-['Playfair_Display']"
          style={{ color: "var(--text-primary)" }}
        >
          Welcome back, {data?.me?.name} 👋
        </h2>
        <p
          className="text-sm font-['DM_Sans'] mt-1"
          style={{ color: "var(--text-muted)" }}
        >
          Manage your orders, wishlist, and account details.
        </p>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {QUICK_LINKS.map(({ label, sub, href, icon: Icon, count }) => (
          <Link
            key={href}
            href={href}
            className="group p-5 border flex flex-col gap-4 transition-all duration-200 hover:border-[var(--accent)]"
            style={{
              backgroundColor: "var(--card-bg)",
              borderColor: "var(--border)",
            }}
          >
            <div className="flex items-start justify-between">
              <div
                className="w-10 h-10 flex items-center justify-center"
                style={{
                  backgroundColor: "color-mix(in srgb, var(--accent) 12%, transparent)",
                  color: "var(--accent)",
                }}
              >
                <Icon size={16} />
              </div>
              <ArrowRight
                size={14}
                className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200"
                style={{ color: "var(--accent)" }}
              />
            </div>
            <div>
              <p
                className="text-sm font-bold font-['DM_Sans']"
                style={{ color: "var(--text-primary)" }}
              >
                {label}
              </p>
              <p
                className="text-xs font-['DM_Sans'] mt-0.5"
                style={{ color: "var(--text-muted)" }}
              >
                {sub}
              </p>
            </div>
            <p
              className="text-[10px] tracking-widest uppercase font-bold font-['DM_Sans']"
              style={{ color: "var(--accent)" }}
            >
              {count}
            </p>
          </Link>
        ))}
      </div>

      {/* Recent orders */}
      <div
        className="border"
        style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border)" }}
      >
        <div
          className="flex items-center justify-between px-6 py-4 border-b"
          style={{ borderColor: "var(--border)" }}
        >
          <div className="flex items-center gap-2">
            <Package size={15} style={{ color: "var(--accent)" }} />
            <h3
              className="text-sm font-bold font-['DM_Sans']"
              style={{ color: "var(--text-primary)" }}
            >
              Recent Orders
            </h3>
          </div>
          <Link
            href="/account/orders"
            className="text-xs tracking-widest uppercase font-['DM_Sans'] transition-opacity hover:opacity-60"
            style={{ color: "var(--accent)" }}
          >
            View All
          </Link>
        </div>

        <div className="divide-y" style={{ borderColor: "var(--border)" }}>
          {RECENT_ORDERS.map((order) => (
            <div
              key={order.id}
              className="flex items-center justify-between px-6 py-4"
              style={{ borderColor: "var(--border)" }}
            >
              <div>
                <p
                  className="text-xs font-bold font-['DM_Sans']"
                  style={{ color: "var(--accent)" }}
                >
                  {order.id}
                </p>
                <p
                  className="text-sm font-['DM_Sans'] mt-0.5"
                  style={{ color: "var(--text-primary)" }}
                >
                  {order.product}
                </p>
                <p
                  className="text-[11px] font-['DM_Sans'] mt-0.5"
                  style={{ color: "var(--text-muted)" }}
                >
                  {order.date}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span
                  className="font-bold font-['DM_Sans'] text-sm"
                  style={{ color: "var(--text-primary)" }}
                >
                  ${order.amount}
                </span>
                <span
                  className="text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 font-['DM_Sans']"
                  style={STATUS_STYLES[order.status]}
                >
                  {order.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}