"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Plus, 
  Tag, 
  Clock, 
  DollarSign, 
  Settings2,
  Trash2,
  Edit,
  Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";


import { Modal } from "@/components/ui/modal";
import { 
  getPackages, 
  createPackage, 
  updatePackage, 
  deletePackage 
} from "@/app/actions/services";
import { useEffect } from "react";
import { Package } from "@prisma/client";

export default function AdminServices() {
  const [services, setServices] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Package | null>(null);
  const [formData, setFormData] = useState({ name: "", price: 0, category: "Wedding", duration: "" });

  useEffect(() => {
    loadPackages();
  }, []);

  const loadPackages = async () => {
    const data = await getPackages();
    setServices(data);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this service?")) {
      try {
        await deletePackage(id);
        setServices(services.filter(s => s.id !== id));
        toast.error("Service package deleted.");
      } catch (error) {
        console.error(error);
        toast.error("Failed to delete service.");
      }
    }
  };

  const handleOpenAdd = () => {
    setEditingService(null);
    setFormData({ name: "", price: 0, category: "Wedding", duration: "" });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (service: Package) => {
    setEditingService(service);
    setFormData({ 
      name: service.name, 
      price: service.price, 
      category: service.category, 
      duration: service.duration.toString() + " Hours" 
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingService) {
        await updatePackage(editingService.id, formData);
        toast.success("Service package updated.");
      } else {
        await createPackage(formData);
        toast.success("New service package created.");
      }
      setIsModalOpen(false);
      loadPackages();
    } catch (error) {
      console.error(error);
      toast.error("Failed to save service.");
    }
  };




  return (
    <div className="space-y-10">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold">Service Packages</h1>
          <p className="text-white/50 text-sm">Define and price your photography services.</p>
        </div>
        <Button onClick={handleOpenAdd} className="h-10">
          <Plus className="w-4 h-4 mr-2" /> Create New Package
        </Button>


      </header>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-pulse">
          {[1,2,3].map(i => (
            <div key={i} className="h-64 bg-white/5 border border-white/10" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

        {services.map((pkg) => (
          <div key={pkg.id} className="bg-white/5 border border-white/10 p-8 space-y-6 group hover:border-gold/50 transition-all">
            <div className="flex justify-between items-start">
              <div className="p-3 bg-gold/10 text-gold rounded-lg">
                <Tag className="w-6 h-6" />
              </div>
              <span className={`px-2 py-1 text-[8px] font-bold uppercase tracking-widest ${pkg.isActive ? "bg-green-500/20 text-green-400" : "bg-white/5 text-white/30"}`}>
                {pkg.isActive ? "Active" : "Inactive"}
              </span>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-serif font-bold">{pkg.name}</h3>
              <p className="text-gold text-2xl font-bold tracking-tighter">${pkg.price}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-6">
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-widest text-white/30">Category</span>
                <p className="text-xs font-bold">{pkg.category}</p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-widest text-white/30">Duration</span>
                <p className="text-xs font-bold">{pkg.duration}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-4">
              <Button 
                onClick={() => handleOpenEdit(pkg)}
                variant="outline" size="sm" className="flex-1 h-9 bg-white/5"
              >
                <Edit className="w-3.5 h-3.5 mr-2" /> Edit
              </Button>

              <Button 
                onClick={() => handleDelete(pkg.id)}
                variant="ghost" size="icon" className="h-9 w-9 hover:text-red-400"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        ))}


        <button 
          onClick={handleOpenAdd}
          className="border-2 border-dashed border-white/10 hover:border-gold/50 flex flex-col items-center justify-center p-8 gap-4 group transition-all text-left"
        >


          <div className="p-4 bg-white/5 rounded-full group-hover:bg-gold/10 transition-all">
            <Plus className="w-6 h-6 text-white/30 group-hover:text-gold" />
          </div>
          <span className="text-xs uppercase tracking-widest text-white/30 group-hover:text-gold font-bold">New Package</span>
        </button>
      </div>
      )}

      <Modal 

        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingService ? "Edit Service Package" : "Create New Package"}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-white/50">Package Name</label>
            <input 
              type="text" 
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-black border border-white/10 p-4 focus:border-gold outline-none text-sm"
              placeholder="e.g. Wedding Story"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-white/50">Price ($)</label>
            <input 
              type="number" 
              required
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
              className="w-full bg-black border border-white/10 p-4 focus:border-gold outline-none text-sm"
              placeholder="0"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-white/50">Category</label>
              <select 
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-black border border-white/10 p-4 focus:border-gold outline-none text-sm text-white/70"
              >
                <option>Wedding</option>
                <option>Portrait</option>
                <option>Fashion</option>
                <option>Commercial</option>
                <option>Lifestyle</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-white/50">Duration</label>
              <input 
                type="text" 
                required
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="w-full bg-black border border-white/10 p-4 focus:border-gold outline-none text-sm"
                placeholder="e.g. 8 Hours"
              />
            </div>
          </div>
          <Button type="submit" className="w-full h-14">
            {editingService ? "Update Package" : "Create Package"}
          </Button>
        </form>
      </Modal>
    </div>

  );
}
