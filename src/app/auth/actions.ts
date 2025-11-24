"use server";

import argon2 from "argon2";
import { db } from "@/lib/db";
import { generateApiKey, saveKeyInCookie } from "@/services/api/gen-key";
import { signIn } from "@/services/auth";
import { users } from "@/services/db/schemas";
import type { Response } from "@/types/response";

export async function register(data: {
  name: string;
  email: string;
  password: string;
}): Promise<Response<{ userId: string }>> {
  try {
    const hashPassword = await argon2.hash(data.password);
    const { rawKey, hashed } = await generateApiKey();

    await db
      .insert(users)
      .values({
        ...data,
        password: hashPassword,
        key: hashed,
      })
      .returning({ id: users.id });

    await saveKeyInCookie(rawKey);
    await signIn("credentials", {email: data.email, password: data.password, redirect: false})

    return {
      success: true,
      message: "Usuário criado com sucesso",
    };
  } catch (error) {
    console.error("Erro ao registrar usuário:", error);
    if (error instanceof Error && error.message.includes("unique")) {
      return {
        success: false,
        message: "Este email já está cadastrado",
      };
    }

    return {
      success: false,
      message: "Erro ao criar usuário. Tente novamente.",
    };
  }
}

export async function login(
  email: string,
  password: string,
): Promise<Response> {
  try {
    await signIn("credentials", { email, password, redirect: false });

    return {
      success: true,
      message: "Login efetuado com sucesso",
    };
  } catch (error) {
    console.error("Erro ao efetuar login:", error);

    return {
      success: false,
      message: "Falha ao tentar efetuar o login",
    };
  }
}
