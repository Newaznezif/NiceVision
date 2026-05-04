import React from "react";
import Link from "next/link";
import { Camera, Mail, MapPin, Phone, Globe, Send } from "lucide-react";


export function Footer() {
  return (
    <footer className="bg-black border-t border-white/10 pt-20 pb-10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2">
              <Camera className="w-8 h-8 text-gold" />
              <span className="text-2xl font-serif font-bold tracking-widest uppercase">
                Nice <span className="text-gold">Vision</span>
              </span>
            </Link>
            <p className="text-white/50 leading-relaxed max-w-xs">
              Capturing timeless stories through the lens. Based in Burundi, serving the world with cinematic elegance.
            </p>
            <div className="flex items-center gap-4">
              <Link href="#" className="w-10 h-10 flex items-center justify-center rounded-full border border-white/10 hover:border-gold hover:text-gold transition-all">
                <Camera className="w-5 h-5" />
              </Link>
              <Link href="#" className="w-10 h-10 flex items-center justify-center rounded-full border border-white/10 hover:border-gold hover:text-gold transition-all">
                <Globe className="w-5 h-5" />
              </Link>
              <Link href="#" className="w-10 h-10 flex items-center justify-center rounded-full border border-white/10 hover:border-gold hover:text-gold transition-all">
                <Send className="w-5 h-5" />
              </Link>
            </div>

          </div>

          <div>
            <h4 className="text-gold font-serif text-lg mb-6 uppercase tracking-widest">Quick Links</h4>
            <ul className="space-y-4">
              {["Home", "Portfolio", "Services", "About", "Blog", "Contact"].map((item) => (
                <li key={item}>
                  <Link href={`/${item.toLowerCase() === "home" ? "" : item.toLowerCase()}`} className="text-white/50 hover:text-gold transition-colors text-sm uppercase tracking-wider">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-gold font-serif text-lg mb-6 uppercase tracking-widest">Categories</h4>
            <ul className="space-y-4">
              {["Wedding", "Portrait", "Fashion", "Commercial", "Events"].map((item) => (
                <li key={item}>
                  <Link href={`/portfolio?category=${item.toLowerCase()}`} className="text-white/50 hover:text-gold transition-colors text-sm uppercase tracking-wider">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-gold font-serif text-lg mb-6 uppercase tracking-widest">Contact Info</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-white/50 text-sm">
                <MapPin className="w-5 h-5 text-gold shrink-0" />
                <span>Bujumbura, Burundi</span>
              </li>
              <li className="flex items-center gap-3 text-white/50 text-sm">
                <Phone className="w-5 h-5 text-gold shrink-0" />
                <span>+257 00 00 00 00</span>
              </li>
              <li className="flex items-center gap-3 text-white/50 text-sm">
                <Mail className="w-5 h-5 text-gold shrink-0" />
                <span>hello@nicevision.bi</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-white/30 text-xs uppercase tracking-widest">
            © {new Date().getFullYear()} Nice Vision. All Rights Reserved.
          </p>
          <div className="flex items-center gap-8">
            <Link href="/privacy" className="text-white/30 hover:text-white transition-colors text-xs uppercase tracking-widest">Privacy Policy</Link>
            <Link href="/terms" className="text-white/30 hover:text-white transition-colors text-xs uppercase tracking-widest">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
