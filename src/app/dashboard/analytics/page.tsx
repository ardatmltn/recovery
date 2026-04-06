import { createServerClient } from '@/lib/supabase/server'
import { AnalyticsView } from '@/components/dashboard/views/analytics-view'

export default async function AnalyticsPage() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: userData } = await supabase
    .from('users').select('org_id').eq('id', user!.id).single()

  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const { data: analytics } = await supabase
    .from('daily_analytics').select('*')
    .eq('org_id', userData?.org_id ?? '')
    .gte('date', thirtyDaysAgo.toISOString().split('T')[0])
    .order('date', { ascending: true })

  const totals = analytics?.reduce(
    (acc, row) => ({
      recovered: acc.recovered + row.total_recovered_amount,
      failed: acc.failed + row.total_failed_amount,
      retrySuccess: acc.retrySuccess + row.retry_success_count,
      emailSuccess: acc.emailSuccess + row.email_success_count,
      smsSuccess: acc.smsSuccess + row.sms_success_count,
    }),
    { recovered: 0, failed: 0, retrySuccess: 0, emailSuccess: 0, smsSuccess: 0 }
  ) ?? { recovered: 0, failed: 0, retrySuccess: 0, emailSuccess: 0, smsSuccess: 0 }

  const overallRate = totals.failed > 0
    ? Math.round((totals.recovered / totals.failed) * 100) : 0

  return <AnalyticsView analytics={analytics ?? []} totals={totals} overallRate={overallRate} />
}
