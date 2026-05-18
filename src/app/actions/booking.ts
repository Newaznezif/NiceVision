"use server";

import { prisma } from "@/lib/db";
import { stripe } from "@/lib/stripe";

export async function createBookingSession(data: {
  packageId: string;
  dateStr: string; // ISO String format
  timeSlot: string;
  name: string;
  email: string;
  phone: string;
  location?: string;
  notes?: string;
}) {
  try {
    // 1. Find or create the Client User
    let user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          name: data.name,
          email: data.email,
          role: "CLIENT",
        },
      });
    }

    // 2. Fetch the Package details
    const pkg = await prisma.package.findUnique({
      where: { id: data.packageId },
    });

    if (!pkg) {
      throw new Error("Package not found");
    }

    // Calculate endTime based on startTime + package duration
    const startTime = data.timeSlot; // e.g. "10:00 AM"
    const durationHours = Math.ceil(pkg.duration / 60) || 1;
    const startHour = parseInt(startTime);
    const isPM = startTime.includes("PM");
    let endHour = startHour + durationHours;
    let endPM = isPM;
    if (endHour >= 12) {
      if (endHour > 12) {
        endHour -= 12;
      }
      endPM = !isPM;
    }
    const endTime = `${endHour}:00 ${endPM ? "PM" : "AM"}`;

    // 3. Create the Pending Booking
    const booking = await prisma.booking.create({
      data: {
        userId: user.id,
        packageId: pkg.id,
        date: new Date(data.dateStr),
        startTime,
        endTime,
        location: data.location || "To Be Decided",
        notes: data.notes || "",
        totalAmount: pkg.price,
        status: "PENDING",
      },
    });

    // 4. Create Stripe Checkout Session for the deposit amount
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://nice-vision.vercel.app";
    const depositAmount = pkg.depositAmount || pkg.price * 0.25;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Booking Deposit: ${pkg.name}`,
              description: `Photography session deposit for ${data.name} on ${new Date(
                data.dateStr
              ).toLocaleDateString()} at ${startTime}.`,
              images: [
                "https://images.unsplash.com/photo-1516205651411-aef33a44f7c2?q=80&w=600&auto=format&fit=crop",
              ],
            },
            unit_amount: Math.round(depositAmount * 100), // in cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${appUrl}/booking/success?session_id={CHECKOUT_SESSION_ID}&booking_id=${booking.id}`,
      cancel_url: `${appUrl}/booking`,
      customer_email: data.email,
      metadata: {
        bookingId: booking.id,
        userId: user.id,
        packageId: pkg.id,
      },
    });

    return { url: session.url };
  } catch (error) {
    console.error("Booking server action error:", error);
    const err = error as Error;
    throw new Error(err.message || "Failed to initiate booking checkout.");
  }
}
