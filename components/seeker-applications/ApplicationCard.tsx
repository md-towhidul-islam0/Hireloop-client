import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

import { ApplicationStatusPill } from "./ApplicationStatusPill"
import { categoryIcons } from "@/components/browse-jobs/category-icons"
import type { MyApplication } from "@/lib/seeker-applications"

interface ApplicationCardProps {
  application: MyApplication
}

export function ApplicationCard({ application }: ApplicationCardProps) {
  const Icon = categoryIcons[application.categoryIcon]

  return (
    <article className="rounded-xl border border-white/[0.07] bg-[#141418] p-4">
      <div className="flex items-start gap-3">
        <span
          className="flex size-8 shrink-0 items-center justify-center rounded-[4px]"
          style={{ backgroundColor: `${application.categoryColor}1f` }}
          aria-hidden="true"
        >
          <Icon
            className="size-4"
            style={{ color: application.categoryColor }}
          />
        </span>

        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] leading-5 font-medium text-[#EDEDEF]">
            {application.jobTitle}
          </p>
          <p className="truncate text-xs leading-[17px] text-[#A0A0AB]">
            {application.jobType} • {application.workMode}
          </p>
        </div>

        <ApplicationStatusPill status={application.status} />
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-4 border-t border-white/[0.07] pt-3">
        <div className="min-w-0">
          <dt className="text-[10px] font-medium tracking-[0.6px] text-[#6E6E78] uppercase">
            Company
          </dt>
          <dd className="mt-1 truncate text-[13px] leading-5 text-[#EDEDEF]">
            {application.company}
          </dd>
        </div>
        <div className="min-w-0">
          <dt className="text-[10px] font-medium tracking-[0.6px] text-[#6E6E78] uppercase">
            Applied
          </dt>
          <dd className="mt-1 truncate text-[13px] leading-5 text-[#A0A0AB]">
            {application.appliedLabel}
          </dd>
        </div>
      </dl>

      <div className="mt-3 flex justify-end">
        {application.isJobAvailable ? (
          <Link
            href={`/browse-job/${application.jobID}`}
            className="inline-flex items-center gap-1 text-[13px] leading-5 font-medium text-[#EDEDEF] transition-colors hover:text-[#C3C0FF]"
          >
            Details
            <ArrowUpRight className="size-3.5" />
          </Link>
        ) : (
          <span className="text-[13px] leading-5 text-[#6E6E78]">
            Job unavailable
          </span>
        )}
      </div>
    </article>
  )
}
