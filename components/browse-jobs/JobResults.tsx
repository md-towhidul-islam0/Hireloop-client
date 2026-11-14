import { EmptyJobs } from "./EmptyJobs"
import { JobCard } from "./JobCard"
import { Pagination } from "./Pagination"
import { SortSelect } from "./SortSelect"
import type { BrowseJob } from "@/lib/browse-jobs"

const PAGE_SIZE = 12

interface JobResultsProps {
  jobs: BrowseJob[]
}

export function JobResults({ jobs }: JobResultsProps) {
  // TODO: read the page from the URL once pagination is wired up.
  const page = 1
  const pageCount = Math.max(1, Math.ceil(jobs.length / PAGE_SIZE))
  const visibleJobs = jobs.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <section aria-labelledby="job-results-heading" className="min-w-0">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2
            id="job-results-heading"
            className="text-lg font-semibold text-white"
          >
            Open positions
          </h2>
          <p className="mt-1 text-sm text-white/50">
            {jobs.length === 0 ? (
              "No open positions right now"
            ) : (
              <>
                Showing{" "}
                <span className="font-medium text-white">
                  {visibleJobs.length}
                </span>{" "}
                of {jobs.length} {jobs.length === 1 ? "job" : "jobs"}
              </>
            )}
          </p>
        </div>

        <SortSelect />
      </div>

      {jobs.length === 0 ? (
        <EmptyJobs />
      ) : (
        <>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {visibleJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>

          {pageCount > 1 ? <Pagination page={page} pageCount={pageCount} /> : null}
        </>
      )}
    </section>
  )
}
