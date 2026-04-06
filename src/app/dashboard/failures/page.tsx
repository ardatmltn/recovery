import { createServerClient } from '@/lib/supabase/server'
import { FailuresView } from '@/components/dashboard/views/failures-view'

export default async function FailuresPage() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: userData } = await supabase
    .from('users').select('org_id').eq('id', user!.id).single()

  const { data: failures } = await supabase
    .from('payment_events')
    .select('id, amount, currency, failure_code, status, created_at, customers(name, email)')
    .eq('org_id', userData?.org_id ?? '')
    .order('created_at', { ascending: false })
    .limit(50)

  const mapped = (failures ?? []).map((e) => ({
    id: e.id,
    amount: e.amount,
    currency: e.currency,
    failure_code: e.failure_code,
    status: e.status,
    created_at: e.created_at,
    customers: e.customers as { name?: string; email?: string } | null,
  }))

  return <FailuresView failures={mapped} />
}
