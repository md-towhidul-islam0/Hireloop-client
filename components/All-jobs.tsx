import Link from "next/link"
import type { LucideIcon } from "lucide-react"
import {
  ChevronRight,
  CodeXml,
  EllipsisVertical,
  MapPin,
  Megaphone,
  Palette,
  Pencil,
  Plus,
  ServerCog,
  ShieldCheck,
  Users,
} from "lucide-react"

import { DeleteJobButton } from "@/components/DeleteJobButton"

/* -------------------------------------------------------------------------- */
/*                                   Types                                    */
/* -------------------------------------------------------------------------- */

type JobStatus = "Active" | "Expired"

type JobIconKey = "code" | "design" | "infrastructure" | "marketing" | "quality"

type JobApplicantTone = "indigo" | "neutral"

interface Job {
  id: string
  title: string
  category: string
  categoryColor: string
  icon: JobIconKey
  company: string
  location: string
  jobType: string
  compensation: string
  applicants: number
  applicantTone: JobApplicantTone
  status: JobStatus
  deadline: string
  postedAgo: string
}

/* -------------------------------------------------------------------------- */
/*                               Backend fetch                                */
/* -------------------------------------------------------------------------- */

interface ApiJob {
  _id?: string
  title?: string
  companyName?: string
  category?: string
  jobType?: string
  isRemote?: boolean
  location?: string
  deadline?: string
  minSalary?: string
  maxSalary?: string
  frequency?: string
  applicants?: number
}

const categoryMeta: Record<string, { color: string; icon: JobIconKey }> = {
  "Engineering & Tech": { color: "#38BDF8", icon: "code" },
  "Design & Creative": { color: "#F97316", icon: "design" },
  "Product & Management": { color: "#C3C0FF", icon: "infrastructure" },
  "Marketing & Sales": { color: "#FACC15", icon: "marketing" },
  "Finance & Accounting": { color: "#4ADE80", icon: "quality" },
  "Operations & Support": { color: "#F472B6", icon: "quality" },
  Other: { color: "#A0A0AB", icon: "code" },
}

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

function formatDeadline(value?: string) {
  const date = parseDate(value)
  return date ? deadlineFormatter.format(date) : "No deadline"
}

function formatCompensation(job: ApiJob) {
  const { minSalary, maxSalary, frequency } = job
  if (!minSalary && !maxSalary) return "Not specified"
  const range =
    minSalary && maxSalary
      ? `${minSalary} – ${maxSalary}`
      : `${minSalary || maxSalary}`
  return `${range} ${frequency ?? ""}`.trim()
}

function toJob(job: ApiJob, index: number): Job {
  const category = job.category?.trim() || "Other"
  const meta = categoryMeta[category] ?? categoryMeta.Other
  const deadline = parseDate(job.deadline)

  return {
    id: job._id ?? `${category}-${index}`,
    title: job.title || "Untitled role",
    category,
    categoryColor: meta.color,
    icon: meta.icon,
    company: job.companyName || "—",
    location: job.location
      ? job.isRemote
        ? `${job.location} (Remote)`
        : job.location
      : job.isRemote
        ? "Remote"
        : "—",
    jobType: job.jobType || "—",
    compensation: formatCompensation(job),
    applicants: job.applicants ?? 0,
    applicantTone: index % 2 === 0 ? "indigo" : "neutral",
    status: deadline && deadline.getTime() < Date.now() ? "Expired" : "Active",
    deadline: formatDeadline(job.deadline),
    postedAgo: "",
  }
}

async function getJobs(): Promise<Job[]> {
  try {
    const res = await fetch(`${process.env.BACKEND_URL}/jobs`, {
      cache: "no-store",
    })

    if (!res.ok) {
      throw new Error(`GET /jobs failed with status ${res.status}`)
    }

    const jobs = (await res.json()) as ApiJob[]
    return jobs.map(toJob)
  } catch (error) {
    // Keep the page usable even if the API is unreachable.
    console.error("Failed to load job posts:", error)
    return []
  }
}

const jobIcons: Record<JobIconKey, LucideIcon> = {
  code: CodeXml,
  design: Palette,
  infrastructure: ServerCog,
  marketing: Megaphone,
  quality: ShieldCheck,
}

/* -------------------------------------------------------------------------- */
/*                              Small components                              */
/* -------------------------------------------------------------------------- */

