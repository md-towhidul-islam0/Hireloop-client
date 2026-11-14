/* -------------------------------------------------------------------------- */
/*                     Browse Jobs — data & display helpers                   */
/* -------------------------------------------------------------------------- */

export type JobStatus = "Active" | "Expired"

export type CategoryIconKey =
  | "code"
  | "design"
  | "product"
  | "marketing"
  | "finance"
  | "operations"
  | "other"

export interface FilterOption {
  label: string
  value: string
  count?: number
}

export interface BrowseJob {
  id: string
  title: string
  company: string
  category: string
  categoryColor: string
  categoryIcon: CategoryIconKey
  jobType: string
  location: string
  isRemote: boolean
  salary: string
  deadline: string
  status: JobStatus
  postedAgo?: string
  applicants: number
  initials: string
  responsibilities?: string
  qualifications?: string
}

/**
 * The backend stores jobs in a couple of shapes right now (new listings use
 * `companyName` / `minSalary`, older seed records use `company` /
 * `compensation`), so the mapper accepts both.
 */
export interface ApiJob {
  _id?: string
  id?: string
  title?: string
  companyName?: string
  company?: string
  category?: string
  jobType?: string
  isRemote?: boolean
  location?: string
  deadline?: string
  minSalary?: string | number
  maxSalary?: string | number
  frequency?: string
  compensation?: string
  status?: string
  postedAgo?: string
  applicants?: number
  responsibilities?: string
  qualifications?: string
}

/* -------------------------------------------------------------------------- */
/*                                  Formatting                                */
/* -------------------------------------------------------------------------- */

const deadlineFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "2-digit",
  year: "numeric",
  timeZone: "UTC",
})

function parseDate(value?: string) {
  if (!value) return null
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

export function formatJobDeadline(value?: string) {
  if (!value) return "No deadline"
  const date = parseDate(value)
  return date ? deadlineFormatter.format(date) : value
}

function formatMoney(value?: string | number) {
  if (value === undefined || value === null || value === "") return ""
  const number = Number(value)
  if (!Number.isFinite(number)) return String(value)
  return `$${number.toLocaleString("en-US")}`
}

export function formatJobSalary(job: ApiJob) {
  if (job.compensation) return job.compensation

  const min = formatMoney(job.minSalary)
  const max = formatMoney(job.maxSalary)
  const range = min && max ? `${min} – ${max}` : min || max
  if (!range) return "Salary not disclosed"

  return `${range}${job.frequency ? ` ${job.frequency}` : ""}`
}

export function getCompanyInitials(company: string) {
  return (
    company
      .split(/[\s-]+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0]?.toUpperCase())
      .join("") || "JL"
  )
}

/* -------------------------------------------------------------------------- */
/*                              Category styling                              */
/* -------------------------------------------------------------------------- */

interface CategoryMeta {
  icon: CategoryIconKey
  color: string
}

const categoryStyles: Array<{ match: RegExp; meta: CategoryMeta }> = [
  { match: /engineer|tech|develop|software|data/i, meta: { icon: "code", color: "#38BDF8" } },
  { match: /design|creative|ux|ui/i, meta: { icon: "design", color: "#F97316" } },
  { match: /product|manage|project/i, meta: { icon: "product", color: "#C3C0FF" } },
  { match: /market|sale|growth|content/i, meta: { icon: "marketing", color: "#FACC15" } },
  { match: /financ|account|bank/i, meta: { icon: "finance", color: "#4ADE80" } },
  { match: /operation|support|customer|admin/i, meta: { icon: "operations", color: "#F472B6" } },
]

export function getCategoryMeta(category: string): CategoryMeta {
  return (
    categoryStyles.find(({ match }) => match.test(category))?.meta ?? {
      icon: "other",
      color: "#A0A0AB",
    }
  )
}

/* -------------------------------------------------------------------------- */
/*                                  Mapping                                   */
/* -------------------------------------------------------------------------- */

