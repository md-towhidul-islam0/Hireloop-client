"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  AlertCircleIcon,
  ArrowRightIcon,
  BriefcaseIcon,
  CheckIcon,
  EyeIcon,
  EyeOffIcon,
  LoaderCircleIcon,
  LockIcon,
  MailIcon,
  ShieldCheckIcon,
  UserIcon,
} from "lucide-react"

import AuthLayout from "@/components/AuthLayout"
import { authClient } from "@/lib/auth-client"
import { ROLE_OPTIONS, type UserRole } from "@/lib/roles"

const inputClass =
  "h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] pl-11 pr-4 text-sm text-white placeholder:text-white/30 outline-none transition focus:border-indigo-500/60 focus:ring-4 focus:ring-indigo-500/15"

const strengthLabels = ["Too short", "Weak", "Fair", "Good", "Strong"]
const strengthColors = [
  "bg-white/15",
  "bg-red-500",
  "bg-amber-500",
  "bg-sky-500",
  "bg-emerald-500",
]

const getPasswordStrength = (password: string) => {
  if (password.length === 0) return 0
  let score = 0
  if (password.length >= 8) score++
  if (/[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++
  return password.length >= 8 ? score : Math.min(score, 1)
}

const roleIcons: Record<UserRole, React.ReactNode> = {
  seeker: <UserIcon className="size-4" />,
  recruiter: <BriefcaseIcon className="size-4" />,
  admin: <ShieldCheckIcon className="size-4" />,
}

const SignUpPage = () => {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [role, setRole] = useState<UserRole | null>(null)
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [agreed, setAgreed] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const strength = useMemo(() => getPasswordStrength(password), [password])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    if (!role) {
      setError("Please choose the role you're signing up with.")
      return
    }

    if (password !== confirm) {
      setError("Passwords don't match.")
      return
    }

    if (!agreed) {
      setError("Please agree to the terms to continue.")
      return
    }

    setLoading(true)

    try {
      const {data, error: signUpError } = await authClient.signUp.email({
        name,
        email,
        password,
        role,
      })

      if (signUpError) {
        setError(signUpError.message || "Unable to create your account.")
        return
      }
      console.log(data);
      router.push("/")
      router.refresh()
    } catch {
      setError("Something went wrong. Please check your connection and retry.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout>
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.9)] backdrop-blur-xl sm:p-8">
        <p className="font-mono text-xs tracking-[0.24em] text-indigo-400 uppercase">
          Get started
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">
          Create your account
        </h1>
        <p className="mt-2 text-sm text-white/50">
          Free forever — start applying to thousands of roles today.
        </p>

        <form onSubmit={handleSubmit} className="mt-7 space-y-4">
          <div>
            <label
              htmlFor="name"
              className="mb-1.5 block text-sm font-medium text-white/70"
            >
              Full name
            </label>
            <div className="relative">
              <UserIcon className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-white/35" />
              <input
                id="name"
                type="text"
                name="name"
                required
                autoComplete="name"
                placeholder="Alex Morgan"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-sm font-medium text-white/70"
            >
              Email address
            </label>
            <div className="relative">
              <MailIcon className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-white/35" />
              <input
                id="email"
                type="email"
                name="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <span
              id="role-label"
              className="mb-1.5 block text-sm font-medium text-white/70"
            >
              I am joining as
            </span>
            <div
              role="radiogroup"
              aria-labelledby="role-label"
              className="space-y-2.5"
            >
              {ROLE_OPTIONS.map((option) => {
                const selected = role === option.value

                return (
                  <button
                    key={option.value}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => {
                      setRole(option.value)
                      setError(null)
                    }}
                    className={`flex w-full items-center gap-3 rounded-xl border px-3.5 py-3 text-left transition-all focus-visible:ring-4 focus-visible:outline-none ${
                      selected
                        ? "border-indigo-500/60 bg-indigo-500/10 ring-4 ring-indigo-500/15"
                        : "border-white/10 bg-white/[0.04] hover:border-white/25 hover:bg-white/[0.07] focus-visible:border-indigo-500/50 focus-visible:ring-indigo-500/15"
                    }`}
                  >
                    <span
                      className={`grid size-9 shrink-0 place-items-center rounded-lg transition-colors ${
                        selected
                          ? "bg-indigo-500 text-white"
                          : "bg-white/10 text-white/55"
                      }`}
                    >
                      {roleIcons[option.value]}
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-medium text-white/90">
                        {option.label}
                      </span>
                      <span className="mt-0.5 block truncate text-xs text-white/45">
                        {option.description}
                      </span>
                    </span>

                    <span
                      className={`grid size-5 shrink-0 place-items-center rounded-full border transition-all ${
                        selected
                          ? "border-indigo-400 bg-indigo-500 text-white"
                          : "border-white/25 text-transparent"
                      }`}
                    >
                      <CheckIcon className="size-3" />
                    </span>
                  </button>
                )
              })}
            </div>
            <p className="mt-1.5 text-xs text-white/40">
              This decides what you can do on HireLoop — you can&apos;t change it
              later.
            </p>
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-sm font-medium text-white/70"
            >
              Password
            </label>
            <div className="relative">
              <LockIcon className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-white/35" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                required
                minLength={8}
                autoComplete="new-password"
                placeholder="At least 8 characters"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className={`${inputClass} pr-12`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute top-1/2 right-3 grid size-7 -translate-y-1/2 place-items-center rounded-md text-white/40 transition-colors hover:bg-white/10 hover:text-white/80"
              >
                {showPassword ? (
                  <EyeOffIcon className="size-4" />
                ) : (
                  <EyeIcon className="size-4" />
                )}
              </button>
            </div>

            {password.length > 0 && (
              <div className="mt-2.5">
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4].map((step) => (
                    <span
                      key={step}
                      className={`h-1 flex-1 rounded-full transition-colors ${
                        strength >= step
                          ? strengthColors[strength]
                          : "bg-white/10"
                      }`}
                    />
                  ))}
                </div>
                <p className="mt-1.5 text-xs text-white/40">
                  {strengthLabels[strength]} — mix letters, numbers and symbols
                </p>
              </div>
            )}
          </div>

          <div>
            <label
              htmlFor="confirm"
              className="mb-1.5 block text-sm font-medium text-white/70"
            >
              Confirm password
            </label>
            <div className="relative">
              <LockIcon className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-white/35" />
              <input
                id="confirm"
                type={showPassword ? "text" : "password"}
                name="confirm"
                required
                minLength={8}
                autoComplete="new-password"
                placeholder="Repeat your password"
                value={confirm}
                onChange={(event) => setConfirm(event.target.value)}
                className={`${inputClass} pr-12 ${
                  confirm && confirm !== password
                    ? "border-red-500/50 focus:border-red-500/70 focus:ring-red-500/15"
                    : ""
                }`}
              />
              {confirm && confirm === password && (
                <CheckIcon className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-emerald-400" />
              )}
            </div>
            {confirm && confirm !== password && (
              <p className="mt-1.5 text-xs text-red-400">
                Passwords don&apos;t match yet.
              </p>
            )}
          </div>

          <label className="flex cursor-pointer items-start gap-2.5 text-sm text-white/60 select-none">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(event) => setAgreed(event.target.checked)}
              className="mt-0.5 size-4 shrink-0 rounded border-white/20 accent-indigo-600"
            />
            <span>
              I agree to the HireLoop Terms of Service and Privacy Policy.
            </span>
          </label>

          {error && (
            <p
              role="alert"
              className="flex items-start gap-2.5 rounded-lg border border-red-500/25 bg-red-500/10 px-3.5 py-3 text-sm text-red-300"
            >
              <AlertCircleIcon className="mt-0.5 size-4 shrink-0" />
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 text-sm font-semibold text-white transition-all hover:bg-indigo-500 focus-visible:ring-4 focus-visible:ring-indigo-500/30 focus-visible:outline-none active:translate-y-px disabled:pointer-events-none disabled:opacity-60"
          >
            {loading ? (
              <>
                <LoaderCircleIcon className="size-4 animate-spin" />
                Creating your account…
              </>
            ) : (
              <>
                Create account
                <ArrowRightIcon className="size-4" />
              </>
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-white/50">
          Already have an account?{" "}
          <Link
            href="/SignIn"
            className="font-medium text-indigo-400 transition-colors hover:text-indigo-300"
          >
            Sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}

export default SignUpPage
