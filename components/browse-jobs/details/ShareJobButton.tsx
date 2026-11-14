"use client"

import { useState } from "react"
import { Check, Share2 } from "lucide-react"

import { cn } from "@/lib/utils"

interface ShareJobButtonProps {
  title: string
}

export function ShareJobButton({ title }: ShareJobButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    const url = window.location.href

    try {
      if (navigator.share) {
        await navigator.share({ title, url })
        return
      }

      await navigator.clipboard.writeText(url)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      // The user dismissed the share sheet or the clipboard was unavailable.
    }
  }

  return (
    <button
      type="button"
      aria-label={copied ? "Link copied" : `Share ${title}`}
      onClick={handleShare}
      className={cn(
        "inline-flex size-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-white/45 transition-colors hover:border-white/20 hover:text-white",
        copied && "border-emerald-400/40 bg-emerald-400/10 text-emerald-300"
      )}
    >
      {copied ? (
        <Check className="size-4" />
      ) : (
        <Share2 className="size-4" />
      )}
    </button>
  )
}
