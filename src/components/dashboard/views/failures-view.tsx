'use client'

import { useLanguage } from '@/lib/language-context'
import { dashboardTranslations } from '@/lib/dashboard-translations'
import { formatCurrency, formatRelativeTime } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

const STATUS_VARIANT: Record<string, 'destructive' | 'secondary' | 'outline' | 'default'> = {
  new: 'destructive',
  processing: 'secondary',
  recovered: 'default',
  failed: 'outline',
  ignored: 'outline',
}

type Failure = {
  id: string
  amount: number
  currency: string
  failure_code: string | null
  status: string
  created_at: string
  customers: { name?: string; email?: string } | null
}

export function FailuresView({ failures }: { failures: Failure[] }) {
  const { lang } = useLanguage()
  const t = dashboardTranslations[lang].failures

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t.title}</h1>
        <p className="text-muted-foreground">{t.subtitle}</p>
      </div>
      <div className="rounded-lg border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left px-4 py-3 font-medium">{t.colCustomer}</th>
              <th className="text-left px-4 py-3 font-medium">{t.colAmount}</th>
              <th className="text-left px-4 py-3 font-medium">{t.colFailureReason}</th>
              <th className="text-left px-4 py-3 font-medium">{t.colStatus}</th>
              <th className="text-left px-4 py-3 font-medium">{t.colTime}</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {failures.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">{t.noFailures}</td>
              </tr>
            ) : (
              failures.map((event) => (
                <tr key={event.id} className="hover:bg-muted/30 cursor-pointer">
                  <td className="px-4 py-3">
                    <a href={`/dashboard/failures/${event.id}`} className="block">
                      <p className="font-medium text-foreground">{event.customers?.name ?? '—'}</p>
                      <p className="text-xs text-zinc-400">{event.customers?.email ?? '—'}</p>
                    </a>
                  </td>
                  <td className="px-4 py-3 font-semibold">{formatCurrency(event.amount, event.currency)}</td>
                  <td className="px-4 py-3 text-zinc-300 max-w-xs truncate">{event.failure_code ?? '—'}</td>
                  <td className="px-4 py-3">
                    <Badge variant={STATUS_VARIANT[event.status] ?? 'outline'}>{event.status}</Badge>
                  </td>
                  <td className="px-4 py-3 text-zinc-300">{formatRelativeTime(event.created_at, lang)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
