"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Camera, Mail, Lock, ArrowRight, Globe } from "lucide-react";

import { Button } from "@/components/ui/button";
import Link from "next/link";

import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back!");
        router.push("/admin/dashboard");
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        toast.success("Account created! Please check your email.");
      }
    } catch (error) {
      const err = error as Error;
      toast.error(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-black p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-gold/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-gold/10 rounded-full blur-[100px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md space-y-8 relative z-10"
      >
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 mb-8">
            <Camera className="w-10 h-10 text-gold" />
            <span className="text-3xl font-serif font-bold tracking-widest uppercase">
              Nice <span className="text-gold">Vision</span>
            </span>
          </Link>
          <h1 className="text-2xl font-serif font-bold italic">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h1>
          <p className="text-white/50 text-xs uppercase tracking-widest">
            {isLogin ? "Access your dashboard and galleries" : "Join the Nice Vision community"}
          </p>
        </div>

        <form onSubmit={handleAuth} className="bg-white/5 border border-white/10 p-8 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-white/50">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black border border-white/10 p-4 pl-12 focus:border-gold outline-none text-sm transition-colors"
                  placeholder="john@example.com"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-white/50">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black border border-white/10 p-4 pl-12 focus:border-gold outline-none text-sm transition-colors"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full h-14 group">
            {loading ? "Processing..." : (isLogin ? "Sign In" : "Register")}
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>


          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10" /></div>
            <div className="relative flex justify-center text-[10px] uppercase tracking-widest"><span className="bg-brand-black px-4 text-white/30">Or continue with</span></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-3 py-3 bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-xs font-bold uppercase tracking-widest">
              <Globe className="w-4 h-4" /> Google
            </button>
            <button className="flex items-center justify-center gap-3 py-3 bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-xs font-bold uppercase tracking-widest">
              <Mail className="w-4 h-4" /> Github
            </button>
          </div>

        </form>

        <p className="text-center text-xs text-white/50">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="ml-2 text-gold font-bold hover:underline"
          >
            {isLogin ? "Sign up now" : "Log in here"}
          </button>
        </p>
      </motion.div>
    </div>
  );
}
