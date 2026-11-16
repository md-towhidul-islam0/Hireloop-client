"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"

interface PaginationProps {
  page: number
  pageCount: number
}

type PageItem = number | "ellipsis"

function getPageItems(page: number, pageCount: number): PageItem[] {
  if (pageCount <= 7) {
    return Array.from({ length: pageCount }, (_, index) => index + 1)
  }

  const items: PageItem[] = [1]
  const start = Math.max(2, page - 1)
  const end = Math.min(pageCount - 1, page + 1)

  if (start > 2) items.push("ellipsis")
  for (let pageNumber = start; pageNumber <= end; pageNumber += 1) {
    items.push(pageNumber)
  }
  if (end < pageCount - 1) items.push("ellipsis")
  items.push(pageCount)

  return items
}

export function Pagination({ page, pageCount }: PaginationProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const handlePageChange = (nextPage: number) => {
    if (nextPage === page || nextPage < 1 || nextPage > pageCount) return

    const params = new URLSearchParams(searchParams.toString())
    if (nextPage <= 1) {
      params.delete("page")
    } else {
      params.set("page", String(nextPage))
    }

    const query = params.toString()
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false })
    document
      .getElementById("job-results")
      ?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  const pageItems = getPageItems(page, pageCount)

  return (
    <nav
      aria-label="Job results pages"
      className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 sm:flex-row"
    >
      <button
        type="button"
        aria-label="Previous page"
        disabled={page <= 1}
        onClick={() => handlePageChange(page - 1)}
        className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.03] px-4 text-sm font-medium text-white/70 transition-colors hover:border-white/20 hover:text-white disabled:pointer-events-none disabled:opacity-40"
      >
        <ChevronLeft className="size-4" />
        Previous
      </button>

      <div className="flex items-center gap-1.5">
        {pageItems.map((item, index) =>
          item === "ellipsis" ? (
            <span
              key={`ellipsis-${index}`}
              aria-hidden="true"
              className="inline-flex size-10 items-center justify-center text-sm text-white/40"
            >
              …
            </span>
          ) : (
            <button
              key={item}
              type="button"
              aria-label={`Page ${item}`}
              aria-current={item === page ? "page" : undefined}
              onClick={() => handlePageChange(item)}
              className={cn(
                "inline-flex size-10 items-center justify-center rounded-xl border text-sm font-medium transition-colors",
                item === page
                  ? "border-indigo-500/60 bg-indigo-600 text-white"
                  : "border-white/10 bg-white/[0.03] text-white/60 hover:border-white/20 hover:text-white"
              )}
            >
              {item}
            </button>
          )
        )}
      </div>

      <button
        type="button"
        aria-label="Next page"
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
