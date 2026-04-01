import Link from 'next/link'
import { ModalPricing } from '@/components/ui/modal-pricing'
import { Check, Zap } from 'lucide-react'

const PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    price: '$59',
    description: 'For early-stage SaaS products',
    features: [
      '1 payment provider (İyzico)',
      'Email recovery only',
      'Up to 3-step sequences',
      'Basic analytics dashboard',
      'Email support',
    ],
    highlighted: false,
  },
  {
    id: 'growth',
    name: 'Growth',
    price: '$99',
    description: 'For growing products with more recovery needs',
    features: [
      '2 payment providers',
      'Email + SMS recovery',
      'AI personalization',
      'Custom sequences (unlimited steps)',
      'Advanced analytics & reports',
      'Priority email support',
    ],
    highlighted: true,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$149',
    description: 'Maximum recovery for established products',
    features: [
      'Unlimited payment providers',
      'All channels (Email, SMS)',
      'AI personalization',
      'Custom sequences',
      'Full analytics + exports',
      'Dedicated support',
      'Slack integration',
    ],
    highlighted: false,
  },
]

export default function PricingPage() {
  return (
    <div className="min-h-[100dvh] bg-[#09090B]">

      {/* ── Nav ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-800/60 bg-[#09090B]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center shadow-[0_0_16px_rgba(34,197,94,0.3)]">
              <Zap className="w-4 h-4 text-black" />
            </div>
            <span className="font-display font-bold text-white text-lg tracking-tight">Recoverly</span>
          </Link>
          <div className="flex items-center gap-2">
            <ModalPricing />
            <Link
              href="/login"
              className="px-4 py-2 border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-white text-sm font-medium rounded-full transition-all bg-zinc-900/50 hover:bg-zinc-800/60"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 bg-green-500 hover:bg-green-400 text-black text-sm font-semibold rounded-full transition-all shadow-[0_0_16px_rgba(34,197,94,0.2)] hover:shadow-[0_0_24px_rgba(34,197,94,0.35)]"
            >
              Get started
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <div className="pt-36 pb-20 text-center px-6">
        <p className="text-green-500 text-xs font-semibold uppercase tracking-widest mb-4">Pricing</p>
        <h1 className="font-display font-black text-white text-5xl md:text-6xl leading-[1.0] mb-5">
          Simple, predictable pricing.
        </h1>
        <p className="text-zinc-400 text-lg max-w-md mx-auto mb-2">
          All plans include a 14-day free trial. No credit card required.
        </p>
        <p className="text-zinc-600 text-sm">Cancel anytime · No setup fees · Instant activation</p>
      </div>

      {/* ── Plans ── */}
      <div className="max-w-5xl mx-auto px-6 pb-28">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-2xl p-8 transition-all duration-300 ${
                plan.highlighted
                  ? 'bg-zinc-900 border-2 border-green-500/40 shadow-[0_0_60px_rgba(34,197,94,0.07)]'
                  : 'bg-zinc-900 border border-zinc-800 hover:border-zinc-700'
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="px-3 py-1 bg-green-500 text-black text-[11px] font-bold rounded-full uppercase tracking-wide">
                    Most popular
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h2 className="font-display font-bold text-white text-xl mb-1">{plan.name}</h2>
                <p className="text-zinc-500 text-sm leading-relaxed">{plan.description}</p>
              </div>

              <div className="flex items-baseline gap-1 mb-8">
                <span className="font-display font-black text-white text-5xl">{plan.price}</span>
                <span className="text-zinc-500 text-sm">/mo</span>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm">
                    <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                    <span className="text-zinc-400">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/register"
                className={`w-full inline-flex justify-center items-center px-6 py-3 rounded-full text-sm font-semibold transition-all duration-200 ${
                  plan.highlighted
                    ? 'bg-green-500 hover:bg-green-400 text-black shadow-[0_0_24px_rgba(34,197,94,0.2)] hover:shadow-[0_0_36px_rgba(34,197,94,0.38)] hover:-translate-y-0.5'
                    : 'border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-white hover:-translate-y-0.5 bg-zinc-800/40 hover:bg-zinc-800'
                }`}
              >
                Get started →
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* ── FAQ ── */}
      <div className="border-t border-zinc-800 py-24">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="font-display font-black text-white text-3xl mb-12 text-center">
            Frequently asked questions
          </h2>
          <div className="space-y-3">
            {[
              {
                q: 'How does the free trial work?',
                a: 'You get 14 days of full access to all features on any plan. No credit card required. Cancel anytime with no questions asked.',
              },
              {
                q: 'What payment providers do you support?',
                a: 'Currently İyzico. More providers including Stripe and PayTR are coming soon.',
              },
              {
                q: 'How much can I expect to recover?',
                a: 'Our customers typically recover 20-35% of failed payments. The exact amount depends on your failure reasons and customer base.',
              },
              {
                q: 'Is my İyzico data secure?',
                a: 'Yes. We store the minimum data required. Your İyzico API key is encrypted at rest using AES-256. We never store raw card data.',
              },
            ].map(({ q, a }) => (
              <div
                key={q}
                className="border border-zinc-800 hover:border-zinc-700 rounded-xl p-6 transition-colors"
              >
                <p className="font-semibold text-white text-sm mb-2">{q}</p>
                <p className="text-zinc-500 text-sm leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Footer ── */}
      <footer className="border-t border-zinc-800 py-8">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between">
          <span className="text-zinc-700 text-xs">© 2026 Recoverly</span>
          <div className="flex gap-6">
            <Link href="/" className="text-zinc-600 hover:text-zinc-400 text-xs transition-colors">Home</Link>
            <Link href="/login" className="text-zinc-600 hover:text-zinc-400 text-xs transition-colors">Sign in</Link>
          </div>
        </div>
      </footer>

    </div>
  )
}
