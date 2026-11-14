import Link from "next/link"
import { FileText, GraduationCap, ListChecks, SearchX } from "lucide-react"

import Navbar from "@/components/Navbar"
import { CompanyCard } from "@/components/browse-jobs/details/CompanyCard"
import { JobDetailHeader } from "@/components/browse-jobs/details/JobDetailHeader"
import {
  BulletList,
  JobSection,
  toList,
} from "@/components/browse-jobs/details/JobSection"
import { JobSummaryCard } from "@/components/browse-jobs/details/JobSummaryCard"
import { SimilarJobs } from "@/components/browse-jobs/details/SimilarJobs"
import { Toaster } from "@/components/ui/toast"
import { geteachjob, getjob } from "@/lib/job-actions"
import { toBrowseJobs, type BrowseJob } from "@/lib/browse-jobs"

function buildSummary(job: BrowseJob) {
  const workMode = job.isRemote ? "fully remote" : `based in ${job.location}`
  const deadline =
    job.deadline === "No deadline"
      ? "Applications stay open until the role is filled."
      : `Applications close on ${job.deadline}.`
  const salary =
    job.salary === "Salary not disclosed"
      ? ""
      : ` The salary range is ${job.salary}.`

  return `${job.company} is hiring a ${job.title} for a ${job.jobType.toLowerCase()} role that is ${workMode}.${salary} ${deadline}`
}

function JobNotFound() {
  return (
    <main className="min-h-screen bg-[#050507] text-white">
      <Navbar />

      <div className="mx-auto flex w-full max-w-3xl flex-col items-center px-4 py-24 text-center sm:px-6">
        <span className="grid size-14 place-items-center rounded-2xl border border-white/10 bg-white/[0.04]">
          <SearchX className="size-6 text-white/45" />
        </span>
        <h1 className="mt-5 text-2xl font-semibold text-white">
          Job not found
        </h1>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-white/50">
          This job may have been removed or the link is no longer valid. Browse
          the open roles to find something similar.
        </p>
        <Link
          href="/browse-job"
          className="mt-6 inline-flex h-10 items-center justify-center rounded-xl bg-indigo-600 px-5 text-sm font-medium text-white transition-colors hover:bg-indigo-500"
        >
          Browse jobs
        </Link>
      </div>
    </main>
  )
}

const JobDetailsPage = async ({
  params,
}: {
  params: Promise<{ id: string }>
}) => {
  const { id } = await params

  let data: unknown = null

  try {
    data = await geteachjob(id)
  } catch (error) {
    console.error(`Failed to load job ${id}:`, error)
  }

  const [job] = toBrowseJobs(data ? [data] : [])

  if (!job) {
    return <JobNotFound />
  }

  let allJobs: BrowseJob[] = []

  try {
    allJobs = toBrowseJobs(await getjob())
  } catch (error) {
    // Similar jobs are optional, so a backend hiccup should not break the page.
    console.error("Failed to load similar jobs:", error)
  }

  const otherJobs = allJobs.filter((item) => item.id !== job.id)
  const sameCategory = otherJobs.filter(
    (item) => item.category === job.category
  )
  const similarJobs = [
    ...sameCategory,
    ...otherJobs.filter((item) => item.category !== job.category),
  ].slice(0, 3)

  const responsibilities = toList(job.responsibilities)
  const qualifications = toList(job.qualifications)

  return (
    <main className="min-h-screen bg-[#050507] text-white">
      <Navbar />

      <JobDetailHeader job={job} />

      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-8">
          <div className="min-w-0 space-y-5">
            <JobSection title="About the role" icon={FileText}>
              <p>{buildSummary(job)}</p>
            </JobSection>

            <JobSection title="Responsibilities" icon={ListChecks}>
              <BulletList
                items={responsibilities}
                emptyLabel="The recruiter has not listed responsibilities for this role yet."
              />
            </JobSection>

            <JobSection
              title="Qualifications & requirements"
              icon={GraduationCap}
            >
              <BulletList
                items={qualifications}
                emptyLabel="The recruiter has not listed qualifications for this role yet."
              />
            </JobSection>
          </div>

          <div className="min-w-0 space-y-5 lg:sticky lg:top-6 lg:self-start">
            <CompanyCard job={job} />
            <JobSummaryCard job={job} />
          </div>
        </div>
      </div>

      <SimilarJobs jobs={similarJobs} />

      <Toaster />
    </main>
  )
}

export default JobDetailsPage
