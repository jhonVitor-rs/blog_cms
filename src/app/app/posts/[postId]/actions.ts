"use server";

import { asc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { deleteImage, uploadImage } from "@/services/cloudinary/actions";
import { articles, images, posts, type TPost } from "@/services/db/schemas";
import type { Response } from "@/types/response";

export async function getPost(postId: string) {
  try {
    const post = await db.query.posts.findFirst({
      where: eq(posts.id, postId),
      with: {
        articles: {
          orderBy: [asc(articles.index)],
          with: {
            images: {
              orderBy: [asc(images.index)],
            },
          },
        },
      },
    });

    return post ?? null;
  } catch (error) {
    console.error("Erro ao buscar post:", error);
    return null;
  }
}

export type TPostWithRelations = NonNullable<
  Awaited<ReturnType<typeof getPost>>
>;

export async function updatePost(
  postId: string,
  data: {
    title?: string;
    banner?: File;
  }
): Promise<Response<TPost>> {
  try {
    const post = await db.query.posts.findFirst({
      where: eq(posts.id, postId),
    });

    if (!post) {
      return {
        success: false,
        message: "Post não encontrado",
      };
    }

    let bannerUrl = post.banner;
    let bannerId = post.publicBannerId;

    if (data.banner) {
      const uploadData = await uploadImage(
        data.banner,
        `posts/${post.id}/banner`
      );
      bannerUrl = uploadData.secure_url;
      bannerId = uploadData.public_id;

      if (post.publicBannerId) {
        try {
          await deleteImage(post.publicBannerId);
        } catch (error) {
          console.warn("Não foi possível deletar banner antigo:", error);
        }
      }
    }

    const updateData: Partial<TPost> = {};

    if (data.title && data.title !== post.title) {
      updateData.title = data.title;
    }

    if (bannerUrl !== post.banner) {
      updateData.banner = bannerUrl;
      updateData.publicBannerId = bannerId;
    }

    if (Object.keys(updateData).length === 0) {
      return {
        success: true,
        message: "Nenhuma alteração foi feita",
        data: post,
      };
    }

    const [updatedPost] = await db
      .update(posts)
      .set(updateData)
      .where(eq(posts.id, postId))
      .returning();

    return {
      success: true,
      message: "Post atualizado com sucesso",
      data: updatedPost,
    };
  } catch (error) {
    console.error("Erro ao atualizar post:", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Falha ao tentar atualizar post",
    };
  }
}
