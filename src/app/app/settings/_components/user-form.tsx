"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
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
import type { TUser } from "@/services/db/schemas";
import { updateUserData } from "../actions";

const userSchema = z.object({
  name: z
    .string({ error: "Nome é obrigatório" })
    .min(1, "Nome é obrigatório")
    .min(2, "Nome deve ter no mínimo 2 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres")
    .trim(),
  email: z
    .string({ error: "Email é obrigatório" })
    .min(1, "Email é obrigatório")
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Formato de email inválido")
    .max(255, "Email muito longo")
    .toLowerCase()
    .trim(),
});

export function UserForm({ user }: { user: TUser }) {
  const [userData, setUserData] = useState(user);

  const userForm = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: userData.name,
      email: userData.email,
    },
  });

  const handleSubmitUser = userForm.handleSubmit(async (data) => {
    const {
      success,
      message,
      data: userData,
    } = await updateUserData(data.name, data.email);
    if (success && userData) {
      setUserData(userData);
      toast.success(message);
    } else {
      toast.error(message);
      setUserData(user);
    }
  });

  return (
    <Card className="lg:col-span-1">
      <CardHeader>
        <CardTitle>Dados do Usuário</CardTitle>
        <CardDescription>
          Aqui você pode atualizar seus dados de cadastro
        </CardDescription>
      </CardHeader>
      <Form {...userForm}>
        <form onSubmit={handleSubmitUser} className="space-y-4">
          <CardContent className="space-y-4">
            <FormField
              control={userForm.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Seu nome"
                      disabled={userForm.formState.isSubmitting}
                    />
                  </FormControl>
                  <FormDescription>Seu nome de cadastro</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={userForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="seu@email.com"
                      disabled={userForm.formState.isSubmitting}
                    />
                  </FormControl>
                  <FormDescription>Seu email de cadastro</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              disabled={userForm.formState.isSubmitting}
              className="w-full"
            >
              {userForm.formState.isSubmitting ? "Salvando..." : "Salvar Dados"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
