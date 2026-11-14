import {
  CalendarDays,
  Laptop,
  MapPin,
  Wallet,
} from "lucide-react"

import { ApplyJobButton } from "./ApplyJobButton"
import type { BrowseJob } from "@/lib/browse-jobs"

interface JobSummaryCardProps {
  job: BrowseJob
}

export function JobSummaryCard({ job }: JobSummaryCardProps) {
  const rows = [
    { icon: Wallet, label: "Salary", value: job.salary },
    { icon: CalendarDays, label: "Application deadline", value: job.deadline },
    { icon: MapPin, label: "Location", value: job.location },
    { icon: Laptop, label: "Work mode", value: job.isRemote ? "Remote" : "On-site" },
  ]

  return (
    <aside className="rounded-2xl border border-white/10 bg-[#0c0c0e] p-5 shadow-[0_20px_50px_-30px_rgba(0,0,0,0.9)]">
      <h2 className="text-base font-semibold text-white">Job overview</h2>

      <dl className="mt-4 space-y-3.5 border-t border-white/10 pt-4 text-sm">
        {rows.map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex items-start gap-2.5">
            <Icon className="mt-0.5 size-4 shrink-0 text-white/35" />
            <div className="min-w-0">
              <dt className="text-[11px] tracking-[0.14em] text-white/35 uppercase">
                {label}
              </dt>
              <dd className="mt-0.5 break-words text-white/70">{value}</dd>
            </div>
          </div>
        ))}

        <div className="flex items-start gap-2.5">
          <span
            aria-hidden="true"
            className={`mt-1.5 size-2 shrink-0 rounded-full ${
              job.status === "Expired" ? "bg-white/30" : "bg-emerald-400"
            }`}
          />
          <div>
            <dt className="text-[11px] tracking-[0.14em] text-white/35 uppercase">
              Status
            </dt>
            <dd className="mt-0.5 text-white/70">{job.status}</dd>
          </div>
        </div>
      </dl>

      <div className="mt-5 border-t border-white/10 pt-4 lg:hidden">
        <ApplyJobButton
          jobId={job.id}
          title={job.title}
          expired={job.status === "Expired"}
        />
      </div>
    </aside>
  )
}
