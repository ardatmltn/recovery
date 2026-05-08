'use client'

import { useLanguage } from '@/lib/language-context'
import { CreditCard, Check, Zap, Sparkles, Mail } from 'lucide-react'

const PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    price: '$59',
    period: '/mo',
    features: [
      '1 payment provider',
      'Email recovery only',
      'Basic analytics',
      'Email support',
    ],
  },
  {
    id: 'growth',
    name: 'Growth',
    price: '$99',
    period: '/mo',
    popular: true,
    features: [
      '2 payment providers',
      'Email + SMS recovery',
      'AI personalization',
      'Advanced analytics',
      'Priority support',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$149',
    period: '/mo',
    features: [
      'Unlimited providers',
      'All channels',
      'AI personalization',
      'Custom sequences',
      'Dedicated support',
    ],
  },
]

const PLAN_LABELS: Record<string, string> = {
  starter: 'Starter — $59/mo',
  growth: 'Growth — $99/mo',
  pro: 'Pro — $149/mo',
}

const PLAN_STATUS_LABELS: Record<string, { en: string; tr: string; color: string }> = {
  active:   { en: 'Active',    tr: 'Aktif',     color: 'text-green-400 bg-green-500/10 border-green-500/30' },
  trialing: { en: 'Trial',     tr: 'Deneme',    color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30' },
  past_due: { en: 'Past Due',  tr: 'Gecikmiş',  color: 'text-red-400 bg-red-500/10 border-red-500/30' },
  inactive: { en: 'Inactive',  tr: 'Pasif',     color: 'text-zinc-400 bg-zinc-500/10 border-zinc-500/30' },
}

type Props = {
  currentPlan: string
  planStatus: string
}

export function SettingsBillingView({ currentPlan, planStatus }: Props) {
  const { lang } = useLanguage()
  const isTR = lang === 'tr'

  const statusInfo = PLAN_STATUS_LABELS[planStatus] ?? PLAN_STATUS_LABELS.trialing

  return (
    <div className="space-y-8 max-w-3xl">
      {/* Current plan card */}
      <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden">
        <div className="px-6 py-5 border-b border-zinc-800 bg-zinc-800/30 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center">
            <CreditCard className="w-4 h-4 text-green-400" />
          </div>
          <div>
            <p className="text-sm font-bold text-white">
              {isTR ? 'Mevcut Plan' : 'Current Plan'}
            </p>
            <p className="text-[11px] text-zinc-500">
              {isTR ? 'Aktif abonelik bilgileriniz' : 'Your active subscription details'}
            </p>
          </div>
        </div>
        <div className="p-6 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-lg font-bold text-white">
              {PLAN_LABELS[currentPlan] ?? currentPlan}
            </p>
            <p className="text-xs text-zinc-500">
              {isTR
                ? 'Ödeme sistemi entegrasyonu yakında tamamlanacak'
                : 'Payment system integration coming soon'}
            </p>
          </div>
          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${statusInfo.color}`}>
            {isTR ? statusInfo.tr : statusInfo.en}
          </span>
        </div>
      </div>

      {/* Plan comparison */}
      <div>
        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-4">
          {isTR ? 'Planlar' : 'Plans'}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PLANS.map((plan) => {
            const isCurrent = currentPlan === plan.id
            return (
              <div
                key={plan.id}
                className={`relative rounded-2xl border overflow-hidden transition-all ${
                  isCurrent
                    ? 'border-green-500/50 bg-green-500/5'
                    : 'border-zinc-800 bg-zinc-900'
                }`}
              >
                {plan.popular && !isCurrent && (
                  <div className="absolute top-3 right-3">
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-zinc-700 text-zinc-300 border border-zinc-600">
                      <Sparkles className="w-2.5 h-2.5" />
                      {isTR ? 'Popüler' : 'Popular'}
                    </span>
                  </div>
                )}
                {isCurrent && (
                  <div className="absolute top-3 right-3">
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-green-500/20 text-green-400 border border-green-500/30">
                      <Zap className="w-2.5 h-2.5" />
                      {isTR ? 'Mevcut' : 'Current'}
                    </span>
                  </div>
                )}
                <div className="p-5 space-y-4">
                  <div>
                    <p className="text-sm font-bold text-white">{plan.name}</p>
                    <p className="text-2xl font-black text-white mt-1">
                      {plan.price}
                      <span className="text-xs font-normal text-zinc-500">{plan.period}</span>
                    </p>
                  </div>
                  <ul className="space-y-2">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-xs text-zinc-400">
                        <Check className="w-3.5 h-3.5 text-green-400 mt-0.5 shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  {!isCurrent && (
                    <div className="pt-1">
                      <div className="w-full py-2.5 rounded-xl text-center text-xs font-bold text-zinc-500 bg-zinc-800/50 border border-zinc-700/50 cursor-not-allowed select-none">
                        {isTR ? 'Yakında' : 'Coming soon'}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Contact notice */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-zinc-800/40 border border-zinc-700/50">
        <Mail className="w-4 h-4 text-zinc-400 mt-0.5 shrink-0" />
        <p className="text-xs text-zinc-400 leading-relaxed">
          {isTR
            ? 'Plan değişikliği veya faturalama hakkında soru için '
            : 'To change your plan or ask about billing, contact us at '}
          <a
            href="mailto:support@recoverly.io"
            className="text-green-400 hover:text-green-300 underline underline-offset-2 transition-colors"
          >
            support@recoverly.io
          </a>
          {isTR ? ' adresine yazabilirsiniz.' : '.'}
        </p>
      </div>
    </div>
  )
}
