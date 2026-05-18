import React from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

interface SuccessPageProps {
  searchParams: Promise<{
    booking_id?: string;
  }>;
}

export default async function BookingSuccessPage({ searchParams }: SuccessPageProps) {
  const params = await searchParams;
  const bookingId = params.booking_id;

  let bookingDetails = null;

  if (bookingId) {
    try {
      const chapaSecret = process.env.CHAPA_SECRET_KEY || "CHASECK_TEST-placeholder";

      // 1. Verify transaction status directly with Chapa API
      const response = await fetch(`https://api.chapa.co/v1/transaction/verify/${bookingId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${chapaSecret}`,
        },
      });

      const resJson = await response.json();

      if (resJson.status === "success" && resJson.data.status === "success") {
        // 2. Fetch booking and package details
        const booking = await prisma.booking.findUnique({
          where: { id: bookingId },
          include: { package: true, user: true },
        });

        if (booking) {
          const paidAmount = Number(resJson.data.amount) || booking.package.depositAmount || (booking.package.price * 0.25);

          // 3. Update the booking and create the payment record securely in a transaction
          const existingPayment = await prisma.payment.findUnique({
            where: { stripeId: bookingId }, // Reusing stripeId column to hold Chapa reference
          });

          if (!existingPayment) {
            await prisma.$transaction([
              prisma.booking.update({
                where: { id: bookingId },
                data: {
                  status: "APPROVED",
                  paidAmount: paidAmount,
                },
              }),
              prisma.payment.create({
                data: {
                  bookingId: bookingId,
                  stripeId: bookingId,
                  amount: paidAmount,
                  currency: resJson.data.currency || "USD",
                  status: "SUCCESS",
                },
              }),
            ]);
          }

          bookingDetails = {
            clientName: booking.user.name || "Client",
            packageName: booking.package.name,
            date: booking.date.toLocaleDateString(),
            timeSlot: booking.startTime,
            amountPaid: paidAmount,
            currency: resJson.data.currency || "USD",
          };

          revalidatePath("/admin/bookings");
          revalidatePath("/admin/dashboard");
        }
      }
    } catch (error) {
      console.error("Error confirming booking payment with Chapa:", error);
    }
  }

  return (
    <div className="pt-40 pb-24 min-h-screen bg-brand-black flex items-center justify-center">
      <div className="container mx-auto px-6 max-w-xl text-center">
        <div className="bg-white/5 border border-gold/20 p-12 space-y-8 relative">
          
          {/* Animated/Glowing Check Icon */}
          <div className="w-20 h-20 bg-gold/10 text-gold flex items-center justify-center rounded-full mx-auto border border-gold/30 shadow-[0_0_30px_rgba(212,175,55,0.2)]">
            <Check className="w-10 h-10" />
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl font-serif font-bold italic text-gold">Booking Confirmed!</h1>
            <p className="text-white/60 text-sm max-w-sm mx-auto leading-relaxed">
              {bookingDetails
                ? `Thank you, ${bookingDetails.clientName}! Your deposit has been successfully paid, and your session has been secured.`
                : "Thank you! Your photography session deposit has been paid and your session is successfully reserved."}
            </p>
          </div>

          {bookingDetails && (
            <div className="border-t border-white/10 pt-8 mt-4 grid grid-cols-2 gap-6 text-left text-sm">
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-widest text-white/30">Package</span>
                <p className="font-bold text-white">{bookingDetails.packageName}</p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-widest text-white/30">Date</span>
                <p className="font-bold text-white">{bookingDetails.date}</p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-widest text-white/30">Time</span>
                <p className="font-bold text-white">{bookingDetails.timeSlot}</p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-widest text-white/30">Deposit Paid</span>
                <p className="font-bold text-gold">
                  {bookingDetails.currency} {bookingDetails.amountPaid.toFixed(2)}
                </p>
              </div>
            </div>
          )}

          <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/" className="flex-1">
              <Button className="w-full h-12">Return Home</Button>
            </Link>
            <Link href="/portfolio" className="flex-1">
              <Button variant="outline" className="w-full h-12 bg-white/5">View Portfolio</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
