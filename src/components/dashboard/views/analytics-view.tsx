'use client'

import { useLanguage } from '@/lib/language-context'
import { dashboardTranslations } from '@/lib/dashboard-translations'
import { formatCurrency } from '@/lib/utils'
import { AnalyticsCharts } from '@/components/dashboard/analytics-charts'
import { TrendingUp, RefreshCw, Mail, MessageSquare } from 'lucide-react'

type DailyAnalytic = {
  id: string
  org_id: string
  date: string
  total_recovered_amount: number
  total_failed_amount: number
  total_failed_count: number
  total_recovered_count: number
  recovery_rate: number
  retry_success_count: number
  email_success_count: number
  sms_success_count: number
  created_at: string
}

type Props = {
  analytics: DailyAnalytic[]
  totals: {
    recovered: number
    failed: number
    retrySuccess: number
    emailSuccess: number
    smsSuccess: number
  }
  overallRate: number
}

export function AnalyticsView({ analytics, totals, overallRate }: Props) {
  const { lang } = useLanguage()
  const t = dashboardTranslations[lang].analytics

  const metrics = [
    {
      label: t.recovered,
      value: formatCurrency(totals.recovered),
      icon: TrendingUp,
      accent: 'bg-[#9fff88]',
      glow: 'shadow-[0_0_12px_rgba(159,255,136,0.4)]',
    },
    {
      label: t.recoveryRate,
      value: `${overallRate}%`,
      icon: TrendingUp,
      accent: 'bg-[#9fff88]/40',
      glow: '',
    },
    {
      label: t.retrySuccess,
      value: String(totals.retrySuccess),
      icon: RefreshCw,
      accent: 'bg-zinc-600',
      glow: '',
    },
    {
      label: t.emailSuccess,
      value: String(totals.emailSuccess),
      icon: Mail,
      accent: 'bg-zinc-600',
      glow: '',
    },
  ]

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2">{t.title}</h1>
        <p className="text-zinc-500 text-sm">{t.subtitle}</p>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map(({ label, value, icon: Icon, accent, glow }) => (
          <div key={label} className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800 relative overflow-hidden">
            <div className={`absolute top-0 left-0 w-1 h-full ${accent} ${glow}`} />
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-3">{label}</p>
            <p className="text-3xl font-extrabold text-white mb-3">{value}</p>
            <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center">
              <Icon className="w-4 h-4 text-green-400" />
            </div>
          </div>
        ))}
      </div>

      {/* SMS stat */}
      {totals.smsSuccess > 0 && (
        <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">SMS Başarısı</p>
            <p className="text-xl font-extrabold text-white">{totals.smsSuccess}</p>
          </div>
        </div>
      )}

      {/* Charts */}
      <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden">
        <div className="px-8 py-5 border-b border-zinc-800 bg-zinc-800/30">
          <h2 className="text-sm font-black text-white uppercase tracking-widest">Günlük Trend</h2>
        </div>
        <div className="p-8">
          <AnalyticsCharts data={analytics} />
        </div>
      </div>
    </div>
  )
}
