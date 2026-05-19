import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    console.log("Received Chapa Webhook payload:", payload);

    const txRef = payload.tx_ref;
    if (!txRef) {
      return NextResponse.json({ error: "Missing transaction reference" }, { status: 400 });
    }

    const chapaSecret = process.env.CHAPA_SECRET_KEY || "CHASECK_TEST-placeholder";

    // 1. Double-verify the payment legitimacy directly with Chapa's server
    // (Bypasses webhook payload spoofing entirely for bulletproof security!)
    const response = await fetch(`https://api.chapa.co/v1/transaction/verify/${txRef}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${chapaSecret}`,
      },
    });

    const resJson = await response.json();

    if (resJson.status === "success" && resJson.data.status === "success") {
      // 2. Fetch the corresponding booking and package details
      const booking = await prisma.booking.findUnique({
        where: { id: txRef },
        include: { package: true },
      });

      if (booking) {
        const paidAmount = Number(resJson.data.amount) || booking.package.depositAmount || (booking.package.price * 0.25);

        // 3. Update the booking and create the payment record securely in a transaction
        const existingPayment = await prisma.payment.findUnique({
          where: { stripeId: txRef }, // Reusing stripeId column to hold Chapa reference
        });

        if (!existingPayment) {
          await prisma.$transaction([
            prisma.booking.update({
              where: { id: txRef },
              data: {
                status: "APPROVED",
                paidAmount: paidAmount,
              },
            }),
            prisma.payment.create({
              data: {
                bookingId: txRef,
                stripeId: txRef,
                amount: paidAmount,
                currency: resJson.data.currency || "USD",
                status: "SUCCESS",
              },
            }),
          ]);
          console.log(`Booking #${txRef} successfully approved via background webhook.`);
        }
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("Error processing Chapa Webhook:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
