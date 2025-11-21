/** biome-ignore-all lint/a11y/noLabelWithoutControl: <explanation> */
"use client";

import { HardDrive, Image as ImageIcon, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ImageForm } from "@/components/image-component";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import type { TImage } from "@/services/db/schemas";
import {
  createUserImage,
  deleteUserImage,
  type TUserImagesData,
  updateUserImage,
} from "../actions";

export function ImagesList({ data }: { data: TUserImagesData }) {
  const [imagesData, setImagesData] = useState(data);

  const usagePercentage = (imagesData.totalSize / (1024 * 1024) / 500) * 100;
  const usedMB = (imagesData.totalSize / (1024 * 1024)).toFixed(2);
  const remainingMB = (500 - parseFloat(usedMB)).toFixed(2);

  const handleCreateNew = async (file: File) => {
    const { success, message, data } = await createUserImage(
      file,
      imagesData.images.length
    );
    if (success && data) {
      toast.success(message);
      setImagesData((prev) => ({
        ...prev,
        images: [...prev.images, data],
      }));
    } else {
      toast.error(message);
    }
  };

  const handleUpdate = async (file: File, image?: TImage) => {
    if (image) {
      const { success, message, data } = await updateUserImage(file, image.id);
      if (success && data) {
        toast.success(message);
        setImagesData((prev) => ({
          ...prev,
          images: prev.images.map((img) => (img.id === data.id ? data : img)),
        }));
      } else {
        toast.error(message);
      }
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    const { success, message } = await deleteUserImage(imageId);
    if (success) {
      setImagesData((prev) => ({
        ...prev,
        images: prev.images.filter((img) => img.id !== imageId),
      }));
      toast.success(message);
    } else {
      toast.error(message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header com informações de armazenamento */}
      <section className="bg-secondary rounded-lg border p-6">
        <div className="space-y-4">
          {/* Linha de informações principais */}
          <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-muted rounded-lg">
                <ImageIcon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Total de Imagens
                </p>
                <p className="text-2xl font-bold">{imagesData.totalImages}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-muted rounded-lg">
                <HardDrive className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Armazenamento Utilizado
                </p>
                <p className="text-2xl font-bold">{usedMB} MB</p>
              </div>
            </div>
          </div>

          {/* Barra de progresso */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">
                Capacidade de Armazenamento
              </label>
              <span className="text-sm font-semibold">
                {usagePercentage.toFixed(1)}%
              </span>
            </div>
            <Progress value={usagePercentage} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{usedMB} MB utilizado</span>
              <span>{remainingMB} MB disponível</span>
            </div>
          </div>
        </div>
      </section>

      {/* Grid de imagens */}
      <section>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {imagesData.images.map((image) => (
              <div
                key={image.id}
                className="relative md:basis-1/2 lg:basis-1/3 shrink-0"
              >
                {/* Conteúdo da imagem */}
                <div className="relative h-full">
                  <ImageForm image={image} onSave={handleUpdate} />

                  <Button
                    variant={"destructive"}
                    size={"icon"}
                    className="absolute bottom-11 right-8 hover:scale-110 transition-transform"
                    onClick={() => handleDeleteImage(image.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            <div className="h-full min-h-[200px]">
              <ImageForm onSave={handleCreateNew} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
