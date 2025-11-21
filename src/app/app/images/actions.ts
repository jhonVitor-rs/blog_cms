'use server'

import { asc, eq, sql } from "drizzle-orm";
import { getUserSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { deleteImage, uploadImage } from "@/services/cloudinary/actions";
import { images, type TImage } from "@/services/db/schemas";
import type { Response } from "@/types/response";

export async function getUserImages() {
  const user = await getUserSession();

  const [result] = await db
    .select({
      totalImages: sql<number>`count(${images.id})`,
      totalSize: sql<number>`sum(${images.size})`,
    })
    .from(images)
    .where(eq(images.userId, user.id));

  const imagesData = await db.query.images.findMany({
    where: eq(images.userId, user.id),
    orderBy: asc(images.createdAt),
  });

  return {
    images: imagesData,
    totalImages: result.totalImages ?? 0,
    totalSize: result.totalSize ?? 0,
  };
}

export type TUserImagesData = Awaited<ReturnType<typeof getUserImages>>;

export async function createUserImage(
  file: File,
  index: number,
): Promise<Response<TImage>> {
  try {
    const user = await getUserSession();

    const uploadedImage = await uploadImage(file, `users/${user.id}/images`);

    const [image] = await db
      .insert(images)
      .values({
        url: uploadedImage.secure_url,
        publicId: uploadedImage.public_id,
        index,
        userId: user.id,
        size: file.size,
        orignalName: file.name,
      })
      .returning();

    return {
      success: true,
      message: "Imagem criada com sucesso",
      data: image,
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      message: "Falha ao criar imagen",
    };
  }
}
export async function updateUserImage(
  file: File,
  imageId: string,
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
      `users/${image.articleId}/images`,
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
      message: "Imagen atualizada com sucesso",
      data: updatedImage,
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      message: "Falha ao atualizar imagen",
    };
  }
}

export async function deleteUserImage(
  imageId: string,
): Promise<Response<null>> {
  try {
    const image = await db.query.images.findFirst({
      where: eq(images.id, imageId),
    });
    if (!image) {
      return {
        success: false,
        message: "Imagem não encontrada",
      };
    }

    await deleteImage(image.publicId);
    await db.delete(images).where(eq(images.id, imageId));

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
