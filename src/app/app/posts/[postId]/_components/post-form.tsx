/** biome-ignore-all lint/complexity/useOptionalChain: <explanation> */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { ImageInput } from "@/components/image-input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { TPost } from "@/services/db/schemas";
import { updatePost } from "../actions";
import { imageFileSchema } from "./file-schema";

const postSchema = z.object({
  title: z
    .string({ message: "O título é obrigatório" })
    .min(5, { message: "O título deve ter no mínimo 5 caracteres" })
    .max(255, { message: "O título deve ter no máximo 255 caracteres" })
    .trim(),
  banner: imageFileSchema.optional(),
});

export function PostForm({ post }: { post: TPost }) {
  const [previewUrl, setPreviewUrl] = useState(post.banner);
  const form = useForm<z.infer<typeof postSchema>>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: post.title,
      banner: undefined,
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
    const { success, message } = await updatePost(post.id, {
      title: data.title,
      banner: data.banner,
    });
    if (success) toast.success(message);
    else toast.error(message);
  });

  const handlePreviewUrl = (value: string) => {
    if (previewUrl && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }

    setPreviewUrl(value);
  };

  const clearPreviewUrl = () => {
    if (previewUrl !== post.banner) setPreviewUrl(post.banner);
    else setPreviewUrl(null);
  };

  const isSave = () =>
    form.watch("title") !== post.title || post.banner !== previewUrl;

  return (
    <div>
      <section>
        <Form {...form}>
          <form onSubmit={handleSubmit}>
            <FormField
              control={form.control}
              name="banner"
              render={({ field }) => (
                <FormItem>
                  <ImageInput
                    field={field}
                    url={previewUrl || undefined}
                    clearPreviewUrl={clearPreviewUrl}
                    handlePreviewUrl={handlePreviewUrl}
                  />
                </FormItem>
              )}
            />
            <div className="flex items-center justify-between gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input
                        {...field}
                        className={cn(
                          "border-0 border-b-2 border-gray-300 rounded-none px-0 bg-transparent",
                          "text-gray-800 placeholder:text-gray-400 font-semibold text-2xl!",
                          "focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0",
                          "focus:border-b-2 focus:border-primary",
                          "transition-colors duration-200"
                        )}
                        placeholder="Título..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={!isSave()}>
                Salvar
              </Button>
            </div>
          </form>
        </Form>
      </section>
    </div>
  );
}
