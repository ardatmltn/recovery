'use client'

import { useLanguage } from '@/lib/language-context'
import { dashboardTranslations } from '@/lib/dashboard-translations'
import { formatCurrency, formatRelativeTime } from '@/lib/utils'
import {
  DollarSign, AlertCircle, TrendingUp, Activity,
  ArrowUpRight, Clock, CreditCard, UserPlus, RefreshCw, Bell,
} from 'lucide-react'
import { SetupGuide } from '@/components/dashboard/setup-guide'
import Link from 'next/link'

type RecentFailure = {
  id: string
  amount: number
  currency: string
  failure_message: string | null
  created_at: string
  customers: { name?: string; email?: string } | null
}

type Props = {
  fullName?: string
  showSetupGuide: boolean
  iyzicoConnected: boolean
  n8nConfigured: boolean
  totalRecovered: number
  totalFailed: number
  recoveryRate: number
  activeFailures: number
  recoveredCount: number
  analyticsLength: number
  recentFailures: RecentFailure[]
}

const activityIconMap = [
  { icon: CreditCard, color: 'text-green-400', bg: 'bg-green-500/10' },
  { icon: UserPlus, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  { icon: RefreshCw, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  { icon: Bell, color: 'text-orange-400', bg: 'bg-orange-500/10' },
  { icon: AlertCircle, color: 'text-red-400', bg: 'bg-red-500/10' },
]

export function OverviewView({
  fullName, showSetupGuide, iyzicoConnected, n8nConfigured,
  totalRecovered, totalFailed, recoveryRate, activeFailures,
  recoveredCount, analyticsLength, recentFailures,
}: Props) {
  const { lang } = useLanguage()
  const t = dashboardTranslations[lang].overview

  const metrics = [
    {
      label: t.metrics.recoveredRevenue,
      value: formatCurrency(totalRecovered),
      trend: '+0%',
      trendLabel: t.metrics.fromLastMonth,
      icon: DollarSign,
      iconColor: 'text-blue-400',
      iconBg: 'bg-blue-500/10',
      trendColor: 'text-green-400',
    },
    {
      label: t.metrics.activeFailures,
      value: String(activeFailures),
      trend: t.metrics.newCount,
      trendLabel: t.metrics.thisWeek,
      icon: AlertCircle,
      iconColor: 'text-green-400',
      iconBg: 'bg-green-500/10',
      trendColor: 'text-green-400',
    },
    {
      label: t.metrics.recoveryRate,
      value: `${recoveryRate}%`,
      trend: '+0%',
      trendLabel: t.metrics.fromLastWeek,
      icon: TrendingUp,
      iconColor: 'text-purple-400',
      iconBg: 'bg-purple-500/10',
      trendColor: 'text-green-400',
    },
    {
      label: t.metrics.atRiskAmount,
      value: formatCurrency(totalFailed),
      trend: t.metrics.unrecovered,
      trendLabel: t.metrics.needsAttention,
      icon: Activity,
      iconColor: 'text-orange-400',
      iconBg: 'bg-orange-500/10',
      trendColor: 'text-orange-400',
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">{t.title}</h1>
        <p className="text-zinc-400 mt-1 text-sm">{t.welcome(fullName)}</p>
      </div>

      {showSetupGuide && (
        <SetupGuide iyzicoConnected={iyzicoConnected} n8nConfigured={n8nConfigured} />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map(({ label, value, trend, trendLabel, icon: Icon, iconColor, iconBg, trendColor }) => (
          <div key={label} className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900 hover:shadow-md hover:border-zinc-700 transition-all duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 ${iconBg} rounded-lg`}>
                <Icon className={`h-5 w-5 ${iconColor}`} />
              </div>
              <ArrowUpRight className="h-4 w-4 text-green-400" />
            </div>
            <h3 className="font-medium text-zinc-400 mb-1 text-sm">{label}</h3>
            <p className="text-2xl font-bold text-white">{value}</p>
            <p className={`text-sm mt-1 ${trendColor}`}>
              {trend} <span className="text-zinc-500">{trendLabel}</span>
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">{t.recentFailures}</h3>
            <Link href="/dashboard/failures" className="text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors">
              {t.viewAll}
            </Link>
          </div>
          {recentFailures.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-zinc-500 text-sm">{t.noFailures}</p>
            </div>
          ) : (
            <div className="space-y-1">
              {recentFailures.map((event, i) => {
                const customer = event.customers
                const iconDef = activityIconMap[i % activityIconMap.length]
                const IconComp = iconDef.icon
                return (
                  <Link key={event.id} href={`/dashboard/failures/${event.id}`}
                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-zinc-800/60 transition-colors cursor-pointer">
                    <div className={`p-2 rounded-lg ${iconDef.bg} shrink-0`}>
                      <IconComp className={`h-4 w-4 ${iconDef.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">
                        {customer?.name || customer?.email || t.unknownCustomer}
                      </p>
                      <p className="text-xs text-zinc-400 truncate mt-0.5">
                        {formatCurrency(event.amount, event.currency)} · {event.failure_message || t.paymentFailed}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-zinc-400 shrink-0">
                      <Clock className="w-3 h-3" />
                      {formatRelativeTime(event.created_at, lang)}
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">{t.quickStats}</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-zinc-400">{t.recoveryRateLabel}</span>
                  <span className="text-sm font-semibold text-white">{recoveryRate}%</span>
                </div>
                <div className="w-full bg-zinc-800 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full transition-all duration-700" style={{ width: `${Math.min(recoveryRate, 100)}%` }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-zinc-400">{t.failureRate}</span>
                  <span className="text-sm font-semibold text-white">
                    {totalFailed > 0 ? Math.round((1 - totalRecovered / totalFailed) * 100) : 100}%
                  </span>
                </div>
                <div className="w-full bg-zinc-800 rounded-full h-2">
                  <div className="bg-orange-500 h-2 rounded-full transition-all duration-700"
                    style={{ width: `${totalFailed > 0 ? Math.min(Math.round((1 - totalRecovered / totalFailed) * 100), 100) : 100}%` }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-zinc-400">{t.recovered}</span>
                  <span className="text-sm font-semibold text-white">{recoveredCount} {t.payments}</span>
                </div>
                <div className="w-full bg-zinc-800 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full transition-all duration-700"
                    style={{ width: `${Math.min(recoveredCount * 10, 100)}%` }} />
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">{t.summary}</h3>
            <div className="space-y-3">
              {[
                { label: t.activeFailuresLabel, value: activeFailures, color: 'text-red-400' },
                { label: t.recoveredLabel, value: recoveredCount, color: 'text-green-400' },
                { label: t.totalEvents, value: activeFailures + recoveredCount, color: 'text-blue-400' },
                { label: t.analyticsDays, value: analyticsLength, color: 'text-purple-400' },
              ].map(({ label, value, color }) => (
                <div key={label} className="flex items-center justify-between py-2 border-b border-zinc-800 last:border-0">
                  <span className="text-sm text-zinc-400">{label}</span>
                  <span className={`text-sm font-bold ${color}`}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
