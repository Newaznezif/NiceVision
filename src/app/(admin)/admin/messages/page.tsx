"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Inbox, 
  Search, 
  Trash2, 
  Reply, 
  Star,
  Clock,
  MoreVertical,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";

const messages = [
  { id: 1, sender: "Marie Ange", subject: "Wedding Inquiry - July 2026", preview: "Hello Kim, we are planning a wedding in Gitega and love your work...", time: "2h ago", unread: true, starred: true },
  { id: 2, sender: "Thierry N.", subject: "Commercial Portrait Session", preview: "I need some professional headshots for our corporate website...", time: "5h ago", unread: false, starred: false },
  { id: 3, sender: "Studio Guest", subject: "General Question", preview: "Do you offer physical photo albums with your packages?", time: "1d ago", unread: false, starred: false },
];

export default function AdminMessages() {
  return (
    <div className="h-[calc(100vh-140px)] flex flex-col gap-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold">Messages</h1>
          <p className="text-white/50 text-sm">Review inquiries and client communication.</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input 
              type="text" 
              placeholder="Search inbox..."
              className="bg-white/5 border border-white/10 pl-10 pr-4 py-2 text-sm focus:border-gold outline-none"
            />
          </div>
        </div>
      </header>

      <div className="flex-1 bg-white/5 border border-white/10 flex overflow-hidden">
        {/* Sidebar Mini */}
        <div className="w-48 border-r border-white/10 flex flex-col p-4 gap-2">
          <Button variant="outline" className="justify-start bg-gold text-black border-none hover:bg-gold/90">
            <Inbox className="w-4 h-4 mr-2" /> Inbox
          </Button>
          <Button variant="ghost" className="justify-start text-white/50">
            <Star className="w-4 h-4 mr-2" /> Starred
          </Button>
          <Button variant="ghost" className="justify-start text-white/50">
            <CheckCircle2 className="w-4 h-4 mr-2" /> Sent
          </Button>
          <Button variant="ghost" className="justify-start text-white/50">
            <Trash2 className="w-4 h-4 mr-2" /> Trash
          </Button>
        </div>

        {/* Message List */}
        <div className="flex-1 overflow-y-auto">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`p-6 border-b border-white/5 flex items-start justify-between cursor-pointer hover:bg-white/[0.02] transition-colors ${msg.unread ? "bg-white/[0.03]" : ""}`}
            >
              <div className="flex items-start gap-6">
                <div className={`mt-1.5 w-2 h-2 rounded-full ${msg.unread ? "bg-gold" : "bg-transparent"}`} />
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className={`text-sm ${msg.unread ? "font-bold text-white" : "text-white/70"}`}>{msg.sender}</span>
                    <span className="text-[10px] text-white/30 uppercase tracking-widest">{msg.time}</span>
                  </div>
                  <h4 className={`text-sm ${msg.unread ? "font-bold text-gold" : "text-white/90"}`}>{msg.subject}</h4>
                  <p className="text-xs text-white/40 line-clamp-1">{msg.preview}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className={`p-2 transition-colors ${msg.starred ? "text-gold" : "text-white/20 hover:text-gold"}`}>
                  <Star className="w-4 h-4 fill-current" />
                </button>
                <button className="p-2 text-white/20 hover:text-red-400">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
