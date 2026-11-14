"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import {
  Bell,
  Download,
  FileText,
  Search,
  SearchX,
  Settings,
} from "lucide-react"

import { ApplicationCard } from "./ApplicationCard"
import { ApplicationRow } from "./ApplicationRow"
import { ApplicationsPagination } from "./ApplicationsPagination"
import { StatCard } from "./StatCard"
import { cn } from "@/lib/utils"
import type { MyApplication } from "@/lib/seeker-applications"

type TabValue = "active" | "archived"

const PAGE_SIZE = 5

const tabs: Array<{ label: string; value: TabValue }> = [
  { label: "Active", value: "active" },
  { label: "Archived", value: "archived" },
]

const headerCellClass =
  "h-11 px-4 text-left text-xs leading-4 font-medium text-[#6E6E78]"

const getInitials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase() || "HL"

interface MyApplicationsProps {
  applications: MyApplication[]
  user: {
    name: string
    email: string
  }
}

export function MyApplications({ applications, user }: MyApplicationsProps) {
  const [query, setQuery] = useState("")
  const [tab, setTab] = useState<TabValue>("active")
  const [page, setPage] = useState(1)

  const stats = useMemo(() => {
    const total = applications.length
    const shortlisted = applications.filter(
      (application) => application.status === "Shortlisted"
    ).length
    const interviews = applications.filter(
      (application) => application.status === "Interview"
    ).length
    const offered = applications.filter(
      (application) => application.status === "Offered"
    ).length
    const successRate = total === 0 ? 0 : Math.round((offered / total) * 100)

    return { total, shortlisted, interviews, successRate }
  }, [applications])

  const filtered = useMemo(() => {
    const search = query.trim().toLowerCase()

    return applications.filter((application) => {
      const inTab =
        tab === "active"
          ? application.jobStatus === "Active"
          : application.jobStatus !== "Active"

      const matchesSearch =
        !search ||
        `${application.jobTitle} ${application.company}`
          .toLowerCase()
          .includes(search)

      return inTab && matchesSearch
    })
  }, [applications, query, tab])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, pageCount)
  const visibleApplications = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  )

  const handleSearchChange = (value: string) => {
    setQuery(value)
    setPage(1)
  }

  const handleTabChange = (value: TabValue) => {
    setTab(value)
    setPage(1)
  }

  const handleExport = () => {
    // Opens the browser print dialog, where "Save as PDF" is available.
    window.print()
  }

  const isEmpty = applications.length === 0
  const hasNoMatches = !isEmpty && filtered.length === 0
  const isSearching = query.trim().length > 0

  let emptyState: {
    title: string
    description: string
    action: "browse" | "clear" | null
  } | null = null

  if (isEmpty) {
    emptyState = {
      title: "No applications yet",
      description:
        "Once you apply to a role, it will show up here with its latest status.",
      action: "browse",
    }
  } else if (hasNoMatches && isSearching) {
    emptyState = {
      title: "No applications match your search",
      description:
        "Try a different keyword or switch between the Active and Archived tabs.",
      action: "clear",
    }
  } else if (hasNoMatches) {
    emptyState =
      tab === "archived"
        ? {
            title: "No archived applications",
            description:
              "Applications to closed or expired roles will appear here.",
            action: null,
          }
        : {
            title: "No active applications",
            description:
              "Applications to open roles will appear here once you apply.",
            action: "browse",
          }
  }

  return (
    <div className="min-h-svh bg-[#0E0E11] text-[#EDEDEF]">
      {/* Top bar with application search */}
      <div className="border-b border-white/[0.07]">
        <div className="mx-auto flex h-14 w-full max-w-[1184px] items-center gap-4 px-4 sm:px-6 lg:px-8">
          <label className="relative w-full max-w-[320px]">
            <span className="sr-only">Search applications</span>
            <Search className="pointer-events-none absolute top-1/2 left-3 size-[15px] -translate-y-1/2 text-[#C4C7C8]" />
            <input
              type="search"
              value={query}
              onChange={(event) => handleSearchChange(event.target.value)}
              placeholder="Search applications..."
              className="h-9 w-full rounded-lg border border-white/[0.10] bg-[#0C0C0F] pr-3 pl-9 text-[13px] text-[#EDEDEF] outline-none transition-colors placeholder:text-[#828997] focus:border-white/25"
            />
          </label>

          <div className="ml-auto flex shrink-0 items-center gap-3">
            <button
              type="button"
              aria-label="Notifications"
              className="inline-flex size-8 items-center justify-center rounded-lg text-[#C4C7C8] transition-colors hover:bg-white/[0.04] hover:text-[#EDEDEF]"
            >
              <Bell className="size-[18px]" />
            </button>
            <button
              type="button"
              aria-label="Settings"
              className="inline-flex size-8 items-center justify-center rounded-lg text-[#C4C7C8] transition-colors hover:bg-white/[0.04] hover:text-[#EDEDEF]"
            >
              <Settings className="size-[18px]" />
            </button>
            <span
              title={user.email}
              aria-label={user.name}
              className="flex size-8 shrink-0 items-center justify-center rounded-full border border-white/[0.07] bg-[#222228] text-[11px] font-semibold text-[#EDEDEF]"
            >
              {getInitials(user.name)}
            </span>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[1184px] px-4 py-6 sm:px-6 lg:px-8">
        {/* Heading + view tabs + export */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <h1 className="text-[22px] leading-7 font-semibold tracking-tight text-[#EDEDEF]">
              My Applications
            </h1>
            <p className="mt-2 max-w-[420px] text-[13px] leading-5 text-[#A0A0AB]">
              Track your job applications and interview progress in real-time.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div
              role="tablist"
              aria-label="Application status"
              className="inline-flex h-[42px] items-center rounded-xl border border-white/[0.07] bg-[#1A1A1F] p-1"
            >
              {tabs.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  role="tab"
                  aria-selected={tab === item.value}
                  onClick={() => handleTabChange(item.value)}
                  className={cn(
                    "h-8 rounded-lg px-4 text-[13px] leading-5 font-medium transition-colors",
                    tab === item.value
                      ? "border border-white/[0.10] bg-[#232327] text-[#EDEDEF]"
                      : "text-[#A0A0AB] hover:text-[#EDEDEF]"
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={handleExport}
              className="inline-flex h-[42px] items-center gap-2 rounded-xl bg-[#FAFAFA] px-4 text-[13px] leading-5 font-medium text-[#0B0B0C] transition-colors hover:bg-white"
            >
              Export PDF
              <Download className="size-3.5" />
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4 xl:gap-6">
          <StatCard label="Total Applied" value={stats.total} />
          <StatCard label="Shortlisted" value={stats.shortlisted} />
          <StatCard
            label="Interviews"
            value={stats.interviews}
            tone="warning"
          />
          <StatCard
            label="Success Rate"
            value={`${stats.successRate}%`}
            tone="success"
          />
        </div>

        {emptyState ? (
          <div className="mt-6 flex flex-col items-center justify-center rounded-2xl border border-white/[0.07] bg-[#141418] px-6 py-16 text-center">
            <span className="flex size-12 items-center justify-center rounded-xl border border-white/[0.07] bg-[#1A1A1F]">
              {emptyState.action === "clear" ? (
                <SearchX className="size-5 text-[#6E6E78]" />
              ) : (
                <FileText className="size-5 text-[#6E6E78]" />
              )}
            </span>
            <p className="mt-4 text-sm leading-5 font-medium text-[#EDEDEF]">
              {emptyState.title}
            </p>
            <p className="mt-1 max-w-[360px] text-[13px] leading-5 text-[#A0A0AB]">
              {emptyState.description}
            </p>
            {emptyState.action === "browse" ? (
              <Link
                href="/browse-job"
                className="mt-5 inline-flex h-10 items-center justify-center rounded-xl bg-[#5C53FE] px-4 text-[13px] font-semibold text-white transition-colors hover:bg-[#6C64FF]"
              >
                Browse jobs
              </Link>
            ) : null}
            {emptyState.action === "clear" ? (
              <button
                type="button"
                onClick={() => {
                  handleSearchChange("")
                  handleTabChange("active")
                }}
                className="mt-5 inline-flex h-10 items-center justify-center rounded-xl border border-white/[0.07] bg-[#1A1A1F] px-4 text-[13px] font-medium text-[#EDEDEF] transition-colors hover:border-white/20"
              >
                Clear search
              </button>
            ) : null}
          </div>
        ) : (
          <div className="mt-6 overflow-hidden rounded-2xl border border-white/[0.07] bg-[#141418]">
            {/* Desktop table */}
            <div className="hidden xl:block">
              <table className="w-full table-fixed border-collapse">
                <colgroup>
                  <col className="w-[30%]" />
                  <col className="w-[20%]" />
                  <col className="w-[15%]" />
                  <col className="w-[17.5%]" />
                  <col className="w-[17.5%]" />
                </colgroup>
                <thead>
                  <tr className="border-b border-white/[0.07] bg-[#1A1A1F]">
                    <th scope="col" className={headerCellClass}>
                      Job Title
                    </th>
                    <th scope="col" className={headerCellClass}>
                      Company
                    </th>
                    <th scope="col" className={headerCellClass}>
                      Applied
                    </th>
                    <th scope="col" className={headerCellClass}>
                      Status
                    </th>
                    <th scope="col" className={cn(headerCellClass, "text-right")}>
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {visibleApplications.map((application) => (
                    <ApplicationRow
                      key={application.id}
                      application={application}
                    />
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile / tablet cards */}
            <div className="grid gap-3 p-4 xl:hidden">
              {visibleApplications.map((application) => (
                <ApplicationCard
                  key={application.id}
                  application={application}
                />
              ))}
            </div>

            <ApplicationsPagination
              page={currentPage}
              pageCount={pageCount}
              total={filtered.length}
              pageSize={PAGE_SIZE}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>
    </div>
  )
}
