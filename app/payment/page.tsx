import type { Metadata } from "next"
import { headers } from "next/headers"
import Link from "next/link"
import { ChevronRight, ShieldCheck } from "lucide-react"

import Navbar from "@/components/Navbar"
import { CheckoutForm } from "@/components/payment/CheckoutForm"
import { OrderSummary } from "@/components/payment/OrderSummary"
import { Toaster } from "@/components/ui/toast"
import { auth } from "@/lib/auth"
import { FREE_APPLICATION_LIMIT, getPlan } from "@/lib/payments"

export const metadata: Metadata = {
  title: "Payment · HireLoop",
  description: "Upgrade to HireLoop Pro and apply without limits.",
}

type SearchParams = { [key: string]: string | string[] | undefined }

const readParam = (value?: string | string[]) =>
  Array.isArray(value) ? value[0] : value

const PaymentPage = async ({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) => {
  const search = await searchParams
  const { canceled } = await searchParams

  if (canceled) {
    console.log(
      'Order canceled -- continue to shop around and check out when you\'re ready.'
    )
  }
  const plan = getPlan(readParam(search.plan))
  // `reditectTo` is the misspelled param the job details page sends today.
  const redirectTo =
    readParam(search.redirectTo) ?? readParam(search.reditectTo) ?? ""
  const wasCanceled = readParam(search.canceled) === "1"

  const session = await auth.api.getSession({ headers: await headers() })
  const user = session?.user

  return (
    <main className="min-h-screen bg-[#050507] text-white">
      <Navbar />

      <section className="relative isolate overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[420px] bg-[radial-gradient(60%_100%_at_50%_0%,rgba(99,102,241,0.18)_0%,rgba(5,5,7,0)_75%)]"
        />

        <div className="mx-auto w-full max-w-6xl px-4 pt-8 pb-20 sm:px-6 lg:px-8">
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
            <ChevronRight className="size-3 shrink-0" />
            <span className="truncate font-medium text-white/70">Payment</span>
          </nav>

          <div className="mt-6 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-400/20 bg-indigo-500/10 px-2.5 py-1 text-[11px] font-medium text-indigo-300">
              <ShieldCheck aria-hidden="true" className="size-3.5" />
              Secure checkout
            </span>

            <h1 className="mt-4 text-3xl leading-tight font-semibold tracking-tight text-white sm:text-4xl">
              Complete your payment
            </h1>

            <p className="mt-2 text-sm text-white/55 sm:text-base">
              {redirectTo
                ? `You've used all ${FREE_APPLICATION_LIMIT} free applications on your account. Upgrade to ${plan.name} to keep applying — we'll take you back to the job afterwards.`
                : plan.tagline}
            </p>

            {wasCanceled ? (
              <p
                role="status"
                className="mt-4 inline-flex items-start gap-2 rounded-lg border border-amber-400/25 bg-amber-500/10 px-3.5 py-3 text-sm text-amber-200"
              >
                Your previous checkout was canceled — you haven&apos;t been
                charged.
              </p>
            ) : null}
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start">
            <CheckoutForm
              plan={plan}
              defaultName={user?.name ?? ""}
              defaultEmail={user?.email ?? ""}
              redirectTo={redirectTo}
              isSignedIn={Boolean(user)}
            />

            <OrderSummary plan={plan} />
          </div>

          <p className="mt-8 max-w-2xl text-xs leading-5 text-white/35">
            Need help with a payment? Contact support and include the email
            address on your account. Access starts as soon as Stripe confirms
            the payment, and you can cancel from your billing settings at any
            time.
          </p>
        </div>
      </section>

      <Toaster />
    </main>
  )
}

export default PaymentPage
