import { cn } from "@/lib/utils"

interface StatCardProps {
  label: string
  value: number | string
  tone?: "default" | "warning" | "success"
}

const valueTones = {
  default: "text-[#EDEDEF]",
  warning: "text-[#F59E0B]",
  success: "text-[#22C55E]",
}

export function StatCard({ label, value, tone = "default" }: StatCardProps) {
  return (
    <div className="flex min-w-0 flex-col gap-2 rounded-2xl border border-white/[0.07] bg-[#141418] px-5 py-3.5">
      <span className="truncate text-[13px] leading-5 text-[#A0A0AB]">
        {label}
      </span>
      <span
        className={cn(
          "truncate text-[26px] leading-8 font-semibold tracking-tight",
          valueTones[tone]
        )}
      >
        {value}
      </span>
    </div>
  )
}
