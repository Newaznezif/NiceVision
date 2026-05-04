"use client";

import React from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, MessageCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ContactPage() {
  return (
    <div className="pt-32 pb-24 min-h-screen bg-brand-black">
      <div className="container mx-auto px-6">
        <header className="text-center mb-20 space-y-4">
          <h1 className="text-5xl md:text-7xl font-serif font-bold italic">Contact Us</h1>
          <p className="text-white/50 max-w-2xl mx-auto uppercase tracking-widest text-sm">
            Let&apos;s start a conversation about your next project.
          </p>

        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          {/* Contact Info */}
          <div className="space-y-12">
            <div className="space-y-8">
              <h2 className="text-3xl font-serif font-bold italic">Get in Touch</h2>
              <p className="text-white/60 leading-relaxed max-w-md">
                Whether you&apos;re planning a wedding, need professional portraits, or want to elevate your brand&apos;s visual identity, we&apos;re here to help.
              </p>

            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {[
                { icon: Mail, label: "Email", value: "hello@nicevision.bi" },
                { icon: Phone, label: "Phone", value: "+257 00 00 00 00" },
                { icon: MapPin, label: "Studio", value: "Bujumbura, Burundi" },
                { icon: MessageCircle, label: "WhatsApp", value: "Chat with us" },
              ].map((item, i) => (
                <div key={i} className="p-6 bg-white/5 border border-white/10 space-y-4 hover:border-gold transition-colors group">
                  <item.icon className="w-6 h-6 text-gold group-hover:scale-110 transition-transform" />
                  <div>
                    <span className="block text-[10px] uppercase tracking-widest text-white/30 mb-1">{item.label}</span>
                    <span className="text-sm font-bold">{item.value}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-8 border border-gold/20 bg-gold/5 flex items-center justify-between">
              <div className="space-y-1">
                <h4 className="text-gold font-bold uppercase tracking-widest text-xs">Direct Chat</h4>
                <p className="text-white/70 text-sm">Need a quick answer?</p>
              </div>
              <Button className="bg-[#25D366] hover:bg-[#128C7E] text-white border-none">
                <MessageCircle className="w-4 h-4 mr-2" />
                WhatsApp
              </Button>
            </div>
          </div>

          {/* Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white/5 border border-white/10 p-10"
          >
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-white/50">Full Name</label>
                  <input 
                    type="text" 
                    className="w-full bg-black border border-white/10 p-4 focus:border-gold outline-none text-sm transition-colors"
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-white/50">Email Address</label>
                  <input 
                    type="email" 
                    className="w-full bg-black border border-white/10 p-4 focus:border-gold outline-none text-sm transition-colors"
                    placeholder="john@example.com"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-white/50">Subject</label>
                <select className="w-full bg-black border border-white/10 p-4 focus:border-gold outline-none text-sm transition-colors text-white/50">
                  <option>Wedding Inquiry</option>
                  <option>Portrait Session</option>
                  <option>Commercial Shoot</option>
                  <option>General Question</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-white/50">Your Message</label>
                <textarea 
                  rows={6}
                  className="w-full bg-black border border-white/10 p-4 focus:border-gold outline-none text-sm resize-none transition-colors"
                  placeholder="How can we help you?"
                />
              </div>
              <Button className="w-full h-16 group">
                Send Message
                <Send className="w-4 h-4 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
