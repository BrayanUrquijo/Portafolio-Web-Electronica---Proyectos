"use client";

import { AdminSidebar } from "@/components/layout/AdminSidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen -mt-16">
      <AdminSidebar />
      <div className="lg:ml-64 min-h-screen p-6 pt-20 lg:pt-6">
        {children}
      </div>
    </div>
  );
}
