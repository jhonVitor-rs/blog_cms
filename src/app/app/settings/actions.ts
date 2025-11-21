"use server";

import argon2 from "argon2";
import { eq } from "drizzle-orm";
import { getUserSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { type TUser, users } from "@/services/db/schemas";
import type { Response } from "@/types/response";

export async function getUser() {
  const user = await getUserSession();

  const userData = db.query.users.findFirst({
    where: eq(users.id, user.id),
  });

  return userData;
}

export async function updateUserData(
  name: string,
  email: string,
): Promise<Response<TUser>> {
  try {
    const userSession = await getUserSession();

    const user = await db.query.users.findFirst({
      where: eq(users.id, userSession.id),
    });
    if (!user) {
      return {
        success: false,
        message: "Usuário não encontrado.",
      };
    }

    const [updatedUser] = await db
      .update(users)
      .set({ name, email, updatedAt: new Date() })
      .where(eq(users.id, user.id))
      .returning();

    return {
      success: true,
      message: "Dados atualizados com sucesso",
      data: updatedUser,
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      message: "Error ao atualizar os dadso do usuário",
    };
  }
}

export async function updatePassword(
  currentPassword: string,
  newPassword: string,
): Promise<Response<null>> {
  try {
    const userSession = await getUserSession();

    const user = await db.query.users.findFirst({
      where: eq(users.id, userSession.id),
    });
    if (!user) {
      return {
        success: false,
        message: "Usuário não encontrado.",
      };
    }

    const isPasswordValid = await argon2.verify(user.password, currentPassword);
    if (!isPasswordValid) {
      return {
        success: false,
        message: "Senha atual não confere",
      };
    }

    const hashPassword = await argon2.hash(newPassword);

    await db
      .update(users)
      .set({ password: hashPassword, updatedAt: new Date() })
      .where(eq(users.id, user.id));

    return {
      success: true,
      message: "Senha atualizada com sucesso",
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      message: "Erro ao atualizar a senha",
    };
  }
}

export async function deleteUserAccount(password: string): Promise<Response<null>> {
  try {
    const userSession = await getUserSession();

    const user = await db.query.users.findFirst({
      where: eq(users.id, userSession.id),
    });
    if (!user) {
      return {
        success: false,
        message: "Usuário não encontrado.",
      };
    }

    const isPasswordValid = await argon2.verify(user.password, password);
    if (!isPasswordValid) {
      return {
        success: false,
        message: "Senha atual não confere",
      };
    }

    await db.delete(users).where(eq(users.id, user.id))

    return {
      success: true,
      message: "Conta deletada com sucesso"
    }
  } catch (error) {
    console.error(error)

    return {
      success: false,
      message: "Erro ao deletar a conta"
    }
  }
}

export async function generateUserKey(): Promise<Response<string>> {
  try {
    const userSession = await getUserSession()
    const user = await db.query.users.findFirst({
      where: eq(users.id, userSession.id),
    });
    if (!user) {
      return {
        success: false,
        message: "Usuário não encontrado.",
      };
    }

    const newKey = crypto.randomUUID();
    await db.update(users).set({key: newKey, updatedAt: new Date()}).where(eq(users.id, user.id))

    return {
      success: true,
      message: "Chave atualizada com sucesso",
      data: newKey
    }
  } catch (error) {
    console.error(error)

    return {
      success: false,
      message: "Erro ao gerar nova chave"
    }
  }
}
