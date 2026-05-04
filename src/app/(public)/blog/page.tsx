"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Calendar, User, ArrowRight, Tag } from "lucide-react";
import { cn } from "@/lib/utils";
import { getPublishedBlogPosts } from "@/app/actions/blog";

export default function BlogPage() {
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const data = await getPublishedBlogPosts();
      setBlogPosts(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="pt-32 pb-24 min-h-screen bg-brand-black flex items-center justify-center">
        <p className="text-white/50 italic">Loading stories...</p>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 min-h-screen bg-brand-black">
      <div className="container mx-auto px-6">
        <header className="text-center mb-24 space-y-4">
          <h1 className="text-5xl md:text-7xl font-serif font-bold italic">Stories</h1>
          <p className="text-white/50 max-w-2xl mx-auto uppercase tracking-widest text-sm">
            Insights, tips, and behind-the-scenes from the world of Nice Vision.
          </p>
        </header>

        {blogPosts.length === 0 ? (
          <div className="text-center p-20 border border-white/10 bg-white/5 italic text-white/40">
            No published stories yet. Check back soon!
          </div>
        ) : (
          <>
            {/* Featured Post */}
            <div className="mb-24">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="group grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white/5 border border-white/10 overflow-hidden"
              >
                <div className="relative aspect-square lg:aspect-auto h-[400px] lg:h-full overflow-hidden">
                  <Image 
                    src={blogPosts[0].coverImage}
                    alt={blogPosts[0].title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="p-8 lg:p-16 flex flex-col justify-center space-y-8">
                  <div className="flex items-center gap-4 text-gold text-[10px] font-bold uppercase tracking-widest">
                    <span>{blogPosts[0].category}</span>
                    <span className="w-1 h-1 bg-white/20 rounded-full" />
                    <span className="text-white/30">
                      {new Date(blogPosts[0].createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                  <h2 className="text-4xl md:text-5xl font-serif font-bold italic group-hover:text-gold transition-colors">
                    {blogPosts[0].title}
                  </h2>
                  <p className="text-white/50 leading-relaxed text-lg">
                    {blogPosts[0].excerpt}
                  </p>
                  <Link href={`/blog/${blogPosts[0].slug}`} className="flex items-center gap-2 text-gold uppercase tracking-widest text-sm font-bold group/link">
                    Read Full Story
                    <ArrowRight className="w-5 h-5 transition-transform group-hover/link:translate-x-2" />
                  </Link>
                </div>
              </motion.div>
            </div>

            {/* Blog Grid */}
            {blogPosts.length > 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                {blogPosts.slice(1).map((post, i) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="group space-y-6"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-white/5">
                      <Image 
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 text-gold text-[10px] font-bold uppercase tracking-widest">
                        <span>{post.category}</span>
                        <span className="w-1 h-1 bg-white/20 rounded-full" />
                        <span className="text-white/30">
                          {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                      <h3 className="text-2xl font-serif font-bold group-hover:text-gold transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-white/50 text-sm leading-relaxed line-clamp-3">
                        {post.excerpt}
                      </p>
                      <Link href={`/blog/${post.slug}`} className="inline-flex items-center gap-2 text-gold uppercase tracking-widest text-xs font-bold border-b border-gold/0 hover:border-gold transition-all pt-2 pb-1">
                        Read More
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Newsletter / CTA */}
        <div className="mt-32 p-16 bg-white/5 border border-white/10 text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl font-serif font-bold italic">Join Our Community</h2>
            <p className="text-white/50 max-w-xl mx-auto">
              Get photography tips, session deals, and behind-the-scenes stories delivered straight to your inbox.
            </p>
          </div>
          <form className="flex flex-col md:flex-row gap-4 max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="flex-grow bg-black border border-white/10 p-4 focus:border-gold outline-none text-sm"
            />
            <button className="bg-gold text-black px-8 py-4 text-xs font-bold uppercase tracking-widest hover:bg-gold-light transition-colors">
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
