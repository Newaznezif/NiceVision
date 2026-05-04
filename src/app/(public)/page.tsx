import { Hero } from "@/components/sections/hero";
import { FeaturedPortfolio } from "@/components/sections/featured-portfolio";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getPackages } from "@/app/actions/services";
import { Heart, Star, Zap, Tag } from "lucide-react";

const categoryIcons: Record<string, React.ElementType> = {
  Wedding: Heart,
  Portrait: Star,
  Fashion: Zap,
};

export default async function Home() {
  // Fetch up to 3 packages for the homepage preview
  const allPackages = await getPackages();
  const previewPackages = allPackages.slice(0, 3);

  return (
    <div className="flex flex-col">
      <Hero />

      <FeaturedPortfolio />

      {/* Services Preview — DB-driven */}
      <section className="py-24 bg-white/5 relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="text-center space-y-4 mb-20">
            <h2 className="text-4xl md:text-6xl font-serif font-bold italic">Services</h2>
            <p className="text-white/50 max-w-2xl mx-auto uppercase tracking-widest text-sm">
              Tailored photography experiences for your most precious moments.
            </p>
          </div>

          {previewPackages.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {previewPackages.map((pkg) => {
                const Icon = categoryIcons[pkg.category] || Tag;
                return (
                  <div
                    key={pkg.id}
                    className="group p-10 bg-black border border-white/10 hover:border-gold transition-all duration-500 relative overflow-hidden"
                  >
                    <div className="absolute -right-8 -top-8 w-24 h-24 bg-gold/5 rounded-full blur-2xl group-hover:bg-gold/10 transition-all" />
                    <Icon className="w-12 h-12 text-gold mb-8" />
                    <h3 className="text-2xl font-serif font-bold mb-4">{pkg.name}</h3>
                    <p className="text-white/50 mb-8 leading-relaxed">{pkg.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-gold font-bold tracking-tighter">
                        From ${pkg.price.toLocaleString()}
                      </span>
                      <Link
                        href="/services"
                        className="text-xs uppercase font-bold tracking-widest hover:text-gold transition-colors"
                      >
                        Learn More
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-center text-white/30 italic">Services coming soon.</p>
          )}

          <div className="mt-20 text-center">
            <Button asChild variant="outline" size="lg" className="px-12">
              <Link href="/services">View All Packages</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative">
        <div
          className="absolute inset-0 bg-fixed bg-cover bg-center"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=2071&auto=format&fit=crop')` }}
        >
          <div className="absolute inset-0 bg-black/80" />
        </div>

        <div className="container mx-auto px-6 relative z-10 text-center">
          <h2 className="text-5xl md:text-7xl font-serif font-bold mb-8 italic">Ready to tell your story?</h2>
          <p className="text-xl text-white/70 mb-12 max-w-2xl mx-auto">
            Book your session today and let&apos;s create something extraordinary together.
          </p>
          <Button asChild size="lg" className="h-16 px-12 text-lg">
            <Link href="/booking">Reserve Your Date</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
