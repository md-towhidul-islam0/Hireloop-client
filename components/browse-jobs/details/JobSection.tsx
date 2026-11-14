import type { LucideIcon } from "lucide-react"

interface JobSectionProps {
  title: string
  icon: LucideIcon
  children: React.ReactNode
}

/** Card-style content block used for every section of the job description. */
export function JobSection({ title, icon: Icon, children }: JobSectionProps) {
  return (
    <section className="rounded-2xl border border-white/10 bg-[#0c0c0e] p-5 shadow-[0_20px_50px_-30px_rgba(0,0,0,0.9)] sm:p-6">
      <h2 className="flex items-center gap-2.5 text-base font-semibold text-white">
        <span className="grid size-8 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/[0.04]">
          <Icon className="size-4 text-indigo-300" />
        </span>
        {title}
      </h2>
      <div className="mt-4 text-sm leading-relaxed text-white/60">
        {children}
      </div>
    </section>
  )
}

interface BulletListProps {
  items: string[]
  emptyLabel: string
}

export function BulletList({ items, emptyLabel }: BulletListProps) {
  if (items.length === 0) {
    return <p className="text-white/40">{emptyLabel}</p>
  }

  return (
    <ul className="space-y-2.5">
      {items.map((item, index) => (
        <li key={`${index}-${item.slice(0, 24)}`} className="flex gap-2.5">
          <span
            aria-hidden="true"
            className="mt-[7px] size-1.5 shrink-0 rounded-full bg-indigo-400/70"
          />
          <span className="min-w-0">{item}</span>
        </li>
      ))}
    </ul>
  )
}

/** Splits a backend free-text field into a list of lines / bullets. */
export function toList(value?: string) {
  if (!value) return []

  return value
    .split(/\r?\n|·|•/)
    .map((item) => item.replace(/^\s*[-*]\s*/, "").trim())
    .filter(Boolean)
}
