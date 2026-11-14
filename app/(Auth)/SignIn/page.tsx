"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import {
  AlertCircleIcon,
  ArrowRightIcon,
  EyeIcon,
  EyeOffIcon,
  LoaderCircleIcon,
  LockIcon,
  MailIcon,
} from "lucide-react"

import AuthLayout from "@/components/AuthLayout"
import { authClient } from "@/lib/auth-client"

const inputClass =
  "h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] pl-11 pr-4 text-sm text-white placeholder:text-white/30 outline-none transition focus:border-indigo-500/60 focus:ring-4 focus:ring-indigo-500/15"

const SignInPage = () => {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [remember, setRemember] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const searchParams=useSearchParams();
  const redirectTo=searchParams.get("redirectTo") ?? '/'

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { error: signInError } = await authClient.signIn.email({
        email,
        password,
        rememberMe: remember,
      })

      if (signInError) {
        setError(signInError.message || "Unable to sign in. Please try again.")
        return
      }

      router.push(redirectTo)
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
          Welcome back
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">
          Sign in to HireLoop
        </h1>
        <p className="mt-2 text-sm text-white/50">
          Pick up where you left off — your saved jobs are waiting.
        </p>

        <form onSubmit={handleSubmit} className="mt-7 space-y-4">
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
            <div className="mb-1.5 flex items-center justify-between gap-3">
              <label
                htmlFor="password"
                className="text-sm font-medium text-white/70"
              >
                Password
              </label>
            </div>
            <div className="relative">
              <LockIcon className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-white/35" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                required
                minLength={8}
                autoComplete="current-password"
                placeholder="••••••••"
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
          </div>

          <label className="flex cursor-pointer items-center gap-2.5 text-sm text-white/60 select-none">
            <input
              type="checkbox"
              checked={remember}
              onChange={(event) => setRemember(event.target.checked)}
              className="size-4 rounded border-white/20 accent-indigo-600"
            />
            Keep me signed in on this device
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
                Signing in…
              </>
            ) : (
              <>
                Sign in
                <ArrowRightIcon className="size-4" />
              </>
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-white/50">
          New to HireLoop?{" "}
          <Link
            href="/SignUp"
            className="font-medium text-indigo-400 transition-colors hover:text-indigo-300"
          >
            Create an account
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}

export default SignInPage
