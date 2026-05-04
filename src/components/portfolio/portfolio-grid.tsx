"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";

type PortfolioItem = {
  id: string;
  title: string;
  category: string;
  url: string;
  status: string;
};

const ALL_CATEGORIES = ["All", "Wedding", "Portrait", "Fashion", "Commercial", "Lifestyle", "Events"];

interface PortfolioGridProps {
  items: PortfolioItem[];
}

export function PortfolioGrid({ items }: PortfolioGridProps) {
  const [activeCategory, setActiveCategory] = useState("All");

  // Derive available categories from actual DB data
  const categories = [
    "All",
    ...Array.from(new Set(items.map((i) => i.category))).sort(),
  ];

  const filteredImages = items.filter(
    (img) => activeCategory === "All" || img.category === activeCategory
  );

  if (items.length === 0) {
    return (
      <div className="text-center py-32 text-white/30 italic">
        No portfolio items yet. Add some from the admin panel.
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Category Filter */}
      <div className="flex flex-wrap items-center justify-center gap-4">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={cn(
              "px-6 py-2 text-xs uppercase tracking-widest font-bold border transition-all duration-300",
              activeCategory === cat
                ? "bg-gold border-gold text-black"
                : "border-white/10 text-white/50 hover:border-white/30 hover:text-white"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredImages.map((image, index) => (
            <motion.div
              key={image.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5 }}
              className="group relative aspect-[4/5] overflow-hidden bg-white/5 cursor-pointer"
            >
              <Image
                src={image.url}
                alt={image.title}
                fill
                priority={index < 4}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
                <span className="text-gold text-xs uppercase tracking-widest mb-2">{image.category}</span>
                <h3 className="text-2xl font-serif text-white">{image.title}</h3>
                <div className="w-12 h-0.5 bg-gold mt-4 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
