"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

import { Lock, Search, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function GalleryPage() {
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [galleryCode, setGalleryCode] = useState("");

  return (
    <div className="pt-32 pb-24 min-h-screen bg-brand-black">
      <div className="container mx-auto px-6">
        <header className="text-center mb-24 space-y-4">
          <h1 className="text-5xl md:text-7xl font-serif font-bold italic">Client Galleries</h1>
          <p className="text-white/50 max-w-2xl mx-auto uppercase tracking-widest text-sm">
            Access your private, high-resolution photo collection.
          </p>
        </header>

        <div className="max-w-4xl mx-auto">
          {!showPasswordInput ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div 
                onClick={() => setShowPasswordInput(true)}
                className="group relative aspect-video bg-white/5 border border-white/10 flex flex-col items-center justify-center cursor-pointer hover:border-gold transition-all duration-500 overflow-hidden"
              >
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1511795409834-ef04bbd61622')] bg-cover bg-center opacity-10 group-hover:opacity-20 transition-opacity" />
                <Lock className="w-12 h-12 text-gold mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-serif font-bold">Private Gallery</h3>
                <p className="text-white/30 text-[10px] uppercase tracking-widest mt-2">Enter Access Code</p>
              </div>

              <div className="group relative aspect-video bg-white/5 border border-white/10 flex flex-col items-center justify-center cursor-not-allowed grayscale overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1509631179647-0177331693ae')] bg-cover bg-center opacity-10" />
                <Search className="w-12 h-12 text-white/20 mb-4" />
                <h3 className="text-xl font-serif font-bold text-white/30">Public Archives</h3>
                <p className="text-white/20 text-[10px] uppercase tracking-widest mt-2">Coming Soon</p>
              </div>
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/5 border border-gold/30 p-12 text-center space-y-8 max-w-lg mx-auto"
            >
              <div className="w-16 h-16 bg-gold/10 text-gold flex items-center justify-center rounded-full mx-auto">
                <Lock className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-serif font-bold italic">Gallery Access</h2>
                <p className="text-white/50 text-sm">Please enter the unique password provided to you.</p>
              </div>
              <div className="space-y-4">
                <input 
                  type="password" 
                  value={galleryCode}
                  onChange={(e) => setGalleryCode(e.target.value)}
                  className="w-full bg-black border border-white/10 p-4 focus:border-gold outline-none text-center tracking-[0.5em] text-lg font-bold"
                  placeholder="••••••••"
                />
                <Button className="w-full h-14 group">
                  Unlock Gallery
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                <button 
                  onClick={() => setShowPasswordInput(false)}
                  className="text-white/30 text-[10px] uppercase tracking-widest hover:text-white transition-colors"
                >
                  Back to selection
                </button>
              </div>
            </motion.div>
          )}

          <div className="mt-32 text-center space-y-12">
            <h3 className="text-white/30 uppercase tracking-[0.3em] text-xs font-bold">Featured Public Collections</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                "https://images.unsplash.com/photo-1519741497674-611481863552",
                "https://images.unsplash.com/photo-1511795409834-ef04bbd61622",
                "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3",
                "https://images.unsplash.com/photo-1511795409834-ef04bbd61622"

              ].map((url, i) => (
                <div key={i} className="aspect-square relative grayscale hover:grayscale-0 transition-all duration-700 cursor-pointer overflow-hidden">
                  <Image src={`${url}?q=80&w=400&auto=format&fit=crop`} alt="Collection" fill className="object-cover" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
