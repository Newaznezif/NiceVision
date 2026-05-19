import React from "react";
import { prisma } from "@/lib/db";
import BookingsTable from "./bookings-table";

export const dynamic = "force-dynamic";

export default async function AdminBookingsPage() {
  // Fetch real bookings from Supabase database
  const bookings = await prisma.booking.findMany({
    include: {
      user: true,
      package: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Map database entries to matching frontend interface schema
  const formattedBookings = bookings.map((booking) => {
    // Formats appointment date nicely
    const dateFormatted = booking.date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    return {
      id: booking.id,
      client: booking.user.name || "Client",
      email: booking.user.email,
      package: booking.package.name,
      date: dateFormatted,
      time: booking.startTime,
      status: booking.status, // PENDING, APPROVED, REJECTED
      amount: booking.totalAmount,
      paidAmount: booking.paidAmount || 0,
    };
  });

  return <BookingsTable initialBookings={formattedBookings} />;
}
