import { Suspense } from "react"

import Alljobs from "@/components/All-jobs"

import { AllJobsSkeleton } from "./AllJobsSkeleton"

const Page = () => {
  return (
    <Suspense fallback={<AllJobsSkeleton />}>
      <Alljobs />
    </Suspense>
  )
}

export default Page
