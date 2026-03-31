'use client'

import {
  AreaChart,
  Area,
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

type Props = {
  data: DailyAnalytics[]
}

export function AnalyticsCharts({ data }: Props) {
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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle>Revenue Recovery</CardTitle></CardHeader>
        <CardContent>
          {data.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">No data yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `$${v}`} />
                <Tooltip formatter={(v) => [`$${Number(v).toFixed(0)}`, '']} />
                <Area type="monotone" dataKey="recovered" stroke="hsl(var(--primary))" fill="hsl(var(--primary)/0.1)" name="Recovered" />
                <Area type="monotone" dataKey="failed" stroke="hsl(var(--destructive))" fill="hsl(var(--destructive)/0.1)" name="Failed" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Recovery by Channel</CardTitle></CardHeader>
        <CardContent>
          {data.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">No data yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={channelData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="retry" fill="hsl(var(--primary))" name="Auto Retry" />
                <Bar dataKey="email" fill="hsl(var(--primary)/0.6)" name="Email" />
                <Bar dataKey="sms" fill="hsl(var(--primary)/0.3)" name="SMS" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