function toBrowseJob(job: ApiJob, index: number): BrowseJob {
  const company = job.companyName || job.company || "Confidential company"
  const category = job.category?.trim() || "Other"
  const meta = getCategoryMeta(category)

  const rawLocation = job.location?.trim() || "Location not specified"
  const isRemote = Boolean(job.isRemote) || /remote/i.test(rawLocation)
  const location =
    isRemote && !/remote/i.test(rawLocation)
      ? `${rawLocation} · Remote`
      : rawLocation

  const deadlineDate = parseDate(job.deadline)
  const status: JobStatus =
    job.status === "Expired" || job.status === "Active"
      ? job.status
      : deadlineDate && deadlineDate.getTime() < Date.now()
        ? "Expired"
        : "Active"

  return {
    id: job._id || job.id || `job-${index}`,
    title: job.title?.trim() || "Untitled role",
    company,
    category,
    categoryColor: meta.color,
    categoryIcon: meta.icon,
    jobType: job.jobType?.trim() || "Not specified",
    location,
    isRemote,
    salary: formatJobSalary(job),
    deadline: formatJobDeadline(job.deadline),
    status,
    postedAgo: job.postedAgo,
    applicants: job.applicants ?? 0,
    initials: getCompanyInitials(company),
    responsibilities: job.responsibilities,
    qualifications: job.qualifications,
  }
}

/** Accepts whatever `/jobs` returns and keeps the page safe when it is not an array. */
export function toBrowseJobs(data: unknown): BrowseJob[] {
  if (!Array.isArray(data)) return []

  return data
    .filter((job): job is ApiJob => Boolean(job) && typeof job === "object")
    .map(toBrowseJob)
}

/* -------------------------------------------------------------------------- */
/*                              Filter options                                */
/* -------------------------------------------------------------------------- */

function slugify(value: string) {
  return value
}

function countBy(jobs: BrowseJob[], pick: (job: BrowseJob) => string) {
  const counts = new Map<string, number>()
  for (const job of jobs) {
    const label = pick(job)
    counts.set(label, (counts.get(label) ?? 0) + 1)
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([label, count]) => ({ label, value: slugify(label), count }))
}

export function getCategoryOptions(jobs: BrowseJob[]): FilterOption[] {
  const options = countBy(jobs, (job) => job.category)
  return options.length ? options : fallbackCategories
}

export function getJobTypeOptions(jobs: BrowseJob[]): FilterOption[] {
  const options = countBy(jobs, (job) => job.jobType)
  return options.length ? options : JOB_TYPE_OPTIONS
}

const fallbackCategories: FilterOption[] = [
  { label: "Engineering & Tech", value: "engineering-tech" },
  { label: "Design & Creative", value: "design-creative" },
  { label: "Product & Management", value: "product-management" },
  { label: "Marketing & Sales", value: "marketing-sales" },
  { label: "Finance & Accounting", value: "finance-accounting" },
]

export const JOB_TYPE_OPTIONS: FilterOption[] = [
  { label: "Full-time", value: "full-time" },
  { label: "Part-time", value: "part-time" },
  { label: "Contract", value: "contract" },
  { label: "Internship", value: "internship" },
  { label: "Freelance", value: "freelance" },
]

export const EXPERIENCE_OPTIONS: FilterOption[] = [
  { label: "Entry level", value: "entry" },
  { label: "Mid level", value: "mid" },
  { label: "Senior level", value: "senior" },
  { label: "Lead / Principal", value: "lead" },
]

export const DATE_POSTED_OPTIONS: FilterOption[] = [
  { label: "Any time", value: "any" },
  { label: "Past 24 hours", value: "24h" },
  { label: "Past 7 days", value: "7d" },
  { label: "Past 30 days", value: "30d" },
]

export const SORT_OPTIONS: FilterOption[] = [
  { label: "Most relevant", value: "relevance" },
  { label: "Newest first", value: "newest" },
  { label: "Deadline: soonest", value: "deadline" },
  { label: "Salary: high to low", value: "salary-desc" },
]
