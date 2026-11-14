import Link from "next/link"
import { SearchX } from "lucide-react"

export function EmptyJobs() {
  return (
    <div className="mt-5 flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 bg-[#0c0c0e] px-6 py-20 text-center">
      <span className="grid size-14 place-items-center rounded-2xl border border-white/10 bg-white/[0.04]">
        <SearchX className="size-6 text-white/45" />
      </span>
      <h3 className="mt-5 text-lg font-semibold text-white">
        No jobs match your search
      </h3>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-white/50">
        Try a different keyword, widen the salary range, or clear a few filters
        to see more opportunities.
      </p>
      <Link
        href="/browse-job"
        className="mt-6 inline-flex h-10 items-center justify-center rounded-xl bg-indigo-600 px-5 text-sm font-medium text-white transition-colors hover:bg-indigo-500"
      >
        Clear filters
      </Link>
    </div>
  )
}
