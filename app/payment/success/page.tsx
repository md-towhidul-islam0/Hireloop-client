import Link from "next/link"
import { redirect } from "next/navigation"

import { SearchParams } from "next/dist/server/request/search-params"
import { stripe } from "@/lib/stripe"
import { GetSessionByserver } from "@/lib/core/apiget"
import { paymentPost } from "@/lib/core/paymentPost"
import { PRO_PLAN } from "@/lib/payments"
import { isUserRole } from "@/lib/roles"
import { PaymentSuccess } from "@/components/payment/PaymentSuccess"

export const metadata = {
  title: "Payment complete · HireLoop",
}

export default async function Success({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const { session_id } = await searchParams
  const UserSession = await GetSessionByserver()
  if (!session_id)
    throw new Error('Please provide a valid session_id (`cs_test_...`)')

  const {
    status,
    customer_email,
    payment_intent,
    payment_status,
    metadata,
    amount_total,
    currency,
    line_items,
  } = await stripe.checkout.sessions.retrieve(session_id as string, {
    expand: ['line_items', 'payment_intent']
  })
  console.log(UserSession?.user.email)
  console.log({
    status,
    customer_email,
    payment_intent,
    payment_status,
    metadata
  })
  if (status === 'open') {
    return redirect('/')
  }
  const res = await paymentPost(session_id as string)
  console.log(res);

  const role = UserSession?.user?.role
  const dashboardHref = isUserRole(role)
    ? `/dashbord/${role}`
    : "/dashbord/seeker"

  if (status === 'complete' && payment_status === "paid") {
    return (
      <PaymentSuccess
        email={customer_email ?? UserSession?.user.email ?? null}
        amountTotal={amount_total}
        currency={currency}
        planName={line_items?.data?.[0]?.description || PRO_PLAN.name}
        receiptId={
          typeof payment_intent === "string"
            ? payment_intent
            : (payment_intent?.id ?? (session_id as string))
        }
        dashboardHref={dashboardHref}
      />
    )
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#050507] px-4 text-white">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0c0c0e] p-6 text-center sm:p-8">
        <h1 className="text-xl font-semibold tracking-tight">
          Payment not completed
        </h1>
        <p className="mt-2 text-sm leading-6 text-white/50">
          We couldn&apos;t confirm a completed payment for this checkout
          session. You can return to checkout and try again.
        </p>
        <Link
          href="/payment"
          className="mt-6 inline-flex h-10 items-center justify-center rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-indigo-500"
        >
          Back to payment
        </Link>
      </div>
    </main>
  )
}
