/**
 * Single source of truth for the user roles supported by HireLoop.
 * Used by the sign-up form (client), the auth config (server) and stored
 * on the `role` field of the `user` document in MongoDB.
 */
export const USER_ROLES = ["seeker", "recruiter", "admin"] as const

export type UserRole = (typeof USER_ROLES)[number]

export const isUserRole = (value: unknown): value is UserRole =>
  typeof value === "string" && (USER_ROLES as readonly string[]).includes(value)

export const ROLE_OPTIONS: readonly {
  value: UserRole
  label: string
  description: string
}[] = [
  {
    value: "seeker",
    label: "Job Seeker",
    description: "Browse openings & apply to jobs",
  },
  {
    value: "recruiter",
    label: "Recruiter",
    description: "Post jobs & hire great talent",
  },
  {
    value: "admin",
    label: "Admin",
    description: "Manage & moderate the platform",
  },
]
