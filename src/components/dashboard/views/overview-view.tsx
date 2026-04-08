'use client'

import { useLanguage } from '@/lib/language-context'
import { dashboardTranslations } from '@/lib/dashboard-translations'
import { formatCurrency, formatRelativeTime } from '@/lib/utils'
import { TrendingUp, AlertTriangle, Timer, RefreshCw, Mail, Plus } from 'lucide-react'
import { SetupGuide } from '@/components/dashboard/setup-guide'
import { RealtimeUpdater } from '@/components/dashboard/realtime-updater'
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
  orgId: string
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

const BAR_HEIGHTS = [40, 55, 35, 65, 85, 75, 90, 60, 50, 70, 80, 45]

function getFailureBadge(amount: number, createdAt: string): { label: string; className: string } {
  const minutesAgo = (Date.now() - new Date(createdAt).getTime()) / 60000
  if (amount >= 500) return { label: 'YÜKSEK DEĞER', className: 'bg-red-500/20 text-red-400' }
  if (minutesAgo < 10) return { label: 'KRİTİK', className: 'bg-red-500/20 text-red-400' }
  return { label: 'BEKLEMEDE', className: 'bg-zinc-700/60 text-zinc-400' }
}

function CustomerAvatar({ name, email }: { name?: string; email?: string }) {
  const initials = (name || email || '?').slice(0, 2).toUpperCase()
  return (
    <div className="w-12 h-12 rounded-full bg-[#9fff88]/10 flex items-center justify-center text-[#9fff88] font-black text-sm shrink-0">
      {initials}
    </div>
  )
}

