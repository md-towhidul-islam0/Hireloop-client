"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"

interface ApplicationsPaginationProps {
  page: number
  pageCount: number
  total: number
  pageSize: number
  onPageChange: (page: number) => void
}

function getPageItems(page: number, pageCount: number) {
  if (pageCount <= 5) {
    return Array.from({ length: pageCount }, (_, index) => index + 1)
  }

  const pages = new Set([1, pageCount, page - 1, page, page + 1])
  const visible = [...pages]
    .filter((value) => value > 0 && value <= pageCount)
    .sort((a, b) => a - b)

  const items: Array<number | "ellipsis"> = []
  visible.forEach((value, index) => {
    const previous = visible[index - 1]
    if (previous && value - previous > 1) {
      items.push("ellipsis")
    }
    items.push(value)
  })

  return items
}

const controlClass =
  "inline-flex size-8 items-center justify-center rounded-lg border border-white/[0.08] text-[13px] font-medium text-[#A0A0AB] transition-colors hover:border-white/20 hover:text-[#EDEDEF] disabled:pointer-events-none disabled:opacity-40"

export function ApplicationsPagination({
  page,
  pageCount,
  total,
  pageSize,
  onPageChange,
}: ApplicationsPaginationProps) {
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1
  const end = Math.min(page * pageSize, total)
  const items = getPageItems(page, pageCount)

  return (
    <div className="flex flex-col gap-3 border-t border-white/[0.07] bg-[#1A1A1F] px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-[13px] leading-5 text-[#A0A0AB]">
        Showing {start}-{end} of {total}{" "}
        {total === 1 ? "application" : "applications"}
      </p>

      <nav aria-label="Application pages" className="flex items-center gap-1.5">
        <button
          type="button"
          aria-label="Previous page"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className={controlClass}
        >
          <ChevronLeft className="size-4" />
        </button>

        {items.map((item, index) =>
          item === "ellipsis" ? (
            <span
              key={`ellipsis-${index}`}
              className="inline-flex size-8 items-center justify-center text-[13px] text-[#6E6E78]"
            >
              …
            </span>
          ) : (
            <button
              key={item}
              type="button"
              aria-label={`Page ${item}`}
              aria-current={item === page ? "page" : undefined}
              onClick={() => onPageChange(item)}
              className={cn(
                "inline-flex size-8 items-center justify-center rounded-lg border text-[13px] font-medium transition-colors",
                item === page
                  ? "border-white bg-white text-[#0B0B0C]"
                  : "border-white/[0.08] text-[#A0A0AB] hover:border-white/20 hover:text-[#EDEDEF]"
              )}
            >
              {item}
            </button>
          )
        )}

        <button
          type="button"
          aria-label="Next page"
          disabled={page >= pageCount}
          onClick={() => onPageChange(page + 1)}
          className={controlClass}
        >
          <ChevronRight className="size-4" />
        </button>
      </nav>
    </div>
  )
}
