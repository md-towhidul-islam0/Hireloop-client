"use client"

import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Check,
  ChevronDown,
  LoaderCircleIcon,
  Users,
} from "lucide-react"

import { updateApplicationStatus } from "@/lib/application-actions"
import {
  APPLICATION_STATUSES,
  DEFAULT_APPLICATION_STATUS,
  type ApplicationStatus,
} from "@/lib/application-status"
import { toast } from "@/components/ui/toast"
import { cn } from "@/lib/utils"

export interface Applicant {
  applicationId: string
  applicationIds: string[]
  applicationCount: number
  userID: string
  name: string
  email: string
  status: ApplicationStatus
  appliedAt: string | null
}

interface ApplicantsListProps {
  applicants: Applicant[]
  jobId: string
  jobTitle: string
}

const statusStyles: Record<
  ApplicationStatus,
  {
    dot: string
    text: string
    border: string
    background: string
    glow: string
    ring: string
    check: string
  }
> = {
  Pending: {
    dot: "bg-amber-400",
    text: "text-amber-300",
    border: "border-amber-400/30",
    background: "bg-amber-500/[0.10]",
    glow: "shadow-[0_0_0_3px_rgba(251,191,36,0.05)]",
    ring: "focus-within:ring-amber-400/25",
    check: "text-amber-300",
  },
  Shortlisted: {
    dot: "bg-violet-400",
    text: "text-violet-300",
    border: "border-violet-400/30",
    background: "bg-violet-500/[0.10]",
    glow: "shadow-[0_0_0_3px_rgba(167,139,250,0.05)]",
    ring: "focus-within:ring-violet-400/25",
    check: "text-violet-300",
  },
  Interview: {
    dot: "bg-sky-400",
    text: "text-sky-300",
    border: "border-sky-400/30",
    background: "bg-sky-500/[0.10]",
    glow: "shadow-[0_0_0_3px_rgba(56,189,248,0.05)]",
    ring: "focus-within:ring-sky-400/25",
    check: "text-sky-300",
  },
  Hired: {
    dot: "bg-emerald-400",
    text: "text-emerald-300",
    border: "border-emerald-400/30",
    background: "bg-emerald-500/[0.10]",
    glow: "shadow-[0_0_0_3px_rgba(52,211,153,0.05)]",
    ring: "focus-within:ring-emerald-400/25",
    check: "text-emerald-300",
  },
  Rejected: {
    dot: "bg-rose-400",
    text: "text-rose-300",
    border: "border-rose-400/30",
    background: "bg-rose-500/[0.10]",
    glow: "shadow-[0_0_0_3px_rgba(251,113,133,0.05)]",
    ring: "focus-within:ring-rose-400/25",
    check: "text-rose-300",
  },
}

const MENU_WIDTH = 188
const MENU_HEIGHT = 254

const headerCellClass =
  "px-3 py-4 text-left text-[11px] leading-4 font-semibold tracking-[0.5px] text-[#A0A0AB] 2xl:px-4 2xl:text-[12px]"

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
}

interface StatusSelectProps {
  id: string
  value: ApplicationStatus
  disabled: boolean
  open: boolean
  onOpenChange: (open: boolean) => void
  onChange: (status: ApplicationStatus) => void
  name: string
}

