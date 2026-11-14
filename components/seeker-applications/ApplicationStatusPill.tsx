import { cn } from "@/lib/utils"
import type { ApplicationStatus } from "@/lib/seeker-applications"

const statusStyles: Record<ApplicationStatus, string> = {
  Applied: "border-white/[0.10] bg-[#A1A4AA]/[0.14] text-[#A0A0AB]",
  Review: "border-[#F59E0B]/30 bg-[#F59E0B]/[0.14] text-[#F59E0B]",
  Shortlisted: "border-[#60A5FA]/30 bg-[#60A5FA]/[0.14] text-[#60A5FA]",
  Interview: "border-[#A78BFA]/30 bg-[#A78BFA]/[0.14] text-[#A78BFA]",
  Rejected: "border-[#EF4444]/30 bg-[#EF4444]/[0.14] text-[#EF4444]",
  Offered: "border-[#22C55E]/30 bg-[#22C55E]/[0.14] text-[#22C55E]",
}

interface ApplicationStatusPillProps {
  status: ApplicationStatus
  className?: string
}

export function ApplicationStatusPill({
  status,
  className,
}: ApplicationStatusPillProps) {
  return (
    <span
      className={cn(
        "inline-flex h-[22px] items-center rounded-full border px-[11px] text-xs leading-4 font-medium whitespace-nowrap",
        statusStyles[status],
        className
      )}
    >
      {status}
    </span>
  )
}
