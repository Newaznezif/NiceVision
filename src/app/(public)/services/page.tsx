import React from "react";
import { Check, Clock, Heart, Star, Zap, Image as ImageIcon, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { formatPrice, cn } from "@/lib/utils";
import { getPackages } from "@/app/actions/services";

export const metadata = {
  title: "Services | Nice Vision",
  description: "Professional photography services tailored to your unique story.",
};

// Map category to an icon
const categoryIcons: Record<string, React.ElementType> = {
  Wedding: Heart,
  Portrait: Star,
  Fashion: Zap,
  Commercial: ImageIcon,
};

function getCategoryIcon(category: string): React.ElementType {
  return categoryIcons[category] || Tag;
}

// Convert duration in minutes to human-readable string
function formatDuration(minutes: number): string {
  const hours = Math.round(minutes / 60);
  return `${hours} Hour${hours !== 1 ? "s" : ""}`;
}

export default async function ServicesPage() {
  const packages = await getPackages();

  return (
    <div className="pt-32 pb-24 min-h-screen bg-brand-black">
      <div className="container mx-auto px-6">
        <header className="text-center mb-24 space-y-4">
          <h1 className="text-5xl md:text-7xl font-serif font-bold italic">Our Packages</h1>
          <p className="text-white/50 max-w-2xl mx-auto uppercase tracking-widest text-sm">
            Professional photography services tailored to your unique story.
          </p>
        </header>

        {packages.length === 0 ? (
          <div className="text-center py-32 text-white/30 italic">
            No packages available yet. Check back soon.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {packages.map((pkg, i) => {
              const Icon = getCategoryIcon(pkg.category);
              const isFeatured = i === 0; // First (most recent) is featured

              return (
                <div
                  key={pkg.id}
                  className={cn(
                    "relative p-10 flex flex-col border transition-all duration-500",
                    isFeatured
                      ? "bg-gold/5 border-gold shadow-[0_0_50px_rgba(212,175,55,0.1)]"
                      : "bg-white/5 border-white/10 hover:border-gold/50"
                  )}
                >
                  {isFeatured && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gold text-black text-[10px] font-bold uppercase tracking-widest px-4 py-1">
                      Most Popular
                    </div>
                  )}

                  <div className="mb-8">
                    <Icon className="w-10 h-10 text-gold mb-6" />
                    <h3 className="text-2xl font-serif font-bold mb-2">{pkg.name}</h3>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold text-gold">{formatPrice(pkg.price)}</span>
                      <span className="text-white/30 text-xs uppercase tracking-widest">/ Session</span>
                    </div>
                  </div>

                  <div className="space-y-4 flex-grow mb-12">
                    <p className="flex items-center gap-2 text-white/50 text-xs font-bold uppercase tracking-widest pb-4 border-b border-white/5">
                      <Clock className="w-4 h-4 text-gold" /> {formatDuration(pkg.duration)} Session
                    </p>
                    <ul className="space-y-3">
                      {pkg.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-3 text-sm text-white/70">
                          <Check className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button asChild variant={isFeatured ? "default" : "outline"} className="w-full h-14">
                    <Link href={`/booking?package=${pkg.id}`}>Book This Package</Link>
                  </Button>
                </div>
              );
            })}
          </div>
        )}

        {/* Custom Quote Section */}
        <div className="mt-24 p-12 bg-white/5 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-12 text-center md:text-left">
          <div className="space-y-4">
            <h2 className="text-3xl font-serif font-bold italic">Need a Custom Experience?</h2>
            <p className="text-white/50 max-w-lg">
              Every project is unique. If our standard packages don&apos;t fit your vision, let&apos;s create a custom proposal that does.
            </p>
          </div>
          <Button asChild variant="outline" size="lg" className="h-16 px-12 shrink-0">
            <Link href="/contact">Request Custom Quote</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
