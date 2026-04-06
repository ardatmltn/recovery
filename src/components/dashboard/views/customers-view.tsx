'use client'

import { useLanguage } from '@/lib/language-context'
import { dashboardTranslations } from '@/lib/dashboard-translations'
import { formatCurrency, formatRelativeTime, getRiskLabel } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

type Customer = {
  id: string
  name: string | null
  email: string | null
  risk_score: number
  total_failed_payments: number
  total_recovered_amount: number
  last_payment_failed_at: string | null
}

export function CustomersView({ customers }: { customers: Customer[] }) {
  const { lang } = useLanguage()
  const t = dashboardTranslations[lang].customers

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
              <th className="text-left px-4 py-3 font-medium">{t.colRisk}</th>
              <th className="text-left px-4 py-3 font-medium">{t.colFailedPayments}</th>
              <th className="text-left px-4 py-3 font-medium">{t.colRecovered}</th>
              <th className="text-left px-4 py-3 font-medium">{t.colLastFailure}</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {customers.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">{t.noCustomers}</td>
              </tr>
            ) : (
              customers.map((customer) => {
                const risk = getRiskLabel(customer.risk_score, lang)
                return (
                  <tr key={customer.id} className="hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <a href={`/dashboard/customers/${customer.id}`} className="block">
                        <p className="font-medium">{customer.name ?? '—'}</p>
                        <p className="text-xs text-muted-foreground">{customer.email ?? '—'}</p>
                      </a>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{customer.risk_score}</span>
                        <Badge variant={risk.variant === 'warning' ? 'secondary' : risk.variant}>{risk.label}</Badge>
                      </div>
                    </td>
                    <td className="px-4 py-3">{customer.total_failed_payments}</td>
                    <td className="px-4 py-3">{formatCurrency(customer.total_recovered_amount)}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {customer.last_payment_failed_at ? formatRelativeTime(customer.last_payment_failed_at, lang) : '—'}
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
