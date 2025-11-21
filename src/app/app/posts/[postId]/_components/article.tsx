"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronsUpDown, Trash2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { LexicalEditor } from "@/components/lexical-editor";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { TArticle, TNewArticle } from "@/services/db/schemas";
import { ArticleImages } from "./images";

const articleSchema = z.object({
  title: z
    .string()
    .max(255, { message: "O título deve ter no máximo 255 caracteres" })
    .optional(),
  text: z
    .string({ message: "O texto é obrigatório" })
    .min(1, { message: "O texto não pode ser vazio" })
    .max(10000, { message: "O texto deve ter no máximo 10.000 caracteres" }),
});

export function Article({
  article,
  defaultOpen = false,
  onSave,
  onCancel,
  onDelete,
}: {
  article: TArticle | TNewArticle;
  defaultOpen?: boolean;
  onSave: (data: TArticle | TNewArticle) => Promise<void>;
  onCancel?: () => void;
  onDelete?: (id: string) => Promise<void>;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const form = useForm<z.infer<typeof articleSchema>>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      title: article.title || "",
      text: article.text,
    },
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    await onSave({ ...article, title: data.title || null, text: data.text });
    setIsOpen(false);
  });

  const handleDelete = async () => {
    if (onDelete && "id" in article && article.id) {
      await onDelete(article.id);
    }
  };

  const isSave = () =>
    form.watch("title") !== article.title &&
    form.watch("text") !== article.text;

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="border rounded-lg mb-2 bg-background"
    >
      <div className="flex items-center justify-between gap-4 px-4 py-2">
        <h4 className="text-sm font-semibold">
          {`${article.title || "Sem título"}`}
        </h4>
        <div className="flex items-center gap-4">
          {onDelete && "id" in article && article.id && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant={"destructive"} size={"icon"}>
                  <Trash2 />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Tem certeza que deseja excluir este artigo?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta ação não pode ser desfeita.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cacelar</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>
                    Confirmar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          <CollapsibleTrigger asChild>
            <Button variant={"ghost"} size={"icon"} className="size-8">
              <ChevronsUpDown />
              <span className="sr-only">Toggle</span>
            </Button>
          </CollapsibleTrigger>
        </div>
      </div>

      <CollapsibleContent className="px-4 pb-4 transition-all duration-300">
        <Form {...form}>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 pt-4 w-full"
          >
            {" "}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>Dê um título ao artigo</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Texto</FormLabel>
                  <FormControl>
                    <div>
                      <LexicalEditor
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Digite o conteúdo do artigo..."
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-2">
              <Button type="submit" disabled={!isSave()}>
                Salvar
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsOpen(false);
                  if (article && onCancel) onCancel();
                }}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </Form>
        <CardFooter>
          {"id" in article && article.id && (
            <ArticleImages articleId={article.id} />
          )}
        </CardFooter>
      </CollapsibleContent>
    </Collapsible>
  );
}
