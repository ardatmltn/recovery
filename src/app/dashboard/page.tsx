import { createServerClient } from '@/lib/supabase/server'
import { formatCurrency, formatRelativeTime } from '@/lib/utils'
import { DollarSign, AlertCircle, TrendingUp, Activity, ArrowRight } from 'lucide-react'
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
      label: 'Recovered Revenue',
      value: formatCurrency(totalRecovered),
      sub: 'Last 30 days',
      icon: DollarSign,
      color: 'text-green-400',
      bg: 'bg-green-500/10',
      border: 'border-green-500/20',
    },
    {
      label: 'Recovery Rate',
      value: `${recoveryRate}%`,
      sub: 'Of failed payments',
      icon: TrendingUp,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20',
    },
    {
      label: 'Active Failures',
      value: String(activeFailures ?? 0),
      sub: 'Needs attention',
      icon: AlertCircle,
      color: 'text-red-400',
      bg: 'bg-red-500/10',
      border: 'border-red-500/20',
    },
    {
      label: 'Failed Amount',
      value: formatCurrency(totalFailed),
      sub: 'At risk',
      icon: Activity,
      color: 'text-orange-400',
      bg: 'bg-orange-500/10',
      border: 'border-orange-500/20',
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-bold text-white text-2xl">Overview</h1>
        <p className="text-zinc-500 text-sm mt-0.5">Last 30 days performance</p>
      </div>

      {showSetupGuide && (
        <SetupGuide
          iyzicoConnected={!!org?.iyzico_connected}
          n8nConfigured={!!org?.n8n_webhook_url}
        />
      )}

      {/* Metric cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {metrics.map(({ label, value, sub, icon: Icon, color, bg, border }) => (
          <div key={label} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="text-zinc-500 text-xs font-medium">{label}</p>
              <div className={`w-8 h-8 rounded-lg ${bg} border ${border} flex items-center justify-center`}>
                <Icon className={`w-4 h-4 ${color}`} />
              </div>
            </div>
            <p className="font-display font-bold text-white text-2xl">{value}</p>
            <p className="text-zinc-600 text-xs mt-1">{sub}</p>
          </div>
        ))}
      </div>

      {/* Recent failures */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
          <h2 className="font-semibold text-white text-sm">Recent Failures</h2>
          <Link
            href="/dashboard/failures"
            className="flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {!recentFailures || recentFailures.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-zinc-600 text-sm">No active failures. Great work!</p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-800">
            {recentFailures.map((event) => {
              const customer = event.customers as { name?: string; email?: string } | null
              return (
                <Link
                  key={event.id}
                  href={`/dashboard/failures/${event.id}`}
                  className="flex items-center justify-between px-5 py-3.5 hover:bg-zinc-800/50 transition-colors"
                >
                  <div className="min-w-0">
                    <p className="text-sm text-white font-medium truncate">
                      {customer?.name || customer?.email || 'Unknown customer'}
                    </p>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      {formatRelativeTime(event.created_at)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 ml-4 shrink-0">
                    <span className="text-sm font-semibold text-white">
                      {formatCurrency(event.amount, event.currency)}
                    </span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      event.status === 'processing'
                        ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                        : 'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}>
                      {event.status}
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
