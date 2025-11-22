"use server"

import { auth, signOut } from "@/services/auth"

export async function getUserSession() {
  const userSession = await auth()

  if (!userSession?.user || !userSession.user.id) {
    return signOut()
  }

  return userSession.user
}

export async function logout() {
  return await signOut()
}
