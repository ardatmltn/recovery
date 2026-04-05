import { createServerClient } from '@/lib/supabase/server'
import { Badge } from '@/components/ui/badge'
import { formatCurrency, formatRelativeTime } from '@/lib/utils'

const STATUS_VARIANT: Record<string, 'destructive' | 'secondary' | 'outline' | 'default'> = {
  new: 'destructive',
  processing: 'secondary',
  recovered: 'default',
  failed: 'outline',
  ignored: 'outline',
}

export default async function FailuresPage() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: userData } = await supabase
    .from('users').select('org_id').eq('id', user!.id).single()

  const { data: failures } = await supabase
    .from('payment_events')
    .select('*, customers(name, email, risk_score)')
    .eq('org_id', userData?.org_id ?? '')
    .order('created_at', { ascending: false })
    .limit(50)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Failed Payments</h1>
        <p className="text-muted-foreground">All payment failures and their recovery status</p>
      </div>

      <div className="rounded-lg border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Customer</th>
              <th className="text-left px-4 py-3 font-medium">Amount</th>
              <th className="text-left px-4 py-3 font-medium">Failure reason</th>
              <th className="text-left px-4 py-3 font-medium">Status</th>
              <th className="text-left px-4 py-3 font-medium">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {!failures || failures.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                  No payment failures yet.
                </td>
              </tr>
            ) : (
              failures.map((event) => {
                const customer = event.customers as { name?: string; email?: string; risk_score?: number } | null
                return (
                  <tr key={event.id} className="hover:bg-muted/30 cursor-pointer">
                    <td className="px-4 py-3">
                      <a href={`/dashboard/failures/${event.id}`} className="block">
                        <p className="font-medium text-foreground">{customer?.name ?? '—'}</p>
                        <p className="text-xs text-zinc-400">{customer?.email ?? '—'}</p>
                      </a>
                    </td>
                    <td className="px-4 py-3 font-semibold">
                      {formatCurrency(event.amount, event.currency)}
                    </td>
                    <td className="px-4 py-3 text-zinc-300 max-w-xs truncate">
                      {event.failure_code ?? '—'}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={STATUS_VARIANT[event.status] ?? 'outline'}>
                        {event.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-zinc-300">
                      {formatRelativeTime(event.created_at)}
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
