import { createServerClient } from '@/lib/supabase/server'
import { formatCurrency, formatRelativeTime } from '@/lib/utils'
import { DollarSign, AlertCircle, TrendingUp, Activity, ArrowRight, ChevronRight } from 'lucide-react'
import { SetupGuide } from '@/components/dashboard/setup-guide'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: userData } = await supabase
    .from('users')
    .select('org_id')
    .eq('id', user!.id)
    .single()

  const orgId = userData?.org_id ?? ''

  const { data: org } = await supabase
    .from('organizations')
    .select('iyzico_connected, n8n_webhook_url')
    .eq('id', orgId)
    .single()

  const { data: recentFailures } = await supabase
    .from('payment_events')
    .select('*, customers(name, email)')
    .eq('org_id', orgId)
    .in('status', ['new', 'processing'])
    .order('created_at', { ascending: false })
    .limit(5)

  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const { data: analytics } = await supabase
    .from('daily_analytics')
    .select('*')
    .eq('org_id', orgId)
    .gte('date', thirtyDaysAgo.toISOString().split('T')[0])

  const totalRecovered = analytics?.reduce((sum, a) => sum + a.total_recovered_amount, 0) ?? 0
  const totalFailed = analytics?.reduce((sum, a) => sum + a.total_failed_amount, 0) ?? 0
  const recoveryRate = totalFailed > 0 ? Math.round((totalRecovered / totalFailed) * 100) : 0

  const { count: activeFailures } = await supabase
    .from('payment_events')
    .select('*', { count: 'exact', head: true })
    .eq('org_id', orgId)
    .in('status', ['new', 'processing'])

  const showSetupGuide = !org?.iyzico_connected || !org?.n8n_webhook_url || (activeFailures === 0 && (!analytics || analytics.length === 0))

  const metrics = [
    {
      label: 'RECOVERED REVENUE',
      value: formatCurrency(totalRecovered),
      sub: 'Last 30 days',
      icon: DollarSign,
      color: 'text-green-400',
      iconBg: 'bg-green-500/10',
      iconBorder: 'border-green-500/20',
      glow: 'hover:shadow-[0_0_20px_rgba(34,197,94,0.08)]',
      trend: null,
    },
    {
      label: 'RECOVERY RATE',
      value: `${recoveryRate}%`,
      sub: 'Of failed payments',
      icon: TrendingUp,
      color: 'text-blue-400',
      iconBg: 'bg-blue-500/10',
      iconBorder: 'border-blue-500/20',
      glow: 'hover:shadow-[0_0_20px_rgba(59,130,246,0.08)]',
      trend: null,
    },
    {
      label: 'ACTIVE FAILURES',
      value: String(activeFailures ?? 0),
      sub: 'Needs attention',
      icon: AlertCircle,
      color: 'text-red-400',
      iconBg: 'bg-red-500/10',
      iconBorder: 'border-red-500/20',
      glow: 'hover:shadow-[0_0_20px_rgba(239,68,68,0.08)]',
      trend: null,
    },
    {
      label: 'AT-RISK AMOUNT',
      value: formatCurrency(totalFailed),
      sub: 'Unrecovered',
      icon: Activity,
      color: 'text-orange-400',
      iconBg: 'bg-orange-500/10',
      iconBorder: 'border-orange-500/20',
      glow: 'hover:shadow-[0_0_20px_rgba(249,115,22,0.08)]',
      trend: null,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-xl font-bold text-white tracking-tight">Overview</h1>
        <p className="text-sm text-zinc-500 mt-0.5">Last 30 days performance</p>
      </div>

      {showSetupGuide && (
        <SetupGuide
          iyzicoConnected={!!org?.iyzico_connected}
          n8nConfigured={!!org?.n8n_webhook_url}
        />
      )}

      {/* Metric cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {metrics.map(({ label, value, sub, icon: Icon, color, iconBg, iconBorder, glow }) => (
          <div
            key={label}
            className={`group relative bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-2xl p-5 transition-all duration-300 ${glow}`}
          >
            {/* Icon */}
            <div className={`w-9 h-9 rounded-xl ${iconBg} border ${iconBorder} flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110`}>
              <Icon className={`w-4 h-4 ${color}`} />
            </div>

            {/* Value */}
            <p className="text-2xl font-bold text-white tracking-tight leading-none mb-1">
              {value}
            </p>

            {/* Label */}
            <p className="text-[10px] font-semibold tracking-widest text-zinc-500 uppercase mb-0.5">
              {label}
            </p>

            {/* Sub */}
            <p className="text-xs text-zinc-600">{sub}</p>
          </div>
        ))}
      </div>

      {/* Recent failures */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
        {/* Table header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
          <div>
            <h2 className="text-sm font-semibold text-white">Recent Failures</h2>
            <p className="text-xs text-zinc-500 mt-0.5">Active payment failures</p>
          </div>
          <Link
            href="/dashboard/failures"
            className="group inline-flex items-center gap-1 text-xs font-medium text-zinc-400 hover:text-white transition-colors"
          >
            View all
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {!recentFailures || recentFailures.length === 0 ? (
          <div className="py-14 text-center">
            <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center mx-auto mb-3">
              <AlertCircle className="w-4 h-4 text-zinc-600" />
            </div>
            <p className="text-sm font-medium text-zinc-500">No active failures</p>
            <p className="text-xs text-zinc-600 mt-0.5">Great — nothing needs attention right now.</p>
          </div>
        ) : (
          <>
            {/* Column headers */}
            <div className="grid grid-cols-[1fr_auto_auto] gap-4 px-5 py-2.5 border-b border-zinc-800/60">
              <span className="text-[10px] font-semibold tracking-widest text-zinc-600 uppercase">Customer</span>
              <span className="text-[10px] font-semibold tracking-widest text-zinc-600 uppercase text-right">Amount</span>
              <span className="text-[10px] font-semibold tracking-widest text-zinc-600 uppercase w-16 text-center">Status</span>
            </div>

            <div className="divide-y divide-zinc-800/60">
              {recentFailures.map((event) => {
                const customer = event.customers as { name?: string; email?: string } | null
                return (
                  <Link
                    key={event.id}
                    href={`/dashboard/failures/${event.id}`}
                    className="grid grid-cols-[1fr_auto_auto] gap-4 items-center px-5 py-3.5 hover:bg-zinc-800/40 transition-colors group"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-white truncate group-hover:text-green-400 transition-colors">
                        {customer?.name || customer?.email || 'Unknown'}
                      </p>
                      <p className="text-xs text-zinc-500 mt-0.5">
                        {formatRelativeTime(event.created_at)}
                      </p>
                    </div>

                    <span className="text-sm font-semibold text-white tabular-nums text-right">
                      {formatCurrency(event.amount, event.currency)}
                    </span>

                    <span className={`inline-flex items-center justify-center w-16 text-[10px] font-bold px-2 py-1 rounded-full tracking-wide ${
                      event.status === 'processing'
                        ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                        : 'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}>
                      {event.status === 'processing' ? 'ACTIVE' : 'NEW'}
                    </span>
                  </Link>
                )
              })}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
