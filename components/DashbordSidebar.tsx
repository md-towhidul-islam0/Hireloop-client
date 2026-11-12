"use client"

import type { CSSProperties } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import type { LucideIcon } from "lucide-react"
import {
  Bookmark,
  Briefcase,
  Building2,
  FileText,
  LayoutDashboard,
  LogOut,
  PlusCircle,
  Settings,
  Users,
  Wallet,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import logo from "@/components/ui/images/logo.png"
import { authClient } from "@/lib/auth-client"
import { isUserRole, ROLE_OPTIONS, type UserRole } from "@/lib/roles"

/* -------------------------------------------------------------------------- */
/*                              Navigation config                             */
/* -------------------------------------------------------------------------- */

type NavItem = {
  label: string
  href: string
  icon: LucideIcon
}

const ROLE_HOME: Record<UserRole, string> = {
  seeker: "/dashbord/seeker",
  recruiter: "/dashbord/recruiter",
  admin: "/dashbord/admin",
}

const NAV_ITEMS: Record<UserRole, NavItem[]> = {
  seeker: [
    { label: "Dashboard", href: "/dashbord/seeker", icon: LayoutDashboard },
    { label: "Jobs", href: "/dashbord/seeker/jobs", icon: Briefcase },
    { label: "Saved Jobs", href: "/dashbord/seeker/saved", icon: Bookmark },
    {
      label: "Applications",
      href: "/dashbord/seeker/applications",
      icon: FileText,
    },
    { label: "Billing", href: "/dashbord/seeker/billing", icon: Wallet },
    { label: "Settings", href: "/dashbord/seeker/settings", icon: Settings },
  ],
  recruiter: [
    { label: "Dashboard", href: "/dashbord/recruiter", icon: LayoutDashboard },
    {
      label: "Add Job",
      href: "/dashbord/recruiter/add-jobs",
      icon: PlusCircle,
    },
    {
      label: "My Company",
      href: "/dashbord/recruiter/company",
      icon: Building2,
    },
    { label: "Manage Jobs", href: "/dashbord/recruiter/all-jobs", icon: Briefcase },
    {
      label: "Applications",
      href: "/dashbord/recruiter/applications",
      icon: FileText,
    },
    { label: "Settings", href: "/dashbord/recruiter/settings", icon: Settings },
  ],
  admin: [
    { label: "Dashboard", href: "/dashbord/admin", icon: LayoutDashboard },
    { label: "Users", href: "/dashbord/admin/users", icon: Users },
    { label: "Companies", href: "/dashbord/admin/companies", icon: Building2 },
    { label: "Jobs", href: "/dashbord/admin/jobs", icon: Briefcase },
    { label: "Payments", href: "/dashbord/admin/payments", icon: Wallet },
    { label: "Settings", href: "/dashbord/admin/settings", icon: Settings },
  ],
}

/* -------------------------------------------------------------------------- */
/*                                Style tokens                                */
/* -------------------------------------------------------------------------- */

/** Figma sidebar tokens: 248px wide, #0B0B0C surface, 34px nav rows. */
const sidebarStyle = {
  "--sidebar-width": "248px",
  "--sidebar": "#0B0B0C",
  "--sidebar-foreground": "#A1A4AA",
  "--sidebar-accent": "#232327",
  "--sidebar-accent-foreground": "#F4F4F5",
  "--sidebar-border": "rgba(255, 255, 255, 0.07)",
  borderRightWidth: 0,
} as CSSProperties

const navItemClassName =
  "h-[34px] gap-2.5 rounded-md px-2.5 text-[13px] font-medium text-[#A1A4AA] transition-colors hover:bg-white/[0.04] hover:text-[#F4F4F5] [&_svg]:size-[18px] [&_svg]:shrink-0"

const activeNavItemClassName =
  "bg-[#232327] text-[#F4F4F5] hover:bg-[#232327] hover:text-[#F4F4F5] before:absolute before:top-1/2 before:left-0 before:h-4 before:w-0.5 before:-translate-y-1/2 before:rounded-full before:bg-[#5C53FE]"

/* -------------------------------------------------------------------------- */
/*                                Subcomponents                               */
/* -------------------------------------------------------------------------- */

const getInitials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase()

const getRoleLabel = (role: UserRole) =>
  ROLE_OPTIONS.find((option) => option.value === role)?.label ?? "Job Seeker"

function UserCard({ name, roleLabel }: { name: string; roleLabel: string }) {
  return (
    <div className="mt-4 flex min-h-[66px] items-center gap-3 border border-white/[0.06] bg-[#141416] px-[10px] py-2.5">
      <span
        aria-hidden="true"
        className="flex size-8 shrink-0 items-center justify-center rounded-full border border-white/[0.09] bg-[#232327] text-[11px] font-semibold text-[#F4F4F5]"
      >
        {getInitials(name)}
      </span>
      <div className="flex min-w-0 flex-col gap-0.5">
        <span className="truncate text-[14px] leading-5 font-semibold text-[#F4F4F5]">
          {name}
        </span>
        <span className="truncate text-[12px] leading-4 text-[#A1A4AA]">
          {roleLabel}
        </span>
      </div>
    </div>
  )
}

function UserCardSkeleton() {
  return (
    <div className="mt-4 flex min-h-[66px] items-center gap-3 border border-white/[0.06] bg-[#141416] px-[10px] py-2.5">
      <span className="size-8 shrink-0 animate-pulse rounded-full bg-white/[0.06]" />
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <span className="h-3.5 w-24 animate-pulse rounded-sm bg-white/[0.06]" />
        <span className="h-3 w-16 animate-pulse rounded-sm bg-white/[0.06]" />
      </div>
    </div>
  )
}

function NavMenu({
  items,
  pathname,
  homeHref,
}: {
  items: NavItem[]
  pathname: string
  homeHref: string
}) {
  const isActive = (href: string) =>
    href === homeHref
      ? pathname === href
      : pathname === href || pathname.startsWith(`${href}/`)

  return (
    <SidebarContent className="bg-[#0B0B0C]">
      <SidebarGroup className="px-3 py-1">
        <SidebarMenu className="gap-0.5">
          {items.map((item) => {
            const active = isActive(item.href)
            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  render={<Link href={item.href} />}
                  isActive={active}
                  className={
                    active
                      ? `${navItemClassName} ${activeNavItemClassName}`
                      : navItemClassName
                  }
                >
                  <item.icon strokeWidth={1.75} />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroup>
    </SidebarContent>
  )
}

function NavSkeleton() {
  return (
    <SidebarContent className="bg-[#0B0B0C]">
      <SidebarGroup className="px-3 py-1">
        <div className="flex flex-col gap-0.5">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="h-[34px] animate-pulse rounded-md bg-white/[0.04]"
            />
          ))}
        </div>
      </SidebarGroup>
    </SidebarContent>
  )
}

function RoleMismatchNotice({
  currentRole,
  requestedRole,
  homeHref,
}: {
  currentRole: UserRole
  requestedRole: UserRole
  homeHref: string
}) {
  return (
    <SidebarContent className="bg-[#0B0B0C]">
      <SidebarGroup className="px-3 py-1">
        <div className="flex flex-col gap-2 border border-white/[0.06] bg-[#141416] p-3">
          <p className="text-[13px] leading-5 font-medium text-[#F4F4F5]">
            Role mismatch
          </p>
          <p className="text-[12px] leading-4 text-[#A1A4AA]">
            This dashboard is for {getRoleLabel(requestedRole)} accounts, but
            you are signed in as a {getRoleLabel(currentRole)}.
          </p>
          <Link
            href={homeHref}
            className="text-[12px] leading-4 font-medium text-[#8F88FF] transition-colors hover:text-[#B3ADFF]"
          >
            Go to my dashboard
          </Link>
        </div>
      </SidebarGroup>
    </SidebarContent>
  )
}

/* -------------------------------------------------------------------------- */
/*                                  Sidebar                                   */
/* -------------------------------------------------------------------------- */

export function DashbordSidebar() {
  const { data: session, isPending } = authClient.useSession()
  const pathname = usePathname()
  const router = useRouter()

  const role: UserRole = isUserRole(session?.user?.role)
    ? session.user.role
    : "seeker"
  const roleLabel = getRoleLabel(role)
  const homeHref = ROLE_HOME[role]
  const userName = session?.user?.name

  // /dashbord/seeker, /dashbord/recruiter, /dashbord/admin (and nested routes).
  const segments = pathname.split("/")
  const requestedRole =
    segments[1] === "dashbord" && isUserRole(segments[2]) ? segments[2] : null
  const mismatchRole =
    session?.user && requestedRole && requestedRole !== role
      ? requestedRole
      : null

  const handleSignOut = async () => {
    await authClient.signOut()
    router.push("/")
  }

  return (
    <Sidebar style={sidebarStyle}>
      <SidebarHeader className="bg-[#0B0B0C] px-3 pt-5 pb-4">
        <Link href="/" aria-label="Hireloop home" className="flex items-center">
          <Image src={logo} alt="Hireloop" priority className="h-8 w-auto" />
        </Link>

        {isPending ? (
          <UserCardSkeleton />
        ) : userName ? (
          <UserCard name={userName} roleLabel={roleLabel} />
        ) : null}
      </SidebarHeader>

      {isPending ? (
        <NavSkeleton />
      ) : mismatchRole ? (
        <RoleMismatchNotice
          currentRole={role}
          requestedRole={mismatchRole}
          homeHref={homeHref}
        />
      ) : (
        <NavMenu items={NAV_ITEMS[role]} pathname={pathname} homeHref={homeHref} />
      )}

      <SidebarFooter className="mt-auto bg-[#0B0B0C] px-3 pt-2 pb-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleSignOut}
              className={navItemClassName}
            >
              <LogOut strokeWidth={1.75} />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
