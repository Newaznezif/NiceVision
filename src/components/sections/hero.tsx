"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Background Image with Cinematic Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-[10000ms] scale-110 hover:scale-100"
        style={{ 
          backgroundImage: `url('https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070&auto=format&fit=crop')`,
        }}
      >
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30" />
      </div>

      <div className="container mx-auto px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-6"
        >
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-gold uppercase tracking-[0.5em] text-sm md:text-base font-medium"
          >
            Kim Gérard | Burundi
          </motion.span>
          
          <h1 className="text-5xl md:text-8xl lg:text-9xl font-serif font-bold text-white leading-tight">
            Nice <span className="text-gradient-gold">Vision</span>
          </h1>
          
          <p className="text-lg md:text-2xl text-white/70 font-light max-w-2xl mx-auto italic">
            &quot;Capturing timeless stories through the lens.&quot;
          </p>


          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="pt-8 flex flex-col md:flex-row items-center justify-center gap-6"
          >
            <Button asChild size="lg" className="rounded-none">
              <Link href="/booking">Book a Session</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-none">
              <Link href="/portfolio">View Portfolio</Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Decorative scroll indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] uppercase tracking-widest text-white/30">Scroll</span>
        <div className="w-px h-12 bg-gradient-to-b from-gold to-transparent" />
      </motion.div>
    </section>
  );
}
