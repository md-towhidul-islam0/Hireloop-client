import Link from "next/link"
import {
  ArrowUpRight,
  Building2,
  Briefcase,
  FolderTree,
  MapPin,
} from "lucide-react"

import type { BrowseJob } from "@/lib/browse-jobs"

interface CompanyCardProps {
  job: BrowseJob
}

export function CompanyCard({ job }: CompanyCardProps) {
  return (
    <aside className="rounded-2xl border border-white/10 bg-[#0c0c0e] p-5 shadow-[0_20px_50px_-30px_rgba(0,0,0,0.9)]">
      <h2 className="flex items-center gap-2.5 text-base font-semibold text-white">
        <span className="grid size-8 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/[0.04]">
          <Building2 className="size-4 text-indigo-300" />
        </span>
        Company
      </h2>

      <div className="mt-4 flex items-center gap-3">
        <span
          className="grid size-12 shrink-0 place-items-center rounded-xl border text-base font-semibold"
          style={{
            color: job.categoryColor,
            borderColor: `${job.categoryColor}2e`,
            backgroundColor: `${job.categoryColor}14`,
          }}
          aria-hidden="true"
        >
          {job.initials}
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-white">
            {job.company}
          </p>
          <p className="mt-0.5 truncate text-xs text-white/45">
            {job.category}
          </p>
        </div>
      </div>

      <dl className="mt-5 space-y-3 border-t border-white/10 pt-4 text-sm">
        <div className="flex items-start gap-2.5">
          <MapPin className="mt-0.5 size-4 shrink-0 text-white/35" />
          <div className="min-w-0">
            <dt className="text-[11px] tracking-[0.14em] text-white/35 uppercase">
              Location
            </dt>
            <dd className="mt-0.5 text-white/70">{job.location}</dd>
          </div>
        </div>
        <div className="flex items-start gap-2.5">
          <Briefcase className="mt-0.5 size-4 shrink-0 text-white/35" />
          <div className="min-w-0">
            <dt className="text-[11px] tracking-[0.14em] text-white/35 uppercase">
              Job type
            </dt>
            <dd className="mt-0.5 text-white/70">{job.jobType}</dd>
          </div>
        </div>
        <div className="flex items-start gap-2.5">
          <FolderTree className="mt-0.5 size-4 shrink-0 text-white/35" />
          <div className="min-w-0">
            <dt className="text-[11px] tracking-[0.14em] text-white/35 uppercase">
              Category
            </dt>
            <dd className="mt-0.5 text-white/70">{job.category}</dd>
          </div>
        </div>
      </dl>

      <Link
        href="/company"
        className="mt-5 inline-flex h-10 w-full items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.03] text-sm font-medium text-white/70 transition-colors hover:border-white/20 hover:text-white"
      >
        View company profile
        <ArrowUpRight className="size-4" />
      </Link>
    </aside>
  )
}
