"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { useRouter } from "next/navigation"
import {
  Check,
  ChevronDown,
  LoaderCircleIcon,
  Search,
  Users as UsersIcon,
} from "lucide-react"

import { toast } from "@/components/ui/toast"
import { updateUserRole } from "@/lib/admin-actions"
import { cn } from "@/lib/utils"
import { isUserRole, type UserRole } from "@/lib/roles"

export interface AdminUserRow {
  id: string
  name: string
  email: string
  role: string | null
  joinedAt: string
  banned: boolean
}

type RoleValue = UserRole | "unassigned"

const roleMeta: Record<
  RoleValue,
  {
    label: string
    description: string
    dot: string
    text: string
    border: string
    background: string
    check: string
  }
> = {
  seeker: {
    label: "Job Seeker",
    description: "Browse and apply to jobs",
    dot: "bg-[#8B85FF]",
    text: "text-[#C3C0FF]",
    border: "border-[#5C53FE]/30",
    background: "bg-[#5C53FE]/10",
    check: "text-[#C3C0FF]",
  },
  recruiter: {
    label: "Recruiter",
    description: "Post jobs and hire talent",
    dot: "bg-sky-400",
    text: "text-sky-300",
    border: "border-sky-400/30",
    background: "bg-sky-500/10",
    check: "text-sky-300",
  },
  admin: {
    label: "Admin",
    description: "Manage the platform",
    dot: "bg-emerald-400",
    text: "text-emerald-300",
    border: "border-emerald-400/30",
    background: "bg-emerald-500/10",
    check: "text-emerald-300",
  },
  unassigned: {
    label: "No role",
    description: "Assign a role to this user",
    dot: "bg-[#6E6E75]",
    text: "text-[#A0A0AB]",
    border: "border-white/10",
    background: "bg-white/[0.04]",
    check: "text-[#F4F4F5]",
  },
}

const ROLE_VALUES: RoleValue[] = [
  "seeker",
  "recruiter",
  "admin",
]

const MENU_WIDTH = 224
const MENU_HEIGHT = 196

const headerCellClass =
  "px-5 py-4 text-left text-[11px] leading-4 font-semibold tracking-[0.6px] text-[#6E6E75] uppercase"

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
}

function formatDate(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return "—"
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(date)
}

interface RoleSelectProps {
  id: string
  name: string
  value: RoleValue
  disabled: boolean
  open: boolean
  onOpenChange: (open: boolean) => void
  onChange: (role: UserRole) => void
}

