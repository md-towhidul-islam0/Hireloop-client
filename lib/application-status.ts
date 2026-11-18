/**
 * Application statuses shared by the recruiter applicant list and the backend
 * update. `Pending` means the application was submitted successfully (it is
 * also the fallback for older records created before status was stored).
 */
export const APPLICATION_STATUSES = [
  "Pending",
  "Shortlisted",
  "Interview",
  "Hired",
  "Rejected",
] as const

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number]

export const DEFAULT_APPLICATION_STATUS: ApplicationStatus = "Pending"

export function isApplicationStatus(
  value: unknown
): value is ApplicationStatus {
  return (
    typeof value === "string" &&
    (APPLICATION_STATUSES as readonly string[]).includes(value)
  )
}

export function normalizeApplicationStatus(
  value: unknown
): ApplicationStatus {
  return isApplicationStatus(value) ? value : DEFAULT_APPLICATION_STATUS
}
