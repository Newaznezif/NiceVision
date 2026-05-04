"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Save, Image as ImageIcon, FileText, AlignLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function AdminAbout() {
  const [title, setTitle] = useState("Kim Gérard");
  const [description, setDescription] = useState(
    "Photography is not just about taking pictures, it's about preserving emotions and telling stories that transcend time."
  );
  const [photoPreview, setPhotoPreview] = useState<string | null>(
    "/uploads/1777869201674-WhatsAppImage2026-04-28at23.12.46.jpeg"
  );
  const [isSaving, setIsSaving] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Mock saving delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success("About page content successfully updated!");
    setIsSaving(false);
  };

  return (
    <div className="space-y-10">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold">About Page Content</h1>
          <p className="text-white/50 text-sm">Update your public profile photo, title, and biography.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* Editor Form */}
        <div className="bg-white/5 border border-white/10 p-8">
          <form onSubmit={handleSave} className="space-y-8">
            
            <div className="space-y-4">
              <label className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-white/50 font-bold">
                <ImageIcon className="w-4 h-4 text-gold" /> Profile Photo
              </label>
              <input 
                type="file" 
                accept="image/*"
                onChange={handleImageChange}
                className="w-full bg-black border border-white/10 p-4 focus:border-gold outline-none text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-gold/10 file:text-gold hover:file:bg-gold/20 transition-all cursor-pointer"
              />
            </div>

            <div className="space-y-4">
              <label className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-white/50 font-bold">
                <FileText className="w-4 h-4 text-gold" /> Display Title
              </label>
              <input 
                type="text" 
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Kim Gérard"
                className="w-full bg-black border border-white/10 p-4 focus:border-gold outline-none text-sm"
              />
            </div>

            <div className="space-y-4">
              <label className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-white/50 font-bold">
                <AlignLeft className="w-4 h-4 text-gold" /> Biography / Description
              </label>
              <textarea 
                required
                rows={6}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tell your story..."
                className="w-full bg-black border border-white/10 p-4 focus:border-gold outline-none text-sm resize-none"
              />
            </div>

            <Button type="submit" className="w-full h-14" disabled={isSaving}>
              {isSaving ? "Saving Content..." : "Save Changes"}
              {!isSaving && <Save className="ml-2 w-4 h-4" />}
            </Button>
          </form>
        </div>

        {/* Live Preview */}
        <div className="space-y-6">
          <h3 className="text-xl font-serif text-white/50 mb-6">Live Public Preview</h3>
          <div className="bg-black border border-white/10 p-10 flex flex-col items-center text-center space-y-8 pointer-events-none">
            
            <div className="relative aspect-[4/5] w-64 overflow-hidden bg-white/5 border border-white/10 p-2">
              {photoPreview ? (
                <img 
                  src={photoPreview} 
                  alt={title} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white/20">
                  <ImageIcon className="w-12 h-12" />
                </div>
              )}
            </div>

            <div className="space-y-4">
              <span className="text-gold uppercase tracking-[0.4em] text-[10px] font-bold">The Artist</span>
              <h2 className="text-4xl font-serif font-bold italic">{title || "Your Name"}</h2>
              <p className="text-white/70 font-serif leading-relaxed italic max-w-sm mx-auto">
                {description ? `"${description}"` : '"Your description will appear here."'}
              </p>
            </div>

          </div>
        </div>
        
      </div>
    </div>
  );
}
