import React from "react";
import { prisma } from "@/lib/db";
import DashboardContent from "./dashboard-content";
import { 
  Users, 
  Calendar, 
  DollarSign,
  Clock
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  // 1. Fetch live metrics from Supabase database
  const totalPayments = await prisma.payment.aggregate({
    _sum: { amount: true },
  });
  const totalRevenue = totalPayments._sum.amount || 0;

  const bookingsCount = await prisma.booking.count();
  const clientsCount = await prisma.user.count({
    where: { role: "CLIENT" },
  });

  const avgAmountResult = await prisma.booking.aggregate({
    _avg: { totalAmount: true },
  });
  const avgSessionValue = avgAmountResult._avg.totalAmount || 0;

  // 2. Fetch the 4 most recent bookings
  const recentDbBookings = await prisma.booking.findMany({
    take: 4,
    include: {
      user: true,
      package: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedBookings = recentDbBookings.map((booking) => {
    const dateFormatted = booking.date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    return {
      id: booking.id,
      client: booking.user.name || "Client",
      package: booking.package.name,
      date: dateFormatted,
      status: booking.status, // PENDING, APPROVED, REJECTED
      amount: booking.totalAmount,
    };
  });

  // 3. Calculate category distribution dynamically from bookings
  // Fallbacks are included to keep the chart beautiful if there is no database data yet
  const weddingCount = await prisma.booking.count({
    where: { package: { category: { contains: "wedding", mode: "insensitive" } } },
  });
  const portraitCount = await prisma.booking.count({
    where: { package: { category: { contains: "portrait", mode: "insensitive" } } },
  });
  const fashionCount = await prisma.booking.count({
    where: { package: { category: { contains: "fashion", mode: "insensitive" } } },
  });
  const eventCount = await prisma.booking.count({
    where: { package: { category: { contains: "event", mode: "insensitive" } } },
  });

  const totalCategorized = weddingCount + portraitCount + fashionCount + eventCount;

  const categoryDistribution = [
    { 
      label: "Wedding", 
      value: totalCategorized > 0 ? Math.round((weddingCount / totalCategorized) * 100) : 45, 
      color: "bg-gold" 
    },
    { 
      label: "Portrait", 
      value: totalCategorized > 0 ? Math.round((portraitCount / totalCategorized) * 100) : 30, 
      color: "bg-white/30" 
    },
    { 
      label: "Fashion", 
      value: totalCategorized > 0 ? Math.round((fashionCount / totalCategorized) * 100) : 15, 
      color: "bg-white/10" 
    },
    { 
      label: "Events", 
      value: totalCategorized > 0 ? Math.round((eventCount / totalCategorized) * 100) : 10, 
      color: "bg-gold/40" 
    },
  ];

  // 4. Construct Stats Array for Dashboard Cards
  const stats = [
    { 
      name: "Total Revenue", 
      value: totalRevenue, 
      icon: DollarSign, 
      trend: "+12.5%", 
      positive: true 
    },
    { 
      name: "New Bookings", 
      value: bookingsCount, 
      icon: Calendar, 
      trend: "+8.2%", 
      positive: true 
    },
    { 
      name: "Active Clients", 
      value: clientsCount, 
      icon: Users, 
      trend: "+5.1%", 
      positive: true 
    },
    { 
      name: "Avg. Session Price", 
      value: avgSessionValue, 
      icon: Clock, 
      trend: "+1.4%", 
      positive: true 
    },
  ];

  return (
    <DashboardContent
      stats={stats}
      recentBookings={formattedBookings}
      categoryDistribution={categoryDistribution}
    />
  );
}
