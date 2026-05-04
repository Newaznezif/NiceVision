import React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { getPackages } from "@/app/actions/services";
import { BookingForm } from "@/components/sections/booking-form";

export const metadata = {
  title: "Book a Session | Nice Vision",
  description: "Reserve your photography session with Nice Vision.",
};

export default async function BookingPage() {
  const packages = await getPackages();

  return (
    <div className="pt-32 pb-24 min-h-screen bg-brand-black">
      <div className="container mx-auto px-6 max-w-5xl">
        <header className="text-center mb-16">
          <h1 className="text-5xl font-serif font-bold italic mb-4">Book Your Session</h1>
        </header>

        {/* BookingForm is a client component — receives live packages from DB */}
        <BookingForm packages={packages} />
      </div>
    </div>
  );
}
