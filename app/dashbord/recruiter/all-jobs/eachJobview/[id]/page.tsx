import {
  normalizeApplicationStatus,
  type ApplicationStatus,
} from "@/lib/application-status"
import {
  toGetapplyedAPI,
  toGetapplyeduserAPI,
} from "@/lib/dataManu"
import { geteachjob } from "@/lib/job-actions"
import {
  ApplicantsList,
  type Applicant,
} from "@/components/recruiter-applications/ApplicantsList"

interface ApplicationRecord {
  _id?: string
  userID?: string
  applicationStatus?: unknown
  appliedAt?: unknown
  createdAt?: unknown
}

interface UserRecord {
  _id?: string
  name?: unknown
  email?: unknown
}

interface JobRecord {
  _id?: string
  title?: unknown
}

/**
 * The backend serializes applications as an array but attaches a non-index
 * `_debugInfo` property. Array helpers only visit real index items, and this
 * guard keeps that defensive behavior explicit.
 */
function toApplicationArray(value: unknown): ApplicationRecord[] {
  return Array.isArray(value)
    ? value.filter(
        (item): item is ApplicationRecord =>
          item !== null && typeof item === "object"
      )
    : []
}

function toUserArray(value: unknown): UserRecord[] {
  return Array.isArray(value)
    ? value.filter(
        (item): item is UserRecord =>
          item !== null && typeof item === "object"
      )
    : []
}

function toJobRecord(value: unknown): JobRecord | null {
  if (Array.isArray(value)) return (toUserArray(value)[0] as JobRecord) ?? null
  if (value !== null && typeof value === "object") return value as JobRecord
  return null
}

function asString(value: unknown): string {
  return typeof value === "string" ? value : ""
}

function formatDate(value: unknown): string | null {
  let date: Date

  if (typeof value === "string" || typeof value === "number") {
    date = new Date(value)
    // Mongo ObjectIds encode their creation time in the first 4 bytes.
    if (Number.isNaN(date.getTime()) && /^[a-f\d]{24}$/i.test(String(value))) {
      date = new Date(parseInt(String(value).slice(0, 8), 16) * 1000)
    }
  } else {
    return null
  }

  if (Number.isNaN(date.getTime())) return null

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(date)
}

function applicationTimestamp(application: ApplicationRecord): number {
  const raw = application.appliedAt ?? application.createdAt
  if (typeof raw === "string" || typeof raw === "number") {
    const time = new Date(raw).getTime()
    if (!Number.isNaN(time)) return time
  }

  const id = asString(application._id)
  if (/^[a-f\d]{24}$/i.test(id)) {
    return parseInt(id.slice(0, 8), 16) * 1000
  }

  return 0
}

const page = async ({
  params,
}: {
  params: Promise<{ id: string }>
}) => {
  const { id } = await params

  const [applicationsResult, jobResult] = await Promise.allSettled([
    toGetapplyedAPI(id),
    geteachjob(id),
  ])

  const applications = toApplicationArray(
    applicationsResult.status === "fulfilled" ? applicationsResult.value : []
  )

  // Fetch each seeker once, then pair the user with their application row.
  const userIDs = [
    ...new Set(
      applications
        .map((application) => asString(application.userID))
        .filter(Boolean)
    ),
  ]

  const fetchedUsers = await Promise.all(
    userIDs.map(async (userID) => {
      try {
        return { userID, result: await toGetapplyeduserAPI(userID) }
      } catch {
        return { userID, result: null }
      }
    })
  )

  const usersByID = new Map<string, UserRecord>()
  fetchedUsers.forEach(({ userID, result }) => {
    const user = toUserArray(result)[0]
    if (user) usersByID.set(userID, user)
  })

  // A seeker can apply more than once to the same job. Show one row per seeker
  // using their most recent application, but keep every application ID so a
  // status change updates all of them in the backend.
  const applicationsByUser = new Map<string, ApplicationRecord[]>()
  applications
    .filter((application) => asString(application._id))
    .forEach((application) => {
      const userID = asString(application.userID)
      const existing = applicationsByUser.get(userID) ?? []
      existing.push(application)
      applicationsByUser.set(userID, existing)
    })

  const applicants: Applicant[] = [...applicationsByUser.entries()].map(
    ([userID, userApplications]) => {
      const sorted = [...userApplications].sort(
        (a, b) => applicationTimestamp(b) - applicationTimestamp(a)
      )
      const latest = sorted[0]
      const user = usersByID.get(userID)

      return {
        applicationId: asString(latest._id),
        applicationIds: sorted.map((application) => asString(application._id)),
        applicationCount: sorted.length,
        userID,
        name: asString(user?.name) || userID || "Unknown applicant",
        email: asString(user?.email),
        status: normalizeApplicationStatus(
          latest.applicationStatus
        ) as ApplicationStatus,
        appliedAt: formatDate(
          latest.appliedAt ?? latest.createdAt ?? latest._id
        ),
      }
    }
  )

  const job = toJobRecord(jobResult.status === "fulfilled" ? jobResult.value : null)
  const jobTitle = asString(job?.title) || "this job"

  return (
    <div className="min-h-screen bg-[#0B0B0C] px-4 py-12 font-sans text-white sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-[1344px]">
        <div className="mb-8">
          <p className="text-[11px] font-semibold tracking-[1.2px] text-[#C3C0FF] uppercase">
            Recruiter / Manage jobs
          </p>
          <h1 className="mt-2 text-xl leading-8 font-bold tracking-[-0.02em] text-white sm:text-2xl sm:leading-9">
            Applicants for {jobTitle}
          </h1>
          <p className="mt-2 text-sm leading-6 text-[#A0A0AB]">
            Review the seekers who applied and move them through your hiring
            pipeline.
          </p>
        </div>

        <ApplicantsList
          applicants={applicants}
          jobId={id}
          jobTitle={jobTitle}
        />
      </div>
    </div>
  )
}

export default page
