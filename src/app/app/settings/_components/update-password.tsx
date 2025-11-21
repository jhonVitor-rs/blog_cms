"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { type ControllerRenderProps, useForm } from "react-hook-form";
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
import { updatePassword } from "../actions";

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

export function UpdatePassword() {
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: "",
      newPassword: "",
      confirmNewPassword: "",
    },
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
                    Mínimo 8 caracteres com letra maiúscula, minúscula e número
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
  );
}
