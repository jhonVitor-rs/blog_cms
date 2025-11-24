"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { getUserSession } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { createPost } from "../actions";

const postSchema = z.object({
  title: z
    .string({ error: "O titulo deve ser uma string válida" })
    .nonempty({ error: "O titulo não pode ser vazio" })
    .min(5, { error: "O titulo deve ter no minimo 5 letras" })
    .max(100, { error: "O titulo deve tr no máximo 100 letras" }),
});

export function NewPostForm({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const router = useRouter();

  const form = useForm<z.infer<typeof postSchema>>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
    },
  });

  const onOpenDialog = () => form.reset({ title: "" });

  const handleSubmit = form.handleSubmit(async (data) => {
    const user = await getUserSession();
    const {
      success,
      message,
      data: resData,
    } = await createPost({ title: data.title, userId: user.id as string });

    if (success) {
      toast.success(message);
      router.push(`/app/posts/${resData?.postId}`);
    } else {
      toast.error(message);
    }
  });

  return (
    <Dialog onOpenChange={onOpenDialog}>
      <DialogTrigger asChild>
        <Button className={cn(className)}>{children}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Defina um titulo para seu post</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit}>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Titulo</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    O titulo deve ter entre 5 e 100 letras
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <CardFooter className="w-full justify-between">
              <DialogClose asChild>
                <Button variant={"outline"}>Cancelar</Button>
              </DialogClose>
              <Button type="submit">Salvar</Button>
            </CardFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
