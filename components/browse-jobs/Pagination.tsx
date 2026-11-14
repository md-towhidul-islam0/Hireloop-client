"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"

interface PaginationProps {
  page: number
  pageCount: number
}

export function Pagination({ page, pageCount }: PaginationProps) {
  const handlePageChange = (nextPage: number) => {
    // TODO: update the `page` query param and refetch.
    console.log("Go to page:", nextPage)
  }

  const pages = Array.from({ length: pageCount }, (_, index) => index + 1)

  return (
    <nav
      aria-label="Job results pages"
      className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 sm:flex-row"
    >
      <button
        type="button"
        disabled={page <= 1}
        onClick={() => handlePageChange(page - 1)}
        className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.03] px-4 text-sm font-medium text-white/70 transition-colors hover:border-white/20 hover:text-white disabled:pointer-events-none disabled:opacity-40"
      >
        <ChevronLeft className="size-4" />
        Previous
      </button>

      <div className="flex items-center gap-1.5">
        {pages.map((pageNumber) => (
          <button
            key={pageNumber}
            type="button"
            aria-current={pageNumber === page ? "page" : undefined}
            onClick={() => handlePageChange(pageNumber)}
            className={cn(
              "inline-flex size-10 items-center justify-center rounded-xl border text-sm font-medium transition-colors",
              pageNumber === page
                ? "border-indigo-500/60 bg-indigo-600 text-white"
                : "border-white/10 bg-white/[0.03] text-white/60 hover:border-white/20 hover:text-white"
            )}
          >
            {pageNumber}
          </button>
        ))}
      </div>

      <button
        type="button"
        disabled={page >= pageCount}
        onClick={() => handlePageChange(page + 1)}
        className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.03] px-4 text-sm font-medium text-white/70 transition-colors hover:border-white/20 hover:text-white disabled:pointer-events-none disabled:opacity-40"
      >
        Next
        <ChevronRight className="size-4" />
      </button>
    </nav>
  )
}
