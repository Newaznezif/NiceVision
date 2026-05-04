"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useBookingStore } from "@/store/use-booking-store";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { cn, formatPrice } from "@/lib/utils";
import { Check, Clock, ArrowLeft, ArrowRight } from "lucide-react";

type Package = {
  id: string;
  name: string;
  price: number;
  duration: number; // in minutes
  category: string;
  includedPhotos: number;
};

interface BookingFormProps {
  packages: Package[];
}

const timeSlots = ["09:00 AM", "10:00 AM", "11:00 AM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM"];

export function BookingForm({ packages }: BookingFormProps) {
  const {
    step, packageId, date, timeSlot, details,
    setStep, setPackage, setDate, setTimeSlot, setDetails,
  } = useBookingStore();

  const currentPackage = packages.find((p) => p.id === packageId);

  return (
    <div className="bg-white/5 border border-white/10 p-8 md:p-12 min-h-[600px] relative">
      
      {/* Dynamic Step Indicator */}
      <div className="flex items-center justify-center gap-4 mb-12">
        {[1, 2, 3].map((i) => {
          const isActive = step >= i;
          const isLineActive = step > i;

          return (
            <div key={i} className="flex items-center gap-2">
              <div 
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors duration-500",
                  isActive ? "bg-gold text-black" : "bg-white/10 text-white/30"
                )}
              >
                {i}
              </div>
              {i < 3 && (
                <div 
                  className={cn(
                    "w-12 h-[2px] transition-colors duration-500",
                    isLineActive ? "bg-gold" : "bg-white/10"
                  )} 
                />
              )}
            </div>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {/* Step 1 — Choose Package */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-serif">Choose Your Package</h2>
              <p className="text-white/50 uppercase tracking-widest text-xs">Select the experience that fits your needs</p>
            </div>

            {packages.length === 0 ? (
              <p className="text-center text-white/30 italic py-12">
                No packages available yet. Please check back soon.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {packages.map((pkg) => (
                  <div
                    key={pkg.id}
                    onClick={() => setPackage(pkg.id)}
                    className={cn(
                      "p-6 border cursor-pointer transition-all group relative overflow-hidden",
                      packageId === pkg.id
                        ? "border-gold bg-gold/5"
                        : "border-white/10 hover:border-white/30"
                    )}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <span className="text-gold text-[10px] uppercase tracking-widest font-bold">{pkg.category}</span>
                        <h3 className="text-xl font-serif font-bold">{pkg.name}</h3>
                      </div>
                      <span className="text-gold font-bold">{formatPrice(pkg.price)}</span>
                    </div>
                    <div className="space-y-2 text-sm text-white/50">
                      <p className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {Math.round(pkg.duration / 60)} Hours
                      </p>
                      <p className="flex items-center gap-2">
                        <Check className="w-4 h-4" />
                        {pkg.includedPhotos}+ Photos
                      </p>
                    </div>
                    {packageId === pkg.id && (
                      <div className="absolute top-2 right-2">
                        <Check className="w-4 h-4 text-gold" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-end pt-4 border-t border-white/10">
              <Button disabled={!packageId} onClick={() => setStep(2)}>
                Next <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        )}

        {/* Step 2 — Select Date & Time */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-serif">Select Date & Time</h2>
              <p className="text-white/50 uppercase tracking-widest text-xs">
                Check availability for your {currentPackage?.name}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
              <div className="flex justify-center bg-black/40 p-4 border border-white/5">
                <Calendar
                  mode="single"
                  selected={date || undefined}
                  onSelect={(d) => setDate(d || null)}
                  disabled={(date) => date < new Date()}
                />
              </div>
              <div className="space-y-6">
                <h3 className="text-lg font-serif text-gold flex items-center gap-2">
                  <Clock className="w-5 h-5" /> Available Slots
                </h3>
                {!date ? (
                  <p className="text-white/30 italic">Please select a date first</p>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    {timeSlots.map((slot) => (
                      <button
                        key={slot}
                        onClick={() => setTimeSlot(slot)}
                        className={cn(
                          "py-3 px-4 text-xs font-bold tracking-widest border transition-all",
                          timeSlot === slot
                            ? "bg-gold border-gold text-black"
                            : "border-white/10 hover:border-gold hover:text-gold"
                        )}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-between pt-8 border-t border-white/10">
              <Button variant="outline" onClick={() => setStep(1)}>
                <ArrowLeft className="mr-2 w-4 h-4" /> Back
              </Button>
              <Button disabled={!date || !timeSlot} onClick={() => setStep(3)}>
                Next <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        )}

        {/* Step 3 — Final Details */}
        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-serif">Final Details</h2>
              <p className="text-white/50 uppercase tracking-widest text-xs">Tell us more about your vision</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-white/50">Full Name</label>
                  <input
                    type="text"
                    value={details.name}
                    onChange={(e) => setDetails({ name: e.target.value })}
                    className="w-full bg-black border border-white/10 p-4 focus:border-gold outline-none text-sm"
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-white/50">Email Address</label>
                  <input
                    type="email"
                    value={details.email}
                    onChange={(e) => setDetails({ email: e.target.value })}
                    className="w-full bg-black border border-white/10 p-4 focus:border-gold outline-none text-sm"
                    placeholder="john@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-white/50">Phone Number</label>
                  <input
                    type="tel"
                    value={details.phone}
                    onChange={(e) => setDetails({ phone: e.target.value })}
                    className="w-full bg-black border border-white/10 p-4 focus:border-gold outline-none text-sm"
                    placeholder="+257 ..."
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-white/50">Location / Venue</label>
                  <input
                    type="text"
                    value={details.location}
                    onChange={(e) => setDetails({ location: e.target.value })}
                    className="w-full bg-black border border-white/10 p-4 focus:border-gold outline-none text-sm"
                    placeholder="Bujumbura, etc."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-white/50">Shoot Notes / Inspiration</label>
                  <textarea
                    rows={4}
                    value={details.notes}
                    onChange={(e) => setDetails({ notes: e.target.value })}
                    className="w-full bg-black border border-white/10 p-4 focus:border-gold outline-none text-sm resize-none"
                    placeholder="Tell us about your style..."
                  />
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="p-6 bg-white/5 border border-gold/20 space-y-4">
              <h4 className="text-gold font-serif text-lg">Summary</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="block text-[8px] uppercase tracking-widest text-white/30">Package</span>
                  <span className="font-bold">{currentPackage?.name}</span>
                </div>
                <div>
                  <span className="block text-[8px] uppercase tracking-widest text-white/30">Date</span>
                  <span className="font-bold">{date?.toLocaleDateString()}</span>
                </div>
                <div>
                  <span className="block text-[8px] uppercase tracking-widest text-white/30">Time</span>
                  <span className="font-bold">{timeSlot}</span>
                </div>
                <div>
                  <span className="block text-[8px] uppercase tracking-widest text-white/30">Amount</span>
                  <span className="font-bold text-gold">{formatPrice(currentPackage?.price || 0)}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-8 border-t border-white/10">
              <Button variant="outline" onClick={() => setStep(2)}>
                <ArrowLeft className="mr-2 w-4 h-4" /> Back
              </Button>
              <Button onClick={() => alert("Redirecting to Stripe...")}>
                Confirm & Pay Deposit
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
