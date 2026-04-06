'use client'

import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { DailyAnalytics } from '@/types/database'
import { format } from 'date-fns'
import { useLanguage } from '@/lib/language-context'
import { dashboardTranslations } from '@/lib/dashboard-translations'

type Props = {
  data: DailyAnalytics[]
}

export function AnalyticsCharts({ data }: Props) {
  const { lang } = useLanguage()
  const t = dashboardTranslations[lang].analytics

  const chartData = data.map((row) => ({
    date: format(new Date(row.date), 'MMM d'),
    recovered: row.total_recovered_amount / 100,
    failed: row.total_failed_amount / 100,
    rate: Number(row.recovery_rate),
  }))

  const channelData = data.map((row) => ({
    date: format(new Date(row.date), 'MMM d'),
    retry: row.retry_success_count,
    email: row.email_success_count,
    sms: row.sms_success_count,
  }))

  const noData = (
    <p className="text-sm text-muted-foreground py-8 text-center">{t.chartNoData}</p>
  )

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle>{t.chartRevenue}</CardTitle></CardHeader>
        <CardContent>
          {data.length === 0 ? noData : (
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `$${v}`} />
                <Tooltip formatter={(v) => [`$${Number(v).toFixed(0)}`, '']} />
                <Area type="monotone" dataKey="recovered" stroke="hsl(var(--primary))" fill="hsl(var(--primary)/0.1)" name={t.recovered} />
                <Area type="monotone" dataKey="failed" stroke="hsl(var(--destructive))" fill="hsl(var(--destructive)/0.1)" name={t.failed} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>{t.chartRate}</CardTitle></CardHeader>
        <CardContent>
          {data.length === 0 ? noData : (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `${v}%`} domain={[0, 100]} />
                <Tooltip formatter={(v) => [`${Number(v).toFixed(1)}%`, t.recoveryRate]} />
                <Line type="monotone" dataKey="rate" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} name={t.recoveryRate} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>{t.chartChannel}</CardTitle></CardHeader>
        <CardContent>
          {data.length === 0 ? noData : (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={channelData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="retry" fill="hsl(var(--primary))" name={t.autoRetry} />
                <Bar dataKey="email" fill="hsl(var(--primary)/0.6)" name={t.email} />
                <Bar dataKey="sms" fill="hsl(var(--primary)/0.3)" name={t.sms} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
