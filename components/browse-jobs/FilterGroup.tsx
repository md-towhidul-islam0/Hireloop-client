import { ChevronDown } from "lucide-react"

interface FilterGroupProps {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
}

/** Collapsible block used by the job filter sidebar. */
export function FilterGroup({
  title,
  children,
  defaultOpen = true,
}: FilterGroupProps) {
  return (
    <details
      open={defaultOpen}
      className="group border-b border-white/10 py-4 last:border-b-0"
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-medium text-white [&::-webkit-details-marker]:hidden">
        {title}
        <ChevronDown className="size-4 shrink-0 text-white/40 transition-transform group-open:rotate-180" />
      </summary>
      <div className="mt-3 space-y-1">{children}</div>
    </details>
  )
}
