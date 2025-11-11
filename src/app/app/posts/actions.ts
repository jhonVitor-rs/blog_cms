"use server";

import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { posts } from "@/services/db/schemas";

export async function getAllPosts(userId: string) {
  return await db
    .select()
    .from(posts)
    .where(eq(posts.userId, userId))
    .orderBy(posts.updatedAt);
}
