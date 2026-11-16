/* -------------------------------------------------------------------------- */
/*                     Payment — plan config & price helpers                 */
/* -------------------------------------------------------------------------- */

export type BillingInterval = "month" | "year"
export type PaymentCurrency = "USD"

export interface PaymentPlan {
  id: string
  name: string
  tagline: string
  /** Amount in the smallest currency unit (cents) — the shape Stripe expects. */
  unitAmount: number
  currency: PaymentCurrency
  interval: BillingInterval
  features: string[]
  /** Filled in once the plan exists in the Stripe dashboard. */
  stripePriceId?: string
}

/** Free applications a seeker gets before they are asked to upgrade. */
export const FREE_APPLICATION_LIMIT = 8

export const PRO_PLAN: PaymentPlan = {
  id: "pro",
  name: "HireLoop Pro",
  tagline: "Apply without limits and get in front of recruiters first.",
  unitAmount: 999,
  currency: "USD",
  interval: "month",
  features: [
    "Unlimited job applications",
    "Priority placement in recruiter searches",
    "Application insights and status tracking",
    "Cancel anytime",
  ],
}

export const PAYMENT_PLANS: PaymentPlan[] = [PRO_PLAN]

export const DEFAULT_PLAN = PRO_PLAN

const priceFormatters = new Map<string, Intl.NumberFormat>()

/** `999` + `"USD"` → `"$9.99"`. */
export function formatPrice(
  unitAmount: number,
  currency: PaymentCurrency = "USD"
) {
  let formatter = priceFormatters.get(currency)

  if (!formatter) {
    formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    })
    priceFormatters.set(currency, formatter)
  }

  return formatter.format(unitAmount / 100)
}

export function getPlan(planId?: string | null) {
  return (
    PAYMENT_PLANS.find((plan) => plan.id === planId) ?? DEFAULT_PLAN
  )
}

export function getBillingPeriod(interval: BillingInterval) {
  return interval === "year" ? "yearly" : "monthly"
}
