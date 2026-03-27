"use client";

import AccountHeader from "@/src/components/account/AccountHeader";
import AccountSidebar from "@/src/components/account/AccountSidebar";
import { useState } from "react";
// import AccountSidebar from "@/src/components/account/AccountSidebar";
// import AccountHeader from "@/src/components/account/AccountHeader";

// Replace with real user from context/query later
const MOCK_USER = {
  name: "John Doe",
  email: "johndoe@gmail.com",
};

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      <AccountSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        userName={MOCK_USER.name}
        userEmail={MOCK_USER.email}
      />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <AccountHeader onMenuOpen={() => setSidebarOpen(true)} />
        <main
          className="flex-1 overflow-y-auto p-6 lg:p-8"
          style={{ backgroundColor: "var(--bg-primary)" }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}