"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getPackages() {
  return await prisma.package.findMany({
    orderBy: { createdAt: 'desc' }
  });
}

export async function createPackage(data: { name: string, price: number, category: string, duration: string }) {
  const durationMinutes = parseInt(data.duration) * 60 || 60;

  const pkg = await prisma.package.create({
    data: {
      name: data.name,
      price: data.price,
      category: data.category,
      description: `Professional ${data.category} session`,
      duration: durationMinutes,
      depositAmount: data.price * 0.25,
      includedPhotos: 20,
      deliveryDays: 7,
      features: ["Professional Editing", "Online Gallery"],
      isActive: true
    }
  });
  revalidatePath("/admin/services");
  revalidatePath("/services");
  revalidatePath("/booking");
  revalidatePath("/");
  return pkg;
}

export async function updatePackage(id: string, data: { name: string, price: number, category: string, duration: string }) {
  const durationMinutes = parseInt(data.duration) * 60 || 60;
  
  const pkg = await prisma.package.update({
    where: { id },
    data: {
      name: data.name,
      price: data.price,
      category: data.category,
      duration: durationMinutes
    }
  });
  revalidatePath("/admin/services");
  revalidatePath("/services");
  revalidatePath("/booking");
  revalidatePath("/");
  return pkg;
}

export async function deletePackage(id: string) {
  await prisma.package.delete({
    where: { id }
  });
  revalidatePath("/admin/services");
  revalidatePath("/services");
  revalidatePath("/booking");
  revalidatePath("/");
}
