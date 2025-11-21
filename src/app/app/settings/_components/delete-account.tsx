"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { deleteUserAccount } from "../actions";

const deleteSchema = z.object({
  password: z.string({ error: "Senha é obrigatória" }),
});

export function DeleteAccount() {
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteForm = useForm<z.infer<typeof deleteSchema>>({
    resolver: zodResolver(deleteSchema),
    defaultValues: {
      password: "",
    },
  });

  const handleDeleteAccount = deleteForm.handleSubmit(async (data) => {
    setIsDeleting(true);
    const { success, message } = await deleteUserAccount(data.password);
    if (success) {
      toast.success(message);
    } else {
      toast.error(message);
    }
    setIsDeleting(false);
  });

  return (
    <Card className="border-destructive/50 lg:col-span-2">
      <CardHeader>
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-destructive" />
          <div>
            <CardTitle>Zona de Perigo</CardTitle>
            <CardDescription>Ações irreversíveis na sua conta</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 bg-destructive/5 p-4 rounded-lg border border-destructive/20">
          <h4 className="font-medium text-sm">Deletar Conta</h4>
          <p className="text-sm text-muted-foreground">
            Ao deletar sua conta, todos os seus dados serão removidos
            permanentemente. Esta ação não pode ser desfeita.
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="w-full">
              Deletar Minha Conta
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Deletar sua conta?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta ação é irreversível. Todos os seus dados, posts e imagens
                serão permanentemente deletados do nosso servidor.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <Form {...deleteForm}>
              <form onSubmit={handleDeleteAccount}>
                <FormField
                  control={deleteForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm sua senha</FormLabel>
                      <FormControl>
                        <Input {...field} type="password" />
                      </FormControl>
                      <FormDescription>
                        Utilize sua senha para confirmar a exclusão da conta
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex items-center justify-between my-4">
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <Button
                    onClick={handleDeleteAccount}
                    disabled={isDeleting}
                    variant={"destructive"}
                  >
                    {isDeleting ? "Deletando..." : "Sim, deletar minha conta"}
                  </Button>
                </div>
              </form>
            </Form>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
}
