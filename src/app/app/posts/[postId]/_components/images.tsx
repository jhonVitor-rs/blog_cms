/** biome-ignore-all lint/complexity/useOptionalChain: <explanation> */
/** biome-ignore-all lint/correctness/useExhaustiveDependencies: <explanation> */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, GripVertical, Trash2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { createSwapy } from "swapy";
import { z } from "zod";
import { ImageInput } from "@/components/image-input";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Form, FormField, FormItem } from "@/components/ui/form";
import { getUserSession } from "@/lib/auth";
import { cn } from "@/lib/utils";
import type { TImage } from "@/services/db/schemas";
import {
  createArticleImage,
  deleteArticleImage,
  getImagesArticle,
  updateArticleImage,
  updateImagesIndex,
} from "../actions";
import { imageFileSchema } from "./file-schema";

const formSchema = z.object({
  image: imageFileSchema,
});

function ImageForm({
  image,
  onSave,
}: {
  image?: TImage;
  onSave: (file: File, image?: TImage) => Promise<void>;
}) {
  const [previewUrl, setPreviewUrl] = useState(image?.url);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      image: undefined,
    },
  });

  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleSubmit = form.handleSubmit(async (data) => {
    await onSave(data.image, image);
    clearPreviewUrl();
  });

  const handlePreviewUrl = (value: string) => {
    if (previewUrl && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }

    setPreviewUrl(value);
  };

  const clearPreviewUrl = () => {
    if (previewUrl !== image?.url) setPreviewUrl(image?.url);
    else setPreviewUrl(undefined);
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="relative">
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <ImageInput
                field={field}
                url={previewUrl || undefined}
                clearPreviewUrl={clearPreviewUrl}
                handlePreviewUrl={handlePreviewUrl}
                className="w-full"
              />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className={cn(
            previewUrl !== image?.url
              ? "absolute bottom-8 right-20 hover:scale-110"
              : "hidden"
          )}
          size={"icon"}
        >
          <Check />
        </Button>
      </form>
    </Form>
  );
}

export function ArticleImages({ articleId }: { articleId: string }) {
  const [images, setImages] = useState<TImage[]>([]);
  const imagesContainer = useRef<HTMLDivElement>(null);
  const swapyInstanceRef = useRef<ReturnType<typeof createSwapy> | null>(null);

  const getImagesData = useCallback(async () => {
    const res = await getImagesArticle(articleId);
    setImages(res);
  }, [articleId]);

  useEffect(() => {
    getImagesData();
  }, [getImagesData]);

  useEffect(() => {
    if (imagesContainer.current && !swapyInstanceRef.current) {
      swapyInstanceRef.current = createSwapy(imagesContainer.current, {
        animation: "dynamic",
      });

      swapyInstanceRef.current.onSwapEnd(async (event) => {
        const newOrder = event.slotItemMap.asArray.map((item, index) => {
          const imageId = item.item.replace("image-", "") || "";
          return {
            id: imageId,
            index: index,
          };
        });

        console.log("Nova ordem de imagens:", newOrder);

        const { success, message } = await updateImagesIndex(newOrder);
        if (!success) {
          toast.error(message);
          getImagesData();
        }
      });
    }

    return () => {
      if (swapyInstanceRef.current) {
        swapyInstanceRef.current.destroy();
        swapyInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (swapyInstanceRef.current && imagesContainer.current) {
      swapyInstanceRef.current.update();
    }
  }, [images.length]);

  const handleCreateNew = async (file: File) => {
    const user = await getUserSession();
    const { success, message, data } = await createArticleImage(
      user.id,
      articleId,
      file,
      images.length
    );
    if (success && data) {
      setImages((prev) => [...prev, data]);
    } else {
      toast.error(message);
    }
  };

  const handleUpdateImage = async (file: File, image?: TImage) => {
    if (image) {
      const { success, message, data } = await updateArticleImage(
        image.id,
        file
      );
      if (success && data) {
        setImages((prev) =>
          prev.map((img) => (img.id === data.id ? data : img))
        );
      } else {
        toast.error(message);
      }
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    const { success, message } = await deleteArticleImage(imageId);
    if (success) {
      setImages((prev) => prev.filter((img) => img.id !== imageId));
      toast.success("Imagem deletada!");
    } else {
      toast.error(message);
    }
  };

  return (
    <Carousel
      opts={{
        align: "start",
      }}
      className="w-full bg-muted my-2 mx-4 rounded-md"
    >
      <CarouselContent ref={imagesContainer} className="px-3">
        {images.map((image) => (
          <div
            key={image.id}
            data-swapy-slot={`slot-${image.id}`}
            className="relative md:basis-1/2 lg:basis-1/3 shrink-0"
          >
            <div
              data-swapy-item={`image-${image.id}`}
              className="relative h-full"
            >
              <div
                data-swapy-handle
                className="absolute top-4 left-4 z-10 cursor-grab active:cursor-grabbing bg-black/50 hover:bg-black/70 p-2 rounded-md transition-colors"
              >
                <GripVertical className="h-5 w-5 text-white" />
              </div>

              <ImageForm image={image} onSave={handleUpdateImage} />

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

        <CarouselItem className="md:basis-1/2 lg:basis-1/3 shrink-0">
          <ImageForm onSave={handleCreateNew} />
        </CarouselItem>
      </CarouselContent>

      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
