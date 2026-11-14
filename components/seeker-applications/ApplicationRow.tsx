import Link from "next/link"

import { ApplicationStatusPill } from "./ApplicationStatusPill"
import { categoryIcons } from "@/components/browse-jobs/category-icons"
import type { MyApplication } from "@/lib/seeker-applications"

interface ApplicationRowProps {
  application: MyApplication
}

export function ApplicationRow({ application }: ApplicationRowProps) {
  const Icon = categoryIcons[application.categoryIcon]
  const detailsHref = `/browse-job/${application.jobID}`

  return (
    <tr className="h-16 border-b border-white/[0.07] transition-colors last:border-b-0 hover:bg-white/[0.015]">
      <td className="px-4">
        <div className="flex min-w-0 items-center gap-3">
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
          <div className="min-w-0">
            <p className="truncate text-[13px] leading-5 font-medium text-[#EDEDEF]">
              {application.jobTitle}
            </p>
            <p className="truncate text-xs leading-[17px] text-[#A0A0AB]">
              {application.jobType} • {application.workMode}
            </p>
          </div>
        </div>
      </td>

      <td className="px-4">
        <p className="truncate text-[13px] leading-5 text-[#EDEDEF]">
          {application.company}
        </p>
      </td>

      <td className="px-4">
        <p className="truncate text-[13px] leading-5 text-[#A0A0AB]">
          {application.appliedLabel}
        </p>
      </td>

      <td className="px-4">
        <ApplicationStatusPill status={application.status} />
      </td>

      <td className="px-4 text-right">
        {application.isJobAvailable ? (
          <Link
            href={detailsHref}
            className="text-[13px] leading-5 font-medium text-[#EDEDEF] transition-colors hover:text-[#C3C0FF]"
          >
            Details
          </Link>
        ) : (
          <span className="text-[13px] leading-5 text-[#6E6E78]">
            Unavailable
          </span>
        )}
      </td>
    </tr>
  )
}
