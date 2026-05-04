"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Plus, 
  FileText, 
  Eye, 
  Edit3, 
  Trash2, 
  Calendar,
  MoreHorizontal
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Modal } from "@/components/ui/modal";
import { toast } from "sonner";
import { getBlogPosts, createBlogPost, updateBlogPost, deleteBlogPost } from "@/app/actions/blog";

export default function AdminBlog() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<any>(null);
  
  // Form State
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Tips");
  const [status, setStatus] = useState("Draft");
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const data = await getBlogPosts();
      setPosts(data);
      setLoading(false);
    } catch (error) {
      toast.error("Failed to load blog posts.");
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingPost(null);
    setTitle("");
    setCategory("Tips");
    setStatus("Draft");
    setFile(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (post: any) => {
    setEditingPost(post);
    setTitle(post.title);
    setCategory(post.category);
    setStatus(post.isPublished ? "Published" : "Draft");
    setFile(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this blog post?")) {
      try {
        await deleteBlogPost(id);
        toast.error("Blog post deleted successfully.");
        loadPosts();
      } catch (error) {
        toast.error("Failed to delete post.");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const isPublished = status === "Published";
      
      const formData = new FormData();
      formData.append("title", title);
      formData.append("category", category);
      formData.append("isPublished", String(isPublished));
      if (file) {
        formData.append("file", file);
      }

      if (editingPost) {
        await updateBlogPost(editingPost.id, formData);
        toast.success("Blog post updated successfully.");
      } else {
        await createBlogPost(formData);
        toast.success("New blog post created successfully.");
      }
      setIsModalOpen(false);
      loadPosts();
    } catch (error: any) {
      toast.error(error.message || "Failed to save post.");
    }
  };

  return (
    <div className="space-y-10">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold">Blog Management</h1>
          <p className="text-white/50 text-sm">Create and edit articles for your audience.</p>
        </div>
        <Button className="h-10" onClick={handleOpenAdd}>
          <Plus className="w-4 h-4 mr-2" /> Write New Post
        </Button>
      </header>

      <div className="grid grid-cols-1 gap-6">
        {loading ? (
          <div className="p-12 border border-white/10 bg-white/5 text-center text-white/30 italic">Loading posts...</div>
        ) : posts.length === 0 ? (
          <div className="p-12 border border-white/10 bg-white/5 text-center text-white/30 italic">
            No blog posts found. Write your first post!
          </div>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="bg-white/5 border border-white/10 p-6 flex items-center justify-between group hover:border-gold/30 transition-all">
              <div className="flex items-center gap-6">
                <div className="w-16 h-12 bg-black/50 border border-white/10 relative overflow-hidden flex items-center justify-center text-gold/30">
                  {post.coverImage ? (
                    <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
                  ) : (
                    <FileText className="w-4 h-4" />
                  )}
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold group-hover:text-gold transition-colors">{post.title}</h3>
                  <div className="flex items-center gap-4 text-xs text-white/40 uppercase tracking-widest font-bold">
                    <span>{post.category}</span>
                    <span className="w-1 h-1 bg-white/10 rounded-full" />
                    <span className="flex items-center gap-2">
                      <Calendar className="w-3 h-3" /> 
                      {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className={cn(
                  "px-3 py-1 text-[10px] font-bold uppercase tracking-widest",
                  post.isPublished ? "bg-green-500/10 text-green-400" : "bg-white/5 text-white/30"
                )}>
                  {post.isPublished ? "Published" : "Draft"}
                </span>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" className="h-9 w-9 hover:text-gold" onClick={() => toast.info(`Previewing ${post.title}`)}><Eye className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="icon" className="h-9 w-9 hover:text-gold" onClick={() => handleOpenEdit(post)}><Edit3 className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="icon" className="h-9 w-9 hover:text-red-400" onClick={() => handleDelete(post.id)}><Trash2 className="w-4 h-4" /></Button>
                </div>
                <Button variant="ghost" size="icon"><MoreHorizontal className="w-4 h-4" /></Button>
              </div>
            </div>
          ))
        )}
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingPost ? "Edit Blog Post" : "Write New Post"}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-white/50">Post Title</label>
            <input 
              type="text" 
              required
              value={title || ""}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-black border border-white/10 p-4 focus:border-gold outline-none text-sm"
              placeholder="e.g. 5 Photography Tips..."
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-white/50">Cover Image</label>
            <input 
              type="file" 
              accept="image/*"
              onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
              className="w-full bg-black border border-white/10 p-4 focus:border-gold outline-none text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-gold/10 file:text-gold hover:file:bg-gold/20"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-white/50">Category</label>
              <select 
                value={category || ""}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-black border border-white/10 p-4 focus:border-gold outline-none text-sm text-white/70"
              >
                <option>Tips</option>
                <option>Locations</option>
                <option>Technical</option>
                <option>Personal</option>
                <option>Updates</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-white/50">Status</label>
              <select 
                value={status || ""}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full bg-black border border-white/10 p-4 focus:border-gold outline-none text-sm text-white/70"
              >
                <option>Draft</option>
                <option>Published</option>
              </select>
            </div>
          </div>

          <Button type="submit" className="w-full h-14">
            {editingPost ? "Save Changes" : "Create Post"}
          </Button>
        </form>
      </Modal>
    </div>
  );
}