export function OverviewView({
  orgId, fullName, showSetupGuide, iyzicoConnected, n8nConfigured,
  totalRecovered, totalFailed, recoveryRate, activeFailures,
  recoveredCount, analyticsLength, recentFailures,
}: Props) {
  const { lang } = useLanguage()
  const t = dashboardTranslations[lang].overview

  const retrySuccessRate = recoveredCount > 0 && activeFailures > 0
    ? Math.round((recoveredCount / (recoveredCount + activeFailures)) * 100)
    : recoveredCount > 0 ? 100 : 0

  return (
    <div className="space-y-8">
      <RealtimeUpdater orgId={orgId} />

      {showSetupGuide && (
        <SetupGuide iyzicoConnected={iyzicoConnected} n8nConfigured={n8nConfigured} />
      )}

      {/* Hero Summary */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1 */}
        <div className="bg-[#1a1919] p-8 rounded-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-[#9fff88] shadow-[0_0_15px_rgba(159,255,136,0.5)]" />
          <p className="text-[10px] font-bold text-zinc-500 tracking-widest uppercase mb-2">
            Kurtarılan Toplam
          </p>
          <h2 className="text-5xl font-black tracking-tight text-white mb-2">
            {formatCurrency(totalRecovered)}
          </h2>
          <div className="flex items-center gap-2 text-[#9fff88] text-sm font-bold">
            <TrendingUp className="w-4 h-4" />
            <span>{t.metrics.fromLastMonth}</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-[#1a1919] p-8 rounded-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-[#9fff88]/40" />
          <p className="text-[10px] font-bold text-zinc-500 tracking-widest uppercase mb-2">
            Kurtarma Oranı
          </p>
          <h2 className="text-5xl font-black tracking-tight text-white mb-2">
            {recoveryRate}%
          </h2>
          <div className="flex items-center gap-2 text-[#9fff88] text-sm font-bold">
            <span className="text-lg">⚡</span>
            <span>Sektör ortalamasının üzerinde</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-[#1a1919] p-8 rounded-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-red-500 shadow-[0_0_15px_rgba(255,115,81,0.5)]" />
          <p className="text-[10px] font-bold text-zinc-500 tracking-widest uppercase mb-2">
            Aktif Hatalar
          </p>
          <h2 className="text-5xl font-black tracking-tight text-white mb-2">
            {activeFailures}
          </h2>
          <div className="flex items-center gap-2 text-red-400 text-sm font-bold">
            <AlertTriangle className="w-4 h-4" />
            <span>Müdahale bekliyor</span>
          </div>
        </div>
      </section>

      {/* Bento: Chart + Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart */}
        <div className="lg:col-span-2 bg-[#1a1919] rounded-xl p-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h3 className="text-2xl font-extrabold text-white mb-1">Kurtarma Trendleri</h3>
              <p className="text-sm text-zinc-500">Son 30 günlük performans akışı</p>
            </div>
            <div className="flex bg-[#262626] p-1 rounded-lg">
              <button className="px-4 py-1.5 text-xs font-bold text-black bg-[#9fff88] rounded-md shadow-sm">
                GÜNLÜK
              </button>
              <button className="px-4 py-1.5 text-xs font-bold text-zinc-500 hover:text-white transition-colors">
                HAFTALIK
              </button>
            </div>
          </div>

          <div className="h-64 flex items-end justify-between gap-2">
            {BAR_HEIGHTS.map((h, i) => {
              const isHighest = h === Math.max(...BAR_HEIGHTS)
              return (
                <div
                  key={i}
                  className={`w-full rounded-t-sm transition-all ${
                    isHighest
                      ? 'bg-[#9fff88]/40 border-t-2 border-[#9fff88] hover:bg-[#9fff88]/60'
                      : i >= BAR_HEIGHTS.length - 3
                      ? 'bg-[#9fff88]/20 hover:bg-[#9fff88]/40'
                      : 'bg-[#9fff88]/10 hover:bg-[#9fff88]/30'
                  }`}
                  style={{ height: `${h}%` }}
                />
              )
            })}
          </div>

          <div className="flex justify-between mt-6 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
            <span>21 gün önce</span>
            <span>14 gün önce</span>
            <span>7 gün önce</span>
            <span>Bugün</span>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-[#201f1f] rounded-xl p-8 space-y-8">
          <h3 className="text-xl font-extrabold text-white">Hızlı İstatistikler</h3>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#262626] flex items-center justify-center text-[#9fff88]">
                  <Timer className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-zinc-500 font-medium">Aktif Başarısızlık</p>
                  <p className="text-lg font-bold text-white">{activeFailures}</p>
                </div>
              </div>
              <div className="h-1.5 w-12 bg-[#262626] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#9fff88] rounded-full"
                  style={{ width: `${Math.min(activeFailures * 2, 100)}%` }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#262626] flex items-center justify-center text-[#9fff88]">
                  <RefreshCw className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-zinc-500 font-medium">Kurtarma Başarısı</p>
                  <p className="text-lg font-bold text-white">{retrySuccessRate}%</p>
                </div>
              </div>
              <div className="h-1.5 w-12 bg-[#262626] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#9fff88] rounded-full"
                  style={{ width: `${retrySuccessRate}%` }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#262626] flex items-center justify-center text-[#9fff88]">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-zinc-500 font-medium">Kurtarılan Ödeme</p>
                  <p className="text-lg font-bold text-white">{recoveredCount}</p>
                </div>
              </div>
              <div className="h-1.5 w-12 bg-[#262626] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#9fff88] rounded-full"
                  style={{ width: `${Math.min(recoveredCount * 5, 100)}%` }}
                />
              </div>
            </div>
          </div>

          <Link
            href="/dashboard/analytics"
            className="w-full py-4 bg-[#9fff88] text-black font-black rounded-xl flex items-center justify-center hover:bg-[#8aee72] active:scale-95 transition-all shadow-lg shadow-[#9fff88]/20"
          >
            ANALİTİĞE GİT
          </Link>
        </div>
      </div>

      {/* Recent Failures */}
      <section className="bg-[#1a1919] rounded-xl overflow-hidden">
        <div className="px-8 py-6 flex justify-between items-center bg-[#131313]">
          <h3 className="text-xl font-extrabold text-white">{t.recentFailures}</h3>
          <Link href="/dashboard/failures" className="text-[#9fff88] text-xs font-bold hover:underline">
            {t.viewAll}
          </Link>
        </div>

        <div className="divide-y divide-zinc-800/50">
          {recentFailures.length === 0 ? (
            <div className="px-8 py-12 text-center">
              <p className="text-zinc-500 text-sm">{t.noFailures}</p>
            </div>
          ) : (
            recentFailures.map((event) => {
              const customer = event.customers
              const badge = getFailureBadge(event.amount, event.created_at)
              return (
                <Link
                  key={event.id}
                  href={`/dashboard/failures/${event.id}`}
                  className="px-8 py-5 flex items-center justify-between hover:bg-[#201f1f] transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <CustomerAvatar name={customer?.name} email={customer?.email} />
                    <div>
                      <p className="font-bold text-white">
                        {customer?.name || customer?.email || t.unknownCustomer}
                      </p>
                      <p className="text-xs text-zinc-500">
                        {event.failure_message || t.paymentFailed}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-black text-white">
                      {formatCurrency(event.amount, event.currency)}
                    </p>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${badge.className}`}>
                      {badge.label}
                    </span>
                  </div>

                  <div className="hidden md:block text-right">
                    <p className="text-xs font-medium text-zinc-500">Oluşturulma</p>
                    <p className="text-xs font-bold text-[#9fff88]">
                      {formatRelativeTime(event.created_at, lang)}
                    </p>
                  </div>
                </Link>
              )
            })
          )}
        </div>
      </section>

      {/* FAB */}
      <Link
        href="/dashboard/sequences"
        className="fixed bottom-8 right-8 w-16 h-16 bg-[#9fff88] rounded-full flex items-center justify-center shadow-2xl shadow-[#9fff88]/40 hover:scale-105 active:scale-95 transition-all group z-50"
      >
        <Plus className="w-7 h-7 text-black" />
        <span className="absolute right-20 bg-[#201f1f] text-white px-4 py-2 rounded-lg text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-zinc-700">
          Yeni Kurtarma Sekansı
        </span>
      </Link>
    </div>
  )
}