const headerCellClass =
  "px-3 py-4 text-left text-[11px] leading-4 font-semibold tracking-[0.5px] text-[#A0A0AB] 2xl:px-4 2xl:text-[12px]"

function StatusPill({ status }: { status: JobStatus }) {
  if (status === "Active") {
    return (
      <span className="inline-flex h-7 items-center gap-1.5 rounded-full bg-[#14532D]/40 px-3 text-[11px] leading-5 font-medium text-[#4ADE80]">
        <span className="size-1.5 rounded-full bg-[#4ADE80]" />
        Active
      </span>
    )
  }

  return (
    <span className="inline-flex h-7 items-center gap-1.5 rounded-full bg-[#1F1F1F] px-3 text-[11px] leading-5 font-medium text-[#A0A0AB]">
      <span className="size-1.5 rounded-full bg-[#5A5A60]" />
      Expired
    </span>
  )
}

function JobRow({ job }: { job: Job }) {
  const Icon = jobIcons[job.icon]
  const applicantColor =
    job.applicantTone === "indigo" ? "text-[#C3C0FF]" : "text-[#D4D4D8]"

  return (
    <tr className="border-b border-[#232327] transition-colors last:border-b-0 hover:bg-white/[0.015]">
      {/* Job title & department */}
      <td className="px-3 py-4 2xl:px-4">
        <div className="flex items-center gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#232327]">
            <Icon className="size-5" style={{ color: job.categoryColor }} />
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm leading-5 font-semibold text-white">
              {job.title}
            </p>
            <p
              className="text-[11px] leading-5 font-medium"
              style={{ color: job.categoryColor }}
            >
              {job.category}
            </p>
          </div>
        </div>
      </td>

      {/* company & location */}
      <td className="px-3 py-4 2xl:px-4">
        <p className="truncate text-[13px] leading-5 font-medium text-white">
          {job.company}
        </p>
        <p className="flex items-center gap-1.5 text-xs leading-5 text-[#A0A0AB]">
          <MapPin className="size-4 shrink-0" />
          <span className="truncate">{job.location}</span>
        </p>
      </td>

      {/* Type */}
      <td className="px-3 py-4 2xl:px-4">
        <span className="inline-flex h-[30px] items-center rounded-full border border-[#232327] bg-[#1F1F1F] px-3 text-[11px] leading-5 font-medium whitespace-nowrap text-[#D4D4D8]">
          {job.jobType}
        </span>
      </td>

      {/* Compensation */}
      <td className="truncate px-3 py-4 2xl:px-4 text-[13px] leading-5 font-medium text-white">
        {job.compensation}
      </td>

      {/* Applicants */}
      <td className="px-3 py-4 2xl:px-4">
        <span
          className={`flex min-w-0 items-center gap-1.5 text-[13px] leading-5 font-semibold ${applicantColor}`}
        >
          <Users className="size-4 shrink-0" />
          <span className="truncate">{job.applicants} Candidates</span>
        </span>
      </td>

      {/* Status */}
      <td className="px-3 py-4 2xl:px-4">
        <StatusPill status={job.status} />
      </td>

      {/* Deadline */}
      <td className="px-3 py-4 2xl:px-4">
        <p
          className={`truncate text-[13px] leading-5 font-medium ${
            job.status === "Expired" ? "text-[#A0A0AB]" : "text-white"
          }`}
        >
          {job.deadline}
        </p>
        {job.postedAgo ? (
          <p className="truncate text-[11px] leading-5 text-[#5A5A60]">
            {job.postedAgo}
          </p>
        ) : null}
      </td>

      {/* Actions */}
      <td className="px-3 py-4 2xl:px-4">
        <div className="flex items-center justify-end gap-1 2xl:gap-1.5">
          <button
            type="button"
            className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-[#5C53FE]/20 px-2 text-xs leading-5 font-medium text-[#C3C0FF] transition-colors hover:bg-[#5C53FE]/30 hover:text-white 2xl:px-2.5"
          >
            <Pencil className="size-4" />
            Update
          </button>
          <DeleteJobButton
            id={job.id}
            title={job.title}
            className="flex size-8 items-center justify-center rounded-lg bg-[#1F1F1F] text-[#A0A0AB] transition-colors hover:bg-[#2A2A2C] hover:text-white"
          />
          <button
            type="button"
            aria-label={`More actions for ${job.title}`}
            className="flex size-8 items-center justify-center rounded-lg text-[#A1A4AA] transition-colors hover:bg-white/[0.04] hover:text-white"
          >
            <EllipsisVertical className="size-4" />
          </button>
        </div>
      </td>
    </tr>
  )
}

/* -------------------------------------------------------------------------- */
/*                        Mobile / tablet job card                            */
/* -------------------------------------------------------------------------- */

function JobCard({ job }: { job: Job }) {
  const Icon = jobIcons[job.icon]
  const applicantColor =
    job.applicantTone === "indigo" ? "text-[#C3C0FF]" : "text-[#D4D4D8]"

  return (
    <article className="flex flex-col gap-4 rounded-[16px] border border-[#232327] bg-[#151516] p-4 shadow-[0_8px_10px_-6px_rgba(0,0,0,0.45),0_20px_25px_-5px_rgba(0,0,0,0.4)]">
      {/* Title + status */}
      <div className="flex items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#232327]">
          <Icon className="size-5" style={{ color: job.categoryColor }} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm leading-5 font-semibold text-white">
            {job.title}
          </p>
          <p
            className="text-[11px] leading-5 font-medium"
            style={{ color: job.categoryColor }}
          >
            {job.category}
          </p>
        </div>
        <StatusPill status={job.status} />
      </div>

      {/* Details */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-3">
        <div className="col-span-2 min-w-0">
          <p className="text-[10px] font-medium tracking-[0.6px] text-[#5A5A60] uppercase">
            company &amp; Location
          </p>
          <p className="truncate text-[13px] leading-5 font-medium text-white">
            {job.company}
          </p>
          <p className="flex items-center gap-1.5 text-xs leading-5 text-[#A0A0AB]">
            <MapPin className="size-3.5 shrink-0" />
            <span className="truncate">{job.location}</span>
          </p>
        </div>

        <div className="min-w-0">
          <p className="text-[10px] font-medium tracking-[0.6px] text-[#5A5A60] uppercase">
            Type
          </p>
          <span className="mt-1 inline-flex h-[26px] items-center rounded-full border border-[#232327] bg-[#1F1F1F] px-2.5 text-[11px] leading-5 font-medium whitespace-nowrap text-[#D4D4D8]">
            {job.jobType}
          </span>
        </div>

        <div className="min-w-0">
          <p className="text-[10px] font-medium tracking-[0.6px] text-[#5A5A60] uppercase">
            Compensation
          </p>
          <p className="truncate text-[13px] leading-5 font-medium text-white">
            {job.compensation}
          </p>
        </div>

        <div className="min-w-0">
          <p className="text-[10px] font-medium tracking-[0.6px] text-[#5A5A60] uppercase">
            Applicants
          </p>
          <span
            className={`flex items-center gap-1.5 text-[13px] leading-5 font-semibold ${applicantColor}`}
          >
            <Users className="size-3.5 shrink-0" />
            {job.applicants} Candidates
          </span>
        </div>

        <div className="min-w-0">
          <p className="text-[10px] font-medium tracking-[0.6px] text-[#5A5A60] uppercase">
            Deadline
          </p>
          <p
            className={`text-[13px] leading-5 font-medium ${
              job.status === "Expired" ? "text-[#A0A0AB]" : "text-white"
            }`}
          >
            {job.deadline}
          </p>
          {job.postedAgo ? (
            <p className="text-[11px] leading-5 text-[#5A5A60]">
              {job.postedAgo}
            </p>
          ) : null}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#5C53FE]/20 px-3 text-xs leading-5 font-medium text-[#C3C0FF] transition-colors hover:bg-[#5C53FE]/30 hover:text-white"
        >
          <Pencil className="size-4" />
          Update
        </button>
        <DeleteJobButton
          id={job.id}
          title={job.title}
          className="flex size-9 items-center justify-center rounded-lg bg-[#1F1F1F] text-[#A0A0AB] transition-colors hover:bg-[#2A2A2C] hover:text-white"
        />
        <button
          type="button"
          aria-label={`More actions for ${job.title}`}
          className="flex size-9 items-center justify-center rounded-lg text-[#A1A4AA] transition-colors hover:bg-white/[0.04] hover:text-white"
        >
          <EllipsisVertical className="size-4" />
        </button>
      </div>
    </article>
  )
}

/* -------------------------------------------------------------------------- */
/*                              Manage Job Posts                              */
/* -------------------------------------------------------------------------- */

const Alljobs = async () => {
  const jobs = await getJobs()

  return (
    <div className="min-h-svh bg-[#131314] px-4 py-6 text-[#F4F4F5] sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-[1395px] flex-col">
        {/* Breadcrumb + page heading + primary action */}
        <div className="flex flex-col gap-4 pb-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 text-[13px] leading-5">
              <Link
                href="/dashbord/recruiter/all-jobs"
                className="text-[#A0A0AB] transition-colors hover:text-white"
              >
                Manage Jobs
              </Link>
              <ChevronRight className="size-3 text-[#A0A0AB]" />
              <span className="font-medium text-[#C3C0FF]">
                Job Listings &amp; Postings
              </span>
            </div>

            <h1 className="mt-4 text-[32px] leading-[42px] font-medium tracking-[-0.8px] text-white">
              Manage Job Posts
            </h1>
            <p className="mt-1 max-w-[580px] text-sm leading-[22px] text-[#A0A0AB]">
              Review live listings, monitor applicants, and update job details
              across your organization.
            </p>
          </div>

          <Link
            href="/dashbord/recruiter/add-jobs"
            className="inline-flex h-10 w-full shrink-0 items-center justify-center gap-2 rounded-[12px] bg-[#5C53FE] px-4 text-sm leading-5 font-bold text-white shadow-[0_2px_4px_-2px_rgba(0,0,0,0.5),0_4px_6px_-1px_rgba(0,0,0,0.4)] transition-colors hover:bg-[#6C64FF] focus-visible:ring-2 focus-visible:ring-[#C3C0FF]/60 focus-visible:outline-none sm:w-auto"
          >
            <Plus className="size-3.5" />
            New Job Post
          </Link>
        </div>

        {jobs.length === 0 ? (
          <div className="flex flex-col items-center gap-2 rounded-[16px] border border-[#232327] bg-[#151516] px-6 py-16 text-center shadow-[0_8px_10px_-6px_rgba(0,0,0,0.45),0_20px_25px_-5px_rgba(0,0,0,0.4)]">
            <p className="text-base leading-6 font-medium text-white">
              No job posts yet
            </p>
            <p className="max-w-[420px] text-sm leading-[22px] text-[#A0A0AB]">
              Published roles will show up here. Create your first job post to
              start receiving applications.
            </p>
          </div>
        ) : (
          <>
            {/* Job posts — cards on mobile/tablet, table on desktop */}
            <div className="grid gap-3 lg:grid-cols-2 xl:hidden">
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>

            <div className="hidden overflow-hidden rounded-[16px] border border-[#232327] bg-[#151516] shadow-[0_8px_10px_-6px_rgba(0,0,0,0.45),0_20px_25px_-5px_rgba(0,0,0,0.4)] xl:block">
              <div className="overflow-x-auto">
                <table className="w-full table-fixed border-collapse">
                  <colgroup>
                    <col className="w-[17%]" />
                    <col className="w-[12%]" />
                    <col className="w-[9%]" />
                    <col className="w-[12%]" />
                    <col className="w-[12%]" />
                    <col className="w-[9%]" />
                    <col className="w-[11%]" />
                    <col className="w-[18%]" />
                  </colgroup>
                  <thead>
                    <tr className="border-b border-[#232327] bg-[#0B0B0C]">
                      <th scope="col" className={headerCellClass}>
                        JOB TITLE &amp; DEPT
                      </th>
                      <th scope="col" className={headerCellClass}>
                        company &amp; LOCATION
                      </th>
                      <th scope="col" className={headerCellClass}>
                        TYPE
                      </th>
                      <th scope="col" className={headerCellClass}>
                        COMPENSATION
                      </th>
                      <th scope="col" className={headerCellClass}>
                        APPLICANTS
                      </th>
                      <th scope="col" className={headerCellClass}>
                        STATUS
                      </th>
                      <th scope="col" className={headerCellClass}>
                        DEADLINE
                      </th>
                      <th
                        scope="col"
                        className={`${headerCellClass} text-right`}
                      >
                        ACTIONS
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {jobs.map((job) => (
                      <JobRow key={job.id} job={job} />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Alljobs
