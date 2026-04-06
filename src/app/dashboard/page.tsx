import { createServerClient } from '@/lib/supabase/server'
import { OverviewView } from '@/components/dashboard/views/overview-view'

export default async function DashboardPage() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: userData } = await supabase
    .from('users').select('org_id, full_name').eq('id', user!.id).single()
  const orgId = userData?.org_id ?? ''

  const { data: org } = await supabase
    .from('organizations').select('iyzico_connected, n8n_webhook_url')
    .eq('id', orgId).single()

  const { data: recentFailures } = await supabase
    .from('payment_events')
    .select('id, amount, currency, failure_message, created_at, customers(name, email)')
    .eq('org_id', orgId).in('status', ['new', 'processing'])
    .order('created_at', { ascending: false }).limit(5)

  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const { data: analytics } = await supabase
    .from('daily_analytics').select('total_recovered_amount, total_failed_amount')
    .eq('org_id', orgId).gte('date', thirtyDaysAgo.toISOString().split('T')[0])

  const totalRecovered = analytics?.reduce((s, a) => s + (a.total_recovered_amount ?? 0), 0) ?? 0
  const totalFailed = analytics?.reduce((s, a) => s + (a.total_failed_amount ?? 0), 0) ?? 0
  const recoveryRate = totalFailed > 0 ? Math.round((totalRecovered / totalFailed) * 100) : 0

  const { count: activeFailures } = await supabase
    .from('payment_events').select('*', { count: 'exact', head: true })
    .eq('org_id', orgId).in('status', ['new', 'processing'])

  const { count: recoveredCount } = await supabase
    .from('payment_events').select('*', { count: 'exact', head: true })
    .eq('org_id', orgId).eq('status', 'recovered')

  const showSetupGuide =
    !org?.iyzico_connected || !org?.n8n_webhook_url ||
    (activeFailures === 0 && (!analytics || analytics.length === 0))

  const failures = (recentFailures ?? []).map((e) => ({
    id: e.id,
    amount: e.amount,
    currency: e.currency,
    failure_message: e.failure_message,
    created_at: e.created_at,
    customers: e.customers as { name?: string; email?: string } | null,
  }))

  return (
    <OverviewView
      orgId={orgId}
      fullName={userData?.full_name ?? undefined}
      showSetupGuide={showSetupGuide}
      iyzicoConnected={!!org?.iyzico_connected}
      n8nConfigured={!!org?.n8n_webhook_url}
      totalRecovered={totalRecovered}
      totalFailed={totalFailed}
      recoveryRate={recoveryRate}
      activeFailures={activeFailures ?? 0}
      recoveredCount={recoveredCount ?? 0}
      analyticsLength={analytics?.length ?? 0}
      recentFailures={failures}
    />
  )
}
