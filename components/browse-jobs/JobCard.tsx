import Link from "next/link"
import { ArrowUpRight, Briefcase, CalendarDays, MapPin } from "lucide-react"

import { SaveJobButton } from "./SaveJobButton"
import { StatusPill } from "./StatusPill"
import { categoryIcons } from "./category-icons"
import type { BrowseJob } from "@/lib/browse-jobs"

interface JobCardProps {
  job: BrowseJob
}

/** Reusable job card — also used as the base for the browse page grid. */
export function JobCard({ job }: JobCardProps) {
  const Icon = categoryIcons[job.categoryIcon]
  // TODO: point at the real job details route once it exists.
  const detailsHref = `/browse-job/${job.id}`

  return (
    <article className="group flex min-w-0 flex-col rounded-2xl border border-white/10 bg-[#0c0c0e] p-5 shadow-[0_20px_50px_-30px_rgba(0,0,0,0.9)] transition-colors hover:border-white/20 hover:bg-[#101014]">
      <div className="flex items-start justify-between gap-3">
        <span
          className="grid size-11 shrink-0 place-items-center rounded-xl border text-sm font-semibold"
          style={{
            color: job.categoryColor,
            borderColor: `${job.categoryColor}2e`,
            backgroundColor: `${job.categoryColor}14`,
          }}
          aria-hidden="true"
        >
          {job.initials}
        </span>

        <div className="flex items-center gap-2">
          <StatusPill status={job.status} />
          <SaveJobButton jobId={job.id} title={job.title} />
        </div>
      </div>

      <h3 className="mt-4 truncate text-base leading-6 font-semibold text-white">
        <Link
          href={detailsHref}
          className="transition-colors hover:text-indigo-300"
        >
          {job.title}
        </Link>
      </h3>

      <p className="mt-1 truncate text-sm text-white/55">{job.company}</p>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-white/50">
        <span className="inline-flex min-w-0 items-center gap-1.5">
          <MapPin className="size-3.5 shrink-0" />
          <span className="truncate">{job.location}</span>
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Briefcase className="size-3.5 shrink-0" />
          {job.jobType}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span
          className="inline-flex max-w-full items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium"
          style={{
            color: job.categoryColor,
            borderColor: `${job.categoryColor}2e`,
            backgroundColor: `${job.categoryColor}14`,
          }}
        >
          <Icon className="size-3.5 shrink-0" />
          <span className="truncate">{job.category}</span>
        </span>
        {job.isRemote ? (
          <span className="inline-flex items-center rounded-full border border-indigo-400/20 bg-indigo-500/10 px-2.5 py-1 text-[11px] font-medium text-indigo-300">
            Remote
          </span>
        ) : null}
      </div>

      <div className="mt-5 flex items-end justify-between gap-3 border-t border-white/10 pt-4">
        <div className="min-w-0">
          <p className="text-[10px] font-medium tracking-[0.16em] text-white/35 uppercase">
            Salary
          </p>
          <p className="mt-0.5 truncate text-sm font-medium text-white">
            {job.salary}
          </p>
        </div>
        <Link
          href={detailsHref}
          className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-indigo-300 transition-colors hover:text-indigo-200"
        >
          View details
          <ArrowUpRight className="size-3.5" />
        </Link>
      </div>

      <p className="mt-3 inline-flex items-center gap-1.5 text-[11px] text-white/35">
        <CalendarDays className="size-3.5 shrink-0" />
        Apply before {job.deadline}
      </p>
    </article>
  )
}
