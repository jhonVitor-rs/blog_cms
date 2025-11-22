"use server";

import { createHash, randomBytes } from "crypto";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { users } from "../db/schemas";

export async function generateApiKey() {
  const rawKey = `sk_${randomBytes(32).toString("hex")}`;
  const hashed = createHash("sha256").update(rawKey).digest("hex");

  const user = await db.query.users.findFirst({ where: eq(users.key, hashed) });
  if (user) {
    generateApiKey();
  }

  return { rawKey, hashed };
}

export async function validateApiKey(key: string) {
  const hashed = createHash("sha256").update(key).digest("hex");

  const user = await db.query.users.findFirst({
    where: eq(users.key, hashed),
  });

  return user;
}

export async function saveKeyInCookie(apiKey: string) {
  const cookieStore = await cookies();
  cookieStore.set("user_api_key", apiKey, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
  });
}

export async function getApiKey() {
  const cookieStore = await cookies();
  const apiKey = cookieStore.get("user_api_key")?.value as string;

  return apiKey;
}
