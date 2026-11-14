import { getAppli } from "@/lib/job-actions"

/**
 * Clientside cache of the jobs a seeker has already applied to.
 * Shared by every `ApplyJobButton` on the page so they all disable together.
 */

interface AppliedJobsState {
  userId: string
  jobIds: string[]
  status: "loading" | "ready"
}

let state: AppliedJobsState | null = null
const listeners = new Set<() => void>()

function emit() {
  for (const listener of listeners) listener()
}

export function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function getAppliedJobs() {
  return state
}

export function getAppliedJobsServerSnapshot() {
  return null
}

export function loadAppliedJobs(userId: string) {
  // Already loaded (or loading) for this seeker.
  if (state?.userId === userId) return

  state = { userId, jobIds: [], status: "loading" }
  emit()

  getAppli(userId)
    .then((applications: unknown) => {
      if (state?.userId !== userId || state.status !== "loading") return

      const jobIds = Array.isArray(applications)
        ? applications
            .map((application) => (application as { jobID?: string })?.jobID)
            .filter((jobId): jobId is string => Boolean(jobId))
        : []

      state = { userId, jobIds, status: "ready" }
    })
    .catch((error) => {
      if (state?.userId !== userId || state.status !== "loading") return

      console.error("Failed to load applied jobs", error)
      state = { userId, jobIds: [], status: "ready" }
    })
    .finally(() => {
      emit()
    })
}

export function markJobApplied(userId: string, jobId: string) {
  const jobIds = state?.userId === userId ? state.jobIds : []

  if (jobIds.includes(jobId)) return

  state = { userId, jobIds: [...jobIds, jobId], status: "ready" }
  emit()
}
