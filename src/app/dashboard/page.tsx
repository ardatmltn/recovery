import { createServerClient } from '@/lib/supabase/server'
import { formatCurrency, formatRelativeTime } from '@/lib/utils'
import {
  DollarSign, AlertCircle, TrendingUp, Activity,
  ArrowUpRight, Clock, CreditCard, UserPlus, RefreshCw, Bell,
} from 'lucide-react'
import { SetupGuide } from '@/components/dashboard/setup-guide'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: userData } = await supabase
    .from('users')
    .select('org_id, full_name')
    .eq('id', user!.id)
    .single()

  const orgId = userData?.org_id ?? ''

  const { data: org } = await supabase
    .from('organizations')
    .select('iyzico_connected, n8n_webhook_url, name')
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

  const totalRecovered = analytics?.reduce((sum, a) => sum + (a.total_recovered_amount ?? 0), 0) ?? 0
  const totalFailed = analytics?.reduce((sum, a) => sum + (a.total_failed_amount ?? 0), 0) ?? 0
  const recoveryRate = totalFailed > 0 ? Math.round((totalRecovered / totalFailed) * 100) : 0

  const { count: activeFailures } = await supabase
    .from('payment_events')
    .select('*', { count: 'exact', head: true })
    .eq('org_id', orgId)
    .in('status', ['new', 'processing'])

  const { count: recoveredCount } = await supabase
    .from('payment_events')
    .select('*', { count: 'exact', head: true })
    .eq('org_id', orgId)
    .eq('status', 'recovered')

  const showSetupGuide =
    !org?.iyzico_connected ||
    !org?.n8n_webhook_url ||
    (activeFailures === 0 && (!analytics || analytics.length === 0))

  const metrics = [
    {
      label: 'Recovered Revenue',
      value: formatCurrency(totalRecovered),
      trend: '+0%',
      trendLabel: 'from last month',
      icon: DollarSign,
      iconColor: 'text-blue-400',
      iconBg: 'bg-blue-500/10',
      trendColor: 'text-green-400',
    },
    {
      label: 'Active Failures',
      value: String(activeFailures ?? 0),
      trend: '0 new',
      trendLabel: 'this week',
      icon: AlertCircle,
      iconColor: 'text-green-400',
      iconBg: 'bg-green-500/10',
      trendColor: 'text-green-400',
    },
    {
      label: 'Recovery Rate',
      value: `${recoveryRate}%`,
      trend: '+0%',
      trendLabel: 'from last week',
      icon: TrendingUp,
      iconColor: 'text-purple-400',
      iconBg: 'bg-purple-500/10',
      trendColor: 'text-green-400',
    },
    {
      label: 'At-Risk Amount',
      value: formatCurrency(totalFailed),
      trend: 'unrecovered',
      trendLabel: 'needs attention',
      icon: Activity,
      iconColor: 'text-orange-400',
      iconBg: 'bg-orange-500/10',
      trendColor: 'text-orange-400',
    },
  ]

  const activityIconMap = [
    { icon: CreditCard, color: 'text-green-400', bg: 'bg-green-500/10' },
    { icon: UserPlus, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { icon: RefreshCw, color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { icon: Bell, color: 'text-orange-400', bg: 'bg-orange-500/10' },
    { icon: AlertCircle, color: 'text-red-400', bg: 'bg-red-500/10' },
  ]

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard</h1>
        <p className="text-zinc-400 mt-1 text-sm">
          Welcome back{userData?.full_name ? `, ${userData.full_name}` : ''} — here's what's happening.
        </p>
      </div>

      {showSetupGuide && (
        <SetupGuide
          iyzicoConnected={!!org?.iyzico_connected}
          n8nConfigured={!!org?.n8n_webhook_url}
        />
      )}

      {/* Metric cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map(({ label, value, trend, trendLabel, icon: Icon, iconColor, iconBg, trendColor }) => (
          <div
            key={label}
            className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900 hover:shadow-md hover:border-zinc-700 transition-all duration-200"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 ${iconBg} rounded-lg`}>
                <Icon className={`h-5 w-5 ${iconColor}`} />
              </div>
              <ArrowUpRight className="h-4 w-4 text-green-400" />
            </div>
            <h3 className="font-medium text-zinc-400 mb-1 text-sm">{label}</h3>
            <p className="text-2xl font-bold text-white">{value}</p>
            <p className={`text-sm mt-1 ${trendColor}`}>
              {trend}{' '}
              <span className="text-zinc-500">{trendLabel}</span>
            </p>
          </div>
        ))}
      </div>

      {/* 2-column section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Recent Activity (failures) */}
        <div className="lg:col-span-2 rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Recent Failures</h3>
            <Link
              href="/dashboard/failures"
              className="text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors"
            >
              View all
            </Link>
          </div>

          {!recentFailures || recentFailures.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-zinc-500 text-sm">No active failures. Great work!</p>
            </div>
          ) : (
            <div className="space-y-1">
              {recentFailures.map((event, i) => {
                const customer = event.customers as { name?: string; email?: string } | null
                const iconDef = activityIconMap[i % activityIconMap.length]
                const IconComp = iconDef.icon
                return (
                  <Link
                    key={event.id}
                    href={`/dashboard/failures/${event.id}`}
                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-zinc-800/60 transition-colors cursor-pointer"
                  >
                    <div className={`p-2 rounded-lg ${iconDef.bg} shrink-0`}>
                      <IconComp className={`h-4 w-4 ${iconDef.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">
                        {customer?.name || customer?.email || 'Unknown customer'}
                      </p>
                      <p className="text-xs text-zinc-500 truncate mt-0.5">
                        {formatCurrency(event.amount, event.currency)} · {event.failure_message || 'Payment failed'}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-zinc-500 shrink-0">
                      <Clock className="w-3 h-3" />
                      {formatRelativeTime(event.created_at)}
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Quick Stats</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-zinc-400">Recovery Rate</span>
                  <span className="text-sm font-semibold text-white">{recoveryRate}%</span>
                </div>
                <div className="w-full bg-zinc-800 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full transition-all duration-700" style={{ width: `${Math.min(recoveryRate, 100)}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-zinc-400">Failure Rate</span>
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
                  <span className="text-sm text-zinc-400">Recovered</span>
                  <span className="text-sm font-semibold text-white">{recoveredCount ?? 0} payments</span>
                </div>
                <div className="w-full bg-zinc-800 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full transition-all duration-700"
                    style={{ width: `${Math.min((recoveredCount ?? 0) * 10, 100)}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* Summary counts */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Summary</h3>
            <div className="space-y-3">
              {[
                { label: 'Active Failures', value: activeFailures ?? 0, color: 'text-red-400' },
                { label: 'Recovered', value: recoveredCount ?? 0, color: 'text-green-400' },
                { label: 'Total Events', value: (activeFailures ?? 0) + (recoveredCount ?? 0), color: 'text-blue-400' },
                { label: 'Analytics Days', value: analytics?.length ?? 0, color: 'text-purple-400' },
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
