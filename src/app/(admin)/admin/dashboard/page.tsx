"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Users, 
  Calendar, 
  TrendingUp, 
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Clock
} from "lucide-react";
import { formatPrice, cn } from "@/lib/utils";
import Link from "next/link";
import { toast } from "sonner";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const stats = [
  { name: "Total Revenue", value: 12500, icon: DollarSign, trend: "+12.5%", positive: true },
  { name: "New Bookings", value: 48, icon: Calendar, trend: "+8.2%", positive: true },
  { name: "Active Clients", value: 156, icon: Users, trend: "+5.1%", positive: true },
  { name: "Avg. Session", value: "3.5h", icon: Clock, trend: "-2.1%", positive: false },
];

const recentBookings = [
  { id: 1, client: "Alice Munyana", package: "Wedding Story", date: "May 15, 2026", status: "Approved", amount: 1200 },
  { id: 2, client: "Bob Ndayisaba", package: "Classic Portrait", date: "May 18, 2026", status: "Pending", amount: 300 },
  { id: 3, client: "Clara Gateka", package: "Fashion Shoot", date: "May 20, 2026", status: "Approved", amount: 450 },
  { id: 4, client: "David Kamana", package: "Event Coverage", date: "May 22, 2026", status: "Pending", amount: 600 },
];

export default function AdminDashboard() {
  const handleGenerateReport = () => {
    try {
      const doc = new jsPDF();
      
      // Header
      doc.setFontSize(22);
      doc.setTextColor(212, 175, 55); // Gold color
      doc.text("Nice Vision Dashboard Report", 14, 22);
      
      doc.setFontSize(11);
      doc.setTextColor(100, 100, 100);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

      // Stats Summary Section
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text("Executive Summary", 14, 45);

      const statData = stats.map(s => [s.name, String(s.value), s.trend]);
      
      autoTable(doc, {
        startY: 50,
        head: [['Metric', 'Value', 'Trend']],
        body: statData,
        theme: 'grid',
        headStyles: { fillColor: [212, 175, 55], textColor: 0 },
        styles: { fontSize: 10, cellPadding: 4 }
      });

      // Recent Bookings Table
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text("Recent Bookings Overview", 14, (doc as any).lastAutoTable.finalY + 15);

      const tableColumn = ["ID", "Client", "Package", "Date", "Status", "Amount"];
      const tableRows = recentBookings.map(b => [
        `#${b.id}`, 
        b.client, 
        b.package, 
        b.date, 
        b.status, 
        `$${b.amount}`
      ]);

      autoTable(doc, {
        startY: (doc as any).lastAutoTable.finalY + 20,
        head: [tableColumn],
        body: tableRows,
        theme: 'striped',
        headStyles: { fillColor: [20, 20, 20], textColor: 255 },
        styles: { fontSize: 10, cellPadding: 4 }
      });

      doc.save(`nicevision-report-${new Date().toISOString().split('T')[0]}.pdf`);
      toast.success("Professional PDF report generated and downloaded.");
    } catch (error) {
      toast.error("Failed to generate PDF report.");
    }
  };

  return (
    <div className="space-y-10">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold">Dashboard Overview</h1>
          <p className="text-white/50 text-sm">Welcome back, Kim. Here's what's happening today.</p>
        </div>
        <button 
          onClick={handleGenerateReport}
          className="px-6 py-2 bg-gold text-black text-xs font-bold uppercase tracking-widest hover:bg-gold-light transition-all active:scale-95"
        >
          Generate Report
        </button>

      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => {
          const href = stat.name.includes("Revenue") ? "/admin/revenue" : 
                       stat.name.includes("Bookings") ? "/admin/bookings" :
                       stat.name.includes("Clients") ? "/admin/clients" : "/admin/dashboard";
          
          return (
            <motion.div
              key={stat.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="group"
            >
              <Link href={href} className="block p-6 bg-white/5 border border-white/10 hover:border-gold/50 transition-all cursor-pointer h-full">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-gold/10 text-gold group-hover:bg-gold group-hover:text-black transition-colors">
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <div className={cn(
                    "flex items-center text-xs font-bold",
                    stat.positive ? "text-green-400" : "text-red-400"
                  )}>
                    {stat.trend}
                    {stat.positive ? <ArrowUpRight className="w-3 h-3 ml-1" /> : <ArrowDownRight className="w-3 h-3 ml-1" />}
                  </div>
                </div>
                <h3 className="text-white/50 text-[10px] uppercase tracking-widest font-bold">{stat.name}</h3>
                <p className="text-2xl font-serif font-bold mt-1 group-hover:text-gold transition-colors">
                  {typeof stat.value === "number" ? formatPrice(stat.value) : stat.value}
                </p>
              </Link>
            </motion.div>
          );
        })}
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Recent Bookings */}
        <div className="lg:col-span-2 bg-white/5 border border-white/10 p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-serif font-bold italic">Recent Bookings</h2>
            <Link href="/admin/bookings" className="text-xs text-gold uppercase tracking-widest font-bold hover:underline">View All</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/10 text-[10px] uppercase tracking-[0.2em] text-white/30">
                  <th className="pb-4 font-normal">Client</th>
                  <th className="pb-4 font-normal">Package</th>
                  <th className="pb-4 font-normal">Date</th>
                  <th className="pb-4 font-normal">Status</th>
                  <th className="pb-4 font-normal text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {recentBookings.map((booking) => (
                  <tr 
                    key={booking.id} 
                    className="border-b border-white/5 last:border-0 hover:bg-white/[0.05] transition-colors cursor-pointer group"
                    onClick={() => window.location.href = `/admin/bookings/${booking.id}`}
                  >
                    <td className="py-4 font-medium group-hover:text-gold transition-colors">{booking.client}</td>
                    <td className="py-4 text-white/50">{booking.package}</td>
                    <td className="py-4 text-white/50">{booking.date}</td>
                    <td className="py-4">
                      <span className={cn(
                        "px-2 py-1 text-[10px] font-bold uppercase tracking-widest",
                        booking.status === "Approved" ? "bg-green-500/10 text-green-400" : "bg-yellow-500/10 text-yellow-400"
                      )}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="py-4 text-right font-bold text-gold">{formatPrice(booking.amount)}</td>
                  </tr>
                ))}

              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Analytics / Distribution */}
        <div className="bg-white/5 border border-white/10 p-8">
          <h2 className="text-xl font-serif font-bold italic mb-8">Bookings by Category</h2>
          <div className="space-y-6">
            {[
              { label: "Wedding", value: 45, color: "bg-gold" },
              { label: "Portrait", value: 30, color: "bg-white/30" },
              { label: "Fashion", value: 15, color: "bg-white/10" },
              { label: "Events", value: 10, color: "bg-gold/40" },
            ].map((item) => (
              <div key={item.label} className="space-y-2">
                <div className="flex justify-between text-xs uppercase tracking-widest">
                  <span className="text-white/50">{item.label}</span>
                  <span className="text-white font-bold">{item.value}%</span>
                </div>
                <div className="w-full h-1.5 bg-white/5">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${item.value}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={cn("h-full", item.color)} 
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-12 p-4 bg-gold/5 border border-gold/10 text-center">
            <TrendingUp className="w-8 h-8 text-gold mx-auto mb-2" />
            <p className="text-xs text-white/70 uppercase tracking-widest leading-relaxed">
              Booking volume is up <span className="text-gold font-bold">15%</span> compared to last month.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

