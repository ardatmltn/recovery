'use client'

import { useLanguage } from '@/lib/language-context'
import { dashboardTranslations } from '@/lib/dashboard-translations'
import { formatCurrency, formatDateTime, formatRelativeTime } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RecoveryTimeline } from '@/components/dashboard/recovery-timeline'

type Attempt = {
  id: string
  step_number: number
  type: string
  status: string
  scheduled_at: string
  executed_at: string | null
  message_templates: { name: string; type: string } | null
}

type Props = {
  event: {
    provider_event_id: string | null
    amount: number
    currency: string
    status: string
    failure_code: string | null
    failure_message: string | null
    created_at: string
    customers: { name?: string; email?: string } | null
  }
  attempts: Attempt[]
}

export function FailureDetailView({ event, attempts }: Props) {
  const { lang } = useLanguage()
  const t = dashboardTranslations[lang].failures.detail

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold">{t.title}</h1>
        <p className="text-muted-foreground text-sm">{event.provider_event_id}</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle className="text-sm">{t.cardCustomer}</CardTitle></CardHeader>
          <CardContent className="space-y-1 text-sm">
            <p className="font-medium">{event.customers?.name ?? '—'}</p>
            <p className="text-muted-foreground">{event.customers?.email ?? '—'}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-sm">{t.cardPayment}</CardTitle></CardHeader>
          <CardContent className="space-y-1 text-sm">
            <p className="text-xl font-bold">{formatCurrency(event.amount, event.currency)}</p>
            <Badge>{event.status}</Badge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-sm">{t.cardFailure}</CardTitle></CardHeader>
          <CardContent className="space-y-1 text-sm">
            <p className="font-medium">{event.failure_code ?? '—'}</p>
            <p className="text-muted-foreground">{event.failure_message ?? '—'}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-sm">{t.cardTimeline}</CardTitle></CardHeader>
          <CardContent className="text-sm">
            <p className="text-muted-foreground">{formatDateTime(event.created_at)}</p>
            <p className="text-xs text-muted-foreground">{formatRelativeTime(event.created_at, lang)}</p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader><CardTitle>{t.recoveryTimeline}</CardTitle></CardHeader>
        <CardContent>
          <RecoveryTimeline attempts={attempts} emptyText={t.noAttempts} />
        </CardContent>
      </Card>
    </div>
  )
}
