import Link from "next/link"
import { ChevronRight, Sparkles } from "lucide-react"

import { SearchBar } from "./SearchBar"
import type { FilterOption } from "@/lib/browse-jobs"

interface BrowseJobsHeroProps {
  totalJobs: number
  categories: FilterOption[]
}

export function BrowseJobsHero({ totalJobs, categories }: BrowseJobsHeroProps) {
  return (
    <section className="relative isolate overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[420px] bg-[radial-gradient(60%_100%_at_50%_0%,rgba(99,102,241,0.20)_0%,rgba(5,5,7,0)_75%)]"
      />

      <div className="mx-auto w-full max-w-7xl px-4 pt-10 pb-8 sm:px-6 sm:pt-12 lg:px-8">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-white/40">
          <Link href="/" className="transition-colors hover:text-white">
            Home
          </Link>
          <ChevronRight className="size-3" />
          <span className="font-medium text-white/70">Browse Jobs</span>
        </nav>

        <div className="mt-4 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-[44px] lg:leading-[1.1]">
              Browse Jobs
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-white/60 sm:text-base">
              Explore open roles from teams that are hiring right now. Filter by
              category, salary, location and more to find your next opportunity.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 font-medium text-white/70">
              <span aria-hidden="true" className="size-1.5 rounded-full bg-emerald-400" />
              {totalJobs} open {totalJobs === 1 ? "role" : "roles"}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 font-medium text-white/70">
              <Sparkles className="size-3.5 text-indigo-300" />
              Updated daily
            </span>
          </div>
        </div>

        <div className="mt-8">
          <SearchBar categories={categories} />
        </div>
      </div>
    </section>
  )
}
