import argon2 from "argon2";
import { eq } from "drizzle-orm";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { db } from "@/lib/db";
import { users } from "../db/schemas/user";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        try {
          const user = await db.query.users.findFirst({
            where: eq(users.email, credentials.email as string),
          });

          if (!user) {
            throw new Error("Email e/ou senha inválido(s)");
          }

          const authorized = await argon2.verify(
            user.password,
            credentials.password as string
          );

          if (!authorized) {
            throw new Error("Email e/ou senha inválido(s)");
          }

          return user;
        } catch {
          throw new Error("Email e/ou senha inválido(s)");
        }
      },
    }),
  ],
  callbacks: {
    signIn: async ({ user, account }) => {
      if (account?.provider !== "credentials" || !user) {
        return false;
      }

      return true;
    },

    jwt: async ({ token, user }) => {
      if (user?.id) {
        token.id = user.id.toString();
      }
      return token;
    },

    session: async ({ session, token }) => {
      session.user.id = token.id as string;
      return session;
    },
  },

  pages: {
    signIn: "/auth",
    error: "/auth",
  },
});
