"use server";

import { prisma } from "@/lib/db";

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

    // 4. Split name for Chapa first_name & last_name validation
    const nameParts = data.name.trim().split(/\s+/);
    const first_name = nameParts[0] || "Client";
    const last_name = nameParts.slice(1).join(" ") || "Customer";

    // Format phone number safely (strip non-digits for validation)
    const phone_number = data.phone.replace(/\D/g, "") || "0900000000";

    // 5. Initialize Chapa Transaction
    const chapaSecret = process.env.CHAPA_SECRET_KEY || "CHASECK_TEST-placeholder";
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://nice-vision.vercel.app";
    const depositAmount = pkg.depositAmount || pkg.price * 0.25;

    const response = await fetch("https://api.chapa.co/v1/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${chapaSecret}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: depositAmount.toString(),
        currency: "USD", // You can switch this to "ETB" if using Ethiopian Birr locally
        email: data.email,
        first_name,
        last_name,
        phone_number,
        tx_ref: booking.id, // Using CUID booking ID as our unique transaction reference
        callback_url: `${appUrl}/api/webhooks/chapa`, // optional webhook
        return_url: `${appUrl}/booking/success?booking_id=${booking.id}`,
        customization: {
          title: "Nice Vision Booking Deposit",
          description: `Deposit payment for ${pkg.name} session.`
        }
      }),
    });

    const resJson = await response.json();

    if (resJson.status !== "success") {
      throw new Error(resJson.message || "Failed to initialize Chapa transaction.");
    }

    return { url: resJson.data.checkout_url };
  } catch (error) {
    console.error("Booking server action error:", error);
    const err = error as Error;
    throw new Error(err.message || "Failed to initiate Chapa payment redirect.");
  }
}
