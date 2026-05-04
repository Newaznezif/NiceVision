import React from "react";
import { AdminSidebar } from "@/components/layout/admin-sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex bg-brand-black min-h-screen text-white">
      <AdminSidebar />
      <main className="flex-grow ml-64 p-10">
        {children}
      </main>
    </div>
  );
}
