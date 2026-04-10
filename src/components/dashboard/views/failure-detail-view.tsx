'use client'

import Link from 'next/link'
import { useLanguage } from '@/lib/language-context'
import { dashboardTranslations } from '@/lib/dashboard-translations'
import { formatCurrency, formatDateTime, formatRelativeTime } from '@/lib/utils'
import { RecoveryTimeline } from '@/components/dashboard/recovery-timeline'
import { ArrowLeft } from 'lucide-react'

type Attempt = {
  id: string
  step_number: number
  type: string
  status: string
  scheduled_at: string
  executed_at: string | null
  message_templates: { name: string; type: string } | null
}

type Props = {
  event: {
    provider_event_id: string | null
    amount: number
    currency: string
    status: string
    failure_code: string | null
    failure_message: string | null
    created_at: string
    customers: { name?: string; email?: string } | null
  }
  attempts: Attempt[]
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

export function FailureDetailView({ event, attempts }: Props) {
  const { lang } = useLanguage()
  const t = dashboardTranslations[lang].failures.detail

  const customer = event.customers
  const initials = ((customer?.name || customer?.email || '?')
    .split(' ').map((w) => w[0]).slice(0, 2).join('')).toUpperCase()

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Back */}
      <Link
        href="/dashboard/failures"
        className="flex items-center gap-2 text-zinc-500 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Başarısız Ödemelere Dön
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mb-1">{t.title}</h1>
          {event.provider_event_id && (
            <p className="text-zinc-600 text-xs font-mono">{event.provider_event_id}</p>
          )}
        </div>
        <StatusPill status={event.status} />
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Customer */}
        <div className="bg-zinc-900 rounded-2xl p-5 border border-zinc-800 col-span-2 md:col-span-1">
          <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-3">{t.cardCustomer}</p>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-green-400 text-xs font-bold shrink-0">
              {initials}
            </div>
            <div>
              <p className="text-sm font-bold text-white leading-tight">{customer?.name ?? '—'}</p>
              <p className="text-[11px] text-zinc-500">{customer?.email ?? '—'}</p>
            </div>
          </div>
        </div>

        {/* Amount */}
        <div className="bg-zinc-900 rounded-2xl p-5 border border-zinc-800 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-[#9fff88]" />
          <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-2">{t.cardPayment}</p>
          <p className="text-2xl font-extrabold text-white">{formatCurrency(event.amount, event.currency)}</p>
          <p className="text-[10px] text-zinc-500 mt-1">Abonelik</p>
        </div>

        {/* Failure */}
        <div className="bg-zinc-900 rounded-2xl p-5 border border-zinc-800 border-l-2 border-l-red-500/50">
          <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-2">{t.cardFailure}</p>
          <p className="text-sm font-bold text-red-400">{event.failure_code ?? '—'}</p>
          {event.failure_message && (
            <p className="text-[11px] text-zinc-500 mt-1 leading-relaxed">{event.failure_message}</p>
          )}
        </div>

        {/* Time */}
        <div className="bg-zinc-900 rounded-2xl p-5 border border-zinc-800">
          <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-2">{t.cardTimeline}</p>
          <p className="text-sm font-bold text-white">{formatRelativeTime(event.created_at, lang)}</p>
          <p className="text-[11px] text-zinc-600 mt-1">{formatDateTime(event.created_at)}</p>
        </div>
      </div>

      {/* Recovery timeline */}
      <div className="bg-zinc-900 rounded-2xl border border-zinc-800">
        <div className="px-8 py-5 border-b border-zinc-800 bg-zinc-800/30">
          <h2 className="text-sm font-black text-white uppercase tracking-widest">{t.recoveryTimeline}</h2>
        </div>
        <div className="p-8">
          <RecoveryTimeline attempts={attempts} emptyText={t.noAttempts} />
        </div>
      </div>
    </div>
  )
}
