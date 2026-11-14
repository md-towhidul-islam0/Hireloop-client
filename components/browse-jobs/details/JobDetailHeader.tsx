import Link from "next/link"
import {
  Briefcase,
  ChevronRight,
  MapPin,
  Wallet,
} from "lucide-react"

import { ApplyJobButton } from "./ApplyJobButton"
import { ShareJobButton } from "./ShareJobButton"
import { SaveJobButton } from "../SaveJobButton"
import { StatusPill } from "../StatusPill"
import { categoryIcons } from "../category-icons"
import type { BrowseJob } from "@/lib/browse-jobs"

interface JobDetailHeaderProps {
  job: BrowseJob
}

export function JobDetailHeader({ job }: JobDetailHeaderProps) {
  const Icon = categoryIcons[job.categoryIcon]

  return (
    <section className="relative isolate overflow-hidden border-b border-white/10">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[380px] bg-[radial-gradient(60%_100%_at_50%_0%,rgba(99,102,241,0.18)_0%,rgba(5,5,7,0)_75%)]"
      />

      <div className="mx-auto w-full max-w-7xl px-4 pt-8 pb-10 sm:px-6 lg:px-8">
        <nav
          aria-label="Breadcrumb"
          className="flex min-w-0 items-center gap-1.5 text-xs text-white/40"
        >
          <Link href="/" className="shrink-0 transition-colors hover:text-white">
            Home
          </Link>
          <ChevronRight className="size-3 shrink-0" />
          <Link
            href="/browse-job"
            className="shrink-0 transition-colors hover:text-white"
          >
            Browse Jobs
          </Link>
          <ChevronRight className="size-3 shrink-0" />
          <span className="truncate font-medium text-white/70">{job.title}</span>
        </nav>

        <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
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

              <StatusPill status={job.status} />

              {job.isRemote ? (
                <span className="inline-flex items-center rounded-full border border-indigo-400/20 bg-indigo-500/10 px-2.5 py-1 text-[11px] font-medium text-indigo-300">
                  Remote
                </span>
              ) : null}
            </div>

            <h1 className="mt-4 text-3xl leading-tight font-semibold tracking-tight text-white sm:text-4xl">
              {job.title}
            </h1>

            <p className="mt-2 text-sm text-white/55 sm:text-base">
              {job.company}
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/55">
              <span className="inline-flex min-w-0 items-center gap-2">
                <MapPin className="size-4 shrink-0 text-white/35" />
                <span className="truncate">{job.location}</span>
              </span>
              <span className="inline-flex items-center gap-2">
                <Briefcase className="size-4 shrink-0 text-white/35" />
                {job.jobType}
              </span>
              <span className="inline-flex items-center gap-2">
                <Wallet className="size-4 shrink-0 text-white/35" />
                {job.salary}
              </span>
            </div>
          </div>

          <div className="flex shrink-0 flex-wrap items-center gap-2">
            <SaveJobButton jobId={job.id} title={job.title} />
            <ShareJobButton title={job.title} />
            <ApplyJobButton
              jobId={job.id}
              title={job.title}
              expired={job.status === "Expired"}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
