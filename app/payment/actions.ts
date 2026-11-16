"use server"

import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { auth } from "@/lib/auth"
import { formatPrice, getPlan } from "@/lib/payments"

export interface CheckoutState {
  status: "idle" | "pending" | "error"
  message: string | null
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * Starts the checkout flow for the selected plan.
 *
 * Today this validates the billing details and stops with a "not connected"
 * message. When Stripe is added, replace the marked block with a Checkout
 * Session creation and redirect to `session.url` — the page and button stay
 * exactly the same.
 */
export async function startCheckout(
  _previousState: CheckoutState,
  formData: FormData
): Promise<CheckoutState> {
  const name = String(formData.get("name") ?? "").trim()
  const email = String(formData.get("email") ?? "").trim()
  const country = String(formData.get("country") ?? "").trim()
  const plan = getPlan(String(formData.get("plan") ?? ""))
  const redirectTo = String(formData.get("redirectTo") ?? "").trim()

  if (name.length < 2) {
    return { status: "error", message: "Enter the cardholder's full name." }
  }

  if (!EMAIL_PATTERN.test(email)) {
    return { status: "error", message: "Enter a valid email address." }
  }

  if (!country) {
    return { status: "error", message: "Select your billing country." }
  }

  const session = await auth.api.getSession({ headers: await headers() })

  if (!session?.user) {
    const params = new URLSearchParams({ plan: plan.id })

    if (redirectTo) params.set("redirectTo", redirectTo)

    redirect(
      `/SignIn?redirectTo=${encodeURIComponent(`/payment?${params.toString()}`)}`
    )
  }

  /* ---------------------------------------------------------------------- */
  /* Stripe integration point                                               */
  /*                                                                        */
  /* const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)               */
  /* const checkout = await stripe.checkout.sessions.create({               */
  /*   mode: "subscription",                                                */
  /*   line_items: [{ price: plan.stripePriceId, quantity: 1 }],            */
  /*   customer_email: email,                                               */
  /*   success_url: `${origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`, */
  /*   cancel_url: `${origin}/payment?canceled=1`,                          */
  /* })                                                                     */
  /* redirect(checkout.url)                                                 */
  /* ---------------------------------------------------------------------- */

  return {
    status: "pending",
    message: `Stripe checkout isn't connected yet. Once it is, this button will open Stripe so you can pay ${formatPrice(
      plan.unitAmount,
      plan.currency
    )} securely.`,
  }
}
