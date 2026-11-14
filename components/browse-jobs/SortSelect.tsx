"use client"

import type { ChangeEvent } from "react"
import { ChevronDown } from "lucide-react"

import { SORT_OPTIONS } from "@/lib/browse-jobs"

export function SortSelect() {
  const handleSortChange = (event: ChangeEvent<HTMLSelectElement>) => {
    // TODO: sort the results (or push `?sort=` to the URL).
    console.log("Sort jobs by:", event.target.value)
  }

  return (
    <label className="inline-flex items-center gap-2">
      <span className="shrink-0 text-xs text-white/45">Sort by</span>
      <span className="relative">
        <select
          name="sort"
          defaultValue="relevance"
          onChange={handleSortChange}
          className="h-10 appearance-none rounded-xl border border-white/10 bg-[#0c0c0e] pr-9 pl-3 text-sm text-white outline-none transition-colors hover:border-white/20 focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20 [&>option]:bg-[#0c0c0e] [&>option]:text-white"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-white/40" />
      </span>
    </label>
  )
}
