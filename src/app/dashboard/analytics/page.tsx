import { createServerClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils'
import { AnalyticsCharts } from '@/components/dashboard/analytics-charts'
import { dashboardTranslations } from '@/lib/dashboard-translations'
import type { Lang } from '@/lib/language-context'

export default async function AnalyticsPage() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  const cookieStore = await cookies()
  const lang = (cookieStore.get('recoverly-lang')?.value ?? 'en') as Lang
  const t = dashboardTranslations[lang].analytics

  const { data: userData } = await supabase
    .from('users').select('org_id').eq('id', user!.id).single()

  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const { data: analytics } = await supabase
    .from('daily_analytics')
    .select('*')
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
    ? Math.round((totals.recovered / totals.failed) * 100)
    : 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t.title}</h1>
        <p className="text-muted-foreground">{t.subtitle}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">{t.recovered}</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">{formatCurrency(totals.recovered)}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">{t.recoveryRate}</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">{overallRate}%</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">{t.retrySuccess}</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">{totals.retrySuccess}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">{t.emailSuccess}</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">{totals.emailSuccess}</p></CardContent>
        </Card>
      </div>

      <AnalyticsCharts data={analytics ?? []} />
    </div>
  )
}
