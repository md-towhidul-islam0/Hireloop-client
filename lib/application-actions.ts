"use server"

import { revalidatePath } from "next/cache"

import {
  isApplicationStatus,
  type ApplicationStatus,
} from "@/lib/application-status"

export type UpdateStatusResult =
  | { ok: true }
  | { ok: false; error: string }

/**
 * Persists a recruiter's status change. A seeker can have more than one
 * application to the same job, so all of their application IDs are updated
 * together to keep the row consistent with the backend.
 */
export async function updateApplicationStatus(
  applicationIds: string | string[],
  status: ApplicationStatus,
  jobId?: string
): Promise<UpdateStatusResult> {
  if (!isApplicationStatus(status)) {
    return { ok: false, error: "That application status isn't supported." }
  }

  const ids = Array.isArray(applicationIds)
    ? [...new Set(applicationIds.filter(Boolean))]
    : [applicationIds]

  if (ids.length === 0) {
    return { ok: false, error: "No application was selected to update." }
  }

  try {
    const results = await Promise.all(
      ids.map((applicationId) =>
        fetch(`${process.env.BACKEND_URL}/appli/${applicationId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          cache: "no-store",
          body: JSON.stringify({ applicationStatus: status }),
        })
      )
    )

    const failed = results.find((result) => !result.ok)
    if (failed) {
      return {
        ok: false,
        error: `Updating the application failed (${failed.status}).`,
      }
    }

    if (jobId) {
      revalidatePath(`/dashbord/recruiter/all-jobs/eachJobview/${jobId}`)
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
