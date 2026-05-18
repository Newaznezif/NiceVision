"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { uploadFile } from "@/lib/storage";

export async function getPortfolioItems() {
  return await prisma.portfolioItem.findMany({
    orderBy: { createdAt: 'desc' }
  });
}

export async function createPortfolioItem(formData: FormData) {
  const title = formData.get("title") as string;
  const category = formData.get("category") as string;
  const file = formData.get("file") as File | null;
  let url = formData.get("url") as string;

  // If a file was uploaded, upload it to cloud storage
  if (file && file.size > 0 && file.name !== "undefined") {
    url = await uploadFile(file);
  } else if (!url) {
    throw new Error("Either a file upload or an image URL is required.");
  }

  const item = await prisma.portfolioItem.create({
    data: {
      title,
      category,
      url,
      status: "Published"
    }
  });

  revalidatePath("/admin/portfolio");
  revalidatePath("/portfolio");
  revalidatePath("/");
  return item;
}

export async function updatePortfolioItem(id: string, formData: FormData) {
  const title = formData.get("title") as string;
  const category = formData.get("category") as string;
  const file = formData.get("file") as File | null;
  const url = formData.get("url") as string;

  const data: {
    title: string;
    category: string;
    url?: string;
  } = { title, category };

  // If a new file was uploaded, overwrite the URL
  if (file && file.size > 0 && file.name !== "undefined") {
    data.url = await uploadFile(file);
  } else if (url) {
    data.url = url;
  }

  const item = await prisma.portfolioItem.update({
    where: { id },
    data
  });

  revalidatePath("/admin/portfolio");
  revalidatePath("/portfolio");
  revalidatePath("/");
  return item;
}

export async function deletePortfolioItem(id: string) {
  await prisma.portfolioItem.delete({
    where: { id }
  });
  revalidatePath("/admin/portfolio");
  revalidatePath("/portfolio");
  revalidatePath("/");
}
