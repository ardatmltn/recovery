'use client'

import Link from 'next/link'
import { useLanguage } from '@/lib/language-context'
import { dashboardTranslations } from '@/lib/dashboard-translations'
import { formatCurrency, formatDateTime, formatRelativeTime } from '@/lib/utils'
import { RiskScoreBadge } from '@/components/dashboard/risk-score-badge'
import { ArrowLeft, ExternalLink } from 'lucide-react'

type Customer = {
  name: string | null
  email: string | null
  provider_customer_id: string | null
  risk_score: number
  total_failed_payments: number
  total_recovered_amount: number
}

type Event = {
  id: string
  amount: number
  currency: string
  status: string
  failure_code: string | null
  created_at: string
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    recovered: 'bg-green-500/10 text-green-400 border-green-500/30',
    new: 'bg-zinc-800 text-zinc-400 border-zinc-700',
    processing: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
    failed: 'bg-red-500/10 text-red-400 border-red-500/30',
    ignored: 'bg-red-500/10 text-red-400 border-red-500/30',
  }
  const labels: Record<string, string> = {
    recovered: 'Kurtarıldı', new: 'Beklemede', processing: 'İşleniyor',
    failed: 'Başarısız', ignored: 'Yoksayıldı',
  }
  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${map[status] ?? 'bg-zinc-800 text-zinc-500 border-zinc-700'}`}>
      {labels[status] ?? status}
    </span>
  )
}

export function CustomerDetailView({ customer, events }: { customer: Customer; events: Event[] }) {
  const { lang } = useLanguage()
  const t = dashboardTranslations[lang].customers.detail

  const initials = (customer.name || customer.email || '?')
    .split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Back + header */}
      <div>
        <Link
          href="/dashboard/customers"
          className="flex items-center gap-2 text-zinc-500 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Müşterilere Dön
        </Link>

        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-green-400 text-xl font-black">
            {initials}
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">
              {customer.name ?? customer.email ?? 'Müşteri'}
            </h1>
            {customer.email && customer.name && (
              <p className="text-zinc-500 text-sm mt-1">{customer.email}</p>
            )}
            {customer.provider_customer_id && (
              <p className="text-zinc-600 text-xs mt-0.5 font-mono">{customer.provider_customer_id}</p>
            )}
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-zinc-900 rounded-2xl p-5 border border-zinc-800 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-[#9fff88]" />
          <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-2">{t.cardRiskScore}</p>
          <RiskScoreBadge score={customer.risk_score} showLabel size="md" />
        </div>
        <div className="bg-zinc-900 rounded-2xl p-5 border border-zinc-800 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-red-500/60" />
          <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-2">{t.cardFailedPayments}</p>
          <p className="text-3xl font-extrabold text-white">{customer.total_failed_payments}</p>
        </div>
        <div className="bg-zinc-900 rounded-2xl p-5 border border-zinc-800 relative overflow-hidden col-span-2">
          <div className="absolute top-0 left-0 w-1 h-full bg-[#9fff88]/40" />
          <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-2">{t.cardTotalRecovered}</p>
          <p className="text-3xl font-extrabold text-white">{formatCurrency(customer.total_recovered_amount)}</p>
        </div>
      </div>

      {/* Payment history */}
      <div className="bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800">
        <div className="px-8 py-5 border-b border-zinc-800 bg-zinc-800/30">
          <h2 className="text-sm font-black text-white uppercase tracking-widest">{t.paymentHistory}</h2>
        </div>

        {events.length === 0 ? (
          <div className="px-8 py-16 text-center">
            <p className="text-zinc-500 text-sm">{t.noHistory}</p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-800/60">
            {events.map((event) => (
              <Link
                key={event.id}
                href={`/dashboard/failures/${event.id}`}
                className="px-8 py-5 flex items-center justify-between hover:bg-zinc-800/30 transition-colors group"
              >
                <div>
                  <p className="text-sm font-bold text-white">{formatCurrency(event.amount, event.currency)}</p>
                  <p className="text-[11px] text-zinc-500 mt-0.5">{formatDateTime(event.created_at)}</p>
                  {event.failure_code && (
                    <p className="text-[11px] text-zinc-600 font-mono mt-0.5">{event.failure_code}</p>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <StatusPill status={event.status} />
                  <ExternalLink className="w-3.5 h-3.5 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
