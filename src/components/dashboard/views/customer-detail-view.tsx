'use client'

import { useLanguage } from '@/lib/language-context'
import { dashboardTranslations } from '@/lib/dashboard-translations'
import { formatCurrency, formatDateTime, getRiskLabel } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type Customer = {
  name: string | null
  email: string | null
  provider_customer_id: string | null
  risk_score: number
  total_failed_payments: number
  total_recovered_amount: number
}

type Event = {
  id: string
  amount: number
  currency: string
  status: string
  failure_code: string | null
  created_at: string
}

export function CustomerDetailView({ customer, events }: { customer: Customer; events: Event[] }) {
  const { lang } = useLanguage()
  const t = dashboardTranslations[lang].customers.detail
  const risk = getRiskLabel(customer.risk_score, lang)

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
              <Badge variant={risk.variant === 'warning' ? 'secondary' : risk.variant}>{risk.label}</Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-sm">{t.cardFailedPayments}</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">{customer.total_failed_payments}</p></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-sm">{t.cardTotalRecovered}</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">{formatCurrency(customer.total_recovered_amount)}</p></CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader><CardTitle>{t.paymentHistory}</CardTitle></CardHeader>
        <CardContent>
          {events.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t.noHistory}</p>
          ) : (
            <div className="space-y-2">
              {events.map((event) => (
                <a key={event.id} href={`/dashboard/failures/${event.id}`}
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50">
                  <div>
                    <p className="text-sm font-medium">{formatCurrency(event.amount, event.currency)}</p>
                    <p className="text-xs text-muted-foreground">{formatDateTime(event.created_at)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {event.failure_code && <span className="text-xs text-muted-foreground">{event.failure_code}</span>}
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
