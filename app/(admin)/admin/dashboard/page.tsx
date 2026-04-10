"use client";

import { ShoppingBag, Users, Package, DollarSign, Loader2 } from "lucide-react";
import StatCard from "@/src/components/admindashboard/StatCard";
import Link from "next/link";
import { useQuery } from "@apollo/client/react";
import gql from "graphql-tag";

const STATS = [
  {
    label: "Total Revenue",
    value: "12,430",
    prefix: "$",
    change: 14.2,
    icon: DollarSign,
  },
  { label: "Total Orders", value: "284", change: 8.1, icon: ShoppingBag },
  { label: "Total Products", value: "148", change: 2.4, icon: Package },
  { label: "Total Customers", value: "1,092", change: -3.5, icon: Users },
];

const RECENT_ORDERS = [
  {
    id: "#ORD-001",
    customer: "Ade Bello",
    product: "Leather Jacket",
    amount: 299.99,
    status: "Delivered",
    date: "Mar 20",
  },
  {
    id: "#ORD-002",
    customer: "Chioma Obi",
    product: "Linen Shirt",
    amount: 79.99,
    status: "Processing",
    date: "Mar 21",
  },
  {
    id: "#ORD-003",
    customer: "Tunde Alabi",
    product: "Cargo Pants",
    amount: 129.99,
    status: "Shipped",
    date: "Mar 22",
  },
  {
    id: "#ORD-004",
    customer: "Ngozi Eze",
    product: "Oversized Tee",
    amount: 49.99,
    status: "Pending",
    date: "Mar 23",
  },
  {
    id: "#ORD-005",
    customer: "Emeka Nwosu",
    product: "Wool Overcoat",
    amount: 349.99,
    status: "Delivered",
    date: "Mar 24",
  },
];

const STATUS_STYLES: Record<string, { bg: string; color: string }> = {
  Delivered: {
    bg: "color-mix(in srgb, #22c55e 12%, transparent)",
    color: "#22c55e",
  },
  Shipped: {
    bg: "color-mix(in srgb, #3b82f6 12%, transparent)",
    color: "#3b82f6",
  },
  Processing: {
    bg: "color-mix(in srgb, var(--accent) 12%, transparent)",
    color: "var(--accent)",
  },
  Pending: {
    bg: "color-mix(in srgb, #f59e0b 12%, transparent)",
    color: "#f59e0b",
  },
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

export default function DashboardPage() {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
  
    const { data, loading: userLoading } = useQuery<{
      me: {
        id: string;
        name: string;
        email: string;
        phone: string;
        address: string;
        createdAt: string;
      };
    }>(ME_QUERY, {
      skip: !token,
    });

    //  if (userLoading) {
    //     return (
    //       <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#080808" }}>
    //         <Loader2 className="animate-spin" size={24} />
    //       </div>
    //     );
    //   }

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h2
          className="text-2xl font-black font-['Playfair_Display']"
          style={{ color: "var(--text-primary)" }}
        >
          Good morning, {data?.me?.name} 👋
        </h2>
        <p
          className="text-sm font-['DM_Sans'] mt-1"
          style={{ color: "var(--text-muted)" }}
        >
          Here's what's happening with your store today.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {STATS.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      {/* Recent orders */}
      <div
        className="border"
        style={{
          backgroundColor: "var(--card-bg)",
          borderColor: "var(--border)",
        }}
      >
        {/* Table header */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b"
          style={{ borderColor: "var(--border)" }}
        >
          <h3
            className="text-sm font-bold font-['DM_Sans']"
            style={{ color: "var(--text-primary)" }}
          >
            Recent Orders
          </h3>
          <Link
            href="/admin/orders"
            className="text-xs tracking-widest uppercase font-['DM_Sans'] transition-opacity hover:opacity-60"
            style={{ color: "var(--accent)" }}
          >
            View All
          </Link>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                {[
                  "Order",
                  "Customer",
                  "Product",
                  "Amount",
                  "Status",
                  "Date",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-6 py-3 text-left text-[10px] tracking-[0.2em] uppercase font-bold font-['DM_Sans']"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {RECENT_ORDERS.map((order, i) => (
                <tr
                  key={order.id}
                  style={{
                    borderBottom:
                      i < RECENT_ORDERS.length - 1
                        ? "1px solid var(--border)"
                        : "none",
                  }}
                >
                  <td className="px-6 py-4">
                    <span
                      className="text-xs font-bold font-['DM_Sans']"
                      style={{ color: "var(--accent)" }}
                    >
                      {order.id}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className="text-sm font-['DM_Sans']"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {order.customer}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className="text-sm font-['DM_Sans']"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {order.product}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className="text-sm font-bold font-['DM_Sans']"
                      style={{ color: "var(--text-primary)" }}
                    >
                      ${order.amount}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className="text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 font-['DM_Sans']"
                      style={STATUS_STYLES[order.status]}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className="text-xs font-['DM_Sans']"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {order.date}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
