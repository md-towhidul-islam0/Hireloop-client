"use client"

import type { FormEvent } from "react"
import { ChevronDown, LayoutGrid, MapPin, Search } from "lucide-react"

import type { FilterOption } from "@/lib/browse-jobs"
import { useRouter } from "next/navigation"

const trendingRoles = [
  "Product Designer",
  "AI Engineering",
  "DevOps Engineer",
  "Data Analyst",
]

interface SearchBarProps {
  categories: FilterOption[]
}

export function SearchBar({ categories }: SearchBarProps) {
  const router=useRouter();
  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const urlSerch=new URLSearchParams()
    urlSerch.set("search",formData.get('q')as string);
    const query=urlSerch.toString();
    console.log(query);
    router.push(`/browse-job?${query}`)

  
  }

  const handleTrendingRole = (role: string) => {
    // TODO: run a search for the selected trending role.
    console.log("Search trending role:", role)
  }

  return (
    <div>
      <form
        role="search"
        onSubmit={handleSearch}
        className="flex w-full flex-col gap-1 rounded-2xl border border-white/10 bg-[#0d0d10]/90 p-2 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.9)] sm:flex-row sm:items-center sm:gap-0"
      >
        <label className="flex min-w-0 flex-1 items-center gap-2.5 px-3">
          <Search className="size-4 shrink-0 text-white/40" />
          <span className="sr-only">Job title, skill or company</span>
          <input
            type="search"
            name="q"
            placeholder="Job title, skill or company"
            className="h-11 w-full min-w-0 bg-transparent text-sm text-white outline-none placeholder:text-white/40"
          />
        </label>

        {/* <span aria-hidden="true" className="hidden h-6 w-px shrink-0 bg-white/10 sm:block" />

        <label className="flex min-w-0 flex-1 items-center gap-2.5 px-3">
          <MapPin className="size-4 shrink-0 text-white/40" />
          <span className="sr-only">Location or remote</span>
          <input
            type="text"
            name="location"
            placeholder="Location or Remote"
            className="h-11 w-full min-w-0 bg-transparent text-sm text-white outline-none placeholder:text-white/40"
          />
        </label>

        <span aria-hidden="true" className="hidden h-6 w-px shrink-0 bg-white/10 sm:block" />

        <label className="relative flex min-w-0 items-center gap-2.5 px-3 sm:max-w-[190px]">
          <LayoutGrid className="size-4 shrink-0 text-white/40" />
          <span className="sr-only">Job category</span>
          <select
            name="category"
            defaultValue=""
            className="h-11 w-full min-w-0 appearance-none bg-transparent pr-6 text-sm text-white/70 outline-none [&>option]:bg-[#0d0d10] [&>option]:text-white"
          >
            <option value="">All categories</option>
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 size-4 text-white/35" />
        </label> */}

        <button
          type="submit"
          className="inline-flex h-11 w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 text-sm font-medium text-white transition-colors hover:bg-indigo-500 focus-visible:ring-3 focus-visible:ring-indigo-400/60 focus-visible:outline-none sm:ml-1 sm:w-auto"
        >
          <Search className="size-4" />
          Search
        </button>
      </form>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="mr-1 text-xs text-white/40">Trending</span>
        {trendingRoles.map((role) => (
          <button
            key={role}
            type="button"
            onClick={() => handleTrendingRole(role)}
            className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-white/65 transition-colors hover:border-white/20 hover:text-white"
          >
            {role}
          </button>
        ))}
      </div>
    </div>
  )
}
