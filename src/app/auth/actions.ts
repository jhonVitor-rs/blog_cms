"use server";

import argon2 from "argon2";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { type TNewUser, users } from "@/services/db/schemas";
import type { Response } from "@/types/response";

export async function register(
  data: TNewUser,
): Promise<Response<{ userId: string }>> {
  try {
    const hashPassword = await argon2.hash(data.password);

    const [newUser] = await db
      .insert(users)
      .values({ name: data.name, email: data.email, password: hashPassword })
      .returning({ id: users.id });

    return {
      success: true,
      message: "Usuário criado com sucesso",
      data: { userId: newUser.id },
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
    const user = await db.query.users
      .findFirst({ where: eq(users.email, email) })
      .execute();
    if (!user)
      return {
        success: false,
        message: "Email/senha inválido(s)",
      };

    const isValid = await argon2.verify(password, user.password);
    if (!isValid)
      return {
        success: false,
        message: "Email/senha inválido(s)",
      };

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