function RoleSelect({
  id,
  name,
  value,
  disabled,
  open,
  onOpenChange,
  onChange,
}: RoleSelectProps) {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ top: 0, left: 0 })
  const style = roleMeta[value]

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

  useEffect(() => {
    if (!open) return

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
  }, [open, onOpenChange])

  const toggle = () => {
    if (disabled) return
    if (!open) placeMenu()
    onOpenChange(!open)
  }

  const selectRole = (role: RoleValue) => {
    onOpenChange(false)
    if (role !== "unassigned" && role !== value) onChange(role)
  }

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        aria-label={`Role for ${name}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? `role-menu-${id}` : undefined}
        disabled={disabled}
        onClick={toggle}
        className={cn(
          "group inline-flex h-9 w-[142px] items-center gap-2 rounded-full border px-2.5 text-[12px] leading-5 font-semibold tracking-[0.01em] outline-none transition-all duration-200",
          "hover:-translate-y-px hover:brightness-110 active:translate-y-0",
          "focus-visible:ring-4 focus-visible:ring-[#C3C0FF]/20",
          "disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0",
          style.border,
          style.background,
          style.text
        )}
      >
        <span className="flex size-4 shrink-0 items-center justify-center rounded-full">
          <span className={cn("size-1.5 rounded-full", style.dot)} />
        </span>
        <span className="min-w-0 flex-1 truncate text-left">{style.label}</span>
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
            id={`role-menu-${id}`}
            ref={menuRef}
            role="listbox"
            aria-label={`Change role for ${name}`}
            style={{ position: "fixed", top: position.top, left: position.left }}
            className="z-[100] w-[224px] overflow-hidden rounded-2xl border border-white/10 bg-[#141418]/95 p-1.5 shadow-[0_18px_40px_-18px_rgba(0,0,0,0.9)] backdrop-blur-xl"
          >
            <p className="px-2.5 pt-1.5 pb-2 text-[10px] font-semibold tracking-[0.8px] text-[#6E6E75] uppercase">
              Change role
            </p>
            {ROLE_VALUES.map((role) => {
              const option = roleMeta[role]
              const selected = role === value

              return (
                <button
                  key={role}
                  type="button"
                  role="option"
                  aria-selected={selected}
                  onClick={() => selectRole(role)}
                  className={cn(
                    "flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left transition-colors",
                    selected ? "bg-white/[0.06]" : "hover:bg-white/[0.04]"
                  )}
                >
                  <span
                    className={cn(
                      "grid size-7 shrink-0 place-items-center rounded-lg border",
                      option.border,
                      option.background
                    )}
                  >
                    <span className={cn("size-1.5 rounded-full", option.dot)} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[12px] font-medium text-[#F4F4F5]">
                      {option.label}
                    </span>
                    <span className="block truncate text-[11px] text-[#7E7E86]">
                      {option.description}
                    </span>
                  </span>
                  {selected && (
                    <Check
                      aria-hidden="true"
                      className={cn("size-3.5 shrink-0", option.check)}
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

export default function UsersTable({ users }: { users: AdminUserRow[] }) {
  const router = useRouter()
  const [search, setSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState<"all" | RoleValue>("all")
  const [overrides, setOverrides] = useState<Record<string, RoleValue>>({})
  const [updatingIds, setUpdatingIds] = useState<string[]>([])
  const [openMenu, setOpenMenu] = useState<string | null>(null)

  const rows = useMemo(
    () =>
      users.map((user) => ({
        ...user,
        role: (overrides[user.id] ??
          (isUserRole(user.role) ? user.role : "unassigned")) as RoleValue,
      })),
    [users, overrides]
  )

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    return rows.filter((user) => {
      const matchesQuery =
        !query ||
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query)
      const matchesRole = roleFilter === "all" || user.role === roleFilter
      return matchesQuery && matchesRole
    })
  }, [rows, search, roleFilter])

  const handleRoleChange = async (user: AdminUserRow, role: UserRole) => {
    const previousRole = rows.find((row) => row.id === user.id)?.role ?? "unassigned"

    setOverrides((current) => ({ ...current, [user.id]: role }))
    setUpdatingIds((current) => [...current, user.id])

    const result = await updateUserRole(user.id, role)

    setUpdatingIds((current) => current.filter((id) => id !== user.id))

    if (!result.ok) {
      setOverrides((current) => ({ ...current, [user.id]: previousRole }))
      toast.add({
        type: "error",
        title: "Role not updated",
        description: result.error,
      })
      return
    }

    toast.add({
      type: "success",
      title: "Role updated",
      description: `${user.name} is now ${roleMeta[role].label}.`,
    })
    router.refresh()
  }

  const renderRoleSelect = (user: (typeof rows)[number], layout: string) => (
    <RoleSelect
      id={`${user.id}-${layout}`}
      name={user.name}
      value={user.role}
      disabled={updatingIds.includes(user.id)}
      open={openMenu === `${user.id}-${layout}`}
      onOpenChange={(open) =>
        setOpenMenu(open ? `${user.id}-${layout}` : null)
      }
      onChange={(role) => handleRoleChange(user, role)}
    />
  )

  const roleCounts = useMemo(
    () => ({
      all: rows.length,
      seeker: rows.filter((user) => user.role === "seeker").length,
      recruiter: rows.filter((user) => user.role === "recruiter").length,
      admin: rows.filter((user) => user.role === "admin").length,
    }),
    [rows]
  )

  return (
    <>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-[320px]">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-[#6E6E75]"
          />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by name or email"
            aria-label="Search users"
            className="h-11 w-full rounded-xl border border-[#232327] bg-[#151516] pr-4 pl-10 text-[13px] text-[#F4F4F5] outline-none transition placeholder:text-[#6E6E75] focus:border-[#5C53FE]/50 focus:ring-4 focus:ring-[#5C53FE]/10"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <select
              value={roleFilter}
              onChange={(event) =>
                setRoleFilter(event.target.value as "all" | RoleValue)
              }
              aria-label="Filter by role"
              className="h-11 appearance-none rounded-xl border border-[#232327] bg-[#151516] pr-9 pl-3.5 text-[13px] font-medium text-[#D4D4D8] outline-none transition focus:border-[#5C53FE]/50"
            >
              <option value="all">All roles ({roleCounts.all})</option>
              <option value="seeker">Job Seekers ({roleCounts.seeker})</option>
              <option value="recruiter">Recruiters ({roleCounts.recruiter})</option>
              <option value="admin">Admins ({roleCounts.admin})</option>
            </select>
            <ChevronDown
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-[#6E6E75]"
            />
          </div>
          <span className="hidden text-[12px] text-[#6E6E75] sm:inline">
            {filtered.length} of {rows.length}
          </span>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-[#232327] bg-[#151516] p-10 text-center">
          <UsersIcon
            aria-hidden="true"
            className="mx-auto size-7 text-[#3A3A40]"
          />
          <p className="mt-3 text-sm font-medium text-[#D4D4D8]">
            No users found
          </p>
          <p className="mt-1 text-[12px] text-[#6E6E75]">
            Try a different search or role filter.
          </p>
        </div>
      ) : (
        <>
          <div className="mt-6 hidden overflow-hidden rounded-2xl border border-[#232327] bg-[#151516] xl:block">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] border-collapse">
                <thead>
                  <tr className="border-b border-[#232327] bg-[#101011]">
                    <th className={headerCellClass}>User</th>
                    <th className={headerCellClass}>Role</th>
                    <th className={headerCellClass}>Status</th>
                    <th className={headerCellClass}>Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b border-[#232327] transition-colors last:border-b-0 hover:bg-white/[0.015]"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <span
                            aria-hidden="true"
                            className="grid size-9 shrink-0 place-items-center rounded-xl border border-white/[0.07] bg-[#232327] text-[11px] font-semibold text-[#D4D4D8]"
                          >
                            {getInitials(user.name)}
                          </span>
                          <span className="min-w-0">
                            <span className="block truncate text-[13px] font-medium text-[#F4F4F5]">
                              {user.name}
                            </span>
                            <span className="block truncate text-[12px] text-[#7E7E86]">
                              {user.email}
                            </span>
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        {renderRoleSelect(user, "table")}
                      </td>
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-2 text-[12px] text-[#A0A0AB]">
                          <span
                            className={cn(
                              "size-1.5 rounded-full",
                              user.banned ? "bg-rose-400" : "bg-emerald-400"
                            )}
                          />
                          {user.banned ? "Banned" : "Active"}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-[12px] text-[#7E7E86]">
                        {formatDate(user.joinedAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-6 grid gap-3 xl:hidden">
            {filtered.map((user) => (
              <div
                key={user.id}
                className="rounded-2xl border border-[#232327] bg-[#151516] p-4"
              >
                <div className="flex items-start gap-3">
                  <span
                    aria-hidden="true"
                    className="grid size-9 shrink-0 place-items-center rounded-xl border border-white/[0.07] bg-[#232327] text-[11px] font-semibold text-[#D4D4D8]"
                  >
                    {getInitials(user.name)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-medium text-[#F4F4F5]">
                      {user.name}
                    </p>
                    <p className="truncate text-[12px] text-[#7E7E86]">
                      {user.email}
                    </p>
                  </div>
                  {renderRoleSelect(user, "card")}
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-[#232327] pt-3 text-[12px] text-[#7E7E86]">
                  <span className="inline-flex items-center gap-2">
                    <span
                      className={cn(
                        "size-1.5 rounded-full",
                        user.banned ? "bg-rose-400" : "bg-emerald-400"
                      )}
                    />
                    {user.banned ? "Banned" : "Active"}
                  </span>
                  <span>Joined {formatDate(user.joinedAt)}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  )
}
