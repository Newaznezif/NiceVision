"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { uploadFile } from "@/lib/storage";

export async function getBlogPosts() {
  try {
    const posts = await prisma.blogPost.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return posts;
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return [];
  }
}

export async function getPublishedBlogPosts() {
  try {
    const posts = await prisma.blogPost.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: 'desc' }
    });
    return posts;
  } catch (error) {
    console.error("Error fetching published blog posts:", error);
    return [];
  }
}

export async function createBlogPost(formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const category = formData.get("category") as string;
    const isPublished = formData.get("isPublished") === "true";
    const file = formData.get("file") as File | null;
    
    let coverImage = "https://images.unsplash.com/photo-1516205651411-aef33a44f7c2?q=80&w=2000&auto=format&fit=crop";

    if (file && file.size > 0 && file.name !== "undefined") {
      coverImage = await uploadFile(file);
    }

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now();
    
    await prisma.blogPost.create({
      data: {
        title,
        slug,
        category,
        isPublished,
        content: "Draft content...",
        excerpt: "Brief excerpt of the article...",
        coverImage,
        author: "Kim Gérard",
        publishedAt: isPublished ? new Date() : null,
      }
    });
    
    revalidatePath("/admin/blog");
    revalidatePath("/blog");
    return { success: true };
  } catch (error) {
    const err = error as Error;
    throw new Error(err.message);
  }
}

export async function updateBlogPost(id: string, formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const category = formData.get("category") as string;
    const isPublished = formData.get("isPublished") === "true";
    const file = formData.get("file") as File | null;
    
    const data: {
      title: string;
      category: string;
      isPublished: boolean;
      publishedAt: Date | null;
      coverImage?: string;
    } = {
      title,
      category,
      isPublished,
      publishedAt: isPublished ? new Date() : null,
    };

    if (file && file.size > 0 && file.name !== "undefined") {
      data.coverImage = await uploadFile(file);
    }

    await prisma.blogPost.update({
      where: { id },
      data
    });
    
    revalidatePath("/admin/blog");
    revalidatePath("/blog");
    return { success: true };
  } catch (error) {
    const err = error as Error;
    throw new Error(err.message);
  }
}

export async function deleteBlogPost(id: string) {
  try {
    await prisma.blogPost.delete({ where: { id } });
    revalidatePath("/admin/blog");
    revalidatePath("/blog");
    return { success: true };
  } catch (error) {
    const err = error as Error;
    throw new Error(err.message);
  }
}