function StatusSelect({
  id,
  value,
  disabled,
  open,
  onOpenChange,
  onChange,
  name,
}: StatusSelectProps) {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ top: 0, left: 0 })
  const style = statusStyles[value]

  useEffect(() => {
    if (!open) return

    const placeMenu = () => {
      const rect = buttonRef.current?.getBoundingClientRect()
      if (!rect) return

      const gap = 6
      const top =
        rect.bottom + gap + MENU_HEIGHT > window.innerHeight
          ? Math.max(8, rect.top - gap - MENU_HEIGHT)
          : rect.bottom + gap
      const left = Math.min(
        Math.max(8, rect.right - MENU_WIDTH),
        Math.max(8, window.innerWidth - MENU_WIDTH - 8)
      )

      setPosition({ top, left })
    }

    placeMenu()

    const closeOnOutsideClick = (event: MouseEvent) => {
      const target = event.target as Node
      if (
        !buttonRef.current?.contains(target) &&
        !menuRef.current?.contains(target)
      ) {
        onOpenChange(false)
      }
    }
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onOpenChange(false)
    }
    const closeMenu = () => onOpenChange(false)

    document.addEventListener("mousedown", closeOnOutsideClick)
    document.addEventListener("keydown", closeOnEscape)
    window.addEventListener("scroll", closeMenu, true)
    window.addEventListener("resize", closeMenu)

    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick)
      document.removeEventListener("keydown", closeOnEscape)
      window.removeEventListener("scroll", closeMenu, true)
      window.removeEventListener("resize", closeMenu)
    }
  }, [open, onOpenChange, id])

  const toggle = () => {
    if (disabled) return
    if (!open) {
      const rect = buttonRef.current?.getBoundingClientRect()
      if (rect) {
        const gap = 6
        const top =
          rect.bottom + gap + MENU_HEIGHT > window.innerHeight
            ? Math.max(8, rect.top - gap - MENU_HEIGHT)
            : rect.bottom + gap
        const left = Math.min(
          Math.max(8, rect.right - MENU_WIDTH),
          Math.max(8, window.innerWidth - MENU_WIDTH - 8)
        )
        setPosition({ top, left })
      }
    }
    onOpenChange(!open)
  }

  const selectStatus = (status: ApplicationStatus) => {
    onOpenChange(false)
    if (status !== value) onChange(status)
  }

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        aria-label={`Application status for ${name}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? `status-menu-${id}` : undefined}
        disabled={disabled}
        onClick={toggle}
        className={cn(
          "group relative inline-flex h-9 w-[154px] items-center gap-2 overflow-hidden rounded-full border px-2.5 text-[12px] leading-5 font-semibold tracking-[0.01em] outline-none transition-all duration-200",
          "hover:-translate-y-px hover:brightness-110 active:translate-y-0",
          "focus-visible:ring-4 focus-visible:ring-[#C3C0FF]/20",
          "disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0",
          style.border,
          style.background,
          style.text,
          style.glow,
          style.ring
        )}
      >
        <span
          aria-hidden="true"
          className={cn(
            "relative flex size-4 shrink-0 items-center justify-center rounded-full",
            style.background
          )}
        >
          <span
            className={cn(
              "size-1.5 rounded-full shadow-[0_0_6px_currentColor]",
              style.dot
            )}
          />
        </span>

        <span className="min-w-0 flex-1 truncate text-left">{value}</span>

        {disabled ? (
          <LoaderCircleIcon
            aria-hidden="true"
            className="size-3.5 shrink-0 animate-spin opacity-60"
          />
        ) : (
          <ChevronDown
            aria-hidden="true"
            className={cn(
              "size-3.5 shrink-0 opacity-60 transition-transform duration-200",
              open && "rotate-180 opacity-100"
            )}
          />
        )}
      </button>

      {open &&
        createPortal(
          <div
            id={`status-menu-${id}`}
            ref={menuRef}
            role="listbox"
            aria-label={`Change application status for ${name}`}
            style={{ position: "fixed", top: position.top, left: position.left }}
            className="z-[100] w-[188px] overflow-hidden rounded-2xl border border-white/10 bg-[#141418]/95 p-1.5 shadow-[0_18px_40px_-18px_rgba(0,0,0,0.9)] backdrop-blur-xl"
          >
            <p className="px-2.5 pt-1.5 pb-2 text-[10px] font-semibold tracking-[0.8px] text-[#6E6E75] uppercase">
              Move to
            </p>
            {APPLICATION_STATUSES.map((status) => {
              const optionStyle = statusStyles[status]
              const selected = status === value

              return (
                <button
                  key={status}
                  type="button"
                  role="option"
                  aria-selected={selected}
                  onClick={() => selectStatus(status)}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-left text-[12px] font-medium transition-colors",
                    selected
                      ? "bg-white/[0.07] text-white"
                      : "text-white/60 hover:bg-white/[0.05] hover:text-white"
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "size-1.5 shrink-0 rounded-full shadow-[0_0_6px_currentColor]",
                      optionStyle.dot
                    )}
                  />
                  <span className="min-w-0 flex-1 truncate">{status}</span>
                  {selected && (
                    <Check
                      aria-hidden="true"
                      className={cn("size-3.5 shrink-0", optionStyle.check)}
                    />
                  )}
                </button>
              )
            })}
          </div>,
          document.body
        )}
    </>
  )
}

export function ApplicantsList({
  applicants,
  jobId,
  jobTitle,
}: ApplicantsListProps) {
  const router = useRouter()
  const [overrides, setOverrides] = useState<Record<string, ApplicationStatus>>(
    {}
  )
  const [updatingIds, setUpdatingIds] = useState<string[]>([])
  const [openMenu, setOpenMenu] = useState<string | null>(null)

  const rows = applicants.map((applicant) => ({
    ...applicant,
    status: overrides[applicant.applicationId] ?? applicant.status,
  }))

  const handleStatusChange = async (
    applicant: Applicant,
    nextStatus: ApplicationStatus
  ) => {
    const previousStatus = applicant.status
    const { applicationId, applicationIds } = applicant

    setOverrides((current) => ({ ...current, [applicationId]: nextStatus }))
    setUpdatingIds((current) => [...current, applicationId])

    const result = await updateApplicationStatus(
      applicationIds,
      nextStatus,
      jobId
    )

    setUpdatingIds((current) =>
      current.filter((id) => id !== applicationId)
    )

    if (!result.ok) {
      setOverrides((current) => {
        const next = { ...current }
        if (previousStatus === DEFAULT_APPLICATION_STATUS) {
          delete next[applicationId]
        } else {
          next[applicationId] = previousStatus
        }
        return next
      })
      toast.add({
        type: "error",
        title: "Status not updated",
        description: result.error,
      })
      return
    }

    toast.add({
      type: "success",
      title: "Status updated",
      description: `${applicant.name} is now marked ${nextStatus}.`,
    })
    router.refresh()
  }

  const renderStatusSelect = (applicant: (typeof rows)[number], layout: string) => (
    <StatusSelect
      id={`${applicant.applicationId}-${layout}`}
      name={applicant.name}
      value={applicant.status}
      disabled={updatingIds.includes(applicant.applicationId)}
      open={openMenu === `${applicant.applicationId}-${layout}`}
      onOpenChange={(open) =>
        setOpenMenu(
          open ? `${applicant.applicationId}-${layout}` : null
        )
      }
      onChange={(status) => handleStatusChange(applicant, status)}
    />
  )

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">
            Applicants
            <span className="ml-2 text-sm font-normal text-[#A0A0AB]">
              {rows.length} {rows.length === 1 ? "candidate" : "candidates"}
            </span>
          </h2>
          <p className="mt-1 text-xs text-[#A0A0AB]">
            Change a status to move a candidate through your hiring pipeline.
          </p>
        </div>
      </div>

      {rows.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-[16px] border border-[#232327] bg-[#151516] px-6 py-16 text-center">
          <span className="grid size-12 place-items-center rounded-xl bg-[#232327] text-[#C3C0FF]">
            <Users className="size-6" />
          </span>
          <p className="mt-2 text-base font-medium text-white">No applicants yet</p>
          <p className="max-w-sm text-sm leading-[22px] text-[#A0A0AB]">
            When seekers apply to {jobTitle}, they&apos;ll show up here with
            their application status.
          </p>
        </div>
      ) : (
        <>
          {/* Cards below xl */}
          <div className="grid gap-3 xl:hidden">
            {rows.map((applicant) => (
              <article
                key={applicant.applicationId}
                className="flex flex-col gap-4 rounded-[16px] border border-[#232327] bg-[#151516] p-4 shadow-[0_8px_10px_-6px_rgba(0,0,0,0.45),0_20px_25px_-5px_rgba(0,0,0,0.4)]"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[#5C53FE]/20 text-xs font-semibold text-[#C3C0FF]">
                    {getInitials(applicant.name)}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-white">
                      {applicant.name}
                    </p>
                    <p className="truncate text-xs text-[#A0A0AB]">
                      {applicant.email}
                    </p>
                    {applicant.applicationCount > 1 && (
                      <p className="mt-1 inline-flex rounded-full bg-white/[0.05] px-2 py-0.5 text-[10px] font-medium text-[#A0A0AB]">
                        {applicant.applicationCount} applications
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 border-t border-[#232327] pt-4">
                  <div className="min-w-0">
                    <p className="text-[10px] font-medium tracking-[0.6px] text-[#5A5A60] uppercase">
                      Applied
                    </p>
                    <p className="mt-0.5 text-[13px] text-white">
                      {applicant.appliedAt ?? "—"}
                    </p>
                  </div>
                  {renderStatusSelect(applicant, "card")}
                </div>
              </article>
            ))}
          </div>

          {/* Table at xl and up */}
          <div className="hidden overflow-hidden rounded-[16px] border border-[#232327] bg-[#151516] shadow-[0_8px_10px_-6px_rgba(0,0,0,0.45),0_20px_25px_-5px_rgba(0,0,0,0.4)] xl:block">
            <div className="overflow-x-auto">
              <table className="w-full table-fixed border-collapse">
                <colgroup>
                  <col className="w-[44%]" />
                  <col className="w-[20%]" />
                  <col className="w-[36%]" />
                </colgroup>
                <thead>
                  <tr className="border-b border-[#232327] bg-[#0B0B0C]">
                    <th scope="col" className={headerCellClass}>
                      APPLICANT
                    </th>
                    <th scope="col" className={headerCellClass}>
                      APPLIED
                    </th>
                    <th scope="col" className={headerCellClass}>
                      APPLICATION STATUS
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((applicant) => (
                    <tr
                      key={applicant.applicationId}
                      className="border-b border-[#232327] transition-colors last:border-b-0 hover:bg-white/[0.015]"
                    >
                      <td className="px-3 py-4 2xl:px-4">
                        <div className="flex min-w-0 items-center gap-3">
                          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[#5C53FE]/20 text-[11px] font-semibold text-[#C3C0FF]">
                            {getInitials(applicant.name)}
                          </span>
                          <div className="min-w-0">
                            <p className="truncate text-sm leading-5 font-semibold text-white">
                              {applicant.name}
                            </p>
                            <p className="truncate text-xs leading-5 text-[#A0A0AB]">
                              {applicant.email}
                            </p>
                            {applicant.applicationCount > 1 && (
                              <p className="mt-1 inline-flex rounded-full bg-white/[0.05] px-2 py-0.5 text-[10px] font-medium text-[#A0A0AB]">
                                {applicant.applicationCount} applications
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-4 text-[13px] leading-5 text-white 2xl:px-4">
                        {applicant.appliedAt ?? "—"}
                      </td>
                      <td className="px-3 py-4 2xl:px-4">
                        {renderStatusSelect(applicant, "table")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      <div>
        <Link
          href="/dashbord/recruiter/all-jobs"
          className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-white/[0.04] px-3 text-xs font-medium text-[#A0A0AB] transition-colors hover:bg-white/[0.08] hover:text-white"
        >
          ← Back to manage jobs
        </Link>
      </div>
    </div>
  )
}
