"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { type ControllerRenderProps, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import {
  AlertDialog,
  AlertDialogAction,
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
import type { TUser } from "@/services/db/schemas";
import { deleteUserAccount, updatePassword, updateUserData } from "../actions";

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

const passwordSchema = z
  .object({
    password: z.string({ error: "Senha é obrigatória" }),
    newPassword: z
      .string({ error: "Senha é obrigatória" })
      .min(8, "Senha deve ter no mínimo 8 caracteres")
      .max(100, "Senha deve ter no máximo 100 caracteres")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Senha deve conter pelo menos uma letra maiúscula, uma minúscula e um número"
      ),
    confirmNewPassword: z
      .string({ error: "Confirmação de senha é obrigatória" })
      .min(1, "Confirmação de senha é obrigatória"),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

const deleteSchema = z.object({
  password: z.string({ error: "Senha é obrigatória" }),
});

export function UserForm({ user }: { user: TUser }) {
  const [userData, setUserData] = useState(user);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const userForm = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: userData.name,
      email: userData.email,
    },
  });

  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const deleteForm = useForm<z.infer<typeof deleteSchema>>({
    resolver: zodResolver(deleteSchema),
    defaultValues: {
      password: "",
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

  const handleSubmitPassword = passwordForm.handleSubmit(async (data) => {
    const { message, success } = await updatePassword(
      data.password,
      data.newPassword
    );
    if (success) {
      toast.success(message);
    } else {
      toast.error(message);
    }
  });

  const handleDeleteAccount = deleteForm.handleSubmit(async (data) => {
    const { success, message } = await deleteUserAccount(data.password);
    if (success) {
      toast.success(message);
    } else {
      toast.error(message);
    }
  });

  const PasswordInput = ({
    field,
    show,
    setShow,
    placeholder,
  }: {
    field: ControllerRenderProps<
      z.infer<typeof passwordSchema>,
      "password" | "newPassword" | "confirmNewPassword"
    >;
    show: boolean;
    setShow: (value: boolean) => void;
    placeholder: string;
  }) => (
    <div className="relative">
      <Input
        {...field}
        type={show ? "text" : "password"}
        placeholder={placeholder}
      />
      <button
        type="button"
        onClick={() => setShow(!show)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
      >
        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );

  return (
    <div className="w-full space-y-6 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card: Dados do Usuário */}
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
                  {userForm.formState.isSubmitting
                    ? "Salvando..."
                    : "Salvar Dados"}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>

        {/* Card: Alterar Senha */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Alterar Senha</CardTitle>
            <CardDescription>
              Aqui você pode alterar sua senha de acesso
            </CardDescription>
          </CardHeader>
          <Form {...passwordForm}>
            <form onSubmit={handleSubmitPassword} className="space-y-4">
              <CardContent className="space-y-4">
                <FormField
                  control={passwordForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Senha Atual</FormLabel>
                      <FormControl>
                        <PasswordInput
                          field={field}
                          show={showPassword}
                          setShow={setShowPassword}
                          placeholder="Digite sua senha atual"
                        />
                      </FormControl>
                      <FormDescription>
                        Informe sua senha atual para atualizar para uma nova.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={passwordForm.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nova Senha</FormLabel>
                      <FormControl>
                        <PasswordInput
                          field={field}
                          show={showNewPassword}
                          setShow={setShowNewPassword}
                          placeholder="Digite sua nova senha"
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        Mínimo 8 caracteres com letra maiúscula, minúscula e
                        número
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={passwordForm.control}
                  name="confirmNewPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirmar Nova Senha</FormLabel>
                      <FormControl>
                        <PasswordInput
                          field={field}
                          show={showConfirmPassword}
                          setShow={setShowConfirmPassword}
                          placeholder="Confirme sua nova senha"
                        />
                      </FormControl>
                      <FormDescription>
                        Digite novamente a nova senha para confirmar.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter>
                <Button
                  type="submit"
                  disabled={passwordForm.formState.isSubmitting}
                  className="w-full"
                >
                  {passwordForm.formState.isSubmitting
                    ? "Alterando..."
                    : "Alterar Senha"}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </div>

      {/* Card: Excluir Conta */}
      <Card className="border-destructive/50 lg:col-span-2">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <div>
              <CardTitle>Zona de Perigo</CardTitle>
              <CardDescription>
                Ações irreversíveis na sua conta
              </CardDescription>
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
    </div>
  );
}
