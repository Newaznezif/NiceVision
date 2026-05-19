"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Calendar, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  Clock,
  ExternalLink,
  Coins
} from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { updateBookingStatus } from "@/app/actions/booking";

interface FormattedBooking {
  id: string;
  client: string;
  email: string;
  package: string;
  date: string;
  time: string;
  status: string; // PENDING, APPROVED, REJECTED, CANCELLED
  amount: number;
  paidAmount: number;
}

interface BookingsTableProps {
  initialBookings: FormattedBooking[];
}

export default function BookingsTable({ initialBookings }: BookingsTableProps) {
  const [bookings, setBookings] = useState(initialBookings);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleAction = async (id: string, action: "APPROVED" | "REJECTED") => {
    try {
      const result = await updateBookingStatus(id, action);
      if (result.success) {
        setBookings(prev => prev.map(b => b.id === id ? { ...b, status: action } : b));
        toast.success(`Booking has been marked as ${action.toLowerCase()} in the database!`);
      }
    } catch (error) {
      toast.error("Failed to update status on the server.");
    }
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
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-serif font-bold">Manage Bookings</h1>
          <p className="text-white/50 text-sm">Review, verify Chapa deposits, and approve photography sessions.</p>
        </div>
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search clients..."
              className="bg-white/5 border border-white/10 pl-10 pr-4 py-2 text-sm focus:border-gold outline-none w-full sm:w-64 transition-colors"
            />
          </div>
          <div className="relative">
            <Button 
              variant="outline" 
              size="sm" 
              className="h-10 bg-white/5 border-white/10"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <Filter className={cn("w-4 h-4 mr-2", filterStatus !== "All" && "text-gold")} /> 
              {filterStatus === "All" ? "Filter" : filterStatus.charAt(0) + filterStatus.slice(1).toLowerCase()}
            </Button>

            {isFilterOpen && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setIsFilterOpen(false)}
                />
                <div className="absolute top-full right-0 mt-2 w-36 bg-black border border-white/10 shadow-xl z-20">
                  {["All", "PENDING", "APPROVED", "REJECTED"].map(status => (
                    <button
                      key={status}
                      onClick={() => {
                        setFilterStatus(status);
                        setIsFilterOpen(false);
                      }}
                      className={cn(
                        "w-full text-left px-4 py-3 text-[10px] uppercase tracking-widest transition-colors hover:bg-white/5",
                        filterStatus === status ? "text-gold font-bold" : "text-white/70"
                      )}
                    >
                      {status === "All" ? "All Statuses" : status}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      <div className="bg-white/5 border border-white/10 overflow-x-auto">
        <table className="w-full text-left min-w-[700px]">
          <thead>
            <tr className="border-b border-white/10 text-[10px] uppercase tracking-[0.2em] text-white/30">
              <th className="p-6 font-normal">Booking ID</th>
              <th className="p-6 font-normal">Client Details</th>
              <th className="p-6 font-normal">Package & Date</th>
              <th className="p-6 font-normal">Deposit Paid</th>
              <th className="p-6 font-normal">Status</th>
              <th className="p-6 font-normal text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {filteredBookings.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-12 text-center text-white/30 italic">
                  No bookings found matching your search or filter status.
                </td>
              </tr>
            ) : (
              filteredBookings.map((booking) => (
                <tr key={booking.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                  <td className="p-6 align-top">
                    <span className="font-mono text-gold text-xs">#{booking.id.slice(-8).toUpperCase()}</span>
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
                        <Calendar className="w-3 h-3 text-gold" /> {booking.date} at {booking.time}
                      </p>
                    </div>
                  </td>
                  <td className="p-6 align-top">
                    <div className="space-y-1">
                      <p className={cn("font-bold", booking.paidAmount > 0 ? "text-green-400" : "text-white/40")}>
                        {formatPrice(booking.paidAmount)}
                      </p>
                      {booking.paidAmount > 0 ? (
                        <p className="text-[10px] text-white/40 uppercase tracking-wider flex items-center gap-1">
                          <Coins className="w-3 h-3 text-gold" /> Verified Deposit
                        </p>
                      ) : (
                        <p className="text-[10px] text-white/30">Unpaid / Mock</p>
                      )}
                    </div>
                  </td>
                  <td className="p-6 align-top">
                    <span className={cn(
                      "px-3 py-1 text-[9px] font-bold uppercase tracking-widest inline-flex items-center gap-2 rounded-full",
                      booking.status === "APPROVED" ? "bg-green-500/10 text-green-400 border border-green-500/20" : 
                      booking.status === "PENDING" ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20" :
                      "bg-red-500/10 text-red-400 border border-red-500/20"
                    )}>
                      {booking.status === "APPROVED" && <CheckCircle2 className="w-3 h-3" />}
                      {booking.status === "PENDING" && <Clock className="w-3 h-3" />}
                      {booking.status === "REJECTED" && <XCircle className="w-3 h-3" />}
                      {booking.status}
                    </span>
                  </td>
                  <td className="p-6 align-top text-right">
                    <div className="flex items-center justify-end gap-2 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                      {booking.status === "PENDING" && (
                        <>
                          <Button 
                            onClick={() => handleAction(booking.id, "APPROVED")}
                            variant="ghost" size="icon" className="h-8 w-8 hover:bg-green-500/10 hover:text-green-400 border border-transparent hover:border-green-500/20 rounded-full"
                            title="Approve Booking"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </Button>
                          <Button 
                            onClick={() => handleAction(booking.id, "REJECTED")}
                            variant="ghost" size="icon" className="h-8 w-8 hover:bg-red-500/10 hover:text-red-400 border border-transparent hover:border-red-500/20 rounded-full"
                            title="Reject Booking"
                          >
                            <XCircle className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                      <Button 
                        onClick={() => toast.info(`Paid Total: ${formatPrice(booking.amount)}`)}
                        variant="ghost" size="icon" className="h-8 w-8 hover:bg-white/5 border border-transparent hover:border-white/10 rounded-full"
                      >
                        <ExternalLink className="w-4 h-4 text-white/50" />
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
