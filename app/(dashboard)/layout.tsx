"use client";

import { useState } from "react";
import DashboardSidebar from "@/src/components/userdashboard/DashboardSidebar";
import DashboardHeader from "@/src/components/userdashboard/DashboardHeader";

export default function DashboardLayout({
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
      {/* Sidebar */}
      <DashboardSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <DashboardHeader
          onMenuOpen={() => setSidebarOpen(true)}
          userName="Emmanuel"
        />

        {/* Scrollable content */}
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
