interface FilterChoiceProps {
  name: string
  value: string
  label: string
  type?: "checkbox" | "radio"
  count?: number
  defaultChecked?: boolean
}

/** Reusable checkbox / radio row with an optional result count. */
export function FilterChoice({
  name,
  value,
  label,
  type = "checkbox",
  count,
  defaultChecked,
}: FilterChoiceProps) {
  return (
    <label className="group flex cursor-pointer items-center justify-between gap-3 rounded-lg px-2 py-1.5 transition-colors hover:bg-white/[0.04]">
      <span className="flex min-w-0 items-center gap-2.5">
        <input
          type={type}
          name={name}
          value={value}
          defaultChecked={defaultChecked}
          className="size-4 shrink-0 cursor-pointer accent-indigo-500"
        />
        <span className="truncate text-sm text-white/65 transition-colors group-hover:text-white">
          {label}
        </span>
      </span>
      {count !== undefined ? (
        <span className="shrink-0 text-xs tabular-nums text-white/35">
          {count}
        </span>
      ) : null}
    </label>
  )
}
