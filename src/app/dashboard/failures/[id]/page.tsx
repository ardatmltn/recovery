import { notFound } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency, formatDateTime, formatRelativeTime } from '@/lib/utils'

export default async function FailureDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createServerClient()

  const { data: event } = await supabase
    .from('payment_events')
    .select('*, customers(name, email, risk_score, provider_customer_id)')
    .eq('id', id)
    .single()

  if (!event) notFound()

  const { data: attempts } = await supabase
    .from('recovery_attempts')
    .select('*, message_templates(name, type)')
    .eq('payment_event_id', id)
    .order('step_number', { ascending: true })

  const customer = event.customers as { name?: string; email?: string; risk_score?: number; provider_customer_id?: string } | null

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold">Payment Failure Detail</h1>
        <p className="text-muted-foreground text-sm">{event.provider_event_id}</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle className="text-sm">Customer</CardTitle></CardHeader>
          <CardContent className="space-y-1 text-sm">
            <p className="font-medium">{customer?.name ?? '—'}</p>
            <p className="text-muted-foreground">{customer?.email ?? '—'}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-sm">Payment</CardTitle></CardHeader>
          <CardContent className="space-y-1 text-sm">
            <p className="text-xl font-bold">{formatCurrency(event.amount, event.currency)}</p>
            <Badge>{event.status}</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-sm">Failure</CardTitle></CardHeader>
          <CardContent className="space-y-1 text-sm">
            <p className="font-medium">{event.failure_code ?? '—'}</p>
            <p className="text-muted-foreground">{event.failure_message ?? '—'}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-sm">Timeline</CardTitle></CardHeader>
          <CardContent className="text-sm">
            <p className="text-muted-foreground">{formatDateTime(event.created_at)}</p>
            <p className="text-xs text-muted-foreground">{formatRelativeTime(event.created_at)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Recovery timeline */}
      <Card>
        <CardHeader><CardTitle>Recovery Timeline</CardTitle></CardHeader>
        <CardContent>
          {!attempts || attempts.length === 0 ? (
            <p className="text-sm text-muted-foreground">No recovery attempts yet.</p>
          ) : (
            <div className="space-y-3">
              {attempts.map((attempt) => {
                const template = attempt.message_templates as { name: string; type: string } | null
                return (
                  <div key={attempt.id} className="flex items-start gap-4 p-3 rounded-lg border">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold shrink-0">
                      {attempt.step_number}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium capitalize">{attempt.type.replace('_', ' ')}</span>
                        {template && <span className="text-xs text-muted-foreground">— {template.name}</span>}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Scheduled: {formatDateTime(attempt.scheduled_at)}
                      </p>
                      {attempt.executed_at && (
                        <p className="text-xs text-muted-foreground">
                          Executed: {formatDateTime(attempt.executed_at)}
                        </p>
                      )}
                    </div>
                    <Badge variant={
                      attempt.status === 'succeeded' ? 'default' :
                      attempt.status === 'failed' ? 'destructive' : 'secondary'
                    }>
                      {attempt.status}
                    </Badge>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
