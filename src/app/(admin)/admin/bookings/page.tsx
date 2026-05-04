"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Calendar, 
  Search, 
  Filter, 
  MoreVertical, 
  CheckCircle2, 
  XCircle, 
  Clock,
  ExternalLink
} from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";


const initialBookings = [
  { id: "B1", client: "Alice Munyana", email: "alice@example.com", package: "Wedding Story", date: "May 15, 2026", time: "10:00 AM", status: "Approved", amount: 1200 },
  { id: "B2", client: "Bob Ndayisaba", email: "bob@example.com", package: "Classic Portrait", date: "May 18, 2026", time: "02:00 PM", status: "Pending", amount: 300 },
  { id: "B3", client: "Clara Gateka", email: "clara@example.com", package: "Fashion Shoot", date: "May 20, 2026", time: "11:00 AM", status: "Approved", amount: 450 },
  { id: "B4", client: "David Kamana", email: "david@example.com", package: "Event Coverage", date: "May 22, 2026", time: "04:00 PM", status: "Rejected", amount: 600 },
];

export default function AdminBookings() {
  const [bookings, setBookings] = useState(initialBookings);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleAction = (id: string, action: "Approved" | "Rejected") => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: action } : b));
    toast.success(`Booking ${id} has been ${action.toLowerCase()}.`);
  };

  const filteredBookings = bookings.filter(b => {
    const matchesSearch = b.client.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          b.email.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          b.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === "All" || b.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-10">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold">Manage Bookings</h1>
          <p className="text-white/50 text-sm">Review and manage your photography appointments.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search clients..."
              className="bg-white/5 border border-white/10 pl-10 pr-4 py-2 text-sm focus:border-gold outline-none w-64"
            />
          </div>
          <div className="relative">
            <Button 
              variant="outline" 
              size="sm" 
              className="h-10"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <Filter className={cn("w-4 h-4 mr-2", filterStatus !== "All" && "text-gold")} /> 
              {filterStatus === "All" ? "Filter" : filterStatus}
            </Button>

            {isFilterOpen && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setIsFilterOpen(false)}
                />
                <div className="absolute top-full right-0 mt-2 w-32 bg-black border border-white/10 shadow-xl z-20">
                  {["All", "Approved", "Pending", "Rejected"].map(status => (
                    <button
                      key={status}
                      onClick={() => {
                        setFilterStatus(status);
                        setIsFilterOpen(false);
                      }}
                      className={cn(
                        "w-full text-left px-4 py-3 text-xs uppercase tracking-widest transition-colors hover:bg-white/5",
                        filterStatus === status ? "text-gold font-bold" : "text-white/70"
                      )}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      <div className="bg-white/5 border border-white/10 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/10 text-[10px] uppercase tracking-[0.2em] text-white/30">
              <th className="p-6 font-normal">Booking ID</th>
              <th className="p-6 font-normal">Client Details</th>
              <th className="p-6 font-normal">Package & Date</th>
              <th className="p-6 font-normal">Status</th>
              <th className="p-6 font-normal text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {filteredBookings.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-12 text-center text-white/30 italic">
                  No bookings found matching your search or filter.
                </td>
              </tr>
            ) : (
              filteredBookings.map((booking) => (
                <tr key={booking.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                  <td className="p-6 align-top">
                    <span className="font-mono text-gold">#{booking.id}</span>
                  </td>
                  <td className="p-6 align-top">
                    <div className="space-y-1">
                      <p className="font-bold">{booking.client}</p>
                      <p className="text-white/40 text-xs">{booking.email}</p>
                    </div>
                  </td>
                  <td className="p-6 align-top">
                    <div className="space-y-1">
                      <p className="font-medium">{booking.package}</p>
                      <p className="text-white/40 text-xs flex items-center gap-2">
                        <Calendar className="w-3 h-3" /> {booking.date} at {booking.time}
                      </p>
                    </div>
                  </td>
                  <td className="p-6 align-top">
                    <span className={cn(
                      "px-3 py-1 text-[10px] font-bold uppercase tracking-widest inline-flex items-center gap-2",
                      booking.status === "Approved" ? "bg-green-500/10 text-green-400" : 
                      booking.status === "Pending" ? "bg-yellow-500/10 text-yellow-400" :
                      "bg-red-500/10 text-red-400"
                    )}>
                      {booking.status === "Approved" && <CheckCircle2 className="w-3 h-3" />}
                      {booking.status === "Pending" && <Clock className="w-3 h-3" />}
                      {booking.status === "Rejected" && <XCircle className="w-3 h-3" />}
                      {booking.status}
                    </span>
                  </td>
                  <td className="p-6 align-top text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button 
                        onClick={() => handleAction(booking.id, "Approved")}
                        variant="ghost" size="icon" className="h-8 w-8 hover:text-gold"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </Button>
                      <Button 
                        onClick={() => handleAction(booking.id, "Rejected")}
                        variant="ghost" size="icon" className="h-8 w-8 hover:text-red-400"
                      >
                        <XCircle className="w-4 h-4" />
                      </Button>
                      <Button 
                        onClick={() => toast.info(`Viewing details for ${booking.id}`)}
                        variant="ghost" size="icon" className="h-8 w-8"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
