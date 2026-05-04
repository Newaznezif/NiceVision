"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Plus, 
  Grid, 
  List, 
  Trash2,
  Edit,
  Upload
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Modal } from "@/components/ui/modal";
import { 
  getPortfolioItems, 
  createPortfolioItem, 
  updatePortfolioItem, 
  deletePortfolioItem 
} from "@/app/actions/portfolio";

export default function AdminPortfolio() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  
  // Form State
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Wedding");
  const [uploadType, setUploadType] = useState<"file" | "url">("file");
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState("");

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    const data = await getPortfolioItems();
    setItems(data);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this item?")) {
      try {
        await deletePortfolioItem(id);
        setItems(items.filter(item => item.id !== id));
        toast.error("Item deleted from portfolio.");
      } catch (error) {
        toast.error("Failed to delete item.");
      }
    }
  };

  const handleOpenAdd = () => {
    setEditingItem(null);
    setTitle("");
    setCategory("Wedding");
    setUploadType("file");
    setFile(null);
    setUrl("");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: any) => {
    setEditingItem(item);
    setTitle(item?.title ?? "");
    setCategory(item?.category ?? "Wedding");
    setUploadType("url");
    setUrl(item?.url ?? "");
    setFile(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (uploadType === "file" && !file && !editingItem) {
      toast.error("Please select a file to upload.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("category", category);
      if (file) formData.append("file", file);
      if (url) formData.append("url", url);

      if (editingItem) {
        await updatePortfolioItem(editingItem.id, formData);
        toast.success("Portfolio item updated.");
      } else {
        await createPortfolioItem(formData);
        toast.success("New item added to portfolio.");
      }
      setIsModalOpen(false);
      loadItems();
    } catch (error: any) {
      toast.error(error.message || "Failed to save item.");
    }
  };

  return (
    <div className="space-y-10">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold">Portfolio Management</h1>
          <p className="text-white/50 text-sm">Upload and organize your photography collections.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex bg-white/5 border border-white/10 p-1">
            <button 
              onClick={() => setView("grid")}
              className={cn("p-2 transition-colors", view === "grid" ? "bg-gold text-black" : "text-white/50 hover:text-white")}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setView("list")}
              className={cn("p-2 transition-colors", view === "list" ? "bg-gold text-black" : "text-white/50 hover:text-white")}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
          <Button onClick={handleOpenAdd} className="h-10">
            <Plus className="w-4 h-4 mr-2" /> Add Image
          </Button>
        </div>
      </header>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
          {[1,2,3,4].map(i => (
            <div key={i} className="aspect-[4/3] bg-white/5 border border-white/10" />
          ))}
        </div>
      ) : view === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              layout
              className="bg-white/5 border border-white/10 group overflow-hidden"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image 
                  src={item.url}
                  alt={item.title}
                  fill
                  priority={index < 4}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                  <button 
                    onClick={() => handleOpenEdit(item)}
                    className="p-3 bg-white/10 hover:bg-gold hover:text-black transition-all rounded-full"
                  ><Edit className="w-4 h-4" /></button>

                  <button 
                    onClick={() => handleDelete(item.id)}
                    className="p-3 bg-white/10 hover:bg-red-500 transition-all rounded-full"
                  ><Trash2 className="w-4 h-4" /></button>
                </div>

                <div className="absolute top-2 right-2">
                  <span className={cn(
                    "px-2 py-1 text-[8px] font-bold uppercase tracking-widest",
                    item.status === "Published" ? "bg-green-500 text-white" : "bg-yellow-500 text-black"
                  )}>
                    {item.status}
                  </span>
                </div>
              </div>
              <div className="p-4 space-y-1">
                <span className="text-[10px] text-gold uppercase tracking-widest font-bold">{item.category}</span>
                <h3 className="text-sm font-bold truncate">{item.title}</h3>
              </div>
            </motion.div>
          ))}
          
          <button 
            onClick={handleOpenAdd}
            className="aspect-[4/3] border-2 border-dashed border-white/10 hover:border-gold/50 flex flex-col items-center justify-center gap-4 transition-all group"
          >
            <div className="p-4 bg-white/5 rounded-full group-hover:bg-gold/10 transition-all">
              <Plus className="w-6 h-6 text-white/30 group-hover:text-gold" />
            </div>
            <span className="text-xs uppercase tracking-widest text-white/30 group-hover:text-gold">Add New Item</span>
          </button>
        </div>
      ) : (
        <div className="bg-white/5 border border-white/10 overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-[10px] uppercase tracking-widest text-white/30">
                <th className="p-4 font-normal">Image</th>
                <th className="p-4 font-normal">Title</th>
                <th className="p-4 font-normal">Category</th>
                <th className="p-4 font-normal">Status</th>
                <th className="p-4 font-normal text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-white/30 italic">No items found.</td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                    <td className="p-4 align-middle">
                      <div className="relative w-16 h-12 overflow-hidden bg-black/50 border border-white/10">
                        <Image 
                          src={item.url} 
                          alt={item.title} 
                          fill 
                          sizes="64px"
                          className="object-cover" 
                        />
                      </div>
                    </td>
                    <td className="p-4 align-middle font-bold">{item.title}</td>
                    <td className="p-4 align-middle text-gold text-[10px] tracking-widest uppercase">{item.category}</td>
                    <td className="p-4 align-middle">
                      <span className={cn(
                        "px-2 py-1 text-[8px] font-bold uppercase tracking-widest",
                        item.status === "Published" ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                      )}>
                        {item.status}
                      </span>
                    </td>
                    <td className="p-4 align-middle text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button 
                          onClick={() => handleOpenEdit(item)}
                          variant="ghost" size="icon" className="h-8 w-8 hover:text-gold"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          onClick={() => handleDelete(item.id)}
                          variant="ghost" size="icon" className="h-8 w-8 hover:text-red-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingItem ? "Edit Portfolio Item" : "Add New Portfolio Item"}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-white/50">Item Title</label>
            <input 
              type="text" 
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-black border border-white/10 p-4 focus:border-gold outline-none text-sm"
              placeholder="e.g. Wedding in Gitega"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-white/50">Category</label>
            <select 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-black border border-white/10 p-4 focus:border-gold outline-none text-sm text-white/70"
            >
              <option>Wedding</option>
              <option>Portrait</option>
              <option>Fashion</option>
              <option>Commercial</option>
              <option>Lifestyle</option>
              <option>Events</option>
            </select>
          </div>
          
          <div className="space-y-4 pt-2">
            <div className="flex gap-4 border-b border-white/10 pb-2">
              <button
                type="button"
                onClick={() => setUploadType("file")}
                className={cn("text-xs font-bold uppercase tracking-widest pb-2", uploadType === "file" ? "text-gold border-b-2 border-gold" : "text-white/50")}
              >
                Upload File
              </button>
              <button
                type="button"
                onClick={() => setUploadType("url")}
                className={cn("text-xs font-bold uppercase tracking-widest pb-2", uploadType === "url" ? "text-gold border-b-2 border-gold" : "text-white/50")}
              >
                Image URL
              </button>
            </div>

            {uploadType === "file" ? (
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-white/50">Choose Local Image</label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                  className="w-full bg-black border border-white/10 p-4 focus:border-gold outline-none text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-gold/10 file:text-gold hover:file:bg-gold/20"
                />
              </div>
            ) : (
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-white/50">Image URL</label>
                <input 
                  type="url" 
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full bg-black border border-white/10 p-4 focus:border-gold outline-none text-sm"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>
            )}
          </div>

          <Button type="submit" className="w-full h-14">
            {editingItem ? "Save Changes" : "Upload to Portfolio"}
          </Button>
        </form>
      </Modal>
    </div>
  );
}
