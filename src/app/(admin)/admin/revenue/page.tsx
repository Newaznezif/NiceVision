"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  DollarSign, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  Download,
  Calendar,
  Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";

const transactions = [
  { id: "T1", client: "Alice Munyana", service: "Wedding Story", amount: 1200, status: "Completed", date: "May 10, 2026" },
  { id: "T2", client: "Bob Ndayisaba", service: "Classic Portrait", amount: 300, status: "Completed", date: "May 12, 2026" },
  { id: "T3", client: "Marie Ange", service: "Deposit - Wedding", amount: 300, status: "Pending", date: "May 14, 2026" },
];

export default function AdminRevenue() {
  const [filterStatus, setFilterStatus] = React.useState("All");
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);

  const filteredTransactions = transactions.filter(t => 
    filterStatus === "All" || t.status === filterStatus
  );

  return (
    <div className="space-y-10">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold">Revenue Analytics</h1>
          <p className="text-white/50 text-sm">Track your earnings and financial performance.</p>
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <Button 
              variant="outline" 
              className="h-10 bg-white/5"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <Filter className="w-4 h-4 mr-2" /> {filterStatus === "All" ? "Filter" : filterStatus}
            </Button>
            {isFilterOpen && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setIsFilterOpen(false)}
                />
                <div className="absolute top-full right-0 mt-2 w-32 bg-black border border-white/10 shadow-xl z-20">
                  {["All", "Completed", "Pending"].map(status => (
                    <button
                      key={status}
                      onClick={() => {
                        setFilterStatus(status);
                        setIsFilterOpen(false);
                      }}
                      className="w-full text-left px-4 py-3 text-xs uppercase tracking-widest transition-colors hover:bg-white/5 text-white/70 hover:text-white"
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
          <Button className="h-10">
            <Download className="w-4 h-4 mr-2" /> Export CSV
          </Button>
        </div>
      </header>

      {/* Financial Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { label: "Total Earnings", value: 12500, trend: "+15%", icon: DollarSign },
          { label: "Pending Deposits", value: 1800, trend: "+5%", icon: Calendar },
          { label: "Net Profit", value: 9200, trend: "+12%", icon: TrendingUp },
        ].map((stat, i) => (
          <div key={i} className="p-8 bg-white/5 border border-white/10 space-y-4">
            <div className="flex justify-between items-start">
              <div className="p-3 bg-gold/10 text-gold">
                <stat.icon className="w-6 h-6" />
              </div>
              <span className="text-green-400 text-xs font-bold flex items-center">
                {stat.trend} <ArrowUpRight className="w-3 h-3 ml-1" />
              </span>
            </div>
            <div>
              <p className="text-white/30 text-[10px] uppercase tracking-widest">{stat.label}</p>
              <h2 className="text-3xl font-serif font-bold">{formatPrice(stat.value)}</h2>
            </div>
          </div>
        ))}
      </div>

      {/* Chart Placeholder */}
      <div className="aspect-[21/9] bg-white/5 border border-white/10 p-10 flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 flex items-end">
           {/* Simple CSS wave/bar visual */}
           {[40, 70, 45, 90, 65, 80, 50, 85, 60, 75].map((h, i) => (
             <div key={i} style={{ height: `${h}%` }} className="flex-1 bg-gold mx-1" />
           ))}
        </div>
        <div className="relative z-10 text-center space-y-2">
          <TrendingUp className="w-12 h-12 text-gold mx-auto mb-4" />
          <h3 className="text-xl font-serif font-bold italic">Earnings Growth</h3>
          <p className="text-white/40 text-sm">Visualizing your monthly performance across Bujumbura.</p>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="space-y-6">
        <h2 className="text-xl font-serif font-bold italic">Recent Transactions</h2>
        <div className="bg-white/5 border border-white/10 overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-[10px] uppercase tracking-widest text-white/30">
                <th className="p-6 font-normal">Transaction ID</th>
                <th className="p-6 font-normal">Client</th>
                <th className="p-6 font-normal">Service</th>
                <th className="p-6 font-normal">Date</th>
                <th className="p-6 font-normal text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-white/30 italic">
                    No transactions found matching your filter.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((t) => (
                  <tr key={t.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                    <td className="p-6 font-mono text-xs text-gold">{t.id}</td>
                    <td className="p-6 font-bold">{t.client}</td>
                    <td className="p-6 text-white/50">{t.service}</td>
                    <td className="p-6 text-white/40">{t.date}</td>
                    <td className="p-6 text-right font-bold">{formatPrice(t.amount)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
