"use server"

import { revalidatePath } from "next/cache"
import { headers } from "next/headers"

import { auth } from "@/lib/auth"
import { isUserRole, type UserRole } from "@/lib/roles"

export type UpdateUserRoleResult =
  | { ok: true; role: UserRole }
  | { ok: false; error: string }

/**
 * Changes a user's role through the Better Auth admin plugin. The page already
 * hides itself from non-admins, but the action checks again so it can't be
 * called directly with a different session.
 */
export async function updateUserRole(
  userId: string,
  role: UserRole
): Promise<UpdateUserRoleResult> {
  if (!userId) {
    return { ok: false, error: "No user was selected." }
  }

  if (!isUserRole(role)) {
    return { ok: false, error: "That role isn't supported." }
  }

  const requestHeaders = await headers()
  const session = await auth.api.getSession({ headers: requestHeaders })

  if (!session || session.user.role !== "admin") {
    return { ok: false, error: "You need admin access to change roles." }
  }

  try {
    await auth.api.setRole({
      body: { userId, role },
      headers: requestHeaders,
    })

    revalidatePath("/dashbord/admin/allusers")
    return { ok: true, role }
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof Error ? error.message : "Unable to change this role.",
    }
  }
}
