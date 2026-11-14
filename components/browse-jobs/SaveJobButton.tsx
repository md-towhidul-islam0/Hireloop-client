"use client"

import { useState } from "react"
import { Bookmark } from "lucide-react"

import { cn } from "@/lib/utils"

interface SaveJobButtonProps {
  jobId: string
  title: string
}

export function SaveJobButton({ jobId, title }: SaveJobButtonProps) {
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    // TODO: persist the saved job through the API / server action.
    console.log("Toggle saved job:", jobId, !saved)
    setSaved((value) => !value)
  }

  return (
    <button
      type="button"
      aria-label={saved ? `Remove ${title} from saved jobs` : `Save ${title}`}
      aria-pressed={saved}
      onClick={handleSave}
      className={cn(
        "inline-flex size-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-white/45 transition-colors hover:border-white/20 hover:text-white",
        saved && "border-indigo-400/40 bg-indigo-500/10 text-indigo-300"
      )}
    >
      <Bookmark className={cn("size-4", saved && "fill-current")} />
    </button>
  )
}
