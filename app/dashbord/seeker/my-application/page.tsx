import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { MyApplications } from "@/components/seeker-applications/MyApplications"
import { auth } from "@/lib/auth"
import { toBrowseJobs } from "@/lib/browse-jobs"
import { getAppli, getjobC } from "@/lib/job-actions"
import {
  toMyApplications,
  type ApiApplication,
  type MyApplication,
} from "@/lib/seeker-applications"

const Page = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  const user = session?.user

  if (!user) {
    redirect("/SignIn")
  }

  let applications: MyApplication[] = []

  try {
    const [myApply, jobs] = await Promise.all([getAppli(user.id), getjobC()])
    applications = toMyApplications(
      (Array.isArray(myApply) ? myApply : []) as ApiApplication[],
      toBrowseJobs(jobs)
    )
  } catch (error) {
    console.error("Failed to load applications", error)
  }

  return (
    <MyApplications
      applications={applications}
      user={{
        name: user.name || user.email || "Hireloop user",
        email: user.email,
      }}
    />
  )
}

export default Page
