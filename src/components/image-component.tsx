/** biome-ignore-all lint/complexity/useOptionalChain: <explanation> */
"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { imageFileSchema } from "@/app/app/posts/[postId]/_components/file-schema";
import { cn } from "@/lib/utils";
import type { TImage } from "@/services/db/schemas";
import { ImageInput } from "./image-input";
import { Button } from "./ui/button";
import { Form, FormField, FormItem } from "./ui/form";

const formSchema = z.object({
  image: imageFileSchema,
});

export function ImageForm({
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
