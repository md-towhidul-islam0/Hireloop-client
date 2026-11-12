"use server"

import { revalidatePath } from "next/cache"

export type DeleteJobResult =
  | { ok: true }
  | { ok: false; error: string }

export async function deleteJob(id: string): Promise<DeleteJobResult> {
  try {
    const res = await fetch(`${process.env.BACKEND_URL}/jobs/${id}`, {
      method: "DELETE",
      cache: "no-store",
    })

    if (!res.ok) {
      return {
        ok: false,
        error: `DELETE /jobs/${id} failed with status ${res.status}`,
      }
    }

    revalidatePath("/dashbord/recruiter/all-jobs")
    return { ok: true }
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
