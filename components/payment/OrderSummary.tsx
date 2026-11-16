import { Check, LockKeyhole } from "lucide-react"

import {
  formatPrice,
  getBillingPeriod,
  type PaymentPlan,
} from "@/lib/payments"

interface OrderSummaryProps {
  plan: PaymentPlan
}

export function OrderSummary({ plan }: OrderSummaryProps) {
  const price = formatPrice(plan.unitAmount, plan.currency)

  return (
    <aside
      aria-labelledby="order-summary-heading"
      className="rounded-2xl border border-white/10 bg-[#0c0c0e] p-5 shadow-[0_24px_60px_-40px_rgba(0,0,0,0.9)] sm:p-6 lg:sticky lg:top-6"
    >
      <h2
        id="order-summary-heading"
        className="text-sm font-semibold text-white"
      >
        Order summary
      </h2>

      <div className="mt-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-white">{plan.name}</p>
          <p className="mt-1 text-xs text-white/45">
            Billed {getBillingPeriod(plan.interval)} · cancel anytime
          </p>
        </div>
        <p className="shrink-0 text-sm font-semibold text-white">{price}</p>
      </div>

      <ul className="mt-5 space-y-2.5 border-t border-white/10 pt-5 text-sm text-white/60">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2.5">
            <Check
              aria-hidden="true"
              className="mt-0.5 size-4 shrink-0 text-indigo-400"
            />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <dl className="mt-5 space-y-2.5 border-t border-white/10 pt-5 text-sm">
        <div className="flex items-center justify-between gap-3">
          <dt className="text-white/50">Subtotal</dt>
          <dd className="text-white/80">{price}</dd>
        </div>
        <div className="flex items-center justify-between gap-3">
          <dt className="text-white/50">Tax</dt>
          <dd className="text-white/80">Calculated at checkout</dd>
        </div>
        <div className="flex items-center justify-between gap-3 border-t border-white/10 pt-3 text-base font-semibold text-white">
          <dt>Total due today</dt>
          <dd>{price}</dd>
        </div>
      </dl>

      <p className="mt-5 flex items-start gap-2 text-xs leading-5 text-white/40">
        <LockKeyhole aria-hidden="true" className="mt-0.5 size-3.5 shrink-0" />
        Payments are processed securely by Stripe. HireLoop never stores your
        card details.
      </p>
    </aside>
  )
}
