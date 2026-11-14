import type { JobStatus } from "@/lib/browse-jobs"

interface StatusPillProps {
  status: JobStatus
}

export function StatusPill({ status }: StatusPillProps) {
  if (status === "Expired") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[11px] font-medium text-white/45">
        <span aria-hidden="true" className="size-1.5 rounded-full bg-white/30" />
        Expired
      </span>
    )
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-[11px] font-medium text-emerald-300">
      <span aria-hidden="true" className="size-1.5 rounded-full bg-emerald-400" />
      Active
    </span>
  )
}
