"use server";

import { asc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { deleteImage, uploadImage } from "@/services/cloudinary/actions";
import {
  articles,
  images,
  posts,
  type TArticle,
  type TImage,
  type TNewArticle,
  type TPost,
} from "@/services/db/schemas";
import type { Response } from "@/types/response";

export async function getPost(postId: string) {
  try {
    const post = await db.query.posts.findFirst({
      where: eq(posts.id, postId),
    });

    return post ?? null;
  } catch (error) {
    console.error("Erro ao buscar post:", error);
    return null;
  }
}

export async function getArticlesPost(postId: string) {
  try {
    return await db.query.articles.findMany({
      where: eq(articles.postId, postId),
      orderBy: asc(articles.index),
    });
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getImagesArticle(articleId: string) {
  try {
    return await db.query.images.findMany({
      where: eq(images.articleId, articleId),
      orderBy: asc(images.index),
    });
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function updatePost(
  postId: string,
  data: {
    title?: string;
    banner?: File;
  },
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
        `posts/${post.id}/banner`,
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

export async function createArticle(
  data: TNewArticle,
): Promise<Response<TArticle>> {
  try {
    const [article] = await db.insert(articles).values(data).returning();

    if (!article)
      return {
        success: false,
        message: "Falha ao criar artigo.",
      };

    return {
      success: true,
      message: "Artigo criado com sucesso",
      data: article,
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      message: "Falha ao criar artigo.",
    };
  }
}

export async function updateArticle(
  data: TArticle,
): Promise<Response<TArticle>> {
  try {
    const article = await db.query.articles.findFirst({
      where: eq(articles.id, data.id),
    });
    if (!article)
      return {
        success: false,
        message: "Artigo não encontrado.",
      };

    const [updatedArticle] = await db
      .update(articles)
      .set(data)
      .where(eq(articles.id, data.id))
      .returning();

    return {
      success: true,
      message: "Artigo atualizado com sucesso",
      data: updatedArticle,
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      message: "Falha ao tentar atualizar artigo",
    };
  }
}

export async function updatedArticlesIndex(
  articlesData: { id: string; index: number }[],
): Promise<Response<TArticle[]>> {
  try {
    const updatedArticles = await db.transaction(async (tx) => {
      const results: TArticle[] = [];

      for (const article of articlesData) {
        const [updated] = await tx
          .update(articles)
          .set({
            index: article.index,
            updatedAt: new Date(),
          })
          .where(eq(articles.id, article.id))
          .returning();

        if (updated) {
          results.push(updated);
        }
      }

      return results;
    });

    const sortedArticles = updatedArticles.sort((a, b) => a.index - b.index);
    revalidatePath("/posts/[id]", "page");

    return {
      success: true,
      message: "Ordem atualizada com sucesso!",
      data: sortedArticles,
    };
  } catch (error) {
    console.error("Erro ao atualizar ordem:", error);
    return {
      success: false,
      message: "Erro ao atualizar ordem dos artigos",
    };
  }
}

export async function deleteArticle(id: string): Promise<Response<null>> {
  try {
    const article = await db.query.articles.findFirst({
      where: eq(articles.id, id),
    });
    if (!article)
      return {
        success: false,
        message: "Artigo não encontrado",
      };

    await db.delete(articles).where(eq(articles.id, id));
    return {
      success: true,
      message: "Artigo excluido com sucesso",
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      message: "Falha ao excluir artigo",
    };
  }
}

export async function createArticleImage(
  userId: string,
  articleId: string,
  file: File,
  index: number,
): Promise<Response<TImage>> {
  try {
    const uploadedImage = await uploadImage(
      file,
      `articles/${articleId}/images`,
    );
    const [image] = await db
      .insert(images)
      .values({
        url: uploadedImage.secure_url,
        publicId: uploadedImage.public_id,
        index,
        articleId,
        userId,
        size: file.size,
        orignalName: file.name,
      })
      .returning();

    return {
      success: true,
      message: "",
      data: image,
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      message: "Falha ao adicionar imagem",
    };
  }
}

export async function deleteArticleImage(
  imageid: string,
): Promise<Response<null>> {
  try {
    const image = await db.query.images.findFirst({
      where: eq(images.id, imageid),
    });
    if (!image) {
      return {
        success: false,
        message: "Imagem não encontrada",
      };
    }

    await deleteImage(image.publicId);
    await db.delete(images).where(eq(images.id, imageid));

    return {
      success: true,
      message: "imagen removidao com sucesso",
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      message: "Falha ao remover imagen",
    };
  }
}

export async function updateArticleImage(
  imageId: string,
  file: File,
): Promise<Response<TImage>> {
  try {
    const image = await db.query.images.findFirst({
      where: eq(images.id, imageId),
    });
    if (!image) {
      return {
        success: false,
        message: "IMagem não encontrada",
      };
    }

    const uploadedImageFile = await uploadImage(
      file,
      `article/${image.articleId}/images`,
    );
    await deleteImage(image.publicId);

    const [updatedImage] = await db
      .update(images)
      .set({
        url: uploadedImageFile.secure_url,
        publicId: uploadedImageFile.public_id,
        size: file.size,
        orignalName: file.name,
        updatedAt: new Date(),
      })
      .where(eq(images.id, imageId))
      .returning();

    return {
      success: true,
      message: "",
      data: updatedImage,
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      message: "Falha ao atualizar imagem",
    };
  }
}

export async function updateImagesIndex(
  imagesData: { id: string; index: number }[],
): Promise<Response<null>> {
  try {
    await db.transaction(async (tx) => {
      for (const image of imagesData) {
        await tx
          .update(images)
          .set({
            index: image.index,
            updatedAt: new Date(),
          })
          .where(eq(images.id, image.id));
      }
    });

    return {
      success: true,
      message: "",
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      message: "Falha ao tentar atualizar ordem das imagens",
    };
  }
}
