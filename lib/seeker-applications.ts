import type { BrowseJob, CategoryIconKey } from "./browse-jobs"

/* -------------------------------------------------------------------------- */
/*                                  Types                                     */
/* -------------------------------------------------------------------------- */

export type ApplicationStatus =
  | "Applied"
  | "Review"
  | "Shortlisted"
  | "Interview"
  | "Rejected"
  | "Offered"

/** Raw application document returned by `GET /appli/:userID`. */
export interface ApiApplication {
  _id?: string
  id?: string
  jobID?: string
  userID?: string
  status?: string
  createdAt?: string
  appliedAt?: string
}

export interface MyApplication {
  id: string
  jobID: string
  jobTitle: string
  company: string
  jobType: string
  workMode: string
  location: string
  category: string
  categoryColor: string
  categoryIcon: CategoryIconKey
  appliedAt: number
  appliedLabel: string
  status: ApplicationStatus
  jobStatus: "Active" | "Expired"
  isJobAvailable: boolean
}

/* -------------------------------------------------------------------------- */
/*                                 Formatting                                 */
/* -------------------------------------------------------------------------- */

export function normalizeApplicationStatus(value?: string): ApplicationStatus {
  const status = value?.trim().toLowerCase() ?? ""

  if (status.includes("offer")) return "Offered"
  if (status.includes("reject")) return "Rejected"
  if (status.includes("interview")) return "Interview"
  if (status.includes("shortlist")) return "Shortlisted"
  if (status.includes("review")) return "Review"

  return "Applied"
}

/** Mongo ObjectIds start with the creation time in seconds. */
function timestampFromObjectId(id?: string) {
  if (!id || id.length < 24) return null
  const seconds = Number.parseInt(id.slice(0, 8), 16)
  return Number.isFinite(seconds) ? seconds * 1000 : null
}

function parseTimestamp(value?: string) {
  if (!value) return null
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date.getTime()
}

function getAppliedAt(application: ApiApplication) {
  return (
    parseTimestamp(application.appliedAt) ??
    parseTimestamp(application.createdAt) ??
    timestampFromObjectId(application._id) ??
    0
  )
}

export function formatRelativeTime(timestamp: number, now = Date.now()) {
  if (!timestamp) return "—"

  const seconds = Math.max(0, Math.round((now - timestamp) / 1000))
  if (seconds < 60) return "Just now"

  const minutes = Math.round(seconds / 60)
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`

  const hours = Math.round(minutes / 60)
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`

  const days = Math.round(hours / 24)
  if (days < 7) return `${days} day${days === 1 ? "" : "s"} ago`

  const weeks = Math.round(days / 7)
  if (weeks < 5) return `${weeks} week${weeks === 1 ? "" : "s"} ago`

  const months = Math.round(days / 30)
  if (months < 12) return `${months} month${months === 1 ? "" : "s"} ago`

  const years = Math.round(days / 365)
  return `${years} year${years === 1 ? "" : "s"} ago`
}

/* -------------------------------------------------------------------------- */
/*                                  Mapping                                   */
/* -------------------------------------------------------------------------- */

export function toMyApplications(
  applications: ApiApplication[],
  jobs: BrowseJob[],
  now = Date.now()
): MyApplication[] {
  const jobsById = new Map(jobs.map((job) => [job.id, job]))

  return applications
    .filter((application) => Boolean(application) && typeof application === "object")
    .map((application, index) => {
      const job = application.jobID ? jobsById.get(application.jobID) : undefined
      const appliedAt = getAppliedAt(application)

      return {
        id: application._id ?? application.id ?? `application-${index}`,
        jobID: application.jobID ?? "",
        jobTitle: job?.title ?? "Job no longer available",
        company: job?.company ?? "Company unavailable",
        jobType: job?.jobType ?? "—",
        workMode: job ? (job.isRemote ? "Remote" : "On-site") : "—",
        location: job?.location ?? "—",
        category: job?.category ?? "Other",
        categoryColor: job?.categoryColor ?? "#A0A0AB",
        categoryIcon: job?.categoryIcon ?? "other",
        appliedAt,
        appliedLabel: formatRelativeTime(appliedAt, now),
        status: normalizeApplicationStatus(application.status),
        jobStatus: job?.status ?? "Expired",
        isJobAvailable: Boolean(job),
      }
    })
    .sort((a, b) => b.appliedAt - a.appliedAt)
}
