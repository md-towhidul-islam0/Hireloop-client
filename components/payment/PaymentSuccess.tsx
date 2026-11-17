import Link from "next/link"
import {
  ArrowRight,
  Check,
  CircleCheck,
  LayoutDashboard,
  Mail,
  ReceiptText,
  Sparkles,
} from "lucide-react"

import Navbar from "@/components/Navbar"
import { formatPrice, type PaymentCurrency } from "@/lib/payments"
import { GetSessionByserver } from "@/lib/core/apiget"

interface PaymentSuccessProps {
  email: string | null
  amountTotal: number | null
  currency: string | null
  planName: string
  receiptId: string | null
  dashboardHref: string
}

const primaryLinkClass =
  "inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 text-sm font-semibold text-white transition-all hover:bg-indigo-500 focus-visible:ring-4 focus-visible:ring-indigo-500/30 focus-visible:outline-none active:translate-y-px"

const secondaryLinkClass =
  "inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-6 text-sm font-medium text-white/75 transition-colors hover:border-white/20 hover:bg-white/[0.06] hover:text-white focus-visible:ring-4 focus-visible:ring-white/10 focus-visible:outline-none"

const steps = [
  {
    icon: Mail,
    title: "Confirmation email",
    description:
      "Your receipt is on its way — check your inbox (and spam folder).",
  },
  {
    icon: Sparkles,
    title: "Your plan is active",
    description:
      "The application limit is lifted, so you can apply to as many jobs as you like.",
  },
  {
    icon: LayoutDashboard,
    title: "Track everything",
    description:
      "Follow your applications and saved jobs from your seeker dashboard.",
  },
]

export async function PaymentSuccess({
  email,
  amountTotal,
  currency,
  planName,
  receiptId,
  dashboardHref,
}: PaymentSuccessProps) {
  const amount =
    amountTotal === null || amountTotal === undefined
      ? null
      : formatPrice(
        amountTotal,
        (currency?.toUpperCase() ?? "USD") as PaymentCurrency
      )
  const UserSession = await GetSessionByserver();
  const user = UserSession?.user;
  return (
    <main className="min-h-screen bg-[#050507] text-white">
      <Navbar />

      <section className="relative isolate overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[560px] bg-[radial-gradient(55%_100%_at_50%_0%,rgba(16,185,129,0.16)_0%,rgba(99,102,241,0.12)_45%,rgba(5,5,7,0)_78%)]"
        />

        <div className="mx-auto w-full max-w-3xl px-4 pt-8 pb-20 sm:px-6 lg:px-8">
          <nav
            aria-label="Breadcrumb"
            className="flex min-w-0 items-center gap-1.5 text-xs text-white/40"
          >
            <Link
              href="/"
              className="shrink-0 transition-colors hover:text-white"
            >
              Home
            </Link>
            <span aria-hidden="true" className="shrink-0">
              /
            </span>
            <span className="shrink-0">Payment</span>
            <span aria-hidden="true" className="shrink-0">
              /
            </span>
            <span className="truncate font-medium text-white/70">
              Confirmation
            </span>
          </nav>

          <div className="mt-10 flex flex-col items-center text-center">
            <div className="relative grid size-20 place-items-center rounded-full border border-emerald-400/30 bg-emerald-500/10 shadow-[0_0_0_12px_rgba(16,185,129,0.035),0_24px_70px_-28px_rgba(16,185,129,0.7)]">
              <span
                aria-hidden="true"
                className="absolute inset-2 rounded-full border border-emerald-400/15"
              />
              <CircleCheck
                aria-hidden="true"
                className="size-10 text-emerald-400"
                strokeWidth={1.5}
              />
            </div>

            <span className="mt-6 inline-flex items-center gap-1.5 rounded-full border border-emerald-400/25 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium tracking-wide text-emerald-300 uppercase">
              <Check aria-hidden="true" className="size-3.5" />
              Payment confirmed
            </span>

            <h1 className="mt-4 text-3xl leading-tight font-semibold tracking-tight text-white sm:text-4xl">
              You&apos;re all set!
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-white/55 sm:text-base">
              Your {planName} payment is complete. Your account is upgraded and
              you can start applying without limits right away.
            </p>
          </div>

          <div className="mt-10 overflow-hidden rounded-2xl border border-white/10 bg-[#0c0c0e] shadow-[0_24px_70px_-40px_rgba(0,0,0,0.95)]">
            <div className="flex items-center justify-between gap-3 border-b border-white/10 px-5 py-4 sm:px-6">
              <div className="flex min-w-0 items-center gap-3">
                <span
                  aria-hidden="true"
                  className="grid size-9 shrink-0 place-items-center rounded-lg bg-white/[0.04] text-indigo-300"
                >
                  <ReceiptText className="size-4.5" />
                </span>
                <div className="min-w-0">
                  <h2 className="text-sm font-semibold text-white">
                    Payment receipt
                  </h2>
                  <p className="mt-0.5 text-[11px] text-white/40">
                    Stripe checkout · Paid in full
                  </p>
                </div>
              </div>

              <span className="shrink-0 rounded-full border border-emerald-400/25 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-300">
                Paid
              </span>
            </div>

            <dl className="grid gap-x-6 gap-y-5 px-5 py-5 sm:grid-cols-2 sm:px-6">
              <div className="min-w-0">
                <dt className="text-xs text-white/45">Plan</dt>
                <dd className="mt-1 truncate text-sm font-medium text-white">
                  {planName}
                </dd>
              </div>
              <div className="min-w-0">
                <dt className="text-xs text-white/45">Amount paid</dt>
                <dd className="mt-1 text-sm font-medium text-white">
                  {amount ?? "—"}
                </dd>
              </div>
              <div className="min-w-0">
                <dt className="text-xs text-white/45">Receipt sent to</dt>
                <dd
                  className="mt-1 truncate text-sm font-medium text-white"
                  title={email ?? undefined}
                >
                  {email ?? "Your account email"}
                </dd>
              </div>
              <div className="min-w-0">
                <dt className="text-xs text-white/45">Payment ID</dt>
                <dd
                  className="mt-1 truncate font-mono text-xs text-white/70"
                  title={receiptId ?? undefined}
                >
                  {receiptId ?? "—"}
                </dd>
              </div>
            </dl>
          </div>

          <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.02] p-5 sm:p-6">
            <h2 className="text-sm font-semibold text-white">
              What happens next
            </h2>

            <ol className="mt-5 space-y-5">
              {steps.map((step, index) => (
                <li key={step.title} className="flex items-start gap-3.5">
                  <span className="grid size-8 shrink-0 place-items-center rounded-lg border border-indigo-400/20 bg-indigo-500/10 text-indigo-300">
                    <step.icon aria-hidden="true" className="size-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white">
                      <span className="mr-1.5 text-white/30">
                        {index + 1}.
                      </span>
                      {step.title}
                    </p>
                    <p className="mt-1 text-xs leading-5 text-white/45">
                      {step.description}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            {user?.role === 'seeker' ? <Link href="/browse-job" className={primaryLinkClass}>
              Browse jobs
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link> :  <Link href="/dashbord/recruiter/add-jobs" className={primaryLinkClass}>
              Add more Job
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>}
            <Link href={dashboardHref} className={secondaryLinkClass}>
              <LayoutDashboard aria-hidden="true" className="size-4" />
              Go to dashboard
            </Link>
          </div>

          <p className="mt-8 text-center text-xs leading-5 text-white/35">
            Questions about this payment? Check your receipt email or contact
            support from your dashboard.
          </p>
        </div>
      </section>
    </main>
  )
}
