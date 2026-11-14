"use client"

import { useState, type ChangeEvent, type FormEvent } from "react"
import {
  ChevronDown,
  CircleDollarSign,
  MapPin,
  RotateCcw,
  SlidersHorizontal,
} from "lucide-react"

import { FilterChoice } from "./FilterChoice"
import { FilterGroup } from "./FilterGroup"
import {
  DATE_POSTED_OPTIONS,
  EXPERIENCE_OPTIONS,
  type FilterOption,
} from "@/lib/browse-jobs"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

interface JobFiltersProps {
  categories: FilterOption[]
  jobTypes: FilterOption[]
}

export function JobFilters({ categories, jobTypes }: JobFiltersProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleFieldChange = (event: ChangeEvent<HTMLFormElement>) => {
    const target = event.target

    if (
      !(target instanceof HTMLInputElement) &&
      !(target instanceof HTMLSelectElement)
    ) {
      return
    }

    // TODO: sync the selected value with the URL / server query.
    console.log(
      "Filter changed:",
      target.name,
      target.value,
      "checked" in target ? target.checked : undefined
    )
  }
  const router=useRouter();
  const handleApply = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const params = new URLSearchParams()
    new FormData(event.currentTarget).forEach((value, key) => {
      if (typeof value === "string" && value.length > 0) {
        params.append(key, value)
      }
    })

    router.push(`/browse-job?${params.toString()}`)
    console.log("Apply filters:", params.toString())
  }

  const handleReset = () => {
    // TODO: clear the filter form and the query string.
    console.log("Reset filters")
  }

  return (
    <div>
      {/* Mobile / tablet toggle */}
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls="browse-job-filters"
        onClick={() => setIsOpen((value) => !value)}
        className="flex w-full items-center justify-between gap-3 rounded-xl border border-white/10 bg-[#0c0c0e] px-4 py-3 text-sm font-medium text-white transition-colors hover:border-white/20 lg:hidden"
      >
        <span className="inline-flex items-center gap-2">
          <SlidersHorizontal className="size-4 text-indigo-400" />
          Filters
        </span>
        <ChevronDown
          className={cn(
            "size-4 text-white/40 transition-transform",
            isOpen && "rotate-180"
          )}
        />
      </button>

      <form
        id="browse-job-filters"
        onSubmit={handleApply}
        onChange={handleFieldChange}
        className={cn("mt-3 lg:mt-0 lg:block", isOpen ? "block" : "hidden")}
      >
        <div className="rounded-2xl border border-white/10 bg-[#0c0c0e] p-5 shadow-[0_20px_50px_-30px_rgba(0,0,0,0.9)]">
          <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-4">
            <h2 className="inline-flex items-center gap-2 text-sm font-semibold text-white">
              <SlidersHorizontal className="size-4 text-indigo-400" />
              Filters
            </h2>
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1 text-xs font-medium text-white/45 transition-colors hover:text-white"
            >
              <RotateCcw className="size-3.5" />
              Reset
            </button>
          </div>

          <FilterGroup title="Job category">
            {categories.map((option) => (
              <FilterChoice
                key={option.value}
                name="category"
                value={option.value}
                label={option.label}
                count={option.count}
              />
            ))}
          </FilterGroup>

          <FilterGroup title="Job type">
            {jobTypes.map((option) => (
              <FilterChoice
                key={option.value}
                name="jobType"
                value={option.value}
                label={option.label}
                count={option.count}
                
              />
              
            ))}
          </FilterGroup>

          <FilterGroup title="Experience level">
            {EXPERIENCE_OPTIONS.map((option) => (
              <FilterChoice
                key={option.value}
                name="experience"
                value={option.value}
                label={option.label}
              />
            ))}
          </FilterGroup>

          {/* <FilterGroup title="Salary range">
            <div className="grid grid-cols-2 gap-2">
              <label className="relative">
                <span className="sr-only">Minimum salary</span>
                <CircleDollarSign className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-white/35" />
                <input
                  type="number"
                  name="minSalary"
                  min={0}
                  placeholder="Min"
                  className="h-10 w-full rounded-lg border border-white/10 bg-white/[0.03] pr-3 pl-8 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20"
                />
              </label>
              <label className="relative">
                <span className="sr-only">Maximum salary</span>
                <CircleDollarSign className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-white/35" />
                <input
                  type="number"
                  name="maxSalary"
                  min={0}
                  placeholder="Max"
                  className="h-10 w-full rounded-lg border border-white/10 bg-white/[0.03] pr-3 pl-8 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20"
                />
              </label>
            </div>

            <div className="mt-3">
              <input
                type="range"
                name="salaryCeiling"
                min={0}
                max={250000}
                step={5000}
                defaultValue={120000}
                aria-label="Maximum salary"
                className="w-full accent-indigo-500"
              />
              <div className="flex items-center justify-between text-[11px] text-white/35">
                <span>$0</span>
                <span>$250k+</span>
              </div>
            </div>
          </FilterGroup> */}

          <FilterGroup title="Location">
            <label className="relative block">
              <span className="sr-only">Location</span>
              <MapPin className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-white/35" />
              <input
                type="text"
                name="location"
                placeholder="City or country"
                className="h-10 w-full rounded-lg border border-white/10 bg-white/[0.03] pr-3 pl-8 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20"
              />
            </label>

            <label className="mt-3 flex cursor-pointer items-center justify-between gap-3 rounded-lg px-2 py-1.5 transition-colors hover:bg-white/[0.04]">
              <span className="text-sm text-white/65">Remote only</span>
              <span className="relative inline-flex">
                <input type="checkbox" name="isRemote" className="peer sr-only" />
                <span className="h-6 w-11 rounded-full bg-white/10 transition-colors peer-checked:bg-indigo-600 peer-focus-visible:ring-2 peer-focus-visible:ring-indigo-400/60" />
                <span className="pointer-events-none absolute top-0.5 left-0.5 size-5 rounded-full bg-white transition-transform peer-checked:translate-x-5" />
              </span>
            </label>
          </FilterGroup>

          {/* <FilterGroup title="Date posted" defaultOpen={false}>
            {DATE_POSTED_OPTIONS.map((option, index) => (
              <FilterChoice
                key={option.value}
                type="radio"
                name="datePosted"
                value={option.value}
                label={option.label}
                defaultChecked={index === 0}
              />
            ))}
          </FilterGroup> */}

          <button
            type="submit"
            className="mt-4 h-10 w-full rounded-xl bg-indigo-600 text-sm font-medium text-white transition-colors hover:bg-indigo-500 focus-visible:ring-3 focus-visible:ring-indigo-400/60 focus-visible:outline-none"
          >
            Apply filters
          </button>
        </div>
      </form>
    </div>
  )
}
