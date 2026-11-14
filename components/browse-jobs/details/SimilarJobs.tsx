import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { JobCard } from "../JobCard"
import type { BrowseJob } from "@/lib/browse-jobs"

interface SimilarJobsProps {
  jobs: BrowseJob[]
}

export function SimilarJobs({ jobs }: SimilarJobsProps) {
  if (jobs.length === 0) return null

  return (
    <section className="border-t border-white/10">
      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-white sm:text-2xl">
              Similar jobs
            </h2>
            <p className="mt-1 text-sm text-white/50">
              More opportunities that match this role.
            </p>
          </div>
          <Link
            href="/browse-job"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-300 transition-colors hover:text-indigo-200"
          >
            View all jobs
            <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </div>
    </section>
  )
}
