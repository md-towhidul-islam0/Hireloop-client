import Navbar from "@/components/Navbar"
import { BrowseJobsHero } from "@/components/browse-jobs/BrowseJobsHero"
import { JobFilters } from "@/components/browse-jobs/JobFilters"
import { JobResults } from "@/components/browse-jobs/JobResults"
import { getjob, getjobC } from "@/lib/job-actions"
import {
  getCategoryOptions,
  getJobTypeOptions,
  toBrowseJobs,
} from "@/lib/browse-jobs"

type SearchParams = { [key: string]: string | string[] | undefined }

const BrowseJobsPage = async ({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) => {
  const search = await searchParams
  const urlSearch = new URLSearchParams()

  for (const [key, value] of Object.entries(search)) {
    if (Array.isArray(value)) {
      value.forEach((item) => urlSearch.append(key, item))
    } else if (value) {
      urlSearch.append(key, value)
    }
  }

  let data: unknown = []
  let dataC: unknown = []

  try {
    data = await getjob(urlSearch.toString())
    dataC=await getjobC()
  } catch (error) {
    // Keep the browse page usable if the backend is unreachable.
    console.error("Failed to load jobs for the browse page:", error)
  }

  const jobs = toBrowseJobs(data)
  const jobsC=toBrowseJobs(dataC)
  const categories = getCategoryOptions(jobsC)
  const jobTypes = getJobTypeOptions(jobsC)

  return (
    <main className="min-h-screen bg-[#050507] text-white">
      <Navbar />

      <BrowseJobsHero totalJobs={jobs.length} categories={categories} />

      <section className="mx-auto w-full max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[292px_minmax(0,1fr)] lg:gap-8">
          <aside className="min-w-0 lg:sticky lg:top-6 lg:self-start">
            <JobFilters categories={categories} jobTypes={jobTypes} />
          </aside>

          <JobResults jobs={jobs} />
        </div>
      </section>
    </main>
  )
}

export default BrowseJobsPage
