"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Camera, Award, Clock, Globe } from "lucide-react";
import { cn } from "@/lib/utils";


export default function AboutPage() {
  return (
    <div className="pt-32 pb-24 min-h-screen bg-brand-black overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-32">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative aspect-[4/5] w-full max-w-md mx-auto overflow-hidden">
              <Image 
                src="/uploads/1777869201674-WhatsAppImage2026-04-28at23.12.46.jpeg" 
                alt="Kim Gérard" 
                fill 
                className="object-cover"
              />
              <div className="absolute inset-0 border-[20px] border-gold/10 -m-5" />
            </div>
            <div className="absolute -bottom-10 -right-10 bg-gold p-8 hidden md:block">
              <p className="text-black font-serif text-3xl font-bold">10+</p>
              <p className="text-black/60 text-xs uppercase tracking-widest font-bold">Years Experience</p>
            </div>
          </motion.div>

          <div className="space-y-8">
            <div className="space-y-4">
              <span className="text-gold uppercase tracking-[0.4em] text-xs font-bold">The Artist</span>
              <h1 className="text-5xl md:text-7xl font-serif font-bold italic">Kim Gérard</h1>
            </div>
            <p className="text-xl text-white/80 font-serif leading-relaxed italic">
              &quot;Photography is not just about taking pictures, it&apos;s about preserving emotions and telling stories that transcend time.&quot;
            </p>

            <div className="space-y-6 text-white/50 leading-relaxed">
              <p>
                Born and raised in the heart of Burundi, my journey with photography began as a fascination with the play of light on the hills of Bujumbura. Over the past decade, I have dedicated my life to capturing the raw beauty of human connection and the breathtaking landscapes of my homeland.
              </p>
              <p>
                My style is characterized by cinematic compositions, emotional depth, and a commitment to authenticity. Whether it&apos;s the nervous joy of a wedding morning or the quiet confidence of a corporate leader, I strive to find the extraordinary in the ordinary.
              </p>
            </div>
          </div>
        </div>

        {/* Values / Mission */}
        <section className="py-24 border-y border-white/10 grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { 
              icon: Camera, 
              title: "Cinematic Vision", 
              desc: "We bring a film-like quality to every shot, focusing on composition and lighting that tells a story." 
            },
            { 
              icon: Award, 
              title: "Premium Quality", 
              desc: "From the session to the final edit, we maintain the highest standards of professional excellence." 
            },
            { 
              icon: Globe, 
              title: "Cultural Depth", 
              desc: "Deeply rooted in Burundi's heritage, we bring a unique perspective to every international project." 
            }
          ].map((item, i) => (
            <div key={i} className="text-center space-y-6 px-4">
              <div className="w-16 h-16 bg-gold/10 text-gold flex items-center justify-center rounded-full mx-auto">
                <item.icon className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-serif font-bold">{item.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </section>

        {/* Timeline or Journey */}
        <div className="mt-32 space-y-16">
          <h2 className="text-4xl font-serif font-bold italic text-center">My Journey</h2>
          <div className="max-w-4xl mx-auto space-y-12 relative">
            <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-white/10 hidden md:block" />
            {[
              { year: "2014", title: "The Beginning", desc: "First professional camera and first wedding shoot in Gitega." },
              { year: "2017", title: "Nice Vision Founded", desc: "Established the studio in Bujumbura with a focus on cinematic portraits." },
              { year: "2020", title: "International Recognition", desc: "Featured in East African photography exhibitions." },
              { year: "2024", title: "Digital Transformation", desc: "Launching the new digital experience for clients worldwide." },
            ].map((milestone, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={cn(
                  "flex flex-col md:flex-row items-center gap-8 relative",
                  i % 2 === 0 ? "md:flex-row-reverse" : ""
                )}
              >
                <div className="flex-1 text-center md:text-left space-y-2">
                  <span className="text-gold font-bold font-serif text-2xl">{milestone.year}</span>
                  <h4 className="text-xl font-bold uppercase tracking-wider">{milestone.title}</h4>
                  <p className="text-white/50 text-sm">{milestone.desc}</p>
                </div>
                <div className="w-4 h-4 bg-gold rounded-full relative z-10 shrink-0" />
                <div className="flex-1 hidden md:block" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

