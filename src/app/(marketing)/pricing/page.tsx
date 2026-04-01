'use client'

import Link from 'next/link'
import { Check, Zap } from 'lucide-react'
import { ModalPricing } from '@/components/ui/modal-pricing'
import { MarketingNav } from '@/components/marketing/nav'
import { useLanguage } from '@/lib/language-context'
import { translations } from '@/components/marketing/translations'

const PLAN_NAMES = ['Starter', 'Growth', 'Pro']
const PLAN_PRICES = ['$59', '$99', '$149']

export default function PricingPage() {
  const { lang } = useLanguage()
  const tx = translations[lang].pricingPage
  const nav = translations[lang].nav

  return (
    <div className="min-h-[100dvh] bg-[#09090B]">
      <MarketingNav showUpgradeButton={<ModalPricing />} />

      {/* Hero */}
      <div className="pt-36 pb-20 text-center px-6">
        <p className="text-green-500 text-xs font-semibold uppercase tracking-widest mb-4">
          {tx.sectionLabel}
        </p>
        <h1 className="font-display font-black text-white text-5xl md:text-6xl leading-[1.0] mb-5">
          {tx.title}
        </h1>
        <p className="text-zinc-400 text-lg max-w-md mx-auto mb-2">{tx.subtitle}</p>
        <p className="text-zinc-600 text-sm">{tx.sub2}</p>
      </div>

      {/* Plans */}
      <div className="max-w-5xl mx-auto px-6 pb-28">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {tx.plans.map((plan, i) => {
            const highlighted = i === 1
            return (
              <div
                key={PLAN_NAMES[i]}
                className={`relative rounded-2xl p-8 transition-all duration-300 ${
                  highlighted
                    ? 'bg-zinc-900 border-2 border-green-500/40 shadow-[0_0_60px_rgba(34,197,94,0.07)]'
                    : 'bg-zinc-900 border border-zinc-800 hover:border-zinc-700'
                }`}
              >
                {highlighted && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="px-3 py-1 bg-green-500 text-black text-[11px] font-bold rounded-full uppercase tracking-wide">
                      {tx.popular}
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <h2 className="font-display font-bold text-white text-xl mb-1">{PLAN_NAMES[i]}</h2>
                  <p className="text-zinc-500 text-sm leading-relaxed">{plan.desc}</p>
                </div>

                <div className="flex items-baseline gap-1 mb-8">
                  <span className="font-display font-black text-white text-5xl">{PLAN_PRICES[i]}</span>
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
                    highlighted
                      ? 'bg-green-500 hover:bg-green-400 text-black shadow-[0_0_24px_rgba(34,197,94,0.2)] hover:shadow-[0_0_36px_rgba(34,197,94,0.38)] hover:-translate-y-0.5'
                      : 'border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-white hover:-translate-y-0.5 bg-zinc-800/40 hover:bg-zinc-800'
                  }`}
                >
                  {tx.cta}
                </Link>
              </div>
            )
          })}
        </div>
      </div>

      {/* FAQ */}
      <div className="border-t border-zinc-800 py-24">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="font-display font-black text-white text-3xl mb-12 text-center">
            {tx.faq.title}
          </h2>
          <div className="space-y-3">
            {tx.faq.items.map(({ q, a }) => (
              <div key={q} className="border border-zinc-800 hover:border-zinc-700 rounded-xl p-6 transition-colors">
                <p className="font-semibold text-white text-sm mb-2">{q}</p>
                <p className="text-zinc-500 text-sm leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-8">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-green-500 rounded-md flex items-center justify-center">
              <Zap className="w-3 h-3 text-black" />
            </div>
            <span className="font-display font-semibold text-white text-sm">Recoverly</span>
          </div>
          <div className="flex gap-6">
            <Link href="/" className="text-zinc-600 hover:text-zinc-400 text-xs transition-colors">Home</Link>
            <Link href="/login" className="text-zinc-600 hover:text-zinc-400 text-xs transition-colors">{nav.signIn}</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
