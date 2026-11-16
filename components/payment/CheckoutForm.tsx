"use client"

import { useActionState, useEffect } from "react"
import {
  AlertCircleIcon,
  ChevronDown,
  CreditCard,
  LoaderCircleIcon,
  Lock,
} from "lucide-react"

import {
  startCheckout,
  type CheckoutState,
} from "@/app/payment/actions"
import { toast } from "@/components/ui/toast"
import { formatPrice, type PaymentPlan } from "@/lib/payments"
import { cn } from "@/lib/utils"

const initialCheckoutState: CheckoutState = {
  status: "idle",
  message: null,
}

const COUNTRIES = [
  "Bangladesh",
  "India",
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "Germany",
  "Netherlands",
  "Singapore",
  "Other",
]

const fieldClass =
  "h-11 w-full rounded-xl border border-white/10 bg-white/[0.04] px-3.5 text-sm text-white placeholder:text-white/30 outline-none transition focus:border-indigo-500/60 focus:ring-4 focus:ring-indigo-500/15"

const labelClass = "mb-1.5 block text-sm font-medium text-white/70"

interface CheckoutFormProps {
  plan: PaymentPlan
  defaultName: string
  defaultEmail: string
  redirectTo: string
  isSignedIn: boolean
}

export function CheckoutForm({
  plan,
  defaultName,
  defaultEmail,
  redirectTo,
  isSignedIn,
}: CheckoutFormProps) {
  const [state, formAction, isPending] = useActionState<CheckoutState, FormData>(
    startCheckout,
    initialCheckoutState
  )

  useEffect(() => {
    if (!state.message) return

    toast.add({
      type: state.status === "error" ? "error" : "info",
      title:
        state.status === "error"
          ? "Check your details"
          : "Stripe checkout coming soon",
      description: state.message,
    })
  }, [state])

  return (
    <form
      action={formAction}
      className="rounded-2xl border border-white/10 bg-[#0c0c0e] p-5 shadow-[0_24px_60px_-40px_rgba(0,0,0,0.9)] sm:p-6"
    >
      <input type="hidden" name="plan" value={plan.id} />
      <input type="hidden" name="redirectTo" value={redirectTo} />

      <h2 className="text-sm font-semibold text-white">Billing details</h2>
      <p className="mt-1 text-xs text-white/45">
        We&apos;ll use these details for your receipt and account.
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="name" className={labelClass}>
            Cardholder name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            minLength={2}
            autoComplete="name"
            defaultValue={defaultName}
            placeholder="Jane Cooper"
            className={fieldClass}
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="email" className={labelClass}>
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            defaultValue={defaultEmail}
            placeholder="you@example.com"
            className={fieldClass}
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="country" className={labelClass}>
            Billing country
          </label>
          <div className="relative">
            <select
              id="country"
              name="country"
              required
              defaultValue={COUNTRIES[0]}
              className={cn(
                fieldClass,
                "appearance-none pr-10 [&>option]:bg-[#0c0c0e] [&>option]:text-white"
              )}
            >
              {COUNTRIES.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
            <ChevronDown
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-white/35"
            />
          </div>
        </div>
      </div>

      <div className="mt-6 border-t border-white/10 pt-6">
        <h3 className="text-sm font-semibold text-white">Payment method</h3>

        <div className="mt-3 flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <span
            aria-hidden="true"
            className="grid size-10 shrink-0 place-items-center rounded-lg bg-indigo-500/10 text-indigo-300"
          >
            <CreditCard className="size-5" />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-medium text-white">
              Card payment via Stripe
            </p>
            <p className="mt-1 text-xs leading-5 text-white/45">
              You&apos;ll be redirected to Stripe&apos;s secure checkout to
              enter your card details.
            </p>
          </div>
          <span className="ml-auto shrink-0 rounded-full border border-white/10 px-2 py-0.5 text-[10px] font-medium tracking-wide text-white/40 uppercase">
            Stripe
          </span>
        </div>
      </div>

      {state.status !== "idle" && state.message ? (
        <p
          role={state.status === "error" ? "alert" : "status"}
          aria-live="polite"
          className={cn(
            "mt-4 flex items-start gap-2.5 rounded-lg border px-3.5 py-3 text-sm",
            state.status === "error"
              ? "border-red-500/25 bg-red-500/10 text-red-300"
              : "border-indigo-400/25 bg-indigo-500/10 text-indigo-200"
          )}
        >
          <AlertCircleIcon
            aria-hidden="true"
            className="mt-0.5 size-4 shrink-0"
          />
          <span>{state.message}</span>
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isPending}
        className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 text-sm font-semibold text-white transition-all hover:bg-indigo-500 focus-visible:ring-4 focus-visible:ring-indigo-500/30 focus-visible:outline-none active:translate-y-px disabled:pointer-events-none disabled:opacity-60"
      >
        {isPending ? (
          <>
            <LoaderCircleIcon className="size-4 animate-spin" />
            Connecting to Stripe…
          </>
        ) : (
          <>
            <Lock className="size-4" />
            Pay {formatPrice(plan.unitAmount, plan.currency)}
          </>
        )}
      </button>

      <p className="mt-3 text-center text-xs leading-5 text-white/40">
        {isSignedIn
          ? `${plan.interval === "year" ? "Yearly" : "Monthly"} subscription. Cancel anytime.`
          : "You'll be asked to sign in before checkout."}
      </p>
    </form>
  )
}
