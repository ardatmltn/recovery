'use client'

import { useLanguage } from '@/lib/language-context'
import { dashboardTranslations } from '@/lib/dashboard-translations'
import { formatCurrency } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AnalyticsCharts } from '@/components/dashboard/analytics-charts'

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
      <AnalyticsCharts data={analytics} />
    </div>
  )
}
