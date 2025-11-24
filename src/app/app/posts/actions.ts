"use server";

import { eq } from "drizzle-orm";
import { getUserSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { posts, type TNewPost } from "@/services/db/schemas";
import type { Response } from "@/types/response";

export async function getAllPosts() {
  const user = await getUserSession();

  return await db
    .select()
    .from(posts)
    .where(eq(posts.userId, user.id as string))
    .orderBy(posts.updatedAt);
}

export async function createPost(
  data: TNewPost,
): Promise<Response<{ postId: string }>> {
  try {
    const [newPost] = await db
      .insert(posts)
      .values({ title: data.title, userId: data.userId })
      .returning({ id: posts.id });

    return {
      success: true,
      message: "Post criado com sucesso",
      data: { postId: newPost.id },
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      message: "Erro ao tenar criar o post!",
    };
  }
}
