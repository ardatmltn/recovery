import { notFound } from 'next/navigation'
import { cookies } from 'next/headers'
import { createServerClient } from '@/lib/supabase/server'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency, formatDateTime, getRiskLabel } from '@/lib/utils'
import { dashboardTranslations } from '@/lib/dashboard-translations'
import type { Lang } from '@/lib/language-context'

export default async function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  const cookieStore = await cookies()
  const lang = (cookieStore.get('recoverly-lang')?.value ?? 'en') as Lang
  const t = dashboardTranslations[lang].customers.detail

  const { data: userData } = await supabase
    .from('users').select('org_id').eq('id', user!.id).single()
  const orgId = userData?.org_id ?? ''

  const { data: customer } = await supabase
    .from('customers')
    .select('*')
    .eq('id', id)
    .eq('org_id', orgId)
    .single()

  if (!customer) notFound()

  const { data: events } = await supabase
    .from('payment_events')
    .select('id, amount, currency, status, failure_code, created_at')
    .eq('customer_id', id)
    .eq('org_id', orgId)
    .order('created_at', { ascending: false })
    .limit(20)

  const risk = getRiskLabel(customer.risk_score)

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold">{customer.name ?? customer.email ?? 'Customer'}</h1>
        <p className="text-muted-foreground">{customer.provider_customer_id}</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle className="text-sm">{t.cardContact}</CardTitle></CardHeader>
          <CardContent className="text-sm space-y-1">
            <p>{customer.name ?? '—'}</p>
            <p className="text-muted-foreground">{customer.email ?? '—'}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-sm">{t.cardRiskScore}</CardTitle></CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold">{customer.risk_score}</span>
              <Badge variant={risk.variant === 'warning' ? 'secondary' : risk.variant}>
                {risk.label}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-sm">{t.cardFailedPayments}</CardTitle></CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{customer.total_failed_payments}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-sm">{t.cardTotalRecovered}</CardTitle></CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{formatCurrency(customer.total_recovered_amount)}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>{t.paymentHistory}</CardTitle></CardHeader>
        <CardContent>
          {!events || events.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t.noHistory}</p>
          ) : (
            <div className="space-y-2">
              {events.map((event) => (
                <a
                  key={event.id}
                  href={`/dashboard/failures/${event.id}`}
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50"
                >
                  <div>
                    <p className="text-sm font-medium">{formatCurrency(event.amount, event.currency)}</p>
                    <p className="text-xs text-muted-foreground">{formatDateTime(event.created_at)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {event.failure_code && (
                      <span className="text-xs text-muted-foreground">{event.failure_code}</span>
                    )}
                    <Badge variant={event.status === 'recovered' ? 'default' : event.status === 'new' ? 'destructive' : 'secondary'}>
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
