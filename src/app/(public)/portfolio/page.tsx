import React from "react";
import { PortfolioGrid } from "@/components/portfolio/portfolio-grid";
import { getPortfolioItems } from "@/app/actions/portfolio";

export const metadata = {
  title: "Portfolio",
  description: "Explore our collection of cinematic photography works.",
};

export default async function PortfolioPage() {
  const items = await getPortfolioItems();

  return (
    <div className="pt-32 pb-24 min-h-screen">
      <div className="container mx-auto px-6">
        <header className="text-center space-y-4 mb-20">
          <h1 className="text-5xl md:text-7xl font-serif font-bold italic">Portfolio</h1>
          <p className="text-white/50 max-w-2xl mx-auto uppercase tracking-[0.3em] text-sm">
            A visual journey through moments that last forever.
          </p>
        </header>

        <PortfolioGrid items={items} />
      </div>
    </div>
  );
}
