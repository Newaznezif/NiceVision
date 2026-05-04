"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Users, 
  Search, 
  Mail, 
  Phone, 
  Calendar,
  MoreVertical,
  ExternalLink,
  ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Link from "next/link";

const initialClients = [
  { id: "C1", name: "Alice Munyana", email: "alice@example.com", phone: "+257 00 00 00 00", joined: "Jan 12, 2026", status: "Active", bookings: 3 },
  { id: "C2", name: "Bob Ndayisaba", email: "bob@example.com", phone: "+257 11 11 11 11", joined: "Feb 05, 2026", status: "Active", bookings: 1 },
  { id: "C3", name: "Clara Gateka", email: "clara@example.com", phone: "+257 22 22 22 22", joined: "Mar 10, 2026", status: "Inactive", bookings: 0 },
];

export default function AdminClients() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredClients = initialClients.filter(client => 
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.phone.includes(searchQuery)
  );

  const handleMessageAll = () => {
    const emails = filteredClients.map(c => c.email).join(",");
    window.location.href = `mailto:?bcc=${emails}&subject=Update from Nice Vision Studio`;
    toast.success("Opened email client to message all visible clients.");
  };

  return (
    <div className="space-y-10">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold">Client Management</h1>
          <p className="text-white/50 text-sm">View and manage your registered clients.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input 
              type="text" 
              placeholder="Search clients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white/5 border border-white/10 pl-10 pr-4 py-2 text-sm focus:border-gold outline-none w-64"
            />
          </div>
          <Button className="h-10" onClick={handleMessageAll}>
            <Mail className="w-4 h-4 mr-2" /> Message All
          </Button>
        </div>
      </header>

      <div className="bg-white/5 border border-white/10 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/10 text-[10px] uppercase tracking-[0.2em] text-white/30">
              <th className="p-6 font-normal">Client</th>
              <th className="p-6 font-normal">Contact</th>
              <th className="p-6 font-normal">Joined</th>
              <th className="p-6 font-normal">Bookings</th>
              <th className="p-6 font-normal text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {filteredClients.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-12 text-center text-white/30 italic">
                  No clients found matching "{searchQuery}"
                </td>
              </tr>
            ) : (
              filteredClients.map((client) => (
                <tr key={client.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                  <td className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gold/10 flex items-center justify-center text-gold font-bold rounded-full">
                        {client.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold">{client.name}</p>
                        <span className="text-[10px] text-white/30 uppercase tracking-widest flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3 text-gold" /> Verified
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="space-y-1 text-xs">
                      <a 
                        href={`mailto:${client.email}`}
                        className="flex items-center gap-2 text-white/60 hover:text-gold transition-colors cursor-pointer w-fit"
                      >
                        <Mail className="w-3 h-3" /> {client.email}
                      </a>
                      <p className="flex items-center gap-2 text-white/60">
                        <Phone className="w-3 h-3" /> {client.phone}
                      </p>
                    </div>
                  </td>
                  <td className="p-6">
                    <span className="text-white/40">{client.joined}</span>
                  </td>
                  <td className="p-6">
                    <span className="px-2 py-1 bg-white/5 border border-white/10 text-xs font-bold text-gold">
                      {client.bookings}
                    </span>
                  </td>
                  <td className="p-6 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link href="/admin/bookings">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 hover:text-gold"
                          onClick={() => toast.info(`Viewing bookings for ${client.name}`)}
                        >
                          <Calendar className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 hover:text-gold"
                        onClick={() => toast.info(`Opening profile for ${client.name}`)}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="w-4 h-4" />
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
