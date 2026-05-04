import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { getPortfolioItems } from "@/app/actions/portfolio";

export async function FeaturedPortfolio() {
  const allItems = await getPortfolioItems();
  // Show up to 4 most recent published items
  const featuredImages = allItems
    .filter((i) => i.status === "Published")
    .slice(0, 4);

  if (featuredImages.length === 0) {
    return null; // hide section if no items yet
  }

  return (
    <section className="py-24 bg-brand-black overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-6xl font-serif font-bold">
              Featured <span className="text-gold">Works</span>
            </h2>
            <div className="w-20 h-1 bg-gold" />
            <p className="text-white/50 max-w-lg">
              A curated selection of our most emotional and cinematic moments captured across Burundi and beyond.
            </p>
          </div>
          <Link
            href="/portfolio"
            className="group flex items-center gap-2 text-gold uppercase tracking-widest text-sm font-bold"
          >
            Explore Gallery
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-2" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredImages.map((image, index) => (
            <div
              key={image.id}
              className="group relative aspect-[3/4] overflow-hidden bg-white/5"
            >
              <Image
                src={image.url}
                alt={image.title}
                fill
                priority={index < 4}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
                <span className="text-gold text-xs uppercase tracking-widest mb-2">{image.category}</span>
                <h3 className="text-2xl font-serif text-white">{image.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
