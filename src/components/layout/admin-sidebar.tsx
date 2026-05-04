"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Calendar, 
  Image as ImageIcon, 
  Users, 
  Package, 
  MessageSquare, 
  FileText, 
  Settings,
  LogOut,
  Camera
} from "lucide-react";
import { cn } from "@/lib/utils";

const adminLinks = [
  { name: "Overview", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Bookings", href: "/admin/bookings", icon: Calendar },
  { name: "Portfolio", href: "/admin/portfolio", icon: ImageIcon },
  { name: "Clients", href: "/admin/clients", icon: Users },
  { name: "Services", href: "/admin/services", icon: Package },
  { name: "Messages", href: "/admin/messages", icon: MessageSquare },
  { name: "Blog", href: "/admin/blog", icon: FileText },
  { name: "About", href: "/admin/about", icon: FileText }, // Add About
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 h-screen bg-black border-r border-white/10 flex flex-col fixed left-0 top-0 z-50">
      <div className="p-8 border-b border-white/10">
        <Link href="/" className="flex items-center gap-2 group">
          <Camera className="w-6 h-6 text-gold" />
          <span className="text-xl font-serif font-bold tracking-widest uppercase">
            Nice <span className="text-gold">Vision</span>
          </span>
        </Link>
        <span className="text-[8px] uppercase tracking-[0.4em] text-white/30 block mt-1">Admin Panel</span>
      </div>

      <nav className="flex-grow p-4 space-y-2 mt-4">
        {adminLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex items-center gap-3 px-4 py-3 text-sm transition-all duration-300 group",
              pathname === link.href 
                ? "bg-gold text-black font-bold" 
                : "text-white/50 hover:text-white hover:bg-white/5"
            )}
          >
            <link.icon className={cn("w-5 h-5", pathname === link.href ? "text-black" : "text-gold")} />
            {link.name}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-white/10 space-y-2">
        <Link
          href="/admin/settings"
          className="flex items-center gap-3 px-4 py-3 text-sm text-white/50 hover:text-white transition-all"
        >
          <Settings className="w-5 h-5" />
          Settings
        </Link>
        <button
          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:text-red-300 transition-all"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </div>
  );
}
