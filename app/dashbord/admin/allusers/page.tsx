import { headers } from "next/headers"
import Link from "next/link"

import UsersTable, {
  type AdminUserRow,
} from "@/components/admin/UsersTable"
import { auth } from "@/lib/auth"
import { admingetUsers } from "@/lib/dataManu"

const toRow = (user: {
  id: string
  name?: string | null
  email?: string | null
  role?: string | null
  createdAt?: Date | string | null
  banned?: boolean | null
}): AdminUserRow => ({
  id: user.id,
  name: user.name?.trim() || "Unnamed user",
  email: user.email || "—",
  role: user.role ?? null,
  joinedAt:
    user.createdAt instanceof Date
      ? user.createdAt.toISOString()
      : user.createdAt || "",
  banned: Boolean(user.banned),
})

const Page = async () => {
  let users: AdminUserRow[] = []
  let errorMessage: string | null = null

  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) {
    errorMessage = "Please sign in with an admin account to view users."
  } else if (session.user.role !== "admin") {
    errorMessage = "You need admin access to view users."
  } else {
    try {
      users = (await admingetUsers()).map(toRow)
    } catch (error) {
      errorMessage =
        error instanceof Error ? error.message : "Unable to load users."
    }
  }

  return (
    <div className="min-h-screen bg-[#0B0B0C] px-4 py-10 font-sans text-white sm:px-6 lg:px-8 lg:py-14">
      <div className="mx-auto w-full max-w-[1200px]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold tracking-[1.2px] text-[#C3C0FF] uppercase">
              Admin
            </p>
            <h1 className="mt-2 text-2xl font-bold tracking-[-0.02em] sm:text-[28px]">
              Users
            </h1>
            <p className="mt-2 text-[13px] text-[#7E7E86]">
              Manage accounts and control who can access HireLoop.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start rounded-xl border border-[#232327] bg-[#151516] px-4 py-2.5">
            <span className="size-2 rounded-full bg-emerald-400" />
            <span className="text-[12px] text-[#A0A0AB]">
              <span className="font-semibold text-[#F4F4F5]">{users.length}</span>{" "}
              registered
            </span>
          </div>
        </div>

        {errorMessage ? (
          <div className="mt-8 rounded-2xl border border-rose-400/25 bg-rose-500/[0.07] p-6 text-sm text-rose-200">
            {errorMessage}
          </div>
        ) : (
          <UsersTable users={users} />
        )}

        <div className="mt-8">
          <Link
            href="/dashbord/admin"
            className="inline-flex h-9 items-center rounded-lg bg-white/[0.04] px-3 text-xs font-medium text-[#A0A0AB] transition-colors hover:bg-white/[0.08] hover:text-white"
          >
            ← Back to admin dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Page
