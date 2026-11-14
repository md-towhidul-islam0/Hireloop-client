"use client"

import { useEffect, useState, useSyncExternalStore } from "react"
import { useRouter } from "next/navigation"
import { Send } from "lucide-react"

import { toast } from "@/components/ui/toast"
import {
  getAppliedJobs,
  getAppliedJobsServerSnapshot,
  loadAppliedJobs,
  markJobApplied,
  subscribe,
} from "@/lib/applied-jobs"
import { authClient } from "@/lib/auth-client"
import { postApplecation } from "@/lib/job-actions"

interface ApplyJobButtonProps {
  jobId: string
  title: string
  expired?: boolean
}

export function ApplyJobButton({
  jobId,
  title,
  expired = false,
}: ApplyJobButtonProps) {
  const {
    data: session,
    isPending, //loading state
  } = authClient.useSession()
  const user = session?.user
  const router = useRouter()

  const applied = useSyncExternalStore(
    subscribe,
    getAppliedJobs,
    getAppliedJobsServerSnapshot
  )
  const [isSubmitting, setIsSubmitting] = useState(false)

  const userId = user?.id

  useEffect(() => {
    if (userId) loadAppliedJobs(userId)
  }, [userId])

  const hasApplied =
    Boolean(userId) &&
    applied !== null &&
    applied.userId === userId &&
    applied.jobIds.includes(jobId)
  const isChecking =
    Boolean(userId) &&
    (applied?.userId !== userId || applied?.status === "loading")

  const handleApply = async () => {
    if (!user) {
      router.push(`/SignIn?redirectTo=/browse-job/${jobId}`)
      return
    }

    if (
      user.role !== "seeker" ||
      expired ||
      hasApplied ||
      isChecking ||
      isSubmitting
    ) {
      return
    }

    setIsSubmitting(true)

    try {
      const ApplicationInfo = {
        jobID: jobId,
        userID: user.id,
      }

      await postApplecation(ApplicationInfo)
      markJobApplied(user.id, jobId)
      toast.add({
        type: "success",
        title: "Application submitted",
        description: `Your application for ${title} was sent successfully.`,
      })
    } catch (error) {
      console.error("Failed to submit application", error)
      toast.add({
        type: "error",
        title: "Application not submitted",
        description: "Something went wrong. Please try again in a moment.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const disabled =
    expired || hasApplied || isChecking || isSubmitting || isPending

  return (
    <button
      type="button"
      onClick={handleApply}
      disabled={disabled}
      className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 text-sm font-medium text-white transition-colors hover:bg-indigo-500 focus-visible:ring-3 focus-visible:ring-indigo-400/60 focus-visible:outline-none disabled:pointer-events-none disabled:bg-white/10 disabled:text-white/40"
    >
      <Send className="size-4" />
      {expired
        ? "Applications closed"
        : hasApplied
          ? "Already applied"
          : isSubmitting
            ? "Applying..."
            : isChecking
              ? "Checking..."
              : "Apply now"}
    </button>
  )
}
