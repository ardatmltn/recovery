import { createServerClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatCurrency, formatRelativeTime } from '@/lib/utils'
import { DollarSign, AlertCircle, TrendingUp, Activity } from 'lucide-react'
import { SetupGuide } from '@/components/dashboard/setup-guide'

export default async function DashboardPage() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: userData } = await supabase
    .from('users')
    .select('org_id')
    .eq('id', user!.id)
    .single()

  const orgId = userData?.org_id ?? ''

  // Fetch org settings for setup guide
  const { data: org } = await supabase
    .from('organizations')
    .select('iyzico_connected, n8n_webhook_url')
    .eq('id', orgId)
    .single()

  // Fetch recent payment events
  const { data: recentFailures } = await supabase
    .from('payment_events')
    .select('*, customers(name, email)')
    .eq('org_id', orgId)
    .in('status', ['new', 'processing'])
    .order('created_at', { ascending: false })
    .limit(5)

  // Fetch analytics summary (last 30 days)
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Overview</h1>
        <p className="text-muted-foreground">Last 30 days performance</p>
      </div>

      {showSetupGuide && (
        <SetupGuide
          iyzicoConnected={!!org?.iyzico_connected}
          n8nConfigured={!!org?.n8n_webhook_url}
        />
      )}

      {/* Metric cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Recovered Revenue</CardTitle>
            <DollarSign className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalRecovered)}</div>
            <p className="text-xs text-muted-foreground mt-1">Last 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Recovery Rate</CardTitle>
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recoveryRate}%</div>
            <p className="text-xs text-muted-foreground mt-1">Of failed payments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Failures</CardTitle>
            <AlertCircle className="w-4 h-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeFailures ?? 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Needs attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Failed Amount</CardTitle>
            <Activity className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalFailed)}</div>
            <p className="text-xs text-muted-foreground mt-1">At risk</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent failures */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Failures</CardTitle>
        </CardHeader>
        <CardContent>
          {!recentFailures || recentFailures.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">
              No active failures. Great work!
            </p>
          ) : (
            <div className="space-y-3">
              {recentFailures.map((event) => (
                <a
                  key={event.id}
                  href={`/dashboard/failures/${event.id}`}
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">
                      {(event.customers as { name?: string; email?: string } | null)?.name ||
                        (event.customers as { name?: string; email?: string } | null)?.email ||
                        'Unknown customer'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatRelativeTime(event.created_at)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 ml-4">
                    <span className="text-sm font-semibold">
                      {formatCurrency(event.amount, event.currency)}
                    </span>
                    <Badge variant={event.status === 'processing' ? 'secondary' : 'destructive'}>
                      {event.status}
                    </Badge>
                  </div>
                </a>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
