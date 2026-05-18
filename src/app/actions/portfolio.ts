"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

// Helper to save file locally for development/production
async function saveFileLocally(file: File): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const uploadDir = join(process.cwd(), "public", "uploads");
  // Ensure the directory exists
  await mkdir(uploadDir, { recursive: true });

  const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '');
  const filename = `${Date.now()}-${safeName}`;
  const filepath = join(uploadDir, filename);

  await writeFile(filepath, buffer);

  return `/uploads/${filename}`;
}

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

  // If a local file was uploaded, save it and use its local path
  if (file && file.size > 0 && file.name !== "undefined") {
    url = await saveFileLocally(file);
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
    data.url = await saveFileLocally(file);
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
